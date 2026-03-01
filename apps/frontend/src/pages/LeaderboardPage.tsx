import { motion } from "framer-motion";
import { ScrambleText } from "../components/ui/ScrambleText";
import { PodiumTopThree } from "../components/leaderboard/PodiumTopThree";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export function LeaderboardPage(): ReactNode {
  const { entries } = useLeaderboard();
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-hacker-green terminal-glow text-lg font-bold mb-8">
        <ScrambleText text="Global Leaderboard" duration={800} scrambleSpeed={2} />
      </h2>

      <PodiumTopThree entries={entries} />
      <LeaderboardTable
        entries={entries}
        currentUserId={user?.id ?? null}
      />
    </motion.div>
  );
}
