import { Request, Response } from "express";
import {
  listCourses,
  getCourseBySlug,
  getUserCourseProgress,
  startCourseProgress,
} from "../services/training-course.service";
import { processQuizCompletion } from "../services/training-scoring.service";
import {
  startLabSession,
  validateLabObjective,
  useLabHint,
} from "../services/lab-execution.service";
import {
  simulateLoginAttempt,
  resetSimulation,
  analyzePasswordStrength,
  calculatePasswordEntropy,
} from "../services/bruteforce-simulation.service";
import {
  executeWindowsCommand,
  resetSession as resetWindowsSession,
} from "../services/windows-simulation.service";

export async function handleListCourses(req: Request, res: Response): Promise<void> {
  const status = req.query.status as string | undefined;
  const validStatuses = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
  const courseStatus = validStatuses.includes(status as any) ? (status as any) : undefined;
  const courses = await listCourses(courseStatus);
  res.status(200).json({ success: true, data: courses });
}

export async function handleGetCourse(req: Request, res: Response): Promise<void> {
  const slug = String(req.params.slug);
  const course = await getCourseBySlug(slug);

  const modules = course.modules.map((m: any) => ({
    id: m.id,
    courseId: m.courseId,
    title: m.title,
    description: m.description,
    orderIndex: m.orderIndex,
    lessons: m.lessons.map((l: any) => ({
      id: l.id,
      moduleId: l.moduleId,
      title: l.title,
      content: l.content,
      orderIndex: l.orderIndex,
      maxXp: l.maxXp,
      minXp: l.minXp,
      quizzes: l.quizzes.map((q: any) => ({
        id: q.id,
        lessonId: q.lessonId,
        question: q.question,
        options: q.options,
        correctAnswer: "",
        explanation: "",
        xpReward: q.xpReward,
        orderIndex: q.orderIndex,
      })),
      labs: l.labs.map((lb: any) => ({
        id: lb.id,
        lessonId: lb.lessonId,
        title: lb.title,
        description: lb.description,
        labType: lb.labType,
        objectives: lb.objectives,
        maxXp: lb.maxXp,
        minXp: lb.minXp,
        hintPenalty: lb.hintPenalty,
        timeoutSeconds: lb.timeoutSeconds,
        orderIndex: lb.orderIndex,
        active: lb.active,
      })),
    })),
  }));

  res.status(200).json({
    success: true,
    data: {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        estimatedDuration: course.estimatedDuration,
        status: course.status,
        orderIndex: course.orderIndex,
        maxXp: course.maxXp,
        certificateFlag: course.certificateFlag,
        moduleCount: modules.length,
        lessonCount: modules.reduce((s: number, m: any) => s + m.lessons.length, 0),
        labCount: modules.reduce(
          (s: number, m: any) => s + m.lessons.reduce((ls: number, l: any) => ls + l.labs.length, 0),
          0
        ),
      },
      modules,
    },
  });
}

export async function handleGetProgress(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const courseId = String(req.params.courseId);
  const progress = await getUserCourseProgress(userId, courseId);
  res.status(200).json({ success: true, data: progress });
}

export async function handleStartCourse(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const courseId = String(req.params.courseId);
  await startCourseProgress(userId, courseId);
  res.status(200).json({ success: true, data: { started: true } });
}

export async function handleSubmitQuiz(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const { quizId, answer } = req.body;
  const result = await processQuizCompletion(userId, quizId, answer);
  res.status(200).json({ success: true, data: result });
}

export async function handleStartLab(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const { labId } = req.body;
  const result = await startLabSession(userId, labId);
  res.status(200).json({
    success: true,
    data: {
      sessionId: result.sessionId,
      wsUrl: result.wsUrl,
      expiresAt: result.expiresAt.toISOString(),
      labType: result.labType,
      objectives: result.objectives,
    },
  });
}

export async function handleValidateObjective(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const { labId, sessionId, objectiveId, answer } = req.body;
  const result = await validateLabObjective(userId, labId, sessionId, objectiveId, answer);
  res.status(200).json({ success: true, data: result });
}

export async function handleLabHint(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.userId;
  const { labId, objectiveId, hintIndex } = req.body;
  const result = await useLabHint(userId, labId, objectiveId, hintIndex);
  res.status(200).json({ success: true, data: result });
}

export async function handleBruteForceAttempt(req: Request, res: Response): Promise<void> {
  const { sessionKey, passwordGuess, config } = req.body;
  const userId = (req as any).user.userId;
  const safeKey = `${userId}:${sessionKey}`;
  const result = simulateLoginAttempt(safeKey, config, passwordGuess);
  res.status(200).json({ success: true, data: result });
}

export async function handleBruteForceReset(req: Request, res: Response): Promise<void> {
  const { sessionKey } = req.body;
  const userId = (req as any).user.userId;
  const safeKey = `${userId}:${sessionKey}`;
  resetSimulation(safeKey);
  res.status(200).json({ success: true, data: { reset: true } });
}

export async function handlePasswordAnalyze(req: Request, res: Response): Promise<void> {
  const { password } = req.body;
  const result = analyzePasswordStrength(password);
  res.status(200).json({ success: true, data: result });
}

export async function handleWindowsCommand(req: Request, res: Response): Promise<void> {
  const { sessionKey, command } = req.body;
  const userId = (req as any).user.userId;
  const safeKey = `${userId}:${sessionKey}`;
  const result = executeWindowsCommand(safeKey, command);
  res.status(200).json({ success: true, data: result });
}

export async function handleWindowsReset(req: Request, res: Response): Promise<void> {
  const { sessionKey } = req.body;
  const userId = (req as any).user.userId;
  const safeKey = `${userId}:${sessionKey}`;
  resetWindowsSession(safeKey);
  res.status(200).json({ success: true, data: { reset: true } });
}

export async function handleEntropyCalculation(req: Request, res: Response): Promise<void> {
  const complexity = req.query.complexity as "weak" | "medium" | "strong" | undefined;
  if (!complexity || !["weak", "medium", "strong"].includes(complexity)) {
    res.status(400).json({ success: false, error: "Invalid complexity" });
    return;
  }
  const entropy = calculatePasswordEntropy(complexity);
  res.status(200).json({ success: true, data: { complexity, entropy } });
}
