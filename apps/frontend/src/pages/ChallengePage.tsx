import { useParams, Link } from "react-router-dom";
import type { ReactNode } from "react";
import { SandboxProvider } from "../context/SandboxContext";
import { ChallengeEngine } from "../components/challenges/ChallengeEngine";

export function ChallengePage(): ReactNode {
  const { challengeId } = useParams<{ challengeId: string }>();

  if (!challengeId) {
    return (
      <div className="terminal-border rounded-lg p-8 text-center">
        <span className="text-sm font-mono text-red-400">Challenge not found</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link
        to="/dashboard/challenges"
        className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-hacker-green transition-colors"
      >
        ← Back to Challenges
      </Link>

      <SandboxProvider challengeId={challengeId}>
        <ChallengeEngine challengeId={challengeId} />
      </SandboxProvider>
    </div>
  );
}
