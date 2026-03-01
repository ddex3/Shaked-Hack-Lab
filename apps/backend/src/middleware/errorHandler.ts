import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  if (err instanceof ZodError) {
    const formatted = err.flatten().fieldErrors;
    res.status(400).json({
      success: false,
      error: "Validation failed",
      statusCode: 400,
      details: formatted,
    });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    success: false,
    error: "Internal server error",
    statusCode: 500,
  });
}
