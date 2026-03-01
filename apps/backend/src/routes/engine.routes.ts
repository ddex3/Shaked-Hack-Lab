import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { engineValidateSchema } from "../schemas/engine.schema";
import { handleValidateSubmission } from "../controllers/engine.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/validate", authenticate, validate(engineValidateSchema), asyncHandler(handleValidateSubmission));

export default router;
