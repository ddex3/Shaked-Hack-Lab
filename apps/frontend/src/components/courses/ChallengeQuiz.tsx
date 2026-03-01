import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { XpRewardAnimation } from "./XpRewardAnimation";
import { useProgress } from "../../context/ProgressContext";
import type { ReactNode } from "react";
import type { CourseChallenge } from "../../types/course.types";

interface ChallengeQuizProps {
  challenge: CourseChallenge;
  courseId: string;
  index: number;
  onComplete?: () => void;
}

export function ChallengeQuiz({
  challenge,
  courseId,
  index,
  onComplete,
}: ChallengeQuizProps): ReactNode {
  const { completeChallenge, isChallengeAttempted, getChallengeResult } = useProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const alreadyAttempted = isChallengeAttempted(courseId, challenge.id);
  const previousResult = getChallengeResult(courseId, challenge.id);

  const handleSubmit = useCallback(() => {
    if (!selected || submitted || alreadyAttempted) return;
    const correct = selected === challenge.correctAnswer;
    completeChallenge(courseId, challenge.id, correct, challenge.xpReward);
    setSubmitted(true);
    if (correct) {
      setShowXp(true);
      setTimeout(() => setShowXp(false), 1500);
    }
    onComplete?.();
  }, [selected, submitted, alreadyAttempted, challenge, courseId, completeChallenge, onComplete]);

  const isCorrect = submitted
    ? selected === challenge.correctAnswer
    : previousResult;
  const showResult = submitted || alreadyAttempted;
  const selectedAnswer = alreadyAttempted && !submitted ? challenge.correctAnswer : selected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="terminal-border rounded-lg p-5 relative"
    >
      <XpRewardAnimation xp={challenge.xpReward} show={showXp} />

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-mono text-gray-500">
          Q{index + 1}
        </span>
        <span className="text-[10px] font-mono text-hacker-green">
          +{challenge.xpReward} XP
        </span>
      </div>

      <p className="text-gray-200 text-sm font-bold mb-4">{challenge.question}</p>

      <div className="space-y-2 mb-4">
        {challenge.options.map((option) => {
          let optionClass = "border-terminal-border hover:border-gray-500 text-gray-300";

          if (showResult) {
            if (option === challenge.correctAnswer) {
              optionClass = "border-green-500/50 bg-green-500/10 text-green-400";
            } else if (option === selectedAnswer && option !== challenge.correctAnswer) {
              optionClass = "border-red-500/50 bg-red-500/10 text-red-400";
            } else {
              optionClass = "border-terminal-border text-gray-600 opacity-50";
            }
          } else if (option === selected) {
            optionClass = "border-hacker-green bg-hacker-green/10 text-hacker-green";
          }

          return (
            <button
              key={option}
              onClick={() => !showResult && setSelected(option)}
              disabled={showResult}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs font-mono transition-all ${optionClass} ${
                showResult ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="btn-primary text-xs w-full disabled:opacity-30"
        >
          Submit Answer
        </button>
      )}

      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-3 mt-3 border ${
            isCorrect
              ? "border-green-500/30 bg-green-500/5"
              : "border-red-500/30 bg-red-500/5"
          }`}
        >
          <span
            className={`text-[10px] font-mono font-bold block mb-1 ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "[CORRECT]" : "[INCORRECT]"}
          </span>
          <p className="text-gray-400 text-xs leading-relaxed">
            {challenge.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
