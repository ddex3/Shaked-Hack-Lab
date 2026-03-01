export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseCategory = "Web Security" | "Network Security" | "Cryptography" | "Linux Fundamentals" | "Windows Fundamentals" | "Brute Force";

export type ChallengeType = "multiple-choice" | "true-false";

export interface TextBlock {
  type: "text";
  content: string;
}

export interface HeadingBlock {
  type: "heading";
  content: string;
}

export interface CodeBlock {
  type: "code";
  content: string;
  language: string;
}

export interface ListBlock {
  type: "list";
  items: string[];
}

export interface AlertBlock {
  type: "alert";
  content: string;
  variant: "info" | "warning" | "danger";
}

export type ContentBlock = TextBlock | HeadingBlock | CodeBlock | ListBlock | AlertBlock;

export interface CourseChallenge {
  id: string;
  type: ChallengeType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: CourseLevel;
  xpReward: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: ContentBlock[];
  order: number;
  challenges: CourseChallenge[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  category: CourseCategory;
  estimatedDuration: string;
  sections: Section[];
}

export interface CourseProgressData {
  challengeResults: Record<string, boolean>;
  xpEarned: number;
}

export interface ProgressState {
  courses: Record<string, CourseProgressData>;
  totalXp: number;
}

export interface CourseFiltersState {
  level: string;
  category: string;
  search: string;
}

export interface CourseScore {
  correct: number;
  total: number;
  percentage: number;
}

export interface ProgressContextValue {
  progress: ProgressState;
  completeChallenge: (courseId: string, challengeId: string, correct: boolean, xp: number) => void;
  isChallengeAttempted: (courseId: string, challengeId: string) => boolean;
  getChallengeResult: (courseId: string, challengeId: string) => boolean | undefined;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  isLessonUnlocked: (courseId: string, lessonId: string) => boolean;
  getCourseCompletion: (courseId: string) => number;
  getCourseScore: (courseId: string) => CourseScore;
  totalXp: number;
}
