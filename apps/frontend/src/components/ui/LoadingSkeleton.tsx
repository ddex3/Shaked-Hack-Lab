import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "row";
}

export function LoadingSkeleton({ count = 6, type = "card" }: LoadingSkeletonProps): ReactNode {
  if (type === "row") {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="terminal-border rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-4 bg-terminal-border rounded" />
              <div className="w-8 h-8 bg-terminal-border rounded-full shrink-0" />
              <div className="w-32 h-4 bg-terminal-border rounded" />
              <div className="flex-1" />
              <div className="w-12 h-4 bg-terminal-border rounded" />
              <div className="w-16 h-4 bg-terminal-border rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}
          className="terminal-border rounded-lg p-5 animate-pulse"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="w-2/3 h-4 bg-terminal-border rounded" />
            <div className="w-8 h-4 bg-terminal-border rounded" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="w-full h-3 bg-terminal-border rounded" />
            <div className="w-3/4 h-3 bg-terminal-border rounded" />
          </div>
          <div className="flex gap-2 mb-4">
            <div className="w-16 h-5 bg-terminal-border rounded-full" />
            <div className="w-24 h-5 bg-terminal-border rounded-full" />
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-16 h-4 bg-terminal-border rounded" />
            <div className="w-12 h-4 bg-terminal-border rounded" />
          </div>
          <div className="w-full h-9 bg-terminal-border rounded" />
        </motion.div>
      ))}
    </div>
  );
}
