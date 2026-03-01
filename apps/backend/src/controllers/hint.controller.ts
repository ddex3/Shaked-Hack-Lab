import { Request, Response } from "express";
import { getHintsForChallenge, unlockHint } from "../services/hint.service";
import { AppError } from "../utils/AppError";

export async function handleGetHints(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const challengeId = req.params.challengeId as string;
  const result = await getHintsForChallenge(req.user.userId, challengeId);

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function handleUnlockHint(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const hintId = req.params.hintId as string;
  const result = await unlockHint(req.user.userId, hintId);

  res.status(200).json({
    success: true,
    data: result,
  });
}
