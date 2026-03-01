import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LeaderboardEntry } from "../../types/leaderboard.types";

interface RankRowProps {
  entry: LeaderboardEntry;
  index: number;
  isCurrentUser: boolean;
}

function computeLevel(score: number): number {
  if (score <= 0) return 1;
  return Math.floor(score / 100) + 1;
}

export function RankRow({ entry, index, isCurrentUser }: RankRowProps): ReactNode {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`border-b border-terminal-border/50 transition-colors ${
        isCurrentUser
          ? "bg-hacker-green/5 hover:bg-hacker-green/10"
          : "hover:bg-terminal-surface/50"
      }`}
    >
      <td className="p-4">
        <span
          className={`text-sm font-mono font-bold ${
            entry.rank === 1
              ? "text-accent-amber"
              : entry.rank === 2
                ? "text-gray-300"
                : entry.rank === 3
                  ? "text-accent-amber/60"
                  : "text-gray-500"
          }`}
        >
          #{entry.rank}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-terminal-border flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-gray-300">
              {entry.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div
              className={`text-sm font-bold truncate ${
                isCurrentUser ? "text-hacker-green" : "text-gray-200"
              }`}
            >
              {entry.displayName}
            </div>
            <div className="text-gray-600 text-xs font-mono truncate">
              @{entry.username}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-center hidden sm:table-cell">
        <span className="text-xs font-mono text-accent-cyan">
          LVL {computeLevel(entry.score)}
        </span>
      </td>
      <td className="p-4 text-right">
        <span className="text-hacker-green terminal-glow font-bold text-sm font-mono">
          {entry.score.toLocaleString()}
        </span>
      </td>
    </motion.tr>
  );
}
