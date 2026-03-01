import { z } from "zod";

const categoryEnum = z.enum([
  "WEB_EXPLOITATION",
  "CRYPTOGRAPHY",
  "REVERSE_ENGINEERING",
  "FORENSICS",
  "BINARY_EXPLOITATION",
  "NETWORK_SECURITY",
  "OSINT",
  "MISCELLANEOUS",
]);

const difficultyEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]);

const sandboxTypeEnum = z.enum(["NONE", "DOCKER", "BROWSER", "REMOTE_VM"]);

export const createChallengeSchema = z.object({
  title: z.string().min(3).max(128),
  description: z.string().min(10).max(5000),
  category: categoryEnum,
  difficulty: difficultyEnum,
  sandboxType: sandboxTypeEnum.default("NONE"),
  points: z.number().int().min(10).max(1000),
  solutionHash: z.string().min(1).max(255),
  instructions: z.string().min(10).max(10000),
});

export const updateChallengeSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  description: z.string().min(10).max(5000).optional(),
  category: categoryEnum.optional(),
  difficulty: difficultyEnum.optional(),
  sandboxType: sandboxTypeEnum.optional(),
  points: z.number().int().min(10).max(1000).optional(),
  solutionHash: z.string().min(1).max(255).optional(),
  instructions: z.string().min(10).max(10000).optional(),
});

export const submitAnswerSchema = z.object({
  answer: z.string().min(1).max(512),
});

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;
