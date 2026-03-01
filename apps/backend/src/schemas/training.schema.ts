import { z } from "zod";

export const quizSubmitSchema = z.object({
  quizId: z.string().uuid(),
  answer: z.string().min(1).max(512),
});

export const labStartSchema = z.object({
  labId: z.string().uuid(),
});

export const labValidateSchema = z.object({
  labId: z.string().uuid(),
  sessionId: z.string().uuid(),
  objectiveId: z.string().min(1).max(128),
  answer: z.string().min(1).max(1024),
});

export const labHintSchema = z.object({
  labId: z.string().uuid(),
  objectiveId: z.string().min(1).max(128),
  hintIndex: z.number().int().min(0).max(10),
});

export const bruteForceAttemptSchema = z.object({
  sessionKey: z.string().min(1).max(128),
  passwordGuess: z.string().min(0).max(256),
  config: z.object({
    maxAttempts: z.number().int().min(1).max(1000),
    lockoutThreshold: z.number().int().min(0).max(100),
    lockoutDurationSeconds: z.number().int().min(0).max(3600),
    rateLimitPerMinute: z.number().int().min(1).max(1000),
    passwordComplexity: z.enum(["weak", "medium", "strong"]),
    simulatedDelayMs: z.number().int().min(0).max(5000),
  }),
});

export const bruteForceResetSchema = z.object({
  sessionKey: z.string().min(1).max(128),
});

export const passwordAnalyzeSchema = z.object({
  password: z.string().min(1).max(256),
});

export const windowsCommandSchema = z.object({
  sessionKey: z.string().min(1).max(128),
  command: z.string().min(1).max(512),
});

export const windowsResetSchema = z.object({
  sessionKey: z.string().min(1).max(128),
});

export const adminCourseUpdateSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  maxXp: z.number().int().min(0).optional(),
  certificateFlag: z.boolean().optional(),
  orderIndex: z.number().int().min(0).optional(),
});

export const adminLabConfigSchema = z.object({
  maxXp: z.number().int().min(0).optional(),
  minXp: z.number().int().min(0).optional(),
  hintPenalty: z.number().int().min(0).optional(),
  timeoutSeconds: z.number().int().min(30).max(1800).optional(),
  active: z.boolean().optional(),
});

export const adminResetProgressSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});
