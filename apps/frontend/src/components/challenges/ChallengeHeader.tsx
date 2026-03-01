import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ChallengeDetail } from "../../types/challenge-engine.types";

interface ChallengeHeaderProps {
  challenge: ChallengeDetail;
  remainingSeconds: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "text-green-400 border-green-500/30",
  INTERMEDIATE: "text-yellow-400 border-yellow-500/30",
  ADVANCED: "text-orange-400 border-orange-500/30",
  EXPERT: "text-red-400 border-red-500/30",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ChallengeHeader({ challenge, remainingSeconds }: ChallengeHeaderProps): ReactNode {
  const difficultyClass = DIFFICULTY_COLORS[challenge.difficulty] || "text-gray-400 border-gray-500/30";
  const timerWarning = remainingSeconds > 0 && remainingSeconds <= 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-border rounded-lg p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              {challenge.category.replace(/_/g, " ")}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyClass}`}>
              {challenge.difficulty}
            </span>
          </div>
          <h1 className="text-lg font-bold text-gray-100 mb-2">{challenge.title}</h1>
          <p className="text-sm text-gray-400 leading-relaxed">{challenge.description}</p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 block">POINTS</span>
            <span className="text-lg font-mono font-bold text-hacker-green">{challenge.points}</span>
          </div>

          {remainingSeconds > 0 && (
            <div className={`text-right px-3 py-1.5 rounded border ${
              timerWarning
                ? "border-red-500/50 bg-red-500/10"
                : "border-terminal-border bg-terminal-bg"
            }`}>
              <span className="text-[10px] font-mono text-gray-500 block">TIME</span>
              <span className={`text-sm font-mono font-bold ${
                timerWarning ? "text-red-400 animate-pulse" : "text-gray-200"
              }`}>
                {formatTime(remainingSeconds)}
              </span>
            </div>
          )}

          <span className="text-[10px] font-mono text-gray-600">
            {challenge.solveCount} solve{challenge.solveCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
