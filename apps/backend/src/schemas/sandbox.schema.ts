import { z } from "zod";

export const sandboxStartSchema = z.object({
  challengeId: z.string().uuid(),
});

export const sqlExecSchema = z.object({
  fields: z.record(z.string().max(2048)),
  endpoint: z.string().min(1).max(256),
});
