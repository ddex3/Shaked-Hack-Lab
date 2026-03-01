import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  quizSubmitSchema,
  labStartSchema,
  labValidateSchema,
  labHintSchema,
  bruteForceAttemptSchema,
  bruteForceResetSchema,
  passwordAnalyzeSchema,
  windowsCommandSchema,
  windowsResetSchema,
} from "../schemas/training.schema";
import {
  handleListCourses,
  handleGetCourse,
  handleGetProgress,
  handleStartCourse,
  handleSubmitQuiz,
  handleStartLab,
  handleValidateObjective,
  handleLabHint,
  handleBruteForceAttempt,
  handleBruteForceReset,
  handlePasswordAnalyze,
  handleWindowsCommand,
  handleWindowsReset,
  handleEntropyCalculation,
} from "../controllers/training.controller";
import rateLimit from "express-rate-limit";

const bruteForceRateLimiter = rateLimit({
  windowMs: 60000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many simulation attempts" },
});

const labRateLimiter = rateLimit({
  windowMs: 60000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many lab start requests" },
});

const router = Router();

router.get("/courses", asyncHandler(handleListCourses));
router.get("/courses/:slug", asyncHandler(handleGetCourse));

router.use(authenticate);

router.get("/courses/:courseId/progress", asyncHandler(handleGetProgress));
router.post("/courses/:courseId/start", asyncHandler(handleStartCourse));

router.post("/quiz/submit", validate(quizSubmitSchema), asyncHandler(handleSubmitQuiz));

router.post("/lab/start", labRateLimiter, validate(labStartSchema), asyncHandler(handleStartLab));
router.post("/lab/validate", validate(labValidateSchema), asyncHandler(handleValidateObjective));
router.post("/lab/hint", validate(labHintSchema), asyncHandler(handleLabHint));

router.post("/simulation/bruteforce/attempt", bruteForceRateLimiter, validate(bruteForceAttemptSchema), asyncHandler(handleBruteForceAttempt));
router.post("/simulation/bruteforce/reset", validate(bruteForceResetSchema), asyncHandler(handleBruteForceReset));
router.post("/simulation/bruteforce/analyze", validate(passwordAnalyzeSchema), asyncHandler(handlePasswordAnalyze));
router.get("/simulation/bruteforce/entropy", asyncHandler(handleEntropyCalculation));

router.post("/simulation/windows/command", validate(windowsCommandSchema), asyncHandler(handleWindowsCommand));
router.post("/simulation/windows/reset", validate(windowsResetSchema), asyncHandler(handleWindowsReset));

export default router;
