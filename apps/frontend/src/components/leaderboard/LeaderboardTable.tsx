import type { ReactNode } from "react";
import { RankRow } from "./RankRow";
import type { LeaderboardEntry } from "../../types/leaderboard.types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string | null;
}

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps): ReactNode {
  return (
    <div className="terminal-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-terminal-border bg-terminal-surface/50">
              <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 font-mono w-16">
                Rank
              </th>
              <th className="text-left text-gray-500 text-xs uppercase tracking-wider p-4 font-mono">
                Operator
              </th>
              <th className="text-center text-gray-500 text-xs uppercase tracking-wider p-4 font-mono w-20 hidden sm:table-cell">
                Level
              </th>
              <th className="text-right text-gray-500 text-xs uppercase tracking-wider p-4 font-mono w-24">
                XP
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <RankRow
                key={entry.userId}
                entry={entry}
                index={index}
                isCurrentUser={entry.userId === currentUserId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
