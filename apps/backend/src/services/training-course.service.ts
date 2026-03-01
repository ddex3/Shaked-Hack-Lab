import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import type { CourseStatus } from "@prisma/client";

export async function listCourses(status?: CourseStatus) {
  const where = status ? { status } : { status: "ACTIVE" as CourseStatus };

  const courses = await prisma.trainingCourse.findMany({
    where,
    orderBy: { orderIndex: "asc" },
    include: {
      _count: {
        select: {
          modules: true,
        },
      },
      modules: {
        include: {
          _count: {
            select: { lessons: true },
          },
          lessons: {
            include: {
              _count: {
                select: { labs: true },
              },
            },
          },
        },
      },
    },
  });

  return courses.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    category: c.category,
    level: c.level,
    estimatedDuration: c.estimatedDuration,
    status: c.status,
    orderIndex: c.orderIndex,
    maxXp: c.maxXp,
    certificateFlag: c.certificateFlag,
    moduleCount: c._count.modules,
    lessonCount: c.modules.reduce((s, m) => s + m._count.lessons, 0),
    labCount: c.modules.reduce(
      (s, m) => s + m.lessons.reduce((ls, l) => ls + l._count.labs, 0),
      0
    ),
  }));
}

export async function getCourseBySlug(slug: string) {
  const course = await prisma.trainingCourse.findUnique({
    where: { slug },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
            include: {
              quizzes: { orderBy: { orderIndex: "asc" } },
              labs: { orderBy: { orderIndex: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
}

export async function getCourseById(id: string) {
  const course = await prisma.trainingCourse.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { orderIndex: "asc" },
        include: {
          lessons: {
            orderBy: { orderIndex: "asc" },
            include: {
              quizzes: { orderBy: { orderIndex: "asc" } },
              labs: { orderBy: { orderIndex: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
}

export async function getUserCourseProgress(userId: string, courseId: string) {
  const courseProgress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

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

  const [lessonProgress, labAttempts] = await Promise.all([
    prisma.userLessonProgress.findMany({
      where: { userId, lessonId: { in: lessonIds } },
    }),
    prisma.userLabAttempt.findMany({
      where: { userId, labId: { in: labIds } },
    }),
  ]);

  return {
    courseProgress: courseProgress
      ? {
          id: courseProgress.id,
          courseId: courseProgress.courseId,
          started: courseProgress.started,
          completed: courseProgress.completed,
          totalXpEarned: courseProgress.totalXpEarned,
          completedAt: courseProgress.completedAt?.toISOString() ?? null,
          certificateHash: courseProgress.certificateHash,
        }
      : null,
    lessonProgress: lessonProgress.map((lp) => ({
      id: lp.id,
      lessonId: lp.lessonId,
      completed: lp.completed,
      xpEarned: lp.xpEarned,
      attempts: lp.attempts,
      completedAt: lp.completedAt?.toISOString() ?? null,
    })),
    labAttempts: labAttempts.map((la) => ({
      id: la.id,
      labId: la.labId,
      completed: la.completed,
      xpEarned: la.xpEarned,
      hintsUsed: la.hintsUsed,
      failedAttempts: la.failedAttempts,
      objectivesState: la.objectivesState as Record<string, boolean>,
      startedAt: la.startedAt.toISOString(),
      completedAt: la.completedAt?.toISOString() ?? null,
    })),
  };
}

export async function startCourseProgress(userId: string, courseId: string) {
  const course = await prisma.trainingCourse.findUnique({
    where: { id: courseId },
  });

  if (!course || course.status !== "ACTIVE") {
    throw new AppError("Course not found or not active", 404);
  }

  return prisma.userCourseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, started: true },
    update: {},
  });
}

export async function checkAndCompleteCourse(userId: string, courseId: string) {
  const course = await prisma.trainingCourse.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) return;

  const allLessonIds = course.modules.flatMap((m) =>
    m.lessons.map((l) => l.id)
  );

  const completedCount = await prisma.userLessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completed: true,
    },
  });

  if (completedCount >= allLessonIds.length && allLessonIds.length > 0) {
    const totalXp = await prisma.userLessonProgress.aggregate({
      where: { userId, lessonId: { in: allLessonIds } },
      _sum: { xpEarned: true },
    });

    const crypto = await import("crypto");
    const certHash = crypto
      .createHash("sha256")
      .update(`${userId}:${courseId}:${Date.now()}`)
      .digest("hex")
      .substring(0, 32);

    await prisma.userCourseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        started: true,
        completed: true,
        totalXpEarned: totalXp._sum.xpEarned ?? 0,
        completedAt: new Date(),
        certificateHash: certHash,
      },
      update: {
        completed: true,
        totalXpEarned: totalXp._sum.xpEarned ?? 0,
        completedAt: new Date(),
        certificateHash: certHash,
      },
    });
  }
}
