import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  executeWindowsCommand,
  resetWindowsSimulation,
  type WindowsCommandResult,
} from "../../services/training.service";

interface WindowsTerminalProps {
  sessionKey?: string;
}

interface HistoryEntry {
  prompt: string;
  command: string;
  output: string;
  exitCode: number;
}

export function WindowsTerminal({ sessionKey }: WindowsTerminalProps): ReactNode {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [cwd, setCwd] = useState("C:\\Users\\trainee");
  const [loading, setLoading] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const session = useRef(sessionKey ?? `win-${Date.now()}`);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const handleCommand = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    if (trimmed.toLowerCase() === "cls" || trimmed.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      setLoading(false);
      return;
    }

    try {
      const result: WindowsCommandResult = await executeWindowsCommand(
        session.current,
        trimmed
      );

      setHistory((prev) => [
        ...prev,
        {
          prompt: `${cwd}>`,
          command: trimmed,
          output: result.output,
          exitCode: result.exitCode,
        },
      ]);

      setCwd(result.cwd);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          prompt: `${cwd}>`,
          command: trimmed,
          output: "Error: Could not execute command.",
          exitCode: 1,
        },
      ]);
    }

    setInput("");
    setLoading(false);
  }, [input, loading, cwd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCommand();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length > 0) {
          const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(cmdHistory[newIndex] ?? "");
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= cmdHistory.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(newIndex);
            setInput(cmdHistory[newIndex] ?? "");
          }
        }
      }
    },
    [handleCommand, cmdHistory, historyIndex]
  );

  const handleReset = useCallback(async () => {
    await resetWindowsSimulation(session.current);
    session.current = `win-${Date.now()}`;
    setHistory([]);
    setCwd("C:\\Users\\trainee");
    setInput("");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-border rounded-lg overflow-hidden"
    >
      <div className="bg-[#0c0c3e] px-4 py-2 flex items-center justify-between border-b border-[#2a2a6e]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#4a4aff]" />
          <span className="text-[11px] font-mono text-gray-300">Command Prompt - Simulated</span>
        </div>
        <button
          onClick={handleReset}
          className="text-[10px] font-mono text-gray-500 hover:text-gray-300 transition-colors px-2 py-0.5 border border-gray-700 rounded"
        >
          Reset
        </button>
      </div>

      <div
        ref={termRef}
        onClick={() => inputRef.current?.focus()}
        className="bg-[#0c0c0c] p-4 min-h-[300px] max-h-[500px] overflow-y-auto cursor-text"
      >
        <div className="text-[11px] font-mono text-gray-400 mb-2">
          Microsoft Windows [Version 10.0.22631] (Simulated Environment)
        </div>
        <div className="text-[11px] font-mono text-gray-400 mb-4">
          (c) Shaked-Hack-Lab. Educational simulation only.
        </div>

        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            <div className="text-[11px] font-mono">
              <span className="text-gray-300">{entry.prompt}</span>
              <span className="text-white ml-1">{entry.command}</span>
            </div>
            {entry.output && (
              <pre className="text-[11px] font-mono text-gray-400 whitespace-pre-wrap mt-0.5">
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <div className="flex items-center text-[11px] font-mono">
          <span className="text-gray-300 shrink-0">{cwd}&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 bg-transparent text-white outline-none border-none ml-1 font-mono text-[11px] caret-white"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </motion.div>
  );
}
