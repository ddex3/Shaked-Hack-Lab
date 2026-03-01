import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LeaderboardEntry } from "../../types/leaderboard.types";

interface PodiumTopThreeProps {
  entries: LeaderboardEntry[];
}

function computeLevel(score: number): number {
  if (score <= 0) return 1;
  return Math.floor(score / 100) + 1;
}

interface PodiumStyle {
  paddingY: string;
  gradient: string;
  border: string;
  glow: string;
  color: string;
  avatarBorder: string;
  rankSize: string;
}

const PODIUM_CONFIG: { [K in 1 | 2 | 3]: PodiumStyle } = {
  1: {
    paddingY: "py-8",
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/40",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    color: "text-amber-400",
    avatarBorder: "border-amber-500/40",
    rankSize: "text-3xl",
  },
  2: {
    paddingY: "py-6",
    gradient: "from-gray-400/15 via-gray-400/5 to-transparent",
    border: "border-gray-400/30",
    glow: "shadow-[0_0_20px_rgba(156,163,175,0.1)]",
    color: "text-gray-300",
    avatarBorder: "border-gray-400/30",
    rankSize: "text-2xl",
  },
  3: {
    paddingY: "py-5",
    gradient: "from-amber-700/15 via-amber-700/5 to-transparent",
    border: "border-amber-700/30",
    glow: "shadow-[0_0_20px_rgba(180,83,9,0.1)]",
    color: "text-amber-600",
    avatarBorder: "border-amber-700/30",
    rankSize: "text-xl",
  },
};

export function PodiumTopThree({ entries }: PodiumTopThreeProps): ReactNode {
  if (entries.length < 3) return null;

  const first = entries[0]!;
  const second = entries[1]!;
  const third = entries[2]!;

  const podiumData: Array<{ entry: LeaderboardEntry; place: 1 | 2 | 3 }> = [
    { entry: second, place: 2 },
    { entry: first, place: 1 },
    { entry: third, place: 3 },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-2xl mx-auto items-end">
      {podiumData.map(({ entry, place }, i) => {
        const config = PODIUM_CONFIG[place];

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`rounded-lg border bg-gradient-to-b ${config.gradient} ${config.border} ${config.glow} ${config.paddingY} px-3 text-center`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.15 + 0.3,
                type: "spring",
              }}
              className={`font-mono font-bold mb-3 ${config.rankSize} ${config.color}`}
            >
              #{place}
            </motion.div>

            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-terminal-surface border ${config.avatarBorder} flex items-center justify-center mx-auto mb-2`}
            >
              <span className={`text-sm sm:text-base font-bold ${config.color}`}>
                {entry.displayName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="text-gray-200 text-xs sm:text-sm font-bold truncate">
              {entry.displayName}
            </div>
            <div className="text-gray-500 text-[10px] font-mono truncate">
              @{entry.username}
            </div>

            <div className="text-hacker-green terminal-glow text-sm sm:text-lg font-bold mt-2 font-mono">
              {entry.score.toLocaleString()}
            </div>
            <div className="text-gray-500 text-[10px] font-mono mt-0.5">
              LVL {computeLevel(entry.score)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
