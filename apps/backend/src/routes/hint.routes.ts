import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { unlockHintSchema } from "../schemas/hint.schema";
import { handleGetHints, handleUnlockHint } from "../controllers/hint.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/:challengeId", authenticate, asyncHandler(handleGetHints));
router.post("/:hintId/unlock", authenticate, validate(unlockHintSchema), asyncHandler(handleUnlockHint));

export default router;
