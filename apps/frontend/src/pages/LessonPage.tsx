import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrambleText } from "../components/ui/ScrambleText";
import { LessonContent } from "../components/courses/LessonContent";
import { ChallengeQuiz } from "../components/courses/ChallengeQuiz";
import { useLesson } from "../hooks/useLesson";
import { useProgress } from "../context/ProgressContext";
import type { ReactNode } from "react";

export function LessonPage(): ReactNode {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { course, section, lesson, previousLesson, nextLesson } = useLesson(courseId, lessonId);
  const { isLessonComplete, isLessonUnlocked } = useProgress();

  if (!courseId || !lessonId || !course || !lesson) {
    return <Navigate to="/dashboard/courses" replace />;
  }

  if (!isLessonUnlocked(courseId, lessonId)) {
    return <Navigate to={`/dashboard/courses/${courseId}`} replace />;
  }

  const completed = isLessonComplete(courseId, lessonId);
  const canGoNext = nextLesson && isLessonUnlocked(courseId, nextLesson.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <button
        onClick={() => navigate(`/dashboard/courses/${courseId}`)}
        className="text-gray-500 hover:text-gray-300 text-xs font-mono mb-4 transition-colors"
      >
        &lt; Back to {course.title}
      </button>

      <div className="text-[10px] font-mono text-gray-600 mb-2">
        {section?.title} &mdash; Lesson {lesson.order}
      </div>

      <h2 className="text-gray-200 text-lg font-bold mb-6">
        <ScrambleText text={lesson.title} duration={600} scrambleSpeed={2} />
      </h2>

      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-border border-hacker-green/30 rounded-lg p-3 mb-6 bg-hacker-green/5"
        >
          <span className="text-hacker-green text-xs font-mono font-bold">
            [COMPLETED] All challenges answered
          </span>
        </motion.div>
      )}

      <LessonContent blocks={lesson.content} />

      {lesson.challenges.length > 0 && (
        <div className="mt-10">
          <h3 className="text-gray-200 text-sm font-bold mb-4 flex items-center gap-2">
            <span className="text-hacker-green font-mono">$</span>
            Challenges
          </h3>
          <div className="space-y-4">
            {lesson.challenges.map((challenge, i) => (
              <ChallengeQuiz
                key={challenge.id}
                challenge={challenge}
                courseId={courseId}
                index={i}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-10 pt-6 border-t border-terminal-border">
        {previousLesson ? (
          <button
            onClick={() =>
              navigate(`/dashboard/courses/${courseId}/lessons/${previousLesson.id}`)
            }
            className="text-gray-400 hover:text-gray-200 text-xs font-mono transition-colors"
          >
            &lt; {previousLesson.title}
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            onClick={() =>
              canGoNext &&
              navigate(`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`)
            }
            disabled={!canGoNext}
            className="text-gray-400 hover:text-hacker-green text-xs font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {nextLesson.title} &gt;
          </button>
        ) : (
          <button
            onClick={() => navigate(`/dashboard/courses/${courseId}`)}
            className="btn-primary text-xs"
          >
            Finish Course
          </button>
        )}
      </div>
    </motion.div>
  );
}
