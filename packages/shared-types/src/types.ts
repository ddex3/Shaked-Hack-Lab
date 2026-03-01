import {
  UserRole,
  ChallengeDifficulty,
  ChallengeCategory,
  SandboxType,
} from "./enums";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  identifier: string;
  password: string;
  deviceInfo?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserPublic;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  focusTrack: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: UserPublic;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface AliasCheckRequest {
  username: string;
}

export interface AliasCheckResponse {
  available: boolean;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profile: ProfilePublic | null;
}

export interface ProfilePublic {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  focusTrack: string;
  score: number;
  rank: number;
}

export interface ChallengePublic {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  sandboxType: SandboxType;
  points: number;
  solveCount: number;
  createdAt: string;
}

export interface SubmissionPublic {
  id: string;
  challengeId: string;
  userId: string;
  correct: boolean;
  score: number;
  submittedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  score: number;
  rank: number;
  solveCount: number;
}

export interface OnboardingStep1Data {
  username: string;
}

export interface OnboardingStep2Data {
  email: string;
  password: string;
}

export interface OnboardingStep3Data {
  displayName: string;
}

export interface OnboardingStep4Data {
  focusTrack: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  sandboxType: SandboxType;
  points: number;
  solutionHash: string;
  instructions: string;
}

export interface UpdateChallengeRequest {
  title?: string;
  description?: string;
  category?: ChallengeCategory;
  difficulty?: ChallengeDifficulty;
  sandboxType?: SandboxType;
  points?: number;
  solutionHash?: string;
  instructions?: string;
}
