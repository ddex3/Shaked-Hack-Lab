import { useParams, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrambleText } from "../components/ui/ScrambleText";
import { ProgressBar } from "../components/courses/ProgressBar";
import { SectionAccordion } from "../components/courses/SectionAccordion";
import { useCourse } from "../hooks/useCourse";
import { useProgress } from "../context/ProgressContext";
import type { ReactNode } from "react";

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/30",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function CourseDetailPage(): ReactNode {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, orderedLessons, totalChallenges } = useCourse(courseId);
  const { getCourseCompletion, getCourseScore, isLessonComplete } = useProgress();

  if (!courseId || !course) {
    return <Navigate to="/dashboard/courses" replace />;
  }

  const completion = getCourseCompletion(course.id);
  const score = getCourseScore(course.id);
  const completedLessons = orderedLessons.filter((l) =>
    isLessonComplete(course.id, l.id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={() => navigate("/dashboard/courses")}
        className="text-gray-500 hover:text-gray-300 text-xs font-mono mb-6 transition-colors"
      >
        &lt; Back to Courses
      </button>

      <div className="terminal-border rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              LEVEL_COLORS[course.level] ?? ""
            }`}
          >
            {course.level}
          </span>
          <span className="text-[10px] font-mono text-gray-500">{course.category}</span>
          <span className="text-[10px] font-mono text-gray-600">{course.estimatedDuration}</span>
        </div>

        <h2 className="text-gray-200 text-lg font-bold mb-2">
          <ScrambleText text={course.title} duration={600} scrambleSpeed={2} />
        </h2>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">{course.description}</p>

        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="text-center">
            <div className="text-hacker-green terminal-glow text-lg font-bold font-mono">
              {completedLessons}/{orderedLessons.length}
            </div>
            <div className="text-gray-500 text-[10px] font-mono">Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-accent-cyan text-lg font-bold font-mono">
              {totalChallenges}
            </div>
            <div className="text-gray-500 text-[10px] font-mono">Challenges</div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-bold font-mono ${
                score.percentage >= 80
                  ? "text-hacker-green terminal-glow"
                  : score.percentage >= 50
                    ? "text-accent-amber"
                    : score.correct > 0
                      ? "text-accent-red"
                      : "text-gray-600"
              }`}
            >
              {score.correct > 0 ? `${score.percentage}` : "--"}
            </div>
            <div className="text-gray-500 text-[10px] font-mono">Score</div>
          </div>
          <div className="text-center">
            <div className="text-accent-amber text-lg font-bold font-mono">
              {completion}%
            </div>
            <div className="text-gray-500 text-[10px] font-mono">Complete</div>
          </div>
        </div>

        <ProgressBar percentage={completion} height="h-2" />
      </div>

      <div className="space-y-3">
        {course.sections.map((section, i) => (
          <SectionAccordion
            key={section.id}
            section={section}
            courseId={course.id}
            sectionIndex={i}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </motion.div>
  );
}
