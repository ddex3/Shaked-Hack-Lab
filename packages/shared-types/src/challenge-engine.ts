import type { SandboxStatus, ValidationType, ChallengeDifficulty, ChallengeCategory, SandboxType } from "./enums";

export interface SandboxSessionPublic {
  id: string;
  challengeId: string;
  status: SandboxStatus;
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
}

export interface ChallengeHintPublic {
  id: string;
  orderIndex: number;
  pointCost: number;
  content: string | null;
  unlocked: boolean;
}

export interface ValidationResult {
  correct: boolean;
  score: number;
  hintsUsed: number;
  pointsDeducted: number;
  feedback: string;
}

export interface ChallengeConfigPublic {
  timeoutSeconds: number;
  sandboxType: SandboxType;
}

export interface ChallengeDetail {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  sandboxType: SandboxType;
  points: number;
  instructions: string;
  solveCount: number;
  config: ChallengeConfigPublic | null;
}

export interface SandboxStartRequest {
  challengeId: string;
}

export interface SandboxStartResponse {
  sessionId: string;
  wsUrl: string;
  expiresAt: string;
}

export interface SandboxStatusResponse {
  session: SandboxSessionPublic;
}

export interface SqlExecRequest {
  fields: Record<string, string>;
  endpoint: string;
}

export interface SqlExecResponse {
  status: number;
  body: unknown;
}

export interface HintUnlockRequest {
  confirm: boolean;
}

export interface HintUnlockResponse {
  hint: ChallengeHintPublic;
  totalDeductions: number;
}

export interface HintsListResponse {
  hints: ChallengeHintPublic[];
  totalDeductions: number;
  maxPoints: number;
}

export interface EngineSubmitRequest {
  challengeId: string;
  answer: string;
  sandboxSessionId?: string;
}

export interface EngineSubmitResponse {
  result: ValidationResult;
}

export { SandboxStatus, ValidationType };
