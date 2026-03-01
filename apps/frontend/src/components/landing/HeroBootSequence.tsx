import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BOOT_LINES = [
  { text: "[SYSTEM] Initializing Shaked-Hack-Lab kernel 1.0.0...", delay: 0 },
  { text: "[OK] Loading encrypted modules...", delay: 400 },
  { text: "[OK] Establishing secure connection...", delay: 800 },
  { text: "[OK] Threat intelligence database online...", delay: 1200 },
  { text: "[OK] Challenge engine initialized...", delay: 1600 },
  { text: "[OK] Sandbox environments ready...", delay: 1900 },
  { text: "[WARN] Unauthorized access will be logged.", delay: 2200 },
  { text: "[SYSTEM] All systems operational.", delay: 2600 },
  { text: "", delay: 3000 },
];

export function HeroBootSequence(): ReactNode {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [titleRevealed, setTitleRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, index) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(index + 1);
        }, line.delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setBootComplete(true);
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
        setTimeout(() => setTitleRevealed(true), 400);
      }, 3200)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!bootComplete) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 100 + Math.random() * 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [bootComplete]);

  const handleEnterLab = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleExploreChallenges = useCallback(() => {
    const el = document.getElementById("threat-map");
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-terminal-bg via-terminal-bg to-transparent" />

      <div className="relative z-10 w-full max-w-3xl">
        <AnimatePresence>
          {!bootComplete && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-sm space-y-1"
            >
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    line.text.includes("[WARN]")
                      ? "text-accent-amber"
                      : line.text.includes("[OK]")
                        ? "text-hacker-green"
                        : "text-gray-400"
                  }
                >
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span className="inline-block w-2 h-4 ml-1 bg-hacker-green animate-pulse" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {titleRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <motion.h1
                className={`text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 ${glitchActive ? "landing-glitch" : ""}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-hacker-green terminal-glow">Welcome to</span>
                <br />
                <span className="bg-gradient-to-r from-hacker-green via-accent-cyan to-accent-purple bg-clip-text text-transparent">
                  Shaked-Hack-Lab
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-400 font-mono mb-10 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {">"} Enter the Cyber Arena_
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <button
                  onClick={handleEnterLab}
                  className="landing-btn-glow group relative px-8 py-3 rounded-lg font-mono font-bold text-terminal-bg bg-hacker-green overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,65,0.5)]"
                >
                  <span className="relative z-10">Enter the Lab</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-hacker-green to-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <button
                  onClick={handleExploreChallenges}
                  className="landing-btn-border group relative px-8 py-3 rounded-lg font-mono font-bold text-hacker-green border border-hacker-green/40 overflow-hidden transition-all duration-300 hover:border-hacker-green hover:shadow-[0_0_20px_rgba(0,255,65,0.2)]"
                >
                  <span className="relative z-10">Explore Challenges</span>
                  <div className="absolute inset-0 bg-hacker-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: titleRevealed ? 1 : 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-hacker-green/50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
