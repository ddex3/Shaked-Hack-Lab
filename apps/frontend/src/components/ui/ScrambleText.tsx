import { useState, useEffect, useRef, type ReactNode } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]!;
}

interface ScrambleTextProps {
  text: string;
  duration?: number;
  className?: string;
  scrambleSpeed?: number;
}

export function ScrambleText({
  text,
  duration = 800,
  className,
  scrambleSpeed = 3,
}: ScrambleTextProps): ReactNode {
  const [display, setDisplay] = useState("");
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || text.length === 0) {
      setDisplay(text);
      return;
    }

    const length = text.length;
    const startTime = performance.now();
    const revealDelay = duration * 0.3;
    const revealDuration = duration * 0.7;
    frameRef.current = 0;

    const animate = (now: number): void => {
      const elapsed = now - startTime;
      frameRef.current++;

      const shouldFlicker = frameRef.current % scrambleSpeed === 0;

      let revealProgress = 0;
      if (elapsed > revealDelay) {
        const revealElapsed = elapsed - revealDelay;
        revealProgress = Math.min(revealElapsed / revealDuration, 1);
        revealProgress = revealProgress * revealProgress * (3 - 2 * revealProgress);
      }
      const resolvedCount = Math.floor(revealProgress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolvedCount) {
          result += text[i];
        } else if (shouldFlicker || frameRef.current < 3) {
          result += randomChar();
        } else {
          result += display[i] && display[i] !== " " ? display[i] : randomChar();
        }
      }

      setDisplay(result);

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    setDisplay(
      text
        .split("")
        .map((c) => (c === " " ? " " : randomChar()))
        .join("")
    );

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [text, duration, scrambleSpeed]);

  return <span className={className}>{display}</span>;
}
