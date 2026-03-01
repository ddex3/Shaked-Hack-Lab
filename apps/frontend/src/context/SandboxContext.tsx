import { createContext, useContext, type ReactNode } from "react";
import { useSandbox } from "../hooks/useSandbox";
import type { SandboxStartResponse, SandboxStatus } from "../types/challenge-engine.types";

interface SandboxContextValue {
  session: SandboxStartResponse | null;
  status: SandboxStatus | null;
  remainingSeconds: number;
  loading: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  reset: () => Promise<void>;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

export function SandboxProvider({
  challengeId,
  children,
}: {
  challengeId: string;
  children: ReactNode;
}): ReactNode {
  const sandbox = useSandbox(challengeId);

  return (
    <SandboxContext.Provider value={sandbox}>
      {children}
    </SandboxContext.Provider>
  );
}

export function useSandboxContext(): SandboxContextValue {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error("useSandboxContext must be used within a SandboxProvider");
  }
  return context;
}
