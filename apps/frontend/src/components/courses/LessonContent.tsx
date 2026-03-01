import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { ContentBlock } from "../../types/course.types";

interface LessonContentProps {
  blocks: ContentBlock[];
}

const ALERT_STYLES: Record<string, { border: string; bg: string; text: string; label: string }> = {
  info: {
    border: "border-accent-cyan/30",
    bg: "bg-accent-cyan/5",
    text: "text-accent-cyan",
    label: "INFO",
  },
  warning: {
    border: "border-accent-amber/30",
    bg: "bg-accent-amber/5",
    text: "text-accent-amber",
    label: "WARNING",
  },
  danger: {
    border: "border-accent-red/30",
    bg: "bg-accent-red/5",
    text: "text-accent-red",
    label: "DANGER",
  },
};

function renderBlock(block: ContentBlock, index: number): ReactNode {
  switch (block.type) {
    case "heading":
      return (
        <h3 key={index} className="text-gray-200 text-base font-bold mt-6 mb-3">
          {block.content}
        </h3>
      );
    case "text":
      return (
        <p key={index} className="text-gray-400 text-sm leading-relaxed mb-4">
          {block.content}
        </p>
      );
    case "code":
      return (
        <div key={index} className="terminal-border rounded-lg overflow-hidden my-4">
          <div className="bg-terminal-surface px-4 py-1.5 border-b border-terminal-border">
            <span className="text-gray-500 text-[10px] font-mono uppercase">
              {block.language}
            </span>
          </div>
          <pre className="p-4 text-hacker-green text-xs leading-relaxed overflow-x-auto">
            <code>{block.content}</code>
          </pre>
        </div>
      );
    case "list":
      return (
        <ul key={index} className="space-y-2 my-4">
          {block.items.map((item, i) => (
            <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
              <span className="text-hacker-green mt-0.5 shrink-0 font-mono">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "alert": {
      const style = ALERT_STYLES[block.variant] ?? ALERT_STYLES.info!;
      return (
        <div
          key={index}
          className={`border rounded-lg p-4 my-4 ${style.border} ${style.bg}`}
        >
          <span className={`text-[10px] font-mono font-bold ${style.text} mb-1 block`}>
            [{style.label}]
          </span>
          <p className="text-gray-400 text-xs leading-relaxed">{block.content}</p>
        </div>
      );
    }
  }
}

export function LessonContent({ blocks }: LessonContentProps): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-1"
    >
      {blocks.map((block, i) => renderBlock(block, i))}
    </motion.div>
  );
}
