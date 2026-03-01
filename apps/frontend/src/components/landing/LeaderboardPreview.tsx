import { useState, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, name: "sh4d0w_r00t", xp: 24850, level: 42, avatar: "S" },
  { rank: 2, name: "cyb3r_gh0st", xp: 22100, level: 38, avatar: "C" },
  { rank: 3, name: "z3r0_d4y", xp: 19750, level: 35, avatar: "Z" },
  { rank: 4, name: "null_byt3", xp: 17200, level: 31, avatar: "N" },
  { rank: 5, name: "r00tk1t", xp: 15600, level: 28, avatar: "R" },
];

const PODIUM_COLORS = ["#f59e0b", "#9ca3af", "#cd7f32"];
const PODIUM_HEIGHTS = ["h-28", "h-20", "h-16"];
const PODIUM_ORDER = [1, 0, 2];

function AnimatedXP({ target }: { target: number }): ReactNode {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setValue(start);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  return <>{value.toLocaleString()}</>;
}

export function LeaderboardPreview(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const topThree = LEADERBOARD_DATA.slice(0, 3);

  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-200">Live</span>{" "}
            <span className="text-accent-amber" style={{ textShadow: "0 0 12px rgba(245,158,11,0.4)" }}>
              Leaderboard
            </span>
          </h2>
          <p className="text-gray-500 font-mono text-sm sm:text-base">
            Top operators ranked by experience points
          </p>
        </motion.div>

        <motion.div
          className="flex items-end justify-center gap-3 sm:gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {PODIUM_ORDER.map((idx, posIndex) => {
            const entry = topThree[idx]!;
            const color = PODIUM_COLORS[idx]!;
            const heightClass = PODIUM_HEIGHTS[idx]!;

            return (
              <motion.div
                key={entry.rank}
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + posIndex * 0.2, duration: 0.6, type: "spring" }}
              >
                <motion.div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold font-mono mb-2"
                  style={{ borderColor: color, color }}
                  animate={{
                    boxShadow: [
                      `0 0 0px ${color}00`,
                      `0 0 15px ${color}60`,
                      `0 0 0px ${color}00`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {entry.avatar}
                </motion.div>
                <span className="text-xs font-mono text-gray-400 mb-1 truncate max-w-[80px] sm:max-w-none">
                  {entry.name}
                </span>
                <span className="text-xs font-mono font-bold mb-2" style={{ color }}>
                  <AnimatedXP target={entry.xp} /> XP
                </span>
                <div
                  className={`w-20 sm:w-28 ${heightClass} rounded-t-lg flex items-start justify-center pt-3 relative overflow-hidden`}
                  style={{
                    background: `linear-gradient(to top, ${color}20, ${color}05)`,
                    borderTop: `2px solid ${color}60`,
                    borderLeft: `1px solid ${color}20`,
                    borderRight: `1px solid ${color}20`,
                  }}
                >
                  <span className="text-2xl font-bold font-mono" style={{ color }}>
                    #{entry.rank}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="terminal-border rounded-lg overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="bg-terminal-surface/50 px-4 py-2 border-b border-terminal-border flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-hacker-green animate-pulse" />
            <span className="text-xs text-gray-500 font-mono">LIVE RANKINGS</span>
          </div>
          <div className="divide-y divide-terminal-border/50">
            {LEADERBOARD_DATA.map((entry, i) => (
              <motion.div
                key={entry.rank}
                className="flex items-center px-4 py-3 hover:bg-terminal-surface/30 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={isVisible ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <span
                  className="w-8 text-sm font-bold font-mono"
                  style={{
                    color: i < 3 ? PODIUM_COLORS[i] : "#6b7280",
                  }}
                >
                  #{entry.rank}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold font-mono"
                    style={{
                      borderColor: i < 3 ? `${PODIUM_COLORS[i]}60` : "#374151",
                      color: i < 3 ? PODIUM_COLORS[i] : "#9ca3af",
                    }}
                  >
                    {entry.avatar}
                  </div>
                  <span className="text-sm font-mono text-gray-300">{entry.name}</span>
                </div>
                <span className="text-xs font-mono text-gray-500 hidden sm:block">
                  LVL {entry.level}
                </span>
                <span className="text-sm font-mono font-bold text-hacker-green ml-4">
                  <AnimatedXP target={entry.xp} />
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
