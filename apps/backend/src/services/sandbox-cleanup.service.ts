import { prisma } from "../config/prisma";
import { docker } from "../config/docker";
import { env } from "../config/env";
import { logger } from "../utils/logger";

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startCleanupLoop(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    cleanupExpiredSessions().catch((err) => {
      logger.error({ err }, "Sandbox cleanup error");
    });
  }, env.SANDBOX_CLEANUP_INTERVAL);

  logger.info(
    { intervalMs: env.SANDBOX_CLEANUP_INTERVAL },
    "Sandbox cleanup loop started"
  );
}

export function stopCleanupLoop(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  const expired = await prisma.sandboxSession.findMany({
    where: {
      status: "RUNNING",
      expiresAt: { lt: new Date() },
    },
  });

  for (const session of expired) {
    try {
      if (session.containerId) {
        const container = docker.getContainer(session.containerId);
        try {
          await container.stop({ t: 2 });
        } catch {
          // already stopped
        }
        await container.remove({ force: true });
      }

      await prisma.sandboxSession.update({
        where: { id: session.id },
        data: {
          status: "EXPIRED",
          terminatedAt: new Date(),
        },
      });

      logger.info({ sessionId: session.id }, "Expired sandbox session cleaned up");
    } catch (err) {
      logger.error({ err, sessionId: session.id }, "Failed to clean up expired session");
    }
  }

  await cleanupOrphanContainers();
}

async function cleanupOrphanContainers(): Promise<void> {
  try {
    const containers = await docker.listContainers({
      all: true,
      filters: { label: ["shaked.sandbox=true"] },
    });

    for (const info of containers) {
      const sessionId = info.Labels["shaked.sessionId"];
      if (!sessionId) continue;

      const session = await prisma.sandboxSession.findUnique({
        where: { id: sessionId },
      });

      if (!session || session.status !== "RUNNING") {
        try {
          const container = docker.getContainer(info.Id);
          await container.remove({ force: true });
          logger.info({ containerId: info.Id }, "Orphan container removed");
        } catch {
          // ignore removal errors
        }
      }
    }
  } catch {
    // Docker may not be available in dev
  }
}

export async function cleanupAllSessions(): Promise<void> {
  const running = await prisma.sandboxSession.findMany({
    where: { status: "RUNNING" },
  });

  for (const session of running) {
    if (session.containerId) {
      try {
        const container = docker.getContainer(session.containerId);
        await container.remove({ force: true });
      } catch {
        // ignore
      }
    }

    await prisma.sandboxSession.update({
      where: { id: session.id },
      data: { status: "COMPLETED", terminatedAt: new Date() },
    });
  }
}
