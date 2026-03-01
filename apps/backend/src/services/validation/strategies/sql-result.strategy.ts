import { execInContainer } from "../../sandbox.service";
import { prisma } from "../../../config/prisma";
import { AppError } from "../../../utils/AppError";

export interface SqlResultValidationData {
  verifyQuery: string;
  expectedOutput: string;
  dbPath: string;
}

export async function validate(
  _answer: string,
  validationData: SqlResultValidationData,
  sandboxSessionId?: string
): Promise<{ correct: boolean; feedback: string }> {
  if (!sandboxSessionId) {
    throw new AppError("Sandbox session required for SQL validation", 400);
  }

  const session = await prisma.sandboxSession.findUnique({
    where: { id: sandboxSessionId },
  });

  if (!session || !session.containerId || session.status !== "RUNNING") {
    throw new AppError("No active sandbox session", 400);
  }

  const { stdout, exitCode } = await execInContainer(session.containerId, [
    "sqlite3",
    validationData.dbPath,
    validationData.verifyQuery,
  ]);

  if (exitCode !== 0) {
    return {
      correct: false,
      feedback: "Verification query failed. The database state does not match the expected result.",
    };
  }

  const normalizedOutput = stdout.trim().toLowerCase();
  const normalizedExpected = validationData.expectedOutput.trim().toLowerCase();
  const correct = normalizedOutput.includes(normalizedExpected);

  return {
    correct,
    feedback: correct
      ? "SQL injection successful. You bypassed the authentication."
      : "The database state does not match the expected result. Keep trying.",
  };
}
