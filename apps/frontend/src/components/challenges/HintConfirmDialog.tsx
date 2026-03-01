import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ChallengeHint } from "../../types/challenge-engine.types";

interface HintConfirmDialogProps {
  hint: ChallengeHint;
  currentMax: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function HintConfirmDialog({
  hint,
  currentMax,
  onConfirm,
  onCancel,
}: HintConfirmDialogProps): ReactNode {
  const afterUnlock = Math.max(0, currentMax - hint.pointCost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="terminal-border rounded-lg p-6 max-w-sm w-full mx-4 bg-[#0a0e17]"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono text-yellow-500">[WARNING]</span>
          <span className="text-sm font-mono text-gray-200">Unlock Hint</span>
        </div>

        <p className="text-sm text-gray-300 mb-4">
          Using this hint costs <span className="text-yellow-400 font-mono">{hint.pointCost} XP</span>.
        </p>

        <div className="flex items-center justify-between text-xs font-mono mb-6 p-3 rounded border border-terminal-border bg-black/30">
          <div>
            <span className="text-gray-500 block">Current max</span>
            <span className="text-gray-200">{currentMax} XP</span>
          </div>
          <span className="text-gray-600">→</span>
          <div>
            <span className="text-gray-500 block">After unlock</span>
            <span className={afterUnlock > 0 ? "text-yellow-400" : "text-red-400"}>
              {afterUnlock} XP
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-lg border border-terminal-border text-xs font-mono text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 btn-primary text-xs"
          >
            Unlock
          </button>
        </div>
      </motion.div>
    </div>
  );
}
