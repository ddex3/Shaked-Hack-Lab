import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface XpRewardAnimationProps {
  xp: number;
  show: boolean;
}

export function XpRewardAnimation({ xp, show }: XpRewardAnimationProps): ReactNode {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1.2 }}
          exit={{ opacity: 0, y: -60, scale: 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <span className="text-hacker-green terminal-glow font-bold font-mono text-lg">
            +{xp} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
