import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SqlFeedbackProps {
  success: boolean;
}

export function SqlFeedback({ success }: SqlFeedbackProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-lg border p-3 ${
        success
          ? "border-green-500/30 bg-green-500/5"
          : "border-yellow-500/30 bg-yellow-500/5"
      }`}
    >
      <span className={`text-[10px] font-mono font-bold ${
        success ? "text-green-400" : "text-yellow-400"
      }`}>
        {success ? "[*] Query returned results" : "[!] No results or error"}
      </span>
    </motion.div>
  );
}
