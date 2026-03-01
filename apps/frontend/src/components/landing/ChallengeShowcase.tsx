import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ChallengeCard3D } from "./ChallengeCard3D";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CHALLENGES = [
  {
    category: "SQL Injection",
    difficulty: 3,
    maxDifficulty: 5,
    xp: 500,
    color: "#ef4444",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    category: "XSS Attacks",
    difficulty: 4,
    maxDifficulty: 5,
    xp: 750,
    color: "#f59e0b",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    category: "Linux Exploitation",
    difficulty: 4,
    maxDifficulty: 5,
    xp: 800,
    color: "#00ff41",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    category: "Windows Security",
    difficulty: 3,
    maxDifficulty: 5,
    xp: 600,
    color: "#06b6d4",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    category: "Brute Force",
    difficulty: 2,
    maxDifficulty: 5,
    xp: 400,
    color: "#a855f7",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    category: "API Exploitation",
    difficulty: 5,
    maxDifficulty: 5,
    xp: 1000,
    color: "#ec4899",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
];

export function ChallengeShowcase(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-200">Challenge</span>{" "}
            <span className="text-accent-cyan" style={{ textShadow: "0 0 12px rgba(6,182,212,0.4)" }}>
              Arsenal
            </span>
          </h2>
          <p className="text-gray-500 font-mono text-sm sm:text-base max-w-lg mx-auto">
            Choose your attack vector. Each challenge tests real-world skills.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((card, i) => (
            <ChallengeCard3D key={card.category} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
