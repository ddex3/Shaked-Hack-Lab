export type CourseStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type LabType = "LINUX_TERMINAL" | "WINDOWS_SIMULATION" | "BRUTE_FORCE_SIMULATION";

export type LabObjectiveType =
  | "COMMAND_EXECUTION"
  | "FILE_DISCOVERY"
  | "PERMISSION_CHECK"
  | "LOG_ANALYSIS"
  | "PROCESS_IDENTIFICATION"
  | "RATE_LIMIT_CONFIG"
  | "PASSWORD_ANALYSIS";

export interface TrainingCoursePublic {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedDuration: string;
  status: CourseStatus;
  orderIndex: number;
  maxXp: number;
  certificateFlag: boolean;
  moduleCount: number;
  lessonCount: number;
  labCount: number;
}

export interface TrainingModulePublic {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessons: TrainingLessonPublic[];
}

export interface TrainingLessonPublic {
  id: string;
  moduleId: string;
  title: string;
  content: LessonContentBlock[];
  orderIndex: number;
  maxXp: number;
  minXp: number;
  quizzes: TrainingQuizPublic[];
  labs: TrainingLabPublic[];
}

export interface TrainingLabPublic {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  labType: LabType;
  objectives: LabObjective[];
  maxXp: number;
  minXp: number;
  hintPenalty: number;
  timeoutSeconds: number;
  orderIndex: number;
  active: boolean;
}

export interface LabObjective {
  id: string;
  description: string;
  type: LabObjectiveType;
  validationRule: LabValidationRule;
  xpValue: number;
  hints: string[];
}

export interface LabValidationRule {
  command?: string;
  expectedOutput?: string;
  expectedPattern?: string;
  filePath?: string;
  expectedContent?: string;
  processName?: string;
  permissionMask?: string;
  configKey?: string;
  configValue?: string;
}

export interface TrainingQuizPublic {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
  orderIndex: number;
}

export type LessonContentBlock =
  | LessonTextBlock
  | LessonHeadingBlock
  | LessonCodeBlock
  | LessonListBlock
  | LessonAlertBlock
  | LessonTerminalBlock;

export interface LessonTextBlock {
  type: "text";
  content: string;
}

export interface LessonHeadingBlock {
  type: "heading";
  content: string;
}

export interface LessonCodeBlock {
  type: "code";
  language: string;
  content: string;
}

export interface LessonListBlock {
  type: "list";
  items: string[];
}

export interface LessonAlertBlock {
  type: "alert";
  variant: "info" | "warning" | "danger";
  content: string;
}

export interface LessonTerminalBlock {
  type: "terminal";
  commands: string[];
  output: string;
}

export interface CourseDetailResponse {
  course: TrainingCoursePublic;
  modules: TrainingModulePublic[];
}

export interface UserCourseProgressPublic {
  id: string;
  courseId: string;
  started: boolean;
  completed: boolean;
  totalXpEarned: number;
  completedAt: string | null;
  certificateHash: string | null;
}

export interface UserLessonProgressPublic {
  id: string;
  lessonId: string;
  completed: boolean;
  xpEarned: number;
  attempts: number;
  completedAt: string | null;
}

export interface UserLabAttemptPublic {
  id: string;
  labId: string;
  completed: boolean;
  xpEarned: number;
  hintsUsed: number;
  failedAttempts: number;
  objectivesState: Record<string, boolean>;
  startedAt: string;
  completedAt: string | null;
}

export interface LabStartRequest {
  labId: string;
}

export interface LabStartResponse {
  sessionId: string;
  wsUrl: string;
  expiresAt: string;
  labType: LabType;
  objectives: LabObjective[];
}

export interface LabValidateRequest {
  labId: string;
  sessionId: string;
  objectiveId: string;
  answer: string;
}

export interface LabValidateResponse {
  correct: boolean;
  feedback: string;
  xpEarned: number;
  objectiveComplete: boolean;
  labComplete: boolean;
  totalLabXp: number;
}

export interface LabHintRequest {
  labId: string;
  objectiveId: string;
  hintIndex: number;
}

export interface LabHintResponse {
  hint: string;
  xpPenalty: number;
  remainingXp: number;
}

export interface QuizSubmitRequest {
  quizId: string;
  answer: string;
}

export interface QuizSubmitResponse {
  correct: boolean;
  explanation: string;
  xpEarned: number;
}

export interface CourseProgressResponse {
  courseProgress: UserCourseProgressPublic | null;
  lessonProgress: UserLessonProgressPublic[];
  labAttempts: UserLabAttemptPublic[];
}

export interface AdminCourseUpdateRequest {
  status?: CourseStatus;
  maxXp?: number;
  certificateFlag?: boolean;
  orderIndex?: number;
}

export interface AdminLabConfigRequest {
  maxXp?: number;
  minXp?: number;
  hintPenalty?: number;
  timeoutSeconds?: number;
  active?: boolean;
}

export interface BruteForceSimConfig {
  maxAttempts: number;
  lockoutThreshold: number;
  lockoutDurationSeconds: number;
  rateLimitPerMinute: number;
  passwordComplexity: "weak" | "medium" | "strong";
  simulatedDelayMs: number;
}

export interface BruteForceSimResult {
  attemptNumber: number;
  success: boolean;
  locked: boolean;
  lockoutRemainingSeconds: number;
  rateLimited: boolean;
  message: string;
  totalAttempts: number;
  estimatedCrackTime: string;
}

export interface WindowsCommandResult {
  command: string;
  output: string;
  exitCode: number;
  cwd: string;
}
