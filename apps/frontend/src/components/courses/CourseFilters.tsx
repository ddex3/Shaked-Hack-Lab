import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { CourseFiltersState } from "../../types/course.types";

interface CourseFiltersProps {
  filters: CourseFiltersState;
  onFilterChange: (partial: Partial<CourseFiltersState>) => void;
}

const LEVELS = [
  { value: "", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "Web Security", label: "Web Security" },
  { value: "Network Security", label: "Network Security" },
  { value: "Cryptography", label: "Cryptography" },
  { value: "Linux Fundamentals", label: "Linux Fundamentals" },
  { value: "Windows Fundamentals", label: "Windows Fundamentals" },
  { value: "Brute Force", label: "Brute Force" },
];

export function CourseFilters({ filters, onFilterChange }: CourseFiltersProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="terminal-border rounded-lg p-4 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Search courses..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="input-field text-xs"
        />
        <div className="relative">
          <select
            value={filters.level}
            onChange={(e) => onFilterChange({ level: e.target.value })}
            className="input-field text-xs cursor-pointer appearance-none pr-8"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value} className="bg-terminal-bg text-hacker-green">
                {l.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 text-xs">&#9662;</span>
          </div>
        </div>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="input-field text-xs cursor-pointer appearance-none pr-8"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-terminal-bg text-hacker-green">
                {c.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 text-xs">&#9662;</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
