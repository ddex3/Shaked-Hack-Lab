import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function MatrixRain(): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / 16);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 14, 23, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(0, 255, 65, 0.12)";
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]!;
        const x = i * 16;
        const y = drops[i]! * 16;

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]!++;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export function CTASection(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <section ref={ref} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <MatrixRain />

      <div className="absolute inset-0 bg-gradient-to-b from-terminal-bg via-transparent to-terminal-bg pointer-events-none" />

      <div className="relative z-10 text-center px-4">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-gray-200">Are You Ready</span>
          <br />
          <span className="text-hacker-green terminal-glow">To Compete?</span>
        </motion.h2>

        <motion.p
          className="text-gray-500 font-mono text-sm sm:text-base mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter the arena. Prove your skills. Climb the ranks.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        >
          <button
            onClick={handleClick}
            className="group relative px-10 py-4 rounded-lg font-mono font-bold text-lg overflow-hidden transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-hacker-green via-accent-cyan to-hacker-green bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />

            <div className="absolute inset-[2px] bg-terminal-bg rounded-md" />

            <span className="relative z-10 text-hacker-green group-hover:text-terminal-bg transition-colors duration-300">
              Initialize Access
            </span>

            <div className="absolute inset-[2px] bg-hacker-green rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-gray-600"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-hacker-green animate-pulse" />
            Free Access
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
            Real Challenges
          </span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
            Live Rankings
          </span>
        </motion.div>
      </div>
    </section>
  );
}
