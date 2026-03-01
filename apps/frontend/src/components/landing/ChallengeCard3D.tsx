import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMouseTilt } from "@/hooks/useMouseTilt";

interface ChallengeCardData {
  category: string;
  difficulty: number;
  maxDifficulty: number;
  xp: number;
  color: string;
  icon: ReactNode;
}

interface ChallengeCard3DProps {
  card: ChallengeCardData;
  index: number;
}

function DifficultyBar({ level, max, color }: { level: number; max: number; color: string }): ReactNode {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className="h-1.5 w-4 rounded-full transition-colors"
          style={{
            backgroundColor: i < level ? color : "rgba(255,255,255,0.1)",
            boxShadow: i < level ? `0 0 6px ${color}50` : "none",
          }}
        />
      ))}
    </div>
  );
}

export function ChallengeCard3D({ card, index }: ChallengeCard3DProps): ReactNode {
  const { ref, tilt, handlers } = useMouseTilt<HTMLDivElement>({
    maxTilt: 12,
    scale: 1.03,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-[1000px]"
    >
      <div
        ref={ref}
        {...handlers}
        className="relative p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-shadow duration-300"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
          transition: "transform 0.15s ease-out",
          borderColor: `${card.color}30`,
          background: `linear-gradient(135deg, rgba(10,14,23,0.9), rgba(17,24,39,0.9))`,
          boxShadow: tilt.scale > 1 ? `0 0 30px ${card.color}20, 0 4px 20px rgba(0,0,0,0.3)` : "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${card.color}08, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 border"
            style={{
              borderColor: `${card.color}30`,
              background: `${card.color}10`,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: card.color }}
            >
              {card.icon}
            </motion.div>
          </div>

          <h3 className="text-lg font-bold font-mono mb-3" style={{ color: card.color }}>
            {card.category}
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-500 font-mono block mb-1">DIFFICULTY</span>
              <DifficultyBar level={card.difficulty} max={card.maxDifficulty} color={card.color} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">XP POTENTIAL</span>
              <motion.span
                className="text-sm font-bold font-mono"
                style={{ color: card.color }}
                animate={{ textShadow: [`0 0 8px ${card.color}00`, `0 0 8px ${card.color}80`, `0 0 8px ${card.color}00`] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                +{card.xp} XP
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
