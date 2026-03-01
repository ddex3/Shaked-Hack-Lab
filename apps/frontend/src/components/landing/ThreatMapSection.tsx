import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ThreatNode } from "./ThreatNode";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const THREAT_NODES = [
  {
    label: "SQL Injection",
    description: "Exploit database vulnerabilities through malicious SQL queries. Learn query manipulation and defense techniques.",
    x: 20,
    y: 25,
    color: "#ef4444",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    label: "XSS",
    description: "Master cross-site scripting attacks and defenses. Inject and sanitize scripts in web applications.",
    x: 50,
    y: 15,
    color: "#f59e0b",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    label: "Linux",
    description: "Navigate Linux systems, exploit misconfigurations, and master privilege escalation techniques.",
    x: 80,
    y: 25,
    color: "#00ff41",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    label: "Windows",
    description: "Explore Windows security, Active Directory attacks, and system hardening strategies.",
    x: 15,
    y: 65,
    color: "#06b6d4",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Brute Force",
    description: "Understand password cracking, dictionary attacks, and how to build resilient authentication systems.",
    x: 50,
    y: 75,
    color: "#a855f7",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    label: "API Exploitation",
    description: "Discover API vulnerabilities, broken authentication, and data exposure in modern web services.",
    x: 82,
    y: 65,
    color: "#ec4899",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
];

export function ThreatMapSection(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="threat-map" ref={ref} className="relative py-20 sm:py-32 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-hacker-green terminal-glow">Global</span>{" "}
            <span className="text-gray-200">Threat Map</span>
          </h2>
          <p className="text-gray-500 font-mono text-sm sm:text-base max-w-xl mx-auto">
            Select a target vector to begin your operation
          </p>
        </motion.div>

        <div className="relative w-full aspect-[16/10] max-w-4xl mx-auto">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,255,65,0.15)" />
                <stop offset="50%" stopColor="rgba(6,182,212,0.15)" />
                <stop offset="100%" stopColor="rgba(168,85,247,0.15)" />
              </linearGradient>
            </defs>
            {THREAT_NODES.map((from, i) =>
              THREAT_NODES.slice(i + 1).map((to, j) => (
                <motion.line
                  key={`${i}-${j}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="url(#line-grad)"
                  strokeWidth="0.2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3 + i * 0.1 }}
                />
              ))
            )}
          </svg>

          {THREAT_NODES.map((node, i) => (
            <ThreatNode key={node.label} {...node} delay={0.2 + i * 0.15} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
