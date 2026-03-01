import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ThreatNodeProps {
  label: string;
  description: string;
  x: number;
  y: number;
  color: string;
  delay: number;
  icon: ReactNode;
}

export function ThreatNode({
  label,
  description,
  x,
  y,
  color,
  delay,
  icon,
}: ThreatNodeProps): ReactNode {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
      onClick={() => setIsActive(!isActive)}
    >
      <motion.div
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full border backdrop-blur-sm"
        style={{
          borderColor: `${color}60`,
          background: `radial-gradient(circle, ${color}15, transparent)`,
        }}
        animate={{
          boxShadow: [
            `0 0 10px ${color}30, 0 0 20px ${color}10`,
            `0 0 20px ${color}50, 0 0 40px ${color}20`,
            `0 0 10px ${color}30, 0 0 20px ${color}10`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.15 }}
      >
        <div style={{ color }} className="text-xl sm:text-2xl">
          {icon}
        </div>

        <motion.div
          className="absolute inset-0 rounded-full border-2 opacity-0"
          style={{ borderColor: color }}
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>

      <motion.span
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono font-bold tracking-wide"
        style={{ color }}
      >
        {label}
      </motion.span>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-56 p-4 rounded-lg backdrop-blur-md border font-mono"
            style={{
              borderColor: `${color}40`,
              background: "rgba(10, 14, 23, 0.95)",
              top: "calc(100% + 16px)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-sm font-bold mb-2" style={{ color }}>
              {label}
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">
              {description}
            </div>
            <div
              className="mt-3 text-xs font-bold tracking-wider"
              style={{ color }}
            >
              {">"} CLICK TO EXPLORE
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
