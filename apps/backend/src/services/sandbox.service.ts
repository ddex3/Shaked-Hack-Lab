import { prisma } from "../config/prisma";
import { docker } from "../config/docker";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import type { SandboxSession } from "@prisma/client";

export async function startSession(
  userId: string,
  challengeId: string
): Promise<{ sessionId: string; wsUrl: string; expiresAt: Date }> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { config: true },
  });

  if (!challenge || !challenge.active) {
    throw new AppError("Challenge not found", 404);
  }

  if (challenge.sandboxType === "NONE") {
    throw new AppError("This challenge does not require a sandbox", 400);
  }

  if (!challenge.config) {
    throw new AppError("Challenge sandbox not configured", 500);
  }

  const existing = await getActiveSession(userId, challengeId);
  if (existing) {
    throw new AppError("You already have an active session for this challenge. Stop it first.", 409);
  }

  const runningCount = await prisma.sandboxSession.count({
    where: { status: "RUNNING" },
  });

  if (runningCount >= env.SANDBOX_MAX_CONTAINERS) {
    throw new AppError("Server at capacity. Please try again later.", 503);
  }

  const config = challenge.config;
  const timeoutSeconds = config.timeoutSeconds || env.SANDBOX_DEFAULT_TIMEOUT;
  const expiresAt = new Date(Date.now() + timeoutSeconds * 1000);

  const session = await prisma.sandboxSession.create({
    data: {
      userId,
      challengeId,
      status: "PENDING",
      expiresAt,
    },
  });

  const needsShell = challenge.category !== "WEB_EXPLOITATION";

  const envList: string[] = [];
  if (config.envVars && typeof config.envVars === "object") {
    for (const [key, value] of Object.entries(config.envVars as Record<string, string>)) {
      envList.push(`${key}=${value}`);
    }
  }

  try {
    const container = await docker.createContainer({
      Image: config.dockerImage,
      ...(needsShell
        ? { Cmd: ["/bin/sh"], Tty: true, OpenStdin: true }
        : {}),
      ...(envList.length > 0 ? { Env: envList } : {}),
      Labels: {
        "shaked.sandbox": "true",
        "shaked.userId": userId,
        "shaked.sessionId": session.id,
      },
      HostConfig: {
        Memory: config.memoryLimitMb * 1024 * 1024,
        NanoCpus: config.cpuLimit * 1e9,
        NetworkMode: config.networkDisabled ? "none" : "bridge",
        PidsLimit: 50,
        SecurityOpt: ["no-new-privileges"],
        CapDrop: ["ALL"],
        ReadonlyRootfs: false,
      },
    });

    await container.start();

    if (config.initScript) {
      const exec = await container.exec({
        Cmd: ["/bin/sh", "-c", config.initScript],
        AttachStdout: true,
        AttachStderr: true,
      });
      await exec.start({ Detach: false, Tty: false });
    }

    if (!needsShell) {
      await waitForServer(container.id, 3000, 10);
    }

    await prisma.sandboxSession.update({
      where: { id: session.id },
      data: {
        containerId: container.id,
        status: "RUNNING",
      },
    });

    const wsUrl = `/ws/terminal?sessionId=${session.id}`;

    return { sessionId: session.id, wsUrl, expiresAt };
  } catch (err) {
    await prisma.sandboxSession.update({
      where: { id: session.id },
      data: { status: "ERROR" },
    });
    logger.error({ err }, "Failed to create sandbox container");
    throw new AppError("Failed to start sandbox environment", 500);
  }
}

export async function stopSession(
  sessionId: string,
  userId: string
): Promise<void> {
  const session = await prisma.sandboxSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.userId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  if (session.status !== "RUNNING" && session.status !== "PENDING") {
    return;
  }

  await destroyContainer(session.containerId);

  await prisma.sandboxSession.update({
    where: { id: sessionId },
    data: {
      status: "COMPLETED",
      terminatedAt: new Date(),
    },
  });
}

export async function getSession(sessionId: string): Promise<SandboxSession | null> {
  return prisma.sandboxSession.findUnique({ where: { id: sessionId } });
}

export async function getActiveSession(
  userId: string,
  challengeId: string
): Promise<SandboxSession | null> {
  return prisma.sandboxSession.findFirst({
    where: {
      userId,
      challengeId,
      status: "RUNNING",
    },
  });
}

export async function execInContainer(
  containerId: string,
  cmd: string[]
): Promise<{ stdout: string; exitCode: number }> {
  const container = docker.getContainer(containerId);

  const exec = await container.exec({
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  });

  const stream = await exec.start({ Detach: false, Tty: true });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    stream.on("end", async () => {
      try {
        const output = Buffer.concat(chunks).toString("utf-8").trim();
        const inspectData = await exec.inspect();
        resolve({
          stdout: output,
          exitCode: inspectData.ExitCode ?? 1,
        });
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
}

export async function resetSession(
  sessionId: string,
  userId: string
): Promise<{ sessionId: string; wsUrl: string; expiresAt: Date }> {
  const session = await prisma.sandboxSession.findUnique({
    where: { id: sessionId },
    include: { challenge: true },
  });

  if (!session) throw new AppError("Session not found", 404);
  if (session.userId !== userId) throw new AppError("Not authorized", 403);

  await stopSession(sessionId, userId);
  return startSession(userId, session.challengeId);
}

async function destroyContainer(containerId: string | null): Promise<void> {
  if (!containerId) return;

  try {
    const container = docker.getContainer(containerId);
    try {
      await container.stop({ t: 2 });
    } catch {
    }
    await container.remove({ force: true });
  } catch (err) {
    logger.warn({ err, containerId }, "Failed to destroy container");
  }
}

async function waitForServer(containerId: string, port: number, retries: number): Promise<void> {
  const container = docker.getContainer(containerId);
  for (let i = 0; i < retries; i++) {
    try {
      const exec = await container.exec({
        Cmd: ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", `http://localhost:${port}/health`],
        AttachStdout: true,
        AttachStderr: true,
      });
      const stream = await exec.start({ Detach: false, Tty: false });
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve) => {
        stream.on("data", (c: Buffer) => chunks.push(c));
        stream.on("end", () => resolve());
      });
      const output = Buffer.concat(chunks).toString("utf-8").trim();
      if (output.includes("200")) return;
    } catch {
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  logger.warn({ containerId }, "Server health check timed out, proceeding anyway");
}

