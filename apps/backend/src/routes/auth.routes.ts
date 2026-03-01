import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { authRateLimiter } from "../middleware/rateLimiter";
import { loginSchema, registerSchema, aliasCheckSchema } from "../schemas/auth.schema";
import {
  handleRegister,
  handleLogin,
  handleRefresh,
  handleLogout,
  handleLogoutAll,
  handleAliasCheck,
  handleMe,
  handleSyncScore,
} from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", authRateLimiter, validate(registerSchema), asyncHandler(handleRegister));
router.post("/login", authRateLimiter, validate(loginSchema), asyncHandler(handleLogin));
router.post("/refresh", asyncHandler(handleRefresh));
router.post("/logout", asyncHandler(handleLogout));
router.post("/logout-all", authenticate, asyncHandler(handleLogoutAll));
router.post("/alias-check", authRateLimiter, validate(aliasCheckSchema), asyncHandler(handleAliasCheck));
router.get("/me", authenticate, asyncHandler(handleMe));
router.post("/sync-score", authenticate, asyncHandler(handleSyncScore));

export default router;
