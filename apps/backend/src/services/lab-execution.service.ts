import { prisma } from "../config/prisma";
import { docker } from "../config/docker";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";
import { processLabCompletion } from "./training-scoring.service";
import type { LabType } from "@prisma/client";

const LINUX_LAB_IMAGE = "shaked-lab-linux:latest";
const WINDOWS_SIM_IMAGE = "shaked-lab-linux:latest";

interface LabSession {
  containerId: string;
  sandboxSessionId: string;
}

export async function startLabSession(
  userId: string,
  labId: string
): Promise<{
  sessionId: string;
  wsUrl: string;
  expiresAt: Date;
  labType: LabType;
  objectives: unknown[];
}> {
  const lab = await prisma.trainingLab.findUnique({
    where: { id: labId },
  });

  if (!lab || !lab.active) {
    throw new AppError("Lab not found or inactive", 404);
  }

  const runningCount = await prisma.sandboxSession.count({
    where: { status: "RUNNING" },
  });

  if (runningCount >= env.SANDBOX_MAX_CONTAINERS) {
    throw new AppError("Server at capacity. Please try again later.", 503);
  }

  const existingAttempt = await prisma.userLabAttempt.findFirst({
    where: { userId, labId, completed: false },
  });

  if (!existingAttempt) {
    await prisma.userLabAttempt.create({
      data: {
        userId,
        labId,
        objectivesState: {},
      },
    });
  }

  const timeoutSeconds = lab.timeoutSeconds;
  const expiresAt = new Date(Date.now() + timeoutSeconds * 1000);

  const challengePlaceholder = await getOrCreateLabChallenge(lab.labType, lab.title);

  const session = await prisma.sandboxSession.create({
    data: {
      userId,
      challengeId: challengePlaceholder.id,
      status: "PENDING",
      expiresAt,
    },
  });

  try {
    const dockerImage = lab.labType === "LINUX_TERMINAL" ? LINUX_LAB_IMAGE : WINDOWS_SIM_IMAGE;
    const sandboxConfig = lab.sandboxConfig as Record<string, unknown>;
    const initScript = (sandboxConfig?.initScript as string) ?? "";

    const container = await docker.createContainer({
      Image: dockerImage,
      Cmd: ["/bin/bash"],
      Tty: true,
      OpenStdin: true,
      Labels: {
        "shaked.sandbox": "true",
        "shaked.lab": "true",
        "shaked.userId": userId,
        "shaked.sessionId": session.id,
        "shaked.labId": labId,
      },
      HostConfig: {
        Memory: 64 * 1024 * 1024,
        NanoCpus: 0.5 * 1e9,
        NetworkMode: "none",
        PidsLimit: 50,
        SecurityOpt: ["no-new-privileges"],
        CapDrop: ["ALL"],
        ReadonlyRootfs: false,
      },
    });

    await container.start();

    if (initScript) {
      const exec = await container.exec({
        Cmd: ["/bin/sh", "-c", initScript],
        AttachStdout: true,
        AttachStderr: true,
      });
      await exec.start({ Detach: false, Tty: false });
    }

    await prisma.sandboxSession.update({
      where: { id: session.id },
      data: { containerId: container.id, status: "RUNNING" },
    });

    const wsUrl = `/ws/terminal?sessionId=${session.id}`;
    const objectives = lab.objectives as unknown[];

    return {
      sessionId: session.id,
      wsUrl,
      expiresAt,
      labType: lab.labType,
      objectives,
    };
  } catch (err) {
    await prisma.sandboxSession.update({
      where: { id: session.id },
      data: { status: "ERROR" },
    });
    logger.error({ err }, "Failed to start lab container");
    throw new AppError("Failed to start lab environment", 500);
  }
}

