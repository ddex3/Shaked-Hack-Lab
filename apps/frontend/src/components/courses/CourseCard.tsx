import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "./ProgressBar";
import { useProgress } from "../../context/ProgressContext";
import { getTotalLessons, getTotalChallenges } from "../../services/course.service";
import type { ReactNode } from "react";
import type { Course } from "../../types/course.types";

interface CourseCardProps {
  course: Course;
  index: number;
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/30",
  Intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Advanced: "bg-red-500/15 text-red-400 border-red-500/30",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Web Security": "text-accent-cyan",
  "Network Security": "text-accent-purple",
  Cryptography: "text-accent-amber",
};

export function CourseCard({ course, index }: CourseCardProps): ReactNode {
  const navigate = useNavigate();
  const { getCourseCompletion, getCourseScore } = useProgress();
  const completion = getCourseCompletion(course.id);
  const score = getCourseScore(course.id);
  const totalLessons = getTotalLessons(course);
  const totalChallenges = getTotalChallenges(course);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      whileHover={{ scale: 1.02 }}
      className="terminal-border rounded-lg p-5 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(0,255,65,0.08)] transition-shadow"
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              LEVEL_COLORS[course.level] ?? ""
            }`}
          >
            {course.level}
          </span>
          <span
            className={`text-[10px] font-mono ${CATEGORY_COLORS[course.category] ?? "text-gray-400"}`}
          >
            {course.category}
          </span>
        </div>

        <h3 className="text-gray-200 text-sm font-bold mb-2 leading-tight">
          {course.title}
        </h3>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600 mb-4">
          <span>{totalLessons} lessons</span>
          <span>{totalChallenges} challenges</span>
          <span>{course.estimatedDuration}</span>
        </div>

        <ProgressBar percentage={completion} showLabel />

        {score.correct > 0 && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-mono text-gray-500">
              Score: {score.correct}/{score.total}
            </span>
            <span
              className={`text-[10px] font-mono font-bold ${
                score.percentage >= 80
                  ? "text-hacker-green"
                  : score.percentage >= 50
                    ? "text-accent-amber"
                    : "text-accent-red"
              }`}
            >
              {score.percentage}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate(`/dashboard/courses/${course.id}`)}
        className="btn-primary text-xs w-full text-center mt-4"
      >
        {completion === 0 ? "Start Course" : completion === 100 ? "Review" : "Continue"}
      </button>
    </motion.div>
  );
}
