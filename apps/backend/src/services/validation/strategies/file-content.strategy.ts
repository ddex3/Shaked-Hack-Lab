import { execInContainer } from "../../sandbox.service";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/AppError";

export interface FileContentValidationData {
  filePath: string;
  expectedContent: string;
  useRegex?: boolean;
}

export async function validate(
  _answer: string,
  validationData: FileContentValidationData,
  sandboxSessionId?: string
): Promise<{ correct: boolean; feedback: string }> {
  if (!sandboxSessionId) {
    throw new AppError("Sandbox session required for file content validation", 400);
  }

  const session = await prisma.sandboxSession.findUnique({
    where: { id: sandboxSessionId },
  });

  if (!session || !session.containerId || session.status !== "RUNNING") {
    throw new AppError("No active sandbox session", 400);
  }

  const { stdout, exitCode } = await execInContainer(session.containerId, [
    "cat",
    validationData.filePath,
  ]);

  if (exitCode !== 0) {
    return {
      correct: false,
      feedback: "Target file not found or not readable. Check your work and try again.",
    };
  }

  let correct: boolean;

  if (validationData.useRegex) {
    const regex = new RegExp(validationData.expectedContent, "m");
    correct = regex.test(stdout);
  } else {
    const normalizedOutput = stdout.trim().toLowerCase();
    const normalizedExpected = validationData.expectedContent.trim().toLowerCase();
    correct = normalizedOutput.includes(normalizedExpected);
  }

  return {
    correct,
    feedback: correct
      ? "File content matches expected state. Challenge complete."
      : "File content does not match the expected result. Keep trying.",
  };
}
