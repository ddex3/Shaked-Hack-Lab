import { useMemo } from "react";
import { getCourseById, getOrderedLessons } from "../services/course.service";
import type { Course, Section, Lesson } from "../types/course.types";

interface UseLessonReturn {
  course: Course | undefined;
  section: Section | undefined;
  lesson: Lesson | undefined;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

export function useLesson(
  courseId: string | undefined,
  lessonId: string | undefined
): UseLessonReturn {
  const course = useMemo(() => {
    if (!courseId) return undefined;
    return getCourseById(courseId);
  }, [courseId]);

  const section = useMemo(() => {
    if (!course || !lessonId) return undefined;
    return course.sections.find((s) =>
      s.lessons.some((l) => l.id === lessonId)
    );
  }, [course, lessonId]);

  const lesson = useMemo(() => {
    if (!section || !lessonId) return undefined;
    return section.lessons.find((l) => l.id === lessonId);
  }, [section, lessonId]);

  const { previousLesson, nextLesson } = useMemo(() => {
    if (!course || !lessonId) return { previousLesson: null, nextLesson: null };
    const ordered = getOrderedLessons(course);
    const idx = ordered.findIndex((l) => l.id === lessonId);
    return {
      previousLesson: idx > 0 ? ordered[idx - 1]! : null,
      nextLesson: idx < ordered.length - 1 ? ordered[idx + 1]! : null,
    };
  }, [course, lessonId]);

  return { course, section, lesson, previousLesson, nextLesson };
}
