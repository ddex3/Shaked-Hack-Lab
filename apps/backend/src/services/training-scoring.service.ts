import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";
import { checkAndCompleteCourse } from "./training-course.service";

export async function submitQuizAnswer(
  userId: string,
  quizId: string
): Promise<{ correct: boolean; explanation: string; xpEarned: number }> {
  const quiz = await prisma.trainingQuiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: { select: { id: true } },
            },
          },
          quizzes: { select: { id: true } },
        },
      },
    },
  });

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  return {
    correct: true,
    explanation: quiz.explanation,
    xpEarned: quiz.xpReward,
  };
}

export async function processQuizCompletion(
  userId: string,
  quizId: string,
  answer: string
): Promise<{ correct: boolean; explanation: string; xpEarned: number }> {
  const quiz = await prisma.trainingQuiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: { select: { id: true } },
            },
          },
          quizzes: {
            orderBy: { orderIndex: "asc" },
            select: { id: true, correctAnswer: true },
          },
        },
      },
    },
  });

  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }

  const correct = answer.trim().toLowerCase() === quiz.correctAnswer.trim().toLowerCase();
  const xpEarned = correct ? quiz.xpReward : 0;

  const lessonId = quiz.lessonId;
  const courseId = quiz.lesson.module.course.id;

  await prisma.userCourseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, started: true },
    update: {},
  });

  if (correct) {
    const existing = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        xpEarned: xpEarned,
        attempts: 1,
      },
      update: {
        xpEarned: { increment: xpEarned },
        attempts: { increment: 1 },
      },
    });

    const allQuizIds = quiz.lesson.quizzes.map((q) => q.id);
    const lessonProg = await prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (lessonProg && !lessonProg.completed) {
      const answeredCorrectly = allQuizIds.length <= 1 || lessonProg.attempts >= allQuizIds.length;
      if (answeredCorrectly) {
        await prisma.userLessonProgress.update({
          where: { userId_lessonId: { userId, lessonId } },
          data: { completed: true, completedAt: new Date() },
        });
        await checkAndCompleteCourse(userId, courseId);
      }
    }

    if (!existing) {
      await prisma.profile.updateMany({
        where: { userId },
        data: { score: { increment: xpEarned } },
      });
    }
  } else {
    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, attempts: 1 },
      update: { attempts: { increment: 1 } },
    });
  }

  return { correct, explanation: quiz.explanation, xpEarned };
}

export async function calculateLabXp(
  labMaxXp: number,
  labMinXp: number,
  hintPenalty: number,
  hintsUsed: number,
  failedAttempts: number,
  timedOut: boolean
): Promise<number> {
  let xp = labMaxXp;
  xp -= hintsUsed * hintPenalty;
  xp -= Math.floor(failedAttempts / 3) * 5;
  if (timedOut) {
    xp = Math.floor(xp * 0.5);
  }
  return Math.max(labMinXp, Math.min(xp, labMaxXp));
}

export async function processLabCompletion(
  userId: string,
  labId: string,
  hintsUsed: number,
  failedAttempts: number,
  timedOut: boolean
): Promise<{ xpEarned: number; courseCompleted: boolean }> {
  const lab = await prisma.trainingLab.findUnique({
    where: { id: labId },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: { select: { id: true } },
            },
          },
          quizzes: { select: { id: true } },
          labs: { select: { id: true } },
        },
      },
    },
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  const xpEarned = await calculateLabXp(
    lab.maxXp,
    lab.minXp,
    lab.hintPenalty,
    hintsUsed,
    failedAttempts,
    timedOut
  );

  const courseId = lab.lesson.module.course.id;
  const lessonId = lab.lessonId;

  await prisma.userLabAttempt.updateMany({
    where: { userId, labId, completed: false },
    data: {
      completed: true,
      xpEarned,
      completedAt: new Date(),
    },
  });

  await prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    create: {
      userId,
      lessonId,
      xpEarned,
      completed: true,
      completedAt: new Date(),
      attempts: 1,
    },
    update: {
      xpEarned: { increment: xpEarned },
      completed: true,
      completedAt: new Date(),
    },
  });

  await prisma.userCourseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      started: true,
      totalXpEarned: xpEarned,
    },
    update: {
      totalXpEarned: { increment: xpEarned },
    },
  });

  await prisma.profile.updateMany({
    where: { userId },
    data: { score: { increment: xpEarned } },
  });

  await checkAndCompleteCourse(userId, courseId);

  const courseProgress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  return {
    xpEarned,
    courseCompleted: courseProgress?.completed ?? false,
  };
}
