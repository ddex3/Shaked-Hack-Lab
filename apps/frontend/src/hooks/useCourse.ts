import { useMemo } from "react";
import { getCourseById, getOrderedLessons, getTotalChallenges } from "../services/course.service";
import type { Course, Lesson } from "../types/course.types";

interface UseCourseReturn {
  course: Course | undefined;
  orderedLessons: Lesson[];
  totalChallenges: number;
}

export function useCourse(courseId: string | undefined): UseCourseReturn {
  const course = useMemo(() => {
    if (!courseId) return undefined;
    return getCourseById(courseId);
  }, [courseId]);

  const orderedLessons = useMemo(() => {
    if (!course) return [];
    return getOrderedLessons(course);
  }, [course]);

  const totalChallenges = useMemo(() => {
    if (!course) return 0;
    return getTotalChallenges(course);
  }, [course]);

  return { course, orderedLessons, totalChallenges };
}
