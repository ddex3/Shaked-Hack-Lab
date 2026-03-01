import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface Objective {
  id: string;
  description: string;
  type: string;
  xpValue: number;
  hints: string[];
}

interface LabObjectiveTrackerProps {
  objectives: Objective[];
  completedObjectives: Record<string, boolean>;
  onValidate: (objectiveId: string, answer: string) => Promise<{
    correct: boolean;
    feedback: string;
  }>;
  onHint: (objectiveId: string, hintIndex: number) => Promise<{
    hint: string;
    xpPenalty: number;
  }>;
}

export function LabObjectiveTracker({
  objectives,
  completedObjectives,
  onValidate,
  onHint,
}: LabObjectiveTrackerProps): ReactNode {
  const [activeObjective, setActiveObjective] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { correct: boolean; message: string }>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleValidate = useCallback(
    async (objectiveId: string) => {
      const answer = answers[objectiveId]?.trim();
      if (!answer || loading) return;
      setLoading(true);
      try {
        const result = await onValidate(objectiveId, answer);
        setFeedback((prev) => ({
          ...prev,
          [objectiveId]: { correct: result.correct, message: result.feedback },
        }));
      } catch {
        setFeedback((prev) => ({
          ...prev,
          [objectiveId]: { correct: false, message: "Validation failed." },
        }));
      } finally {
        setLoading(false);
      }
    },
    [answers, loading, onValidate]
  );

  const handleHint = useCallback(
    async (objectiveId: string) => {
      const current = revealedHints[objectiveId] ?? [];
      const obj = objectives.find((o) => o.id === objectiveId);
      if (!obj || current.length >= obj.hints.length) return;
      try {
        const result = await onHint(objectiveId, current.length);
        setRevealedHints((prev) => ({
          ...prev,
          [objectiveId]: [...(prev[objectiveId] ?? []), result.hint],
        }));
      } catch {
        // silently fail
      }
    },
    [revealedHints, objectives, onHint]
  );

  const totalXp = objectives.reduce((s, o) => s + o.xpValue, 0);
  const earnedXp = objectives
    .filter((o) => completedObjectives[o.id])
    .reduce((s, o) => s + o.xpValue, 0);

  return (
    <div className="terminal-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-gray-200 text-sm font-bold">Objectives</h4>
        <span className="text-[10px] font-mono text-hacker-green">
          {earnedXp}/{totalXp} XP
        </span>
      </div>

      <div className="space-y-2">
        {objectives.map((obj, i) => {
          const isComplete = completedObjectives[obj.id] ?? false;
          const isActive = activeObjective === obj.id;
          const fb = feedback[obj.id];
          const hints = revealedHints[obj.id] ?? [];

          return (
            <div key={obj.id}>
              <button
                onClick={() => setActiveObjective(isActive ? null : obj.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-mono transition-all ${
                  isComplete
                    ? "border-green-500/30 bg-green-500/5 text-green-400"
                    : isActive
                      ? "border-hacker-green/40 bg-hacker-green/5 text-gray-200"
                      : "border-terminal-border text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={isComplete ? "text-green-400" : "text-gray-600"}>
                      {isComplete ? "[x]" : `[${i + 1}]`}
                    </span>
                    <span>{obj.description}</span>
                  </div>
                  <span className="text-hacker-green text-[10px]">+{obj.xpValue}</span>
                </div>
              </button>

              <AnimatePresence>
                {isActive && !isComplete && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 py-3 space-y-2">
                      {hints.length > 0 && (
                        <div className="space-y-1">
                          {hints.map((h, hi) => (
                            <div key={hi} className="text-[10px] font-mono text-accent-amber bg-accent-amber/5 border border-accent-amber/20 rounded p-2">
                              Hint {hi + 1}: {h}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={answers[obj.id] ?? ""}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [obj.id]: e.target.value }))
                          }
                          placeholder="Enter your answer..."
                          className="input-field text-xs flex-1"
                          onKeyDown={(e) => e.key === "Enter" && handleValidate(obj.id)}
                        />
                        <button
                          onClick={() => handleValidate(obj.id)}
                          disabled={loading || !(answers[obj.id]?.trim())}
                          className="btn-primary text-xs px-3 disabled:opacity-30"
                        >
                          Check
                        </button>
                        {obj.hints.length > hints.length && (
                          <button
                            onClick={() => handleHint(obj.id)}
                            className="text-xs px-2 py-1 border border-accent-amber/30 text-accent-amber rounded-lg hover:bg-accent-amber/10 transition-colors"
                            title="Use hint (XP penalty)"
                          >
                            Hint
                          </button>
                        )}
                      </div>

                      {fb && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`text-xs font-mono p-2 rounded border ${
                            fb.correct
                              ? "border-green-500/30 bg-green-500/5 text-green-400"
                              : "border-red-500/30 bg-red-500/5 text-red-400"
                          }`}
                        >
                          {fb.message}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
