import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type { ChallengeHintPublic } from "@shaked-hack-lab/shared-types";

export async function getHintsForChallenge(
  userId: string,
  challengeId: string
): Promise<{ hints: ChallengeHintPublic[]; totalDeductions: number; maxPoints: number }> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      hints: {
        orderBy: { orderIndex: "asc" },
        include: {
          usages: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!challenge || !challenge.active) {
    throw new AppError("Challenge not found", 404);
  }

  const hints: ChallengeHintPublic[] = challenge.hints.map((hint) => {
    const unlocked = hint.usages.length > 0;
    return {
      id: hint.id,
      orderIndex: hint.orderIndex,
      pointCost: hint.pointCost,
      content: unlocked ? hint.content : null,
      unlocked,
    };
  });

  const totalDeductions = await getTotalPointsSpent(userId, challengeId);

  return { hints, totalDeductions, maxPoints: challenge.points };
}

export async function unlockHint(
  userId: string,
  hintId: string
): Promise<{ hint: ChallengeHintPublic; totalDeductions: number }> {
  const hint = await prisma.challengeHint.findUnique({
    where: { id: hintId },
    include: { challenge: true },
  });

  if (!hint) {
    throw new AppError("Hint not found", 404);
  }

  const existingUsage = await prisma.hintUsage.findUnique({
    where: { userId_hintId: { userId, hintId } },
  });

  if (existingUsage) {
    throw new AppError("Hint already unlocked", 409);
  }

  if (hint.orderIndex > 0) {
    const previousHint = await prisma.challengeHint.findUnique({
      where: {
        challengeId_orderIndex: {
          challengeId: hint.challengeId,
          orderIndex: hint.orderIndex - 1,
        },
      },
    });

    if (previousHint) {
      const previousUsage = await prisma.hintUsage.findUnique({
        where: { userId_hintId: { userId, hintId: previousHint.id } },
      });

      if (!previousUsage) {
        throw new AppError("You must unlock previous hints first", 400);
      }
    }
  }

  await prisma.hintUsage.create({
    data: {
      userId,
      hintId,
      pointsSpent: hint.pointCost,
    },
  });

  const totalDeductions = await getTotalPointsSpent(userId, hint.challengeId);

  return {
    hint: {
      id: hint.id,
      orderIndex: hint.orderIndex,
      pointCost: hint.pointCost,
      content: hint.content,
      unlocked: true,
    },
    totalDeductions,
  };
}

export async function getTotalPointsSpent(
  userId: string,
  challengeId: string
): Promise<number> {
  const result = await prisma.hintUsage.aggregate({
    where: {
      userId,
      hint: { challengeId },
    },
    _sum: { pointsSpent: true },
  });

  return result._sum.pointsSpent ?? 0;
}
