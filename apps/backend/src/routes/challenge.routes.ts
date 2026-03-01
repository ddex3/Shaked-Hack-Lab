import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { submitAnswerSchema } from "../schemas/challenge.schema";
import {
  handleGetChallenges,
  handleGetChallenge,
  handleSubmitAnswer,
} from "../controllers/challenge.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", authenticate, asyncHandler(handleGetChallenges));
router.get("/:id", authenticate, asyncHandler(handleGetChallenge));
router.post("/:id/submit", authenticate, validate(submitAnswerSchema), asyncHandler(handleSubmitAnswer));

export default router;
