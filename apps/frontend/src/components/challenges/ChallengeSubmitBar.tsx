import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { ValidationResult } from "../../types/challenge-engine.types";

interface ChallengeSubmitBarProps {
  onSubmit: (answer: string) => void;
  submitting: boolean;
  result: ValidationResult | null;
  placeholder?: string;
}

export function ChallengeSubmitBar({
  onSubmit,
  submitting,
  result,
  placeholder = "Enter flag or answer...",
}: ChallengeSubmitBarProps): ReactNode {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || submitting) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          disabled={submitting || (result?.correct ?? false)}
          className="flex-1 bg-black/50 border border-terminal-border rounded-lg px-4 py-2.5 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-hacker-green/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!answer.trim() || submitting || (result?.correct ?? false)}
          className="btn-primary text-xs px-6 disabled:opacity-30"
        >
          {submitting ? "Validating..." : "Submit"}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 border ${
            result.correct
              ? "border-green-500/30 bg-green-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-mono font-bold ${
              result.correct ? "text-green-400" : "text-red-400"
            }`}>
              {result.correct ? "[SUCCESS]" : "[FAILED]"}
            </span>
            {result.correct && (
              <span className="text-xs font-mono text-hacker-green">
                +{result.score} XP
              </span>
            )}
          </div>
          <p className="text-sm text-gray-300">{result.feedback}</p>
          {result.pointsDeducted > 0 && (
            <p className="text-[10px] font-mono text-yellow-500 mt-1">
              -{result.pointsDeducted} XP from hints ({result.hintsUsed} used)
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
