import { useState, useCallback, useRef, type RefObject } from "react";

interface TiltValues {
  rotateX: number;
  rotateY: number;
  scale: number;
}

interface UseMouseTiltOptions {
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}

export function useMouseTilt<T extends HTMLElement>({
  maxTilt = 15,
  scale = 1.05,
}: UseMouseTiltOptions = {}): {
  ref: RefObject<T | null>;
  tilt: TiltValues;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
  };
} {
  const ref = useRef<T>(null);
  const [tilt, setTilt] = useState<TiltValues>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      setTilt({
        rotateX: -percentY * maxTilt,
        rotateY: percentX * maxTilt,
        scale,
      });
    },
    [maxTilt, scale]
  );

  const onMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  return {
    ref,
    tilt,
    handlers: { onMouseMove, onMouseLeave },
  };
}
