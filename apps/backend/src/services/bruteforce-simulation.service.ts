import { AppError } from "../utils/AppError";

interface SimulationState {
  attempts: number;
  locked: boolean;
  lockoutUntil: number;
  lastAttemptTimestamps: number[];
}

const sessionStates = new Map<string, SimulationState>();

const CLEANUP_INTERVAL = 300000;
setInterval(() => {
  const now = Date.now();
  for (const [key, state] of sessionStates) {
    if (state.lastAttemptTimestamps.length === 0) continue;
    const lastAttempt = state.lastAttemptTimestamps[state.lastAttemptTimestamps.length - 1]!;
    if (now - lastAttempt > 600000) {
      sessionStates.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

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

const PASSWORD_POOLS: Record<string, { charset: number; length: number }> = {
  weak: { charset: 26, length: 6 },
  medium: { charset: 62, length: 8 },
  strong: { charset: 95, length: 14 },
};

export function calculateEstimatedCrackTime(
  complexity: "weak" | "medium" | "strong",
  attemptsPerSecond: number
): string {
  const pool = PASSWORD_POOLS[complexity]!;
  const combinations = Math.pow(pool.charset, pool.length);
  const seconds = combinations / attemptsPerSecond;

  if (seconds < 1) return "Less than 1 second";
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.ceil(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.ceil(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1e6) return `${Math.ceil(seconds / (31536000 * 1000))} thousand years`;
  if (seconds < 31536000 * 1e9) return `${Math.ceil(seconds / (31536000 * 1e6))} million years`;
  return `${Math.ceil(seconds / (31536000 * 1e9))} billion years`;
}

export function calculatePasswordEntropy(
  complexity: "weak" | "medium" | "strong"
): number {
  const pool = PASSWORD_POOLS[complexity]!;
  return Math.round(pool.length * Math.log2(pool.charset) * 100) / 100;
}

export function simulateLoginAttempt(
  sessionKey: string,
  config: BruteForceConfig,
  passwordGuess: string
): BruteForceResult {
  let state = sessionStates.get(sessionKey);
  if (!state) {
    state = {
      attempts: 0,
      locked: false,
      lockoutUntil: 0,
      lastAttemptTimestamps: [],
    };
    sessionStates.set(sessionKey, state);
  }

  const now = Date.now();

  if (state.locked && now < state.lockoutUntil) {
    const remainingMs = state.lockoutUntil - now;
    return {
      attemptNumber: state.attempts,
      success: false,
      locked: true,
      lockoutRemainingSeconds: Math.ceil(remainingMs / 1000),
      rateLimited: false,
      message: `Account locked. Try again in ${Math.ceil(remainingMs / 1000)} seconds.`,
      totalAttempts: state.attempts,
      estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
    };
  }

  if (state.locked && now >= state.lockoutUntil) {
    state.locked = false;
    state.lockoutUntil = 0;
  }

  const oneMinuteAgo = now - 60000;
  state.lastAttemptTimestamps = state.lastAttemptTimestamps.filter(
    (t) => t > oneMinuteAgo
  );

  if (state.lastAttemptTimestamps.length >= config.rateLimitPerMinute) {
    return {
      attemptNumber: state.attempts,
      success: false,
      locked: false,
      lockoutRemainingSeconds: 0,
      rateLimited: true,
      message: `Rate limit exceeded. Maximum ${config.rateLimitPerMinute} attempts per minute.`,
      totalAttempts: state.attempts,
      estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
    };
  }

  state.attempts++;
  state.lastAttemptTimestamps.push(now);

  if (state.attempts > config.maxAttempts) {
    return {
      attemptNumber: state.attempts,
      success: false,
      locked: state.locked,
      lockoutRemainingSeconds: 0,
      rateLimited: false,
      message: "Maximum simulation attempts reached. Reset the simulation to continue.",
      totalAttempts: state.attempts,
      estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
    };
  }

  const isCorrect = checkSimulatedPassword(config.passwordComplexity, passwordGuess);

  if (!isCorrect) {
    const failedSinceReset = state.attempts;
    if (failedSinceReset >= config.lockoutThreshold && config.lockoutThreshold > 0) {
      state.locked = true;
      state.lockoutUntil = now + config.lockoutDurationSeconds * 1000;

      return {
        attemptNumber: state.attempts,
        success: false,
        locked: true,
        lockoutRemainingSeconds: config.lockoutDurationSeconds,
        rateLimited: false,
        message: `Account locked after ${config.lockoutThreshold} failed attempts. Lockout duration: ${config.lockoutDurationSeconds} seconds.`,
        totalAttempts: state.attempts,
        estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
      };
    }

    return {
      attemptNumber: state.attempts,
      success: false,
      locked: false,
      lockoutRemainingSeconds: 0,
      rateLimited: false,
      message: "Invalid credentials. Access denied.",
      totalAttempts: state.attempts,
      estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
    };
  }

  return {
    attemptNumber: state.attempts,
    success: true,
    locked: false,
    lockoutRemainingSeconds: 0,
    rateLimited: false,
    message: "Authentication successful (simulation). In real scenarios, this would indicate a compromised account.",
    totalAttempts: state.attempts,
    estimatedCrackTime: calculateEstimatedCrackTime(config.passwordComplexity, 1000),
  };
}

export function resetSimulation(sessionKey: string): void {
  sessionStates.delete(sessionKey);
}

export function getSimulationState(
  sessionKey: string
): SimulationState | null {
  return sessionStates.get(sessionKey) ?? null;
}

function checkSimulatedPassword(
  complexity: "weak" | "medium" | "strong",
  guess: string
): boolean {
  const targets: Record<string, string> = {
    weak: "abc123",
    medium: "P@ssw0rd",
    strong: "Tr0ub4dor&3x!mP",
  };

  return guess === targets[complexity];
}

export function analyzePasswordStrength(password: string): {
  score: number;
  entropy: number;
  crackTime: string;
  feedback: string[];
} {
  let charsetSize = 0;
  const feedback: string[] = [];

  if (/[a-z]/.test(password)) charsetSize += 26;
  else feedback.push("Add lowercase letters for more complexity.");

  if (/[A-Z]/.test(password)) charsetSize += 26;
  else feedback.push("Add uppercase letters for more complexity.");

  if (/[0-9]/.test(password)) charsetSize += 10;
  else feedback.push("Add numbers for more complexity.");

  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 33;
  else feedback.push("Add special characters for more complexity.");

  if (charsetSize === 0) charsetSize = 26;

  const entropy = password.length * Math.log2(charsetSize);
  const combinations = Math.pow(2, entropy);
  const attemptsPerSecond = 1e9;
  const secondsToCrack = combinations / attemptsPerSecond;

  let crackTime: string;
  if (secondsToCrack < 1) crackTime = "Instant";
  else if (secondsToCrack < 60) crackTime = `${Math.ceil(secondsToCrack)} seconds`;
  else if (secondsToCrack < 3600) crackTime = `${Math.ceil(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack < 86400) crackTime = `${Math.ceil(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack < 31536000) crackTime = `${Math.ceil(secondsToCrack / 86400)} days`;
  else crackTime = `${Math.ceil(secondsToCrack / 31536000)} years`;

  let score = 0;
  if (entropy >= 28) score = 1;
  if (entropy >= 36) score = 2;
  if (entropy >= 60) score = 3;
  if (entropy >= 80) score = 4;
  if (entropy >= 100) score = 5;

  if (password.length < 8) feedback.push("Use at least 8 characters.");
  if (password.length < 12) feedback.push("Consider using 12+ characters for better security.");

  return {
    score,
    entropy: Math.round(entropy * 100) / 100,
    crackTime,
    feedback,
  };
}
