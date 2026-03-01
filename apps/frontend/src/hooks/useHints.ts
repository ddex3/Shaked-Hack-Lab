import { useState, useCallback, useEffect } from "react";
import type { ChallengeHint, HintsListResponse } from "../types/challenge-engine.types";
import { getHints, unlockHint as unlockHintApi } from "../services/hint.service";

interface UseHintsReturn {
  hints: ChallengeHint[];
  totalDeductions: number;
  maxPoints: number;
  loading: boolean;
  error: string | null;
  unlockHint: (hintId: string) => Promise<void>;
  refreshHints: () => Promise<void>;
}

export function useHints(challengeId: string): UseHintsReturn {
  const [hints, setHints] = useState<ChallengeHint[]>([]);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshHints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: HintsListResponse = await getHints(challengeId);
      setHints(data.hints);
      setTotalDeductions(data.totalDeductions);
      setMaxPoints(data.maxPoints);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load hints");
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  const unlockHint = useCallback(async (hintId: string) => {
    setError(null);
    try {
      const result = await unlockHintApi(hintId);
      setHints((prev) =>
        prev.map((h) =>
          h.id === hintId ? { ...h, content: result.hint.content, unlocked: true } : h
        )
      );
      setTotalDeductions(result.totalDeductions);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to unlock hint");
    }
  }, []);

  useEffect(() => {
    refreshHints();
  }, [refreshHints]);

  return { hints, totalDeductions, maxPoints, loading, error, unlockHint, refreshHints };
}
