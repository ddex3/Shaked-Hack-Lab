import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CourseBadgeProps {
  courseTitle: string;
  completed: boolean;
  xpEarned: number;
  certificateHash?: string | null;
  completionPercentage: number;
}

export function CourseBadge({
  courseTitle,
  completed,
  xpEarned,
  certificateHash,
  completionPercentage,
}: CourseBadgeProps): ReactNode {
  if (!completed) {
    return (
      <div className="terminal-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-400">{courseTitle}</span>
          <span className="text-[10px] font-mono text-gray-500">{completionPercentage}%</span>
        </div>
        <div className="h-1.5 bg-terminal-surface rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gray-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="terminal-border border-hacker-green/30 rounded-lg p-4 bg-hacker-green/5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full border-2 border-hacker-green flex items-center justify-center">
          <span className="text-hacker-green font-mono text-lg font-bold">&#10003;</span>
        </div>
        <div>
          <div className="text-gray-200 text-sm font-bold">{courseTitle}</div>
          <div className="text-hacker-green text-[10px] font-mono terminal-glow">
            COURSE COMPLETE
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-hacker-green text-xs font-mono font-bold">
          {xpEarned.toLocaleString()} XP
        </span>
        {certificateHash && (
          <span className="text-[9px] font-mono text-gray-600 truncate max-w-[120px]" title={certificateHash}>
            cert:{certificateHash.substring(0, 8)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
