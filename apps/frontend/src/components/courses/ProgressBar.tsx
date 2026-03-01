import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ProgressBarProps {
  percentage: number;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  percentage,
  height = "h-1.5",
  showLabel = false,
}: ProgressBarProps): ReactNode {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-500 text-[10px] font-mono">Progress</span>
          <span className="text-hacker-green text-[10px] font-mono">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-terminal-border rounded-full ${height} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${height} rounded-full bg-gradient-to-r from-hacker-dim-green to-hacker-green`}
        />
      </div>
    </div>
  );
}
