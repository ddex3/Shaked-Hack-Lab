import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";
import { calculateScore } from "../scoring.service";
import * as flagStrategy from "./strategies/flag.strategy";
import * as sqlResultStrategy from "./strategies/sql-result.strategy";
import * as fileContentStrategy from "./strategies/file-content.strategy";
import * as commandOutputStrategy from "./strategies/command-output.strategy";

type StrategyValidator = (
  answer: string,
  validationData: any,
  sandboxSessionId?: string
) => Promise<{ correct: boolean; feedback: string }>;

const strategies: Record<string, StrategyValidator> = {
  FLAG_MATCH: flagStrategy.validate,
  SQL_RESULT_CHECK: sqlResultStrategy.validate,
  FILE_CONTENT_CHECK: fileContentStrategy.validate,
  COMMAND_OUTPUT_CHECK: commandOutputStrategy.validate,
};

export async function validateSubmission(
  userId: string,
  challengeId: string,
  answer: string,
  sandboxSessionId?: string
): Promise<{
  correct: boolean;
  feedback: string;
  score: number;
  pointsDeducted: number;
  hintsUsed: number;
}> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { validation: true },
  });

  if (!challenge || !challenge.active) {
    throw new AppError("Challenge not found", 404);
  }

  if (!challenge.validation) {
    throw new AppError("Challenge validation not configured", 500);
  }

  const strategyFn = strategies[challenge.validation.validationType];
  if (!strategyFn) {
    throw new AppError(
      `Unsupported validation type: ${challenge.validation.validationType}`,
      500
    );
  }

  let result: { correct: boolean; feedback: string };

  try {
    result = await strategyFn(
      answer,
      challenge.validation.validationData,
      sandboxSessionId
    );
  } catch (err) {
    if (err instanceof AppError) throw err;
    logger.error({ err, challengeId }, "Validation strategy error");
    throw new AppError("Validation failed", 500);
  }

  const { finalScore, pointsDeducted, hintsUsed } = await calculateScore(
    userId,
    challengeId,
    challenge.points,
    result.correct
  );

  await prisma.submission.create({
    data: {
      userId,
      challengeId,
      answer: answer.substring(0, 512),
      correct: result.correct,
      score: finalScore,
    },
  });

  if (result.correct) {
    await prisma.progress.upsert({
      where: {
        userId_challengeId: { userId, challengeId },
      },
      create: {
        userId,
        challengeId,
        completed: true,
        attempts: 1,
        bestScore: finalScore,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        attempts: { increment: 1 },
        bestScore: { set: Math.max(finalScore) },
        completedAt: new Date(),
      },
    });

    await prisma.challenge.update({
      where: { id: challengeId },
      data: { solveCount: { increment: 1 } },
    });

    await prisma.profile.updateMany({
      where: { userId },
      data: { score: { increment: finalScore } },
    });
  } else {
    await prisma.progress.upsert({
      where: {
        userId_challengeId: { userId, challengeId },
      },
      create: {
        userId,
        challengeId,
        completed: false,
        attempts: 1,
        bestScore: 0,
      },
      update: {
        attempts: { increment: 1 },
      },
    });
  }

  return {
    correct: result.correct,
    feedback: result.feedback,
    score: finalScore,
    pointsDeducted,
    hintsUsed,
  };
}
