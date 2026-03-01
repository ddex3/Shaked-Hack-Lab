import type { ReactNode } from "react";

interface TerminalToolbarProps {
  onReset: () => void;
  loading: boolean;
  status: string | null;
}

export function TerminalToolbar({ onReset, loading, status }: TerminalToolbarProps): ReactNode {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === "RUNNING" ? "bg-green-500 animate-pulse" :
          status === "EXPIRED" ? "bg-red-500" :
          "bg-gray-500"
        }`} />
        <span className="text-[10px] font-mono text-gray-500 uppercase">
          {status || "IDLE"}
        </span>
      </div>

      <button
        onClick={onReset}
        disabled={loading || status !== "RUNNING"}
        className="text-[10px] font-mono text-gray-400 hover:text-hacker-green border border-terminal-border rounded px-3 py-1 hover:border-hacker-green/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Reset Environment"}
      </button>
    </div>
  );
}
