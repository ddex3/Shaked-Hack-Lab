import { motion } from "framer-motion";
import { ScrambleText } from "../components/ui/ScrambleText";
import { CourseCard } from "../components/courses/CourseCard";
import { CourseFilters } from "../components/courses/CourseFilters";
import { EmptyState } from "../components/ui/EmptyState";
import { useCourses } from "../hooks/useCourses";
import { useProgress } from "../context/ProgressContext";
import type { ReactNode } from "react";

export function CoursesPage(): ReactNode {
  const { courses, filters, setFilters } = useCourses();
  const { totalXp } = useProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-hacker-green terminal-glow text-lg font-bold">
          <ScrambleText text="Courses" duration={800} scrambleSpeed={2} />
        </h2>
        <div className="text-xs font-mono text-gray-500">
          Total XP: <span className="text-hacker-green terminal-glow">{totalXp.toLocaleString()}</span>
        </div>
      </div>

      <CourseFilters filters={filters} onFilterChange={setFilters} />

      {courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          message="No matching courses available. Try adjusting your filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
