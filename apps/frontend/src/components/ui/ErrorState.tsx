import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="terminal-border rounded-lg p-8 text-center border-accent-red/30"
    >
      <div className="text-accent-red text-3xl mb-3 font-mono font-bold">[!]</div>
      <p className="text-accent-red text-sm font-mono mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-xs">
          Retry
        </button>
      )}
    </motion.div>
  );
}
