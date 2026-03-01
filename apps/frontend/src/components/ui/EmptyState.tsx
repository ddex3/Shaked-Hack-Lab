import { motion } from "framer-motion";
import { TerminalText } from "./TerminalText";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="terminal-border rounded-lg p-12 text-center"
    >
      <div className="text-hacker-green text-4xl mb-4 font-mono terminal-glow">
        {">"}_
      </div>
      <h3 className="text-gray-300 text-sm font-bold mb-3">{title}</h3>
      <div className="text-gray-500 text-xs">
        <TerminalText text={message} speed={25} />
      </div>
    </motion.div>
  );
}
