import { useMemo } from "react";
import { useProgress } from "../context/ProgressContext";
import { useAuth } from "../context/AuthContext";
import type { LeaderboardEntry } from "../types/leaderboard.types";

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
}

export function useLeaderboard(): UseLeaderboardReturn {
  const { user } = useAuth();
  const { totalXp } = useProgress();

  const entries = useMemo((): LeaderboardEntry[] => {
    if (!user) return [];

    return [
      {
        userId: user.id,
        username: user.username,
        displayName: user.profile?.displayName ?? user.username,
        score: totalXp,
        solveCount: 0,
        rank: 1,
      },
    ];
  }, [user, totalXp]);

  return { entries };
}
