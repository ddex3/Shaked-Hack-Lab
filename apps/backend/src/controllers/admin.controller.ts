import { Request, Response } from "express";
import { createChallenge, updateChallenge } from "../services/challenge.service";
import { getLeaderboard } from "../services/leaderboard.service";
import { prisma } from "../config/prisma";

export async function handleCreateChallenge(req: Request, res: Response): Promise<void> {
  const challenge = await createChallenge(req.body);
  res.status(201).json({ success: true, data: challenge });
}

export async function handleUpdateChallenge(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const challenge = await updateChallenge(id, req.body);
  res.status(200).json({ success: true, data: challenge });
}

export async function handleGetUsers(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        failedAttempts: true,
        lockedUntil: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            score: true,
            rank: true,
            focusTrack: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      items: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

export async function handleGetLeaderboard(_req: Request, res: Response): Promise<void> {
  const leaderboard = await getLeaderboard(50);
  res.status(200).json({ success: true, data: leaderboard });
}
