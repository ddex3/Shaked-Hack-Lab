import { Request, Response } from "express";
import {
  getChallenges,
  getChallengeById,
  submitAnswer,
} from "../services/challenge.service";
import { AppError } from "../utils/AppError";

export async function handleGetChallenges(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
  const category = req.query.category as string | undefined;
  const difficulty = req.query.difficulty as string | undefined;

  const result = await getChallenges(page, pageSize, category, difficulty);
  res.status(200).json({ success: true, data: result });
}

export async function handleGetChallenge(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const challenge = await getChallengeById(id);
  res.status(200).json({ success: true, data: challenge });
}

export async function handleSubmitAnswer(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const id = String(req.params.id);
  const { answer } = req.body;
  const result = await submitAnswer(req.user.userId, id, answer);
  res.status(200).json({ success: true, data: result });
}
