import { Request, Response } from "express";
import { validateSubmission } from "../services/validation/validation.pipeline";
import { AppError } from "../utils/AppError";

export async function handleValidateSubmission(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const { challengeId, answer, sandboxSessionId } = req.body;

  const result = await validateSubmission(
    req.user.userId,
    challengeId,
    answer,
    sandboxSessionId
  );

  res.status(200).json({
    success: true,
    data: result,
  });
}
