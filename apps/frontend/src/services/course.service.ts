import { SEED_COURSES } from "../data/seed-courses";
import type { Course, Lesson } from "../types/course.types";

export function getAllCourses(): Course[] {
  return SEED_COURSES;
}

export function getCourseById(id: string): Course | undefined {
  return SEED_COURSES.find((c) => c.id === id);
}

export function getOrderedLessons(course: Course): Lesson[] {
  return course.sections.flatMap((s) => s.lessons);
}

export function getTotalLessons(course: Course): number {
  return course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
}

export function getTotalChallenges(course: Course): number {
  return course.sections.reduce(
    (sum, s) => sum + s.lessons.reduce((ls, l) => ls + l.challenges.length, 0),
    0
  );
}

export function findLessonInCourse(
  course: Course,
  lessonId: string
): { lesson: Lesson; sectionIndex: number; lessonIndex: number } | undefined {
  for (let si = 0; si < course.sections.length; si++) {
    const section = course.sections[si]!;
    for (let li = 0; li < section.lessons.length; li++) {
      if (section.lessons[li]!.id === lessonId) {
        return { lesson: section.lessons[li]!, sectionIndex: si, lessonIndex: li };
      }
    }
  }
  return undefined;
}
