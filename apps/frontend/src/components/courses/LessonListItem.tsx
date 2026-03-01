import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "../../context/ProgressContext";
import type { ReactNode } from "react";
import type { Lesson } from "../../types/course.types";

interface LessonListItemProps {
  lesson: Lesson;
  courseId: string;
  index: number;
}

export function LessonListItem({ lesson, courseId, index }: LessonListItemProps): ReactNode {
  const navigate = useNavigate();
  const { isLessonComplete, isLessonUnlocked } = useProgress();
  const completed = isLessonComplete(courseId, lesson.id);
  const unlocked = isLessonUnlocked(courseId, lesson.id);

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      onClick={() => unlocked && navigate(`/dashboard/courses/${courseId}/lessons/${lesson.id}`)}
      disabled={!unlocked}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
        unlocked
          ? "hover:bg-terminal-surface/80 cursor-pointer"
          : "opacity-40 cursor-not-allowed"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
          completed
            ? "border-hacker-green bg-hacker-green/15 text-hacker-green"
            : unlocked
              ? "border-gray-500 text-gray-500"
              : "border-terminal-border text-terminal-border"
        }`}
      >
        {completed ? "\u2713" : lesson.order}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-bold truncate ${
            completed ? "text-hacker-green" : unlocked ? "text-gray-200" : "text-gray-600"
          }`}
        >
          {lesson.title}
        </div>
        <div className="text-[10px] font-mono text-gray-600">
          {lesson.challenges.length} challenge{lesson.challenges.length !== 1 ? "s" : ""}
        </div>
      </div>

      {!unlocked && (
        <span className="text-terminal-border text-xs font-mono shrink-0">[LOCKED]</span>
      )}
    </motion.button>
  );
}
