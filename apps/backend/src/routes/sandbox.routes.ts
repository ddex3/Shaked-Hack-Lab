import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { sandboxStartLimiter, sandboxResetLimiter, sandboxExecLimiter } from "../middleware/sandbox-rate-limiter";
import { sandboxStartSchema, sqlExecSchema } from "../schemas/sandbox.schema";
import {
  handleStartSandbox,
  handleStopSandbox,
  handleGetSandboxStatus,
  handleSqlExec,
  handleResetSandbox,
  handleGetActiveSandbox,
} from "../controllers/sandbox.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/start", authenticate, sandboxStartLimiter, validate(sandboxStartSchema), asyncHandler(handleStartSandbox));
router.post("/:sessionId/stop", authenticate, asyncHandler(handleStopSandbox));
router.get("/:sessionId/status", authenticate, sandboxExecLimiter, asyncHandler(handleGetSandboxStatus));
router.post("/:sessionId/sql-exec", authenticate, sandboxExecLimiter, validate(sqlExecSchema), asyncHandler(handleSqlExec));
router.post("/:sessionId/reset", authenticate, sandboxResetLimiter, asyncHandler(handleResetSandbox));
router.get("/active/:challengeId", authenticate, asyncHandler(handleGetActiveSandbox));

export default router;
