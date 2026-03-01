import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3).max(255),
  password: z.string().min(1),
  deviceInfo: z.string().max(512).optional(),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username may only contain letters, numbers, hyphens, and underscores"),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(12)
    .max(128)
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one digit")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  displayName: z.string().min(2).max(64),
  focusTrack: z.string().min(1).max(64),
});

export const aliasCheckSchema = z.object({
  username: z.string().min(3).max(32),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AliasCheckInput = z.infer<typeof aliasCheckSchema>;
