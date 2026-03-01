import { Request, Response } from "express";
import {
  startSession,
  stopSession,
  getSession,
  getActiveSession,
  execInContainer,
  resetSession,
} from "../services/sandbox.service";
import { AppError } from "../utils/AppError";

export async function handleStartSandbox(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const { challengeId } = req.body;
  const result = await startSession(req.user.userId, challengeId);

  res.status(201).json({
    success: true,
    data: result,
  });
}

export async function handleStopSandbox(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const sessionId = req.params.sessionId as string;
  await stopSession(sessionId, req.user.userId);

  res.status(200).json({
    success: true,
    data: null,
  });
}

export async function handleGetSandboxStatus(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const sessionId = req.params.sessionId as string;
  const session = await getSession(sessionId);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.userId !== req.user.userId) {
    throw new AppError("Not authorized", 403);
  }

  const now = new Date();
  const remainingMs = Math.max(0, session.expiresAt.getTime() - now.getTime());

  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      status: session.status,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      expiresAt: session.expiresAt.toISOString(),
    },
  });
}

export async function handleSqlExec(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const sessionId = req.params.sessionId as string;
  const { fields, endpoint } = req.body;

  const session = await getSession(sessionId);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.userId !== req.user.userId) {
    throw new AppError("Not authorized", 403);
  }

  if (session.status !== "RUNNING" || !session.containerId) {
    throw new AppError("No active sandbox session", 400);
  }

  const fieldArgs = Object.entries(fields as Record<string, string>)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const { stdout, exitCode } = await execInContainer(session.containerId, [
    "curl",
    "-s",
    "-X",
    "POST",
    "-d",
    fieldArgs,
    `http://localhost:3000${endpoint}`,
  ]);

  res.status(200).json({
    success: true,
    data: {
      output: stdout,
      exitCode,
    },
  });
}

export async function handleResetSandbox(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const sessionId = req.params.sessionId as string;
  const result = await resetSession(sessionId, req.user.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
}

export async function handleGetActiveSandbox(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const challengeId = req.params.challengeId as string;
  const session = await getActiveSession(req.user.userId, challengeId);

  if (!session) {
    res.status(200).json({
      success: true,
      data: null,
    });
    return;
  }

  const now = new Date();
  const remainingMs = Math.max(0, session.expiresAt.getTime() - now.getTime());

  res.status(200).json({
    success: true,
    data: {
      sessionId: session.id,
      status: session.status,
      wsUrl: `/ws/terminal?sessionId=${session.id}`,
      remainingSeconds: Math.ceil(remainingMs / 1000),
      expiresAt: session.expiresAt.toISOString(),
    },
  });
}
