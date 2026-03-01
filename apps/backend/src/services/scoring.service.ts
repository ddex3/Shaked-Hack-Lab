import { getTotalPointsSpent } from "./hint.service";
import { prisma } from "../config/prisma";

export async function calculateScore(
  userId: string,
  challengeId: string,
  basePoints: number,
  correct: boolean
): Promise<{ finalScore: number; pointsDeducted: number; hintsUsed: number }> {
  if (!correct) {
    return { finalScore: 0, pointsDeducted: 0, hintsUsed: 0 };
  }

  const totalDeductions = await getTotalPointsSpent(userId, challengeId);

  const hintsUsed = await prisma.hintUsage.count({
    where: {
      userId,
      hint: { challengeId },
    },
  });

  const finalScore = Math.max(0, basePoints - totalDeductions);

  return { finalScore, pointsDeducted: totalDeductions, hintsUsed };
}
