import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

export async function handleAdminListCourses(req: Request, res: Response): Promise<void> {
  const courses = await prisma.trainingCourse.findMany({
    orderBy: { orderIndex: "asc" },
    include: {
      _count: { select: { modules: true, userProgress: true } },
    },
  });

  res.status(200).json({
    success: true,
    data: courses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      status: c.status,
      category: c.category,
      level: c.level,
      maxXp: c.maxXp,
      orderIndex: c.orderIndex,
      certificateFlag: c.certificateFlag,
      moduleCount: c._count.modules,
      enrolledUsers: c._count.userProgress,
    })),
  });
}

export async function handleAdminUpdateCourse(req: Request, res: Response): Promise<void> {
  const courseId = String(req.params.courseId);
  const { status, maxXp, certificateFlag, orderIndex } = req.body;

  const course = await prisma.trainingCourse.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const updated = await prisma.trainingCourse.update({
    where: { id: courseId },
    data: {
      ...(status !== undefined && { status }),
      ...(maxXp !== undefined && { maxXp }),
      ...(certificateFlag !== undefined && { certificateFlag }),
      ...(orderIndex !== undefined && { orderIndex }),
    },
  });

  res.status(200).json({ success: true, data: updated });
}

export async function handleAdminUpdateLabConfig(req: Request, res: Response): Promise<void> {
  const labId = String(req.params.labId);
  const { maxXp, minXp, hintPenalty, timeoutSeconds, active } = req.body;

  const lab = await prisma.trainingLab.findUnique({
    where: { id: labId },
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  const updated = await prisma.trainingLab.update({
    where: { id: labId },
    data: {
      ...(maxXp !== undefined && { maxXp }),
      ...(minXp !== undefined && { minXp }),
      ...(hintPenalty !== undefined && { hintPenalty }),
      ...(timeoutSeconds !== undefined && { timeoutSeconds }),
      ...(active !== undefined && { active }),
    },
  });

  res.status(200).json({ success: true, data: updated });
}

export async function handleAdminResetUserProgress(req: Request, res: Response): Promise<void> {
  const { userId, courseId } = req.body;

  const course = await prisma.trainingCourse.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              labs: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const labIds = course.modules.flatMap((m) =>
    m.lessons.flatMap((l) => l.labs.map((lb) => lb.id))
  );

  await prisma.$transaction([
    prisma.userLabAttempt.deleteMany({
      where: { userId, labId: { in: labIds } },
    }),
    prisma.userLessonProgress.deleteMany({
      where: { userId, lessonId: { in: lessonIds } },
    }),
    prisma.userCourseProgress.deleteMany({
      where: { userId, courseId },
    }),
  ]);

  res.status(200).json({ success: true, data: { reset: true } });
}

export async function handleAdminGetCourseStats(req: Request, res: Response): Promise<void> {
  const courseId = String(req.params.courseId);

  const [enrolled, completed, totalXpAgg] = await Promise.all([
    prisma.userCourseProgress.count({ where: { courseId } }),
    prisma.userCourseProgress.count({ where: { courseId, completed: true } }),
    prisma.userCourseProgress.aggregate({
      where: { courseId },
      _sum: { totalXpEarned: true },
      _avg: { totalXpEarned: true },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      enrolled,
      completed,
      completionRate: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0,
      totalXpAwarded: totalXpAgg._sum.totalXpEarned ?? 0,
      averageXp: Math.round(totalXpAgg._avg.totalXpEarned ?? 0),
    },
  });
}
