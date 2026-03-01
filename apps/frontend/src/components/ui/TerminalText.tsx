import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TerminalText({
  text,
  speed = 40,
  onComplete,
  className = "",
}: TerminalTextProps): ReactNode {
  const [displayed, setDisplayed] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      <span
        className="inline-block w-2 h-5 ml-0.5 align-middle bg-hacker-green"
        style={{ opacity: cursorVisible ? 1 : 0 }}
      />
    </span>
  );
}
