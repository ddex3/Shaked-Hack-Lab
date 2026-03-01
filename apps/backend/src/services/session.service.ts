import { prisma } from "../config/prisma";
import { signRefreshToken, getRefreshTokenExpiryDate } from "../utils/jwt";
import crypto from "crypto";

export async function createSession(
  userId: string,
  deviceInfo: string | undefined,
  ipAddress: string | undefined
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const refreshToken = signRefreshToken({ userId, sessionId });
  const expiresAt = getRefreshTokenExpiryDate();

  await prisma.session.create({
    data: {
      id: sessionId,
      userId,
      refreshToken,
      deviceInfo: deviceInfo ?? null,
      ipAddress: ipAddress ?? null,
      expiresAt,
    },
  });

  return refreshToken;
}

export async function rotateSession(
  oldRefreshToken: string,
  deviceInfo: string | undefined,
  ipAddress: string | undefined
): Promise<{ refreshToken: string; userId: string } | null> {
  const existing = await prisma.session.findUnique({
    where: { refreshToken: oldRefreshToken },
  });

  if (!existing || existing.expiresAt < new Date()) {
    if (existing) {
      await prisma.session.deleteMany({ where: { userId: existing.userId } });
    }
    return null;
  }

  await prisma.session.deleteMany({ where: { id: existing.id } });

  const sessionId = crypto.randomUUID();
  const newRefreshToken = signRefreshToken({ userId: existing.userId, sessionId });
  const expiresAt = getRefreshTokenExpiryDate();

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: existing.userId,
      refreshToken: newRefreshToken,
      deviceInfo: deviceInfo ?? existing.deviceInfo,
      ipAddress: ipAddress ?? existing.ipAddress,
      expiresAt,
    },
  });

  return { refreshToken: newRefreshToken, userId: existing.userId };
}

export async function revokeSession(refreshToken: string): Promise<void> {
  await prisma.session.deleteMany({ where: { refreshToken } });
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
