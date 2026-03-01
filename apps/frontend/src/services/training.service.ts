import { api } from "./api";

export interface BruteForceConfig {
  maxAttempts: number;
  lockoutThreshold: number;
  lockoutDurationSeconds: number;
  rateLimitPerMinute: number;
  passwordComplexity: "weak" | "medium" | "strong";
  simulatedDelayMs: number;
}

export interface BruteForceResult {
  attemptNumber: number;
  success: boolean;
  locked: boolean;
  lockoutRemainingSeconds: number;
  rateLimited: boolean;
  message: string;
  totalAttempts: number;
  estimatedCrackTime: string;
}

export interface PasswordAnalysis {
  score: number;
  entropy: number;
  crackTime: string;
  feedback: string[];
}

export interface WindowsCommandResult {
  command: string;
  output: string;
  exitCode: number;
  cwd: string;
}

export async function simulateBruteForceAttempt(
  sessionKey: string,
  passwordGuess: string,
  config: BruteForceConfig
): Promise<BruteForceResult> {
  const { data } = await api.post<{ success: boolean; data: BruteForceResult }>(
    "/training/simulation/bruteforce/attempt",
    { sessionKey, passwordGuess, config }
  );
  return data.data;
}

export async function resetBruteForceSimulation(
  sessionKey: string
): Promise<void> {
  await api.post("/training/simulation/bruteforce/reset", { sessionKey });
}

export async function analyzePassword(
  password: string
): Promise<PasswordAnalysis> {
  const { data } = await api.post<{ success: boolean; data: PasswordAnalysis }>(
    "/training/simulation/bruteforce/analyze",
    { password }
  );
  return data.data;
}

export async function executeWindowsCommand(
  sessionKey: string,
  command: string
): Promise<WindowsCommandResult> {
  const { data } = await api.post<{ success: boolean; data: WindowsCommandResult }>(
    "/training/simulation/windows/command",
    { sessionKey, command }
  );
  return data.data;
}

export async function resetWindowsSimulation(
  sessionKey: string
): Promise<void> {
  await api.post("/training/simulation/windows/reset", { sessionKey });
}
