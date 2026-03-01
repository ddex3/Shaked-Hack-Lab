import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createChallengeSchema, updateChallengeSchema } from "../schemas/challenge.schema";
import {
  adminCourseUpdateSchema,
  adminLabConfigSchema,
  adminResetProgressSchema,
} from "../schemas/training.schema";
import {
  handleCreateChallenge,
  handleUpdateChallenge,
  handleGetUsers,
  handleGetLeaderboard,
} from "../controllers/admin.controller";
import {
  handleAdminListCourses,
  handleAdminUpdateCourse,
  handleAdminUpdateLabConfig,
  handleAdminResetUserProgress,
  handleAdminGetCourseStats,
} from "../controllers/admin-training.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post("/challenges", validate(createChallengeSchema), asyncHandler(handleCreateChallenge));
router.patch("/challenges/:id", validate(updateChallengeSchema), asyncHandler(handleUpdateChallenge));
router.get("/users", asyncHandler(handleGetUsers));
router.get("/leaderboard", asyncHandler(handleGetLeaderboard));

router.get("/training/courses", asyncHandler(handleAdminListCourses));
router.patch("/training/courses/:courseId", validate(adminCourseUpdateSchema), asyncHandler(handleAdminUpdateCourse));
router.get("/training/courses/:courseId/stats", asyncHandler(handleAdminGetCourseStats));
router.patch("/training/labs/:labId", validate(adminLabConfigSchema), asyncHandler(handleAdminUpdateLabConfig));
router.post("/training/reset-progress", validate(adminResetProgressSchema), asyncHandler(handleAdminResetUserProgress));

export default router;
