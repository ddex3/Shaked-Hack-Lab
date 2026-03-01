import { z } from "zod";

export const unlockHintSchema = z.object({
  confirm: z.literal(true),
});
