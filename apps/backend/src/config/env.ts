import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(16),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  SANDBOX_MAX_CONTAINERS: z.coerce.number().int().positive().default(20),
  SANDBOX_DEFAULT_TIMEOUT: z.coerce.number().int().positive().default(300),
  SANDBOX_CLEANUP_INTERVAL: z.coerce.number().int().positive().default(60000),
});

function loadEnv(): z.infer<typeof envSchema> {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    throw new Error(`Environment validation failed: ${JSON.stringify(formatted)}`);
  }
  return parsed.data;
}

export const env = loadEnv();
