import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface LabObjective {
  id: string;
  description: string;
  type: string;
  xpValue: number;
  hints: string[];
}

interface LabCardProps {
  title: string;
  description: string;
  labType: string;
  objectives: LabObjective[];
  maxXp: number;
  timeoutSeconds: number;
  active: boolean;
  completed?: boolean;
  onStart?: () => void;
  index: number;
}

const LAB_TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  LINUX_TERMINAL: { label: "Linux Terminal", color: "text-green-400 border-green-500/30 bg-green-500/10", icon: "$" },
  WINDOWS_SIMULATION: { label: "Windows CMD", color: "text-blue-400 border-blue-500/30 bg-blue-500/10", icon: ">" },
  BRUTE_FORCE_SIMULATION: { label: "Simulation", color: "text-purple-400 border-purple-500/30 bg-purple-500/10", icon: "#" },
};

export function LabCard({
  title,
  description,
  labType,
  objectives,
  maxXp,
  timeoutSeconds,
  active,
  completed,
  onStart,
  index,
}: LabCardProps): ReactNode {
  const typeInfo = LAB_TYPE_LABELS[labType] ?? LAB_TYPE_LABELS.LINUX_TERMINAL!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`terminal-border rounded-lg p-5 ${completed ? "border-green-500/20" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${typeInfo.color}`}>
            <span className="mr-1">{typeInfo.icon}</span>
            {typeInfo.label}
          </span>
          {completed && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border border-green-500/30 bg-green-500/10 text-green-400">
              COMPLETED
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-hacker-green">+{maxXp} XP</span>
      </div>

      <h4 className="text-gray-200 text-sm font-bold mb-2">{title}</h4>
      <p className="text-gray-400 text-xs leading-relaxed mb-4">{description}</p>

      <div className="mb-4">
        <div className="text-[10px] font-mono text-gray-500 mb-2">OBJECTIVES</div>
        <div className="space-y-1.5">
          {objectives.map((obj, i) => (
            <div key={obj.id} className="flex items-start gap-2 text-xs">
              <span className="text-gray-600 font-mono shrink-0">[{i + 1}]</span>
              <span className="text-gray-400">{obj.description}</span>
              <span className="text-hacker-green font-mono text-[10px] shrink-0 ml-auto">
                +{obj.xpValue}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-600">
          Timeout: {Math.floor(timeoutSeconds / 60)}m
        </span>
        {active && !completed && onStart && (
          <button onClick={onStart} className="btn-primary text-xs px-4">
            Launch Lab
          </button>
        )}
        {!active && (
          <span className="text-[10px] font-mono text-gray-600">Lab disabled</span>
        )}
      </div>
    </motion.div>
  );
}
