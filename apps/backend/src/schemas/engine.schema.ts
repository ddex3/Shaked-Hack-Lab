import { z } from "zod";

export const engineValidateSchema = z.object({
  challengeId: z.string().uuid(),
  answer: z.string().min(1).max(2048),
  sandboxSessionId: z.string().uuid().optional(),
});
