import { useState, useRef, useEffect, useCallback, type ReactNode, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TerminalLine {
  type: "input" | "output" | "error" | "system";
  content: string;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help     - Show this help message",
    "  about    - Learn about Shaked-Hack-Lab",
    "  courses  - View available training courses",
    "  enter    - Initialize access to the lab",
    "  clear    - Clear the terminal",
  ],
  about: [
    "Shaked-Hack-Lab 1.0.0",
    "A hands-on cybersecurity training platform.",
    "Practice real attack and defense techniques",
    "in a safe, sandboxed environment.",
    "",
    "Categories: SQL Injection, XSS, Linux,",
    "            Windows, Brute Force, API Exploits",
  ],
  courses: [
    "Available Training Courses:",
    "",
    "  [01] Web Application Security       - HTTP, XSS, SQL Injection",
    "  [02] Network Recon & Analysis        - Protocols, Nmap, Wireshark",
    "  [03] Applied Cryptography            - AES, RSA, ECC, PKI",
    "  [04] Linux Fundamentals              - Master the command line",
    "  [05] Windows Fundamentals            - Navigate Windows security",
    "  [06] Brute Force Concepts            - Understand password attacks",
    "",
    "Type 'enter' to begin your journey.",
  ],
  enter: [
    "Initializing secure connection...",
    "Authenticating credentials...",
    "Access granted.",
    "",
    "Redirecting to login portal...",
  ],
};

const INITIAL_LINES: TerminalLine[] = [
  { type: "system", content: "Shaked-Hack-Lab Terminal 1.0.0" },
  { type: "system", content: "Type 'help' for available commands." },
  { type: "output", content: "" },
];

export function TerminalPreview(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const navigate = useNavigate();
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    setLines((prev) => [...prev, { type: "input", content: `> ${cmd}` }]);

    if (trimmed === "clear") {
      setTimeout(() => setLines(INITIAL_LINES), 100);
      return;
    }

    const response = COMMANDS[trimmed];
    if (!response) {
      setLines((prev) => [
        ...prev,
        { type: "error", content: `Command not found: ${trimmed}` },
        { type: "output", content: "Type 'help' for available commands." },
      ]);
      return;
    }

    setIsTyping(true);
    response.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { type: trimmed === "enter" && i >= 2 ? "system" : "output", content: line },
        ]);
        if (i === response.length - 1) {
          setIsTyping(false);
          if (trimmed === "enter") {
            setTimeout(() => navigate("/login"), 800);
          }
        }
      }, (i + 1) * 120);
    });
  }, [navigate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && input.trim() && !isTyping) {
        processCommand(input);
        setInput("");
      }
    },
    [input, isTyping, processCommand]
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-200">Try the</span>{" "}
            <span className="text-hacker-green terminal-glow">Terminal</span>
          </h2>
          <p className="text-gray-500 font-mono text-sm sm:text-base">
            Interactive preview of the lab environment
          </p>
        </motion.div>

        <motion.div
          className="terminal-border rounded-lg overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            boxShadow: "0 0 40px rgba(0,255,65,0.08), 0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          <div className="bg-terminal-surface flex items-center px-4 py-2 border-b border-terminal-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-amber/80" />
              <div className="w-3 h-3 rounded-full bg-hacker-green/80" />
            </div>
            <span className="flex-1 text-center text-xs text-gray-600 font-mono">
              shaked@hack-lab:~
            </span>
          </div>

          <div
            ref={scrollRef}
            className="bg-terminal-bg p-4 h-80 overflow-y-auto font-mono text-sm cursor-text"
            onClick={focusInput}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  line.type === "input"
                    ? "text-hacker-green"
                    : line.type === "error"
                      ? "text-accent-red"
                      : line.type === "system"
                        ? "text-accent-cyan"
                        : "text-gray-400"
                }`}
              >
                {line.content || "\u00A0"}
              </div>
            ))}

            <div className="flex items-center text-hacker-green mt-1">
              <span className="mr-2">{">"}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-hacker-green font-mono text-sm caret-hacker-green"
                spellCheck={false}
                autoComplete="off"
                disabled={isTyping}
              />
              <span className="w-2 h-4 bg-hacker-green animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
