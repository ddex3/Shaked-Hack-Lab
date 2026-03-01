import { execInContainer } from "../../sandbox.service";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/AppError";

export interface CommandOutputValidationData {
  command: string[];
  expectedOutput: string;
  useRegex?: boolean;
}

export async function validate(
  _answer: string,
  validationData: CommandOutputValidationData,
  sandboxSessionId?: string
): Promise<{ correct: boolean; feedback: string }> {
  if (!sandboxSessionId) {
    throw new AppError("Sandbox session required for command output validation", 400);
  }

  const session = await prisma.sandboxSession.findUnique({
    where: { id: sandboxSessionId },
  });

  if (!session || !session.containerId || session.status !== "RUNNING") {
    throw new AppError("No active sandbox session", 400);
  }

  const { stdout, exitCode } = await execInContainer(
    session.containerId,
    validationData.command
  );

  if (exitCode !== 0) {
    return {
      correct: false,
      feedback: "Verification command failed. The system state does not match expectations.",
    };
  }

  let correct: boolean;

  if (validationData.useRegex) {
    const regex = new RegExp(validationData.expectedOutput, "m");
    correct = regex.test(stdout);
  } else {
    const normalizedOutput = stdout.trim().toLowerCase();
    const normalizedExpected = validationData.expectedOutput.trim().toLowerCase();
    correct = normalizedOutput.includes(normalizedExpected);
  }

  return {
    correct,
    feedback: correct
      ? "System state verified. Challenge complete."
      : "The system state does not match expectations. Keep trying.",
  };
}
