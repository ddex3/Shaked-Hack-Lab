import type { ReactNode } from "react";

interface ScoreDisplayProps {
  basePoints: number;
  totalDeductions: number;
}

export function ScoreDisplay({ basePoints, totalDeductions }: ScoreDisplayProps): ReactNode {
  const currentMax = Math.max(0, basePoints - totalDeductions);
  const percentage = basePoints > 0 ? Math.round((currentMax / basePoints) * 100) : 0;

  return (
    <div className="terminal-border rounded-lg p-4">
      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2">
        Max Score
      </span>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-mono font-bold ${
          percentage >= 80 ? "text-hacker-green" :
          percentage >= 50 ? "text-yellow-400" : "text-red-400"
        }`}>
          {currentMax}
        </span>
        <span className="text-xs font-mono text-gray-600">/ {basePoints}</span>
      </div>
      {totalDeductions > 0 && (
        <span className="text-[10px] font-mono text-yellow-500 block mt-1">
          -{totalDeductions} from hints
        </span>
      )}
    </div>
  );
}
