import { prisma } from "../config/prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { createSession } from "./session.service";
import { AppError } from "../utils/AppError";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export async function registerUser(
  input: RegisterInput,
  deviceInfo: string | undefined,
  ipAddress: string | undefined
): Promise<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }> {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username: input.username }, { email: input.email }] },
  });

  if (existingUser) {
    throw new AppError("Username or email already taken", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      profile: {
        create: {
          displayName: input.displayName,
          focusTrack: input.focusTrack,
        },
      },
    },
    include: { profile: true },
  });

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createSession(user.id, deviceInfo, ipAddress);

  return {
    accessToken,
    refreshToken,
    user: {
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
            rank: user.profile.rank,
          }
        : null,
    },
  };
}

export async function loginUser(
  input: LoginInput,
  deviceInfo: string | undefined,
  ipAddress: string | undefined
): Promise<{ accessToken: string; refreshToken: string; user: Record<string, unknown> }> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: input.identifier }, { email: input.identifier }],
    },
    include: { profile: true },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remainingMs = user.lockedUntil.getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new AppError(`Account locked. Try again in ${remainingMin} minutes.`, 423);
  }

  const valid = await verifyPassword(input.password, user.passwordHash);

  if (!valid) {
    const newAttempts = user.failedAttempts + 1;
    const updateData: Record<string, unknown> = { failedAttempts: newAttempts };

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      updateData.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS);
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    throw new AppError("Invalid credentials", 401);
  }

  if (user.failedAttempts > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createSession(user.id, deviceInfo, ipAddress);

  return {
    accessToken,
    refreshToken,
    user: {
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
            rank: user.profile.rank,
          }
        : null,
    },
  };
}

export async function checkAliasAvailability(username: string): Promise<boolean> {
  const existing = await prisma.user.findUnique({ where: { username } });
  return !existing;
}
