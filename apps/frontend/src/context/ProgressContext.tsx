import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import type { ProgressState, CourseProgressData, ProgressContextValue, CourseScore } from "../types/course.types";
import { getCourseById, getOrderedLessons, getTotalChallenges } from "../services/course.service";
import { syncScore } from "../services/auth.service";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "shaked-hack-lab-progress";

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { courses: {}, totalXp: 0 };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { courses: {}, totalXp: 0 };
  }
}

function persistProgress(state: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }): ReactNode {
  const [state, setState] = useState<ProgressState>(() => loadProgress());
  const { user, refreshUser } = useAuth();
  const prevXpRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    if (prevXpRef.current === state.totalXp) return;
    prevXpRef.current = state.totalXp;
    syncScore(state.totalXp)
      .then(() => refreshUser())
      .catch(() => {});
  }, [state.totalXp, user, refreshUser]);

  const completeChallenge = useCallback(
    (courseId: string, challengeId: string, correct: boolean, xp: number) => {
      setState((prev) => {
        const courseData = prev.courses[courseId] ?? { challengeResults: {}, xpEarned: 0 };
        if (courseData.challengeResults[challengeId] !== undefined) return prev;

        const earnedXp = correct ? xp : 0;
        const newCourseData: CourseProgressData = {
          challengeResults: { ...courseData.challengeResults, [challengeId]: correct },
          xpEarned: courseData.xpEarned + earnedXp,
        };

        const newState: ProgressState = {
          courses: { ...prev.courses, [courseId]: newCourseData },
          totalXp: prev.totalXp + earnedXp,
        };

        persistProgress(newState);
        return newState;
      });
    },
    []
  );

  const contextValue = useMemo((): ProgressContextValue => {
    const isChallengeAttempted = (courseId: string, challengeId: string): boolean => {
      return state.courses[courseId]?.challengeResults[challengeId] !== undefined;
    };

    const getChallengeResult = (courseId: string, challengeId: string): boolean | undefined => {
      return state.courses[courseId]?.challengeResults[challengeId];
    };

    const isLessonComplete = (courseId: string, lessonId: string): boolean => {
      const course = getCourseById(courseId);
      if (!course) return false;
      const courseData = state.courses[courseId];
      if (!courseData) return false;
      const allLessons = getOrderedLessons(course);
      const lesson = allLessons.find((l) => l.id === lessonId);
      if (!lesson) return false;
      return lesson.challenges.every(
        (ch) => courseData.challengeResults[ch.id] !== undefined
      );
    };

    const isLessonUnlocked = (courseId: string, lessonId: string): boolean => {
      const course = getCourseById(courseId);
      if (!course) return false;
      const allLessons = getOrderedLessons(course);
      const idx = allLessons.findIndex((l) => l.id === lessonId);
      if (idx <= 0) return true;
      const prev = allLessons[idx - 1];
      return prev ? isLessonComplete(courseId, prev.id) : true;
    };

    const getCourseCompletion = (courseId: string): number => {
      const course = getCourseById(courseId);
      if (!course) return 0;
      const allLessons = getOrderedLessons(course);
      if (allLessons.length === 0) return 0;
      const completed = allLessons.filter((l) => isLessonComplete(courseId, l.id)).length;
      return Math.round((completed / allLessons.length) * 100);
    };

    const getCourseScore = (courseId: string): CourseScore => {
      const course = getCourseById(courseId);
      if (!course) return { correct: 0, total: 0, percentage: 0 };
      const total = getTotalChallenges(course);
      if (total === 0) return { correct: 0, total: 0, percentage: 0 };
      const courseData = state.courses[courseId];
      if (!courseData) return { correct: 0, total, percentage: 0 };
      const correct = Object.values(courseData.challengeResults).filter(Boolean).length;
      return { correct, total, percentage: Math.round((correct / total) * 100) };
    };

    return {
      progress: state,
      completeChallenge,
      isChallengeAttempted,
      getChallengeResult,
      isLessonComplete,
      isLessonUnlocked,
      getCourseCompletion,
      getCourseScore,
      totalXp: state.totalXp,
    };
  }, [state, completeChallenge]);

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
