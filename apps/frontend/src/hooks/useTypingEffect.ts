import { useState, useEffect, useCallback } from "react";

interface UseTypingEffectOptions {
  speed?: number;
  delayBefore?: number;
  onComplete?: () => void;
}

export function useTypingEffect(
  text: string,
  { speed = 40, delayBefore = 0, onComplete }: UseTypingEffectOptions = {}
) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const reset = useCallback(() => {
    setDisplayed("");
    setIsComplete(false);
    setIsStarted(false);
  }, []);

  useEffect(() => {
    reset();
    const delayTimer = setTimeout(() => {
      setIsStarted(true);
    }, delayBefore);
    return () => clearTimeout(delayTimer);
  }, [text, delayBefore, reset]);

  useEffect(() => {
    if (!isStarted) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isStarted, onComplete]);

  return { displayed, isComplete, isStarted, reset };
}
