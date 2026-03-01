import { Request, Response } from "express";
import { registerUser, loginUser, checkAliasAvailability } from "../services/auth.service";
import { rotateSession, revokeSession, revokeAllUserSessions } from "../services/session.service";
import { signAccessToken } from "../utils/jwt";
import { prisma } from "../config/prisma";
import { env } from "../config/env";

const REFRESH_COOKIE_NAME = "shaked_refresh_token";

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  });
}

export async function handleRegister(req: Request, res: Response): Promise<void> {
  const deviceInfo = req.body.deviceInfo ?? req.headers["user-agent"];
  const ipAddress = req.ip;
  const result = await registerUser(req.body, deviceInfo, ipAddress);

  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({
    success: true,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  const deviceInfo = req.body.deviceInfo ?? req.headers["user-agent"];
  const ipAddress = req.ip;
  const result = await loginUser(req.body, deviceInfo, ipAddress);

  setRefreshCookie(res, result.refreshToken);
  res.status(200).json({
    success: true,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}

export async function handleRefresh(req: Request, res: Response): Promise<void> {
  const oldToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!oldToken) {
    res.status(401).json({ success: false, error: "No refresh token", statusCode: 401 });
    return;
  }

  const deviceInfo = req.headers["user-agent"];
  const ipAddress = req.ip;
  const result = await rotateSession(oldToken, deviceInfo, ipAddress);

  if (!result) {
    clearRefreshCookie(res);
    res.status(401).json({ success: false, error: "Invalid or expired refresh token", statusCode: 401 });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: result.userId } });
  if (!user) {
    clearRefreshCookie(res);
    res.status(401).json({ success: false, error: "User not found", statusCode: 401 });
    return;
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    success: true,
    data: { accessToken },
  });
}

export async function handleLogout(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (token) {
    await revokeSession(token);
  }
  clearRefreshCookie(res);
  res.status(200).json({ success: true, data: null });
}

export async function handleLogoutAll(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await revokeAllUserSessions(req.user.userId);
  }
  clearRefreshCookie(res);
  res.status(200).json({ success: true, data: null });
}

export async function handleAliasCheck(req: Request, res: Response): Promise<void> {
  const { username } = req.body;
  const available = await checkAliasAvailability(username);
  res.status(200).json({ success: true, data: { available } });
}

export async function handleSyncScore(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Not authenticated", statusCode: 401 });
    return;
  }

  const { score } = req.body;
  if (typeof score !== "number" || score < 0) {
    res.status(400).json({ success: false, error: "Invalid score", statusCode: 400 });
    return;
  }

  await prisma.profile.updateMany({
    where: { userId: req.user.userId },
    data: { score },
  });

  res.status(200).json({ success: true, data: { score } });
}

export async function handleMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Not authenticated", statusCode: 401 });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { profile: true },
  });

  if (!user) {
    res.status(404).json({ success: false, error: "User not found", statusCode: 404 });
    return;
  }

  let rank = 0;
  if (user.profile) {
    const higherCount = await prisma.profile.count({
      where: { score: { gt: user.profile.score } },
    });
    rank = higherCount + 1;
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      profile: user.profile
        ? {
            id: user.profile.id,
            displayName: user.profile.displayName,
            avatarUrl: user.profile.avatarUrl,
            bio: user.profile.bio,
            focusTrack: user.profile.focusTrack,
            score: user.profile.score,
            rank,
          }
        : null,
    },
  });
}