export async function validateLabObjective(
  userId: string,
  labId: string,
  sessionId: string,
  objectiveId: string,
  answer: string
): Promise<{
  correct: boolean;
  feedback: string;
  xpEarned: number;
  objectiveComplete: boolean;
  labComplete: boolean;
  totalLabXp: number;
}> {
  const lab = await prisma.trainingLab.findUnique({
    where: { id: labId },
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  const session = await prisma.sandboxSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.userId !== userId || session.status !== "RUNNING") {
    throw new AppError("Invalid or expired session", 400);
  }

  const objectives = lab.objectives as Array<{
    id: string;
    description: string;
    type: string;
    validationRule: Record<string, string>;
    xpValue: number;
    hints: string[];
  }>;

  const objective = objectives.find((o) => o.id === objectiveId);
  if (!objective) {
    throw new AppError("Objective not found", 404);
  }

  let correct = false;
  let feedback = "Incorrect. Try again.";

  if (lab.labType === "BRUTE_FORCE_SIMULATION") {
    const result = validateBruteForceObjective(objective, answer);
    correct = result.correct;
    feedback = result.feedback;
  } else {
    const result = await validateContainerObjective(
      session.containerId!,
      objective,
      answer
    );
    correct = result.correct;
    feedback = result.feedback;
  }

  const attempt = await prisma.userLabAttempt.findFirst({
    where: { userId, labId, completed: false },
  });

  if (!correct && attempt) {
    await prisma.userLabAttempt.update({
      where: { id: attempt.id },
      data: { failedAttempts: { increment: 1 } },
    });
  }

  let totalLabXp = 0;

  if (correct && attempt) {
    const currentState = (attempt.objectivesState as Record<string, boolean>) ?? {};
    currentState[objectiveId] = true;

    await prisma.userLabAttempt.update({
      where: { id: attempt.id },
      data: { objectivesState: currentState },
    });

    const allComplete = objectives.every((o) => currentState[o.id] === true);

    if (allComplete) {
      const { xpEarned } = await processLabCompletion(
        userId,
        labId,
        attempt.hintsUsed,
        attempt.failedAttempts,
        false
      );
      totalLabXp = xpEarned;

      return {
        correct: true,
        feedback: "All objectives completed!",
        xpEarned: objective.xpValue,
        objectiveComplete: true,
        labComplete: true,
        totalLabXp,
      };
    }
  }

  return {
    correct,
    feedback,
    xpEarned: correct ? objective.xpValue : 0,
    objectiveComplete: correct,
    labComplete: false,
    totalLabXp,
  };
}

async function validateContainerObjective(
  containerId: string,
  objective: {
    type: string;
    validationRule: Record<string, string>;
  },
  answer: string
): Promise<{ correct: boolean; feedback: string }> {
  const container = docker.getContainer(containerId);
  const rule = objective.validationRule;

  switch (objective.type) {
    case "COMMAND_EXECUTION": {
      const expected = rule.expectedOutput ?? "";
      const pattern = rule.expectedPattern;
      const trimmedAnswer = answer.trim();
      if (pattern) {
        const regex = new RegExp(pattern, "i");
        const correct = regex.test(trimmedAnswer);
        return {
          correct,
          feedback: correct ? "Correct command output!" : "Output does not match expected pattern.",
        };
      }
      const correct = trimmedAnswer.includes(expected);
      return {
        correct,
        feedback: correct ? "Correct!" : "Output does not match.",
      };
    }

    case "FILE_DISCOVERY": {
      const filePath = rule.filePath ?? "";
      const expectedContent = rule.expectedContent ?? "";
      try {
        const exec = await container.exec({
          Cmd: ["cat", filePath],
          AttachStdout: true,
          AttachStderr: true,
          Tty: false,
        });
        const stream = await exec.start({ Detach: false, Tty: false });
        const output = await streamToString(stream);

        if (expectedContent) {
          const correct = output.includes(expectedContent) || answer.trim() === expectedContent;
          return {
            correct,
            feedback: correct ? "File found and content matches!" : "Content does not match.",
          };
        }
        const correct = answer.trim() === output.trim() || output.length > 0;
        return {
          correct,
          feedback: correct ? "File located!" : "File not found.",
        };
      } catch {
        return { correct: false, feedback: "Could not read the file." };
      }
    }

    case "PERMISSION_CHECK": {
      const targetFile = rule.filePath ?? "";
      const expectedMask = rule.permissionMask ?? "";
      try {
        const exec = await container.exec({
          Cmd: ["stat", "-c", "%a", targetFile],
          AttachStdout: true,
          AttachStderr: true,
          Tty: false,
        });
        const stream = await exec.start({ Detach: false, Tty: false });
        const output = await streamToString(stream);
        const correct = output.trim() === expectedMask || answer.trim() === expectedMask;
        return {
          correct,
          feedback: correct ? "Permission check passed!" : "Incorrect permissions.",
        };
      } catch {
        return { correct: false, feedback: "Could not check permissions." };
      }
    }

    case "LOG_ANALYSIS": {
      const expected = rule.expectedOutput ?? "";
      const pattern = rule.expectedPattern;
      if (pattern) {
        const regex = new RegExp(pattern, "i");
        const correct = regex.test(answer.trim());
        return {
          correct,
          feedback: correct ? "Log analysis correct!" : "Analysis does not match.",
        };
      }
      const correct = answer.trim().toLowerCase().includes(expected.toLowerCase());
      return {
        correct,
        feedback: correct ? "Correct analysis!" : "Try analyzing the logs more carefully.",
      };
    }

    case "PROCESS_IDENTIFICATION": {
      const processName = rule.processName ?? "";
      const correct = answer.trim().toLowerCase().includes(processName.toLowerCase());
      return {
        correct,
        feedback: correct ? "Process identified!" : "Incorrect process.",
      };
    }

    default:
      return { correct: false, feedback: "Unknown objective type." };
  }
}

function validateBruteForceObjective(
  objective: {
    type: string;
    validationRule: Record<string, string>;
  },
  answer: string
): { correct: boolean; feedback: string } {
  const rule = objective.validationRule;

  switch (objective.type) {
    case "RATE_LIMIT_CONFIG": {
      const configKey = rule.configKey ?? "";
      const configValue = rule.configValue ?? "";
      const correct = answer.trim() === configValue;
      return {
        correct,
        feedback: correct
          ? `Rate limit configuration for ${configKey} is correct!`
          : "Incorrect configuration value.",
      };
    }

    case "PASSWORD_ANALYSIS": {
      const expected = rule.expectedOutput ?? "";
      const pattern = rule.expectedPattern;
      if (pattern) {
        const regex = new RegExp(pattern, "i");
        const correct = regex.test(answer.trim());
        return {
          correct,
          feedback: correct ? "Password analysis correct!" : "Incorrect analysis.",
        };
      }
      const correct = answer.trim().toLowerCase() === expected.toLowerCase();
      return {
        correct,
        feedback: correct ? "Correct!" : "Try again.",
      };
    }

    case "LOG_ANALYSIS": {
      const expected = rule.expectedOutput ?? "";
      const correct = answer.trim().toLowerCase().includes(expected.toLowerCase());
      return {
        correct,
        feedback: correct ? "Log analysis correct!" : "Review the logs more carefully.",
      };
    }

    default: {
      const expected = rule.expectedOutput ?? "";
      const correct = answer.trim().toLowerCase() === expected.toLowerCase();
      return {
        correct,
        feedback: correct ? "Correct!" : "Incorrect.",
      };
    }
  }
}

export async function useLabHint(
  userId: string,
  labId: string,
  objectiveId: string,
  hintIndex: number
): Promise<{ hint: string; xpPenalty: number; remainingXp: number }> {
  const lab = await prisma.trainingLab.findUnique({
    where: { id: labId },
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  const objectives = lab.objectives as Array<{
    id: string;
    hints: string[];
    xpValue: number;
  }>;

  const objective = objectives.find((o) => o.id === objectiveId);
  if (!objective) {
    throw new AppError("Objective not found", 404);
  }

  if (hintIndex < 0 || hintIndex >= objective.hints.length) {
    throw new AppError("Hint not available", 400);
  }

  const attempt = await prisma.userLabAttempt.findFirst({
    where: { userId, labId, completed: false },
  });

  if (attempt) {
    await prisma.userLabAttempt.update({
      where: { id: attempt.id },
      data: { hintsUsed: { increment: 1 } },
    });
  }

  const totalHintsUsed = (attempt?.hintsUsed ?? 0) + 1;
  const totalPenalty = totalHintsUsed * lab.hintPenalty;
  const remainingXp = Math.max(lab.minXp, lab.maxXp - totalPenalty);

  return {
    hint: objective.hints[hintIndex]!,
    xpPenalty: lab.hintPenalty,
    remainingXp,
  };
}

async function getOrCreateLabChallenge(labType: LabType, title: string) {
  const slugMap: Record<string, string> = {
    LINUX_TERMINAL: "linux-lab-placeholder",
    WINDOWS_SIMULATION: "windows-lab-placeholder",
    BRUTE_FORCE_SIMULATION: "bruteforce-lab-placeholder",
  };

  const slug = slugMap[labType] ?? "lab-placeholder";

  let challenge = await prisma.challenge.findFirst({
    where: { title: slug },
  });

  if (!challenge) {
    challenge = await prisma.challenge.create({
      data: {
        title: slug,
        description: `Lab placeholder for ${title}`,
        category: "MISCELLANEOUS",
        difficulty: "BEGINNER",
        sandboxType: "DOCKER",
        points: 0,
        solutionHash: "placeholder",
        instructions: "Lab environment",
        active: false,
      },
    });
  }

  return challenge;
}

function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      const lines = raw.split("\n");
      const cleaned = lines
        .map((line) => (line.length > 8 ? line.substring(8) : line))
        .join("\n")
        .trim();
      resolve(cleaned);
    });
    stream.on("error", reject);
  });
}
