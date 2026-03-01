import { useCallback, type ReactNode } from "react";
import { useChallengeEngine } from "../../hooks/useChallengeEngine";
import { useHints } from "../../hooks/useHints";
import { useSandboxContext } from "../../context/SandboxContext";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeSubmitBar } from "./ChallengeSubmitBar";
import { ScoreDisplay } from "./ScoreDisplay";
import { HintPanel } from "./HintPanel";
import { TerminalChallenge } from "./TerminalChallenge";
import { SqlInjectionChallenge } from "./SqlInjectionChallenge";

interface ChallengeEngineProps {
  challengeId: string;
}

export function ChallengeEngine({ challengeId }: ChallengeEngineProps): ReactNode {
  const { challenge, loading, error, submitting, result, submit } = useChallengeEngine(challengeId);
  const { hints, totalDeductions, maxPoints, unlockHint } = useHints(challengeId);
  const { session, remainingSeconds } = useSandboxContext();

  const handleSubmit = useCallback((answer: string) => {
    submit(answer, session?.sessionId);
  }, [submit, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm font-mono text-gray-500 animate-pulse">
          Loading challenge...
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="terminal-border rounded-lg p-8 text-center">
        <span className="text-[10px] font-mono text-red-400 block mb-2">[ERROR]</span>
        <p className="text-sm text-gray-400">{error || "Challenge not found"}</p>
      </div>
    );
  }

  const isSqlChallenge = challenge.category === "WEB_EXPLOITATION" &&
    challenge.sandboxType === "DOCKER";
  const isTerminalChallenge = challenge.sandboxType === "DOCKER" && !isSqlChallenge;

  return (
    <div className="space-y-4">
      <ChallengeHeader challenge={challenge} remainingSeconds={remainingSeconds} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="terminal-border rounded-lg p-5">
            <span className="text-[10px] font-mono text-gray-500 uppercase block mb-3">
              Instructions
            </span>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {challenge.instructions}
            </p>
          </div>

          {isTerminalChallenge && <TerminalChallenge />}
          {isSqlChallenge && <SqlInjectionChallenge />}

          <ChallengeSubmitBar
            onSubmit={handleSubmit}
            submitting={submitting}
            result={result}
            placeholder={isSqlChallenge ? "Enter the flag you found..." : undefined}
          />
        </div>

        <div className="space-y-4">
          <ScoreDisplay basePoints={challenge.points} totalDeductions={totalDeductions} />
          <HintPanel
            hints={hints}
            onUnlock={unlockHint}
            maxPoints={maxPoints}
            totalDeductions={totalDeductions}
          />
        </div>
      </div>
    </div>
  );
}
