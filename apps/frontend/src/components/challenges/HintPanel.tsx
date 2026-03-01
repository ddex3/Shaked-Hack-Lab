import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChallengeHint } from "../../types/challenge-engine.types";
import { HintConfirmDialog } from "./HintConfirmDialog";

interface HintPanelProps {
  hints: ChallengeHint[];
  onUnlock: (hintId: string) => Promise<void>;
  maxPoints: number;
  totalDeductions: number;
}

export function HintPanel({ hints, onUnlock, maxPoints, totalDeductions }: HintPanelProps): ReactNode {
  const [confirmHint, setConfirmHint] = useState<ChallengeHint | null>(null);
  const [expanded, setExpanded] = useState(false);

  if (hints.length === 0) return null;

  const unlockedCount = hints.filter((h) => h.unlocked).length;

  return (
    <>
      <div className="terminal-border rounded-lg overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-gray-300">Hints</span>
            <span className="text-[10px] font-mono text-gray-500">
              {unlockedCount}/{hints.length}
            </span>
          </div>
          <span className="text-xs font-mono text-gray-600">
            {expanded ? "▲" : "▼"}
          </span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {hints.map((hint, i) => (
                  <div
                    key={hint.id}
                    className={`rounded-lg border p-3 ${
                      hint.unlocked
                        ? "border-hacker-green/20 bg-hacker-green/5"
                        : "border-terminal-border bg-black/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-gray-500">
                        HINT {i + 1}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        hint.unlocked ? "text-hacker-green" : "text-yellow-500"
                      }`}>
                        {hint.unlocked ? "UNLOCKED" : `-${hint.pointCost} XP`}
                      </span>
                    </div>

                    {hint.unlocked && hint.content ? (
                      <p className="text-sm text-gray-300 leading-relaxed">{hint.content}</p>
                    ) : (
                      <button
                        onClick={() => setConfirmHint(hint)}
                        disabled={i > 0 && !hints[i - 1]?.unlocked}
                        className="text-xs font-mono text-hacker-green hover:text-hacker-green/80 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                      >
                        {i > 0 && !hints[i - 1]?.unlocked
                          ? "Unlock previous hint first"
                          : "Click to unlock"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {confirmHint && (
        <HintConfirmDialog
          hint={confirmHint}
          currentMax={Math.max(0, maxPoints - totalDeductions)}
          onConfirm={async () => {
            await onUnlock(confirmHint.id);
            setConfirmHint(null);
          }}
          onCancel={() => setConfirmHint(null)}
        />
      )}
    </>
  );
}
