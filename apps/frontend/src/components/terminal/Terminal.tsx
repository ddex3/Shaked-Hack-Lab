import { type ReactNode } from "react";
import { useTerminal } from "../../hooks/useTerminal";
import "@xterm/xterm/css/xterm.css";

interface TerminalProps {
  sessionId: string | null;
}

export function Terminal({ sessionId }: TerminalProps): ReactNode {
  const { terminalRef } = useTerminal(sessionId);

  return (
    <div className="terminal-border rounded-lg overflow-hidden bg-[#0a0e17]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border bg-black/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] font-mono text-gray-500 ml-2">
          sandbox@hacklab:~$
        </span>
      </div>
      <div
        ref={terminalRef}
        className="min-h-[300px] max-h-[500px] p-2"
      />
    </div>
  );
}
