import { useState, useCallback, useEffect } from "react";
import type { ChallengeDetail, ValidationResult } from "../types/challenge-engine.types";
import { getChallengeDetail, validateSubmission } from "../services/challenge-engine.service";

interface UseChallengeEngineReturn {
  challenge: ChallengeDetail | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  result: ValidationResult | null;
  submit: (answer: string, sandboxSessionId?: string) => Promise<void>;
  clearResult: () => void;
}

export function useChallengeEngine(challengeId: string): UseChallengeEngineReturn {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getChallengeDetail(challengeId);
        if (!cancelled) setChallenge(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.error || "Failed to load challenge");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [challengeId]);

  const submit = useCallback(async (answer: string, sandboxSessionId?: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const data = await validateSubmission(challengeId, answer, sandboxSessionId);
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [challengeId]);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { challenge, loading, error, submitting, result, submit, clearResult };
}
