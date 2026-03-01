export type SandboxStatus = "PENDING" | "RUNNING" | "COMPLETED" | "EXPIRED" | "ERROR";
export type ValidationType = "FLAG_MATCH" | "SQL_RESULT_CHECK" | "FILE_CONTENT_CHECK" | "COMMAND_OUTPUT_CHECK" | "MULTI_STEP";
export type ChallengeDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type ChallengeCategory =
  | "WEB_EXPLOITATION"
  | "CRYPTOGRAPHY"
  | "REVERSE_ENGINEERING"
  | "FORENSICS"
  | "BINARY_EXPLOITATION"
  | "NETWORK_SECURITY"
  | "OSINT"
  | "MISCELLANEOUS";

export interface ChallengeConfig {
  dockerImage: string;
  memoryLimitMb: number;
  cpuLimit: number;
  timeoutSeconds: number;
  networkDisabled: boolean;
  whitelistedCmds: string[];
}

export interface ChallengeHint {
  id: string;
  orderIndex: number;
  content: string | null;
  pointCost: number;
  unlocked: boolean;
}

export interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
  sandboxType: string;
  instructions: string;
  solveCount: number;
  config: ChallengeConfig | null;
  validationType: ValidationType | null;
}

export interface SandboxSession {
  sessionId: string;
  status: SandboxStatus;
  wsUrl: string;
  remainingSeconds: number;
  expiresAt: string;
}

export interface SandboxStartResponse {
  sessionId: string;
  wsUrl: string;
  expiresAt: string;
}

export interface SandboxStatusResponse {
  sessionId: string;
  status: SandboxStatus;
  remainingSeconds: number;
  expiresAt: string;
}

export interface SqlExecResponse {
  output: string;
  exitCode: number;
}

export interface ValidationResult {
  correct: boolean;
  feedback: string;
  score: number;
  pointsDeducted: number;
  hintsUsed: number;
}

export interface HintsListResponse {
  hints: ChallengeHint[];
  totalDeductions: number;
  maxPoints: number;
}

export interface HintUnlockResponse {
  hint: ChallengeHint;
  totalDeductions: number;
}
