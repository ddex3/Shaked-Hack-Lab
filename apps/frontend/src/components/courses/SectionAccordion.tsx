import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LessonListItem } from "./LessonListItem";
import { useProgress } from "../../context/ProgressContext";
import type { ReactNode } from "react";
import type { Section } from "../../types/course.types";

interface SectionAccordionProps {
  section: Section;
  courseId: string;
  sectionIndex: number;
  defaultOpen?: boolean;
}

export function SectionAccordion({
  section,
  courseId,
  sectionIndex,
  defaultOpen = false,
}: SectionAccordionProps): ReactNode {
  const [open, setOpen] = useState(defaultOpen);
  const { isLessonComplete } = useProgress();

  const completedCount = section.lessons.filter((l) =>
    isLessonComplete(courseId, l.id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
      className="terminal-border rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-terminal-surface/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-hacker-green font-mono text-xs">
            {open ? "[-]" : "[+]"}
          </span>
          <span className="text-gray-200 text-sm font-bold">{section.title}</span>
        </div>
        <span className="text-gray-500 text-[10px] font-mono">
          {completedCount}/{section.lessons.length} completed
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-terminal-border"
          >
            <div className="p-2 space-y-1">
              {section.lessons.map((lesson, i) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  courseId={courseId}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
