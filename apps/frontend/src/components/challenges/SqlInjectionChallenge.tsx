import { type ReactNode } from "react";
import { useSandboxContext } from "../../context/SandboxContext";
import { SqlPlayground } from "../sql-playground/SqlPlayground";
import { TerminalToolbar } from "../terminal/TerminalToolbar";

interface SqlInjectionChallengeProps {
  endpoint?: string;
}

export function SqlInjectionChallenge({ endpoint = "/login" }: SqlInjectionChallengeProps): ReactNode {
  const { session, status, remainingSeconds, loading, error, start, reset } = useSandboxContext();

  if (status === "EXPIRED" || status === "COMPLETED") {
    return (
      <div className="terminal-border rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <span className="text-sm font-mono text-gray-400">
          {status === "EXPIRED" ? "Session expired" : "Session ended"}
        </span>
        <button
          onClick={start}
          disabled={loading}
          className="btn-primary text-xs px-6"
        >
          {loading ? "Starting..." : "Relaunch Sandbox"}
        </button>
      </div>
    );
  }

  if (!session || status !== "RUNNING") {
    return (
      <div className="terminal-border rounded-lg p-8 flex flex-col items-center gap-4">
        <span className="text-sm font-mono text-gray-400">
          Start the sandbox to access the SQL injection playground
        </span>
        {error && (
          <span className="text-xs font-mono text-red-400">{error}</span>
        )}
        <button
          onClick={start}
          disabled={loading}
          className="btn-primary text-xs px-6"
        >
          {loading ? "Starting..." : "Launch Sandbox"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TerminalToolbar onReset={reset} loading={loading} status={status} />
      {remainingSeconds > 0 && remainingSeconds <= 60 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <span className="text-xs font-mono text-red-400">
            Session expires in {remainingSeconds}s - save your work!
          </span>
        </div>
      )}
      <SqlPlayground sessionId={session.sessionId} endpoint={endpoint} />
    </div>
  );
}
