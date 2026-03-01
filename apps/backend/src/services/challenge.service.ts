import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { CreateChallengeInput, UpdateChallengeInput } from "../schemas/challenge.schema";
import crypto from "crypto";

export async function createChallenge(
  input: CreateChallengeInput
): Promise<Record<string, unknown>> {
  const challenge = await prisma.challenge.create({ data: input });
  return sanitizeChallenge(challenge);
}

export async function updateChallenge(
  id: string,
  input: UpdateChallengeInput
): Promise<Record<string, unknown>> {
  const existing = await prisma.challenge.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Challenge not found", 404);
  }

  const updated = await prisma.challenge.update({ where: { id }, data: input });
  return sanitizeChallenge(updated);
}

export async function getChallenges(
  page: number,
  pageSize: number,
  category?: string,
  difficulty?: string
): Promise<{ items: Record<string, unknown>[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const where: Record<string, unknown> = { active: true };
  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;

  const [items, total] = await Promise.all([
    prisma.challenge.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.challenge.count({ where }),
  ]);

  return {
    items: items.map(sanitizeChallenge),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getChallengeById(id: string): Promise<Record<string, unknown>> {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      config: true,
      validation: true,
    },
  });
  if (!challenge || !challenge.active) {
    throw new AppError("Challenge not found", 404);
  }
  const { config, validation, ...rest } = challenge;
  const sanitized = sanitizeChallenge(rest);
  return {
    ...sanitized,
    config: config
      ? {
          timeoutSeconds: config.timeoutSeconds,
          sandboxType: rest.sandboxType,
        }
      : null,
    validationType: validation?.validationType ?? null,
  };
}

export async function submitAnswer(
  userId: string,
  challengeId: string,
  answer: string
): Promise<{ correct: boolean; score: number }> {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || !challenge.active) {
    throw new AppError("Challenge not found", 404);
  }

  const answerHash = crypto.createHash("sha256").update(answer.trim()).digest("hex");
  const correct = answerHash === challenge.solutionHash;
  const score = correct ? challenge.points : 0;

  await prisma.submission.create({
    data: { userId, challengeId, answer: answerHash, correct, score },
  });

  if (correct) {
    const existingProgress = await prisma.progress.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });
    const alreadySolved = existingProgress?.completed ?? false;

    if (!alreadySolved) {
      await prisma.challenge.update({
        where: { id: challengeId },
        data: { solveCount: { increment: 1 } },
      });
    }

    await prisma.progress.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      create: {
        userId,
        challengeId,
        completed: true,
        attempts: 1,
        bestScore: score,
        completedAt: new Date(),
      },
      update: {
        completed: true,
        attempts: { increment: 1 },
        bestScore: { set: score },
        completedAt: new Date(),
      },
    });

    if (!alreadySolved) {
      await prisma.profile.updateMany({
        where: { userId },
        data: { score: { increment: score } },
      });
    }
  } else {
    await prisma.progress.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      create: { userId, challengeId, attempts: 1 },
      update: { attempts: { increment: 1 } },
    });
  }

  return { correct, score };
}

function sanitizeChallenge(challenge: Record<string, unknown>): Record<string, unknown> {
  const { solutionHash: _removed, ...rest } = challenge as Record<string, unknown> & { solutionHash: string };
  return rest;
}
