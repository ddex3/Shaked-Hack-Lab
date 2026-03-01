import { useState, useCallback, useEffect, useRef } from "react";
import type { SandboxStartResponse, SandboxStatus } from "../types/challenge-engine.types";
import { startSandbox, stopSandbox, resetSandbox, getActiveSandbox } from "../services/sandbox.service";

interface UseSandboxReturn {
  session: SandboxStartResponse | null;
  status: SandboxStatus | null;
  remainingSeconds: number;
  loading: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => Promise<void>;
}

export function useSandbox(challengeId: string): UseSandboxReturn {
  const [session, setSession] = useState<SandboxStartResponse | null>(null);
  const [status, setStatus] = useState<SandboxStatus | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback((expiresAt: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const update = () => {
      const remaining = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        setStatus("EXPIRED");
        if (timerRef.current) clearInterval(timerRef.current);
      }
    };

    update();
    timerRef.current = setInterval(update, 1000);
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (session && (status === "EXPIRED" || status === "COMPLETED")) {
      try {
        await stopSandbox(session.sessionId);
      } catch {
      }
      setSession(null);
    }

    try {
      const result = await startSandbox(challengeId);
      setSession(result);
      setStatus("RUNNING");
      startTimer(result.expiresAt);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        const existing = await getActiveSandbox(challengeId);
        if (existing) {
          setSession(existing);
          setStatus("RUNNING");
          startTimer(existing.expiresAt);
          return;
        }
      }
      setError(err?.response?.data?.error || "Failed to start sandbox");
    } finally {
      setLoading(false);
    }
  }, [challengeId, session, status, startTimer]);

  const stop = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      await stopSandbox(session.sessionId);
      setSession(null);
      setStatus("COMPLETED");
      setRemainingSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to stop sandbox");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const reset = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const result = await resetSandbox(session.sessionId);
      setSession(result);
      setStatus("RUNNING");
      startTimer(result.expiresAt);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to reset sandbox");
    } finally {
      setLoading(false);
    }
  }, [session, startTimer]);

  useEffect(() => {
    let cancelled = false;

    async function checkExisting() {
      try {
        const existing = await getActiveSandbox(challengeId);
        if (!cancelled && existing) {
          setSession(existing);
          setStatus("RUNNING");
          startTimer(existing.expiresAt);
        }
      } catch {
      }
    }

    checkExisting();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [challengeId, startTimer]);

  return { session, status, remainingSeconds, loading, error, start, stop, reset };
}
