import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ChallengeDetail, ChallengeCategory, ChallengeDifficulty } from "../types/challenge-engine.types";
import { listChallenges } from "../services/challenge-engine.service";

const CATEGORY_LABELS: Record<string, string> = {
  WEB_EXPLOITATION: "Web Exploitation",
  CRYPTOGRAPHY: "Cryptography",
  REVERSE_ENGINEERING: "Reverse Engineering",
  FORENSICS: "Forensics",
  BINARY_EXPLOITATION: "Binary Exploitation",
  NETWORK_SECURITY: "Network Security",
  OSINT: "OSINT",
  MISCELLANEOUS: "Miscellaneous",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "text-green-400 border-green-500/30 bg-green-500/5",
  INTERMEDIATE: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",
  ADVANCED: "text-orange-400 border-orange-500/30 bg-orange-500/5",
  EXPERT: "text-red-400 border-red-500/30 bg-red-500/5",
};

export function ChallengesPage(): ReactNode {
  const [challenges, setChallenges] = useState<ChallengeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ChallengeCategory | "ALL">("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | "ALL">("ALL");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listChallenges();
        if (!cancelled) setChallenges(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.error || "Failed to load challenges");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = challenges.filter((c) => {
    if (categoryFilter !== "ALL" && c.category !== categoryFilter) return false;
    if (difficultyFilter !== "ALL" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  const categories = [...new Set(challenges.map((c) => c.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="text-sm font-mono text-gray-500 animate-pulse">Loading challenges...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-border rounded-lg p-8 text-center">
        <span className="text-[10px] font-mono text-red-400 block mb-2">[ERROR]</span>
        <p className="text-sm text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-mono text-hacker-green tracking-widest">[CTF]</span>
        <h1 className="text-xl font-bold text-gray-100 mt-1">Security Challenges</h1>
        <p className="text-sm text-gray-500 mt-1">
          Practice your skills against live sandboxed environments
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter("ALL")}
          className={`px-3 py-1 rounded text-[10px] font-mono border transition-colors ${
            categoryFilter === "ALL"
              ? "border-hacker-green/50 text-hacker-green bg-hacker-green/10"
              : "border-terminal-border text-gray-500 hover:text-gray-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded text-[10px] font-mono border transition-colors ${
              categoryFilter === cat
                ? "border-hacker-green/50 text-hacker-green bg-hacker-green/10"
                : "border-terminal-border text-gray-500 hover:text-gray-300"
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}

        <div className="w-px bg-terminal-border mx-1" />

        {(["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            className={`px-3 py-1 rounded text-[10px] font-mono border transition-colors ${
              difficultyFilter === diff
                ? "border-hacker-green/50 text-hacker-green bg-hacker-green/10"
                : "border-terminal-border text-gray-500 hover:text-gray-300"
            }`}
          >
            {diff === "ALL" ? "All Levels" : diff}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="terminal-border rounded-lg p-8 text-center">
          <span className="text-sm font-mono text-gray-500">No challenges match your filters</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Link
                to={`/dashboard/challenges/${challenge.id}`}
                className="block terminal-border rounded-lg p-5 hover:border-hacker-green/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">
                    {CATEGORY_LABELS[challenge.category] || challenge.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    DIFFICULTY_COLORS[challenge.difficulty] || ""
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-200 group-hover:text-hacker-green transition-colors mb-2">
                  {challenge.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-hacker-green font-bold">
                    {challenge.points} pts
                  </span>
                  <span className="text-[10px] font-mono text-gray-600">
                    {challenge.solveCount} solve{challenge.solveCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
