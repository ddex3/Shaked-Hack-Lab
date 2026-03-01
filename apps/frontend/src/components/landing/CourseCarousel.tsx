import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CourseData {
  title: string;
  description: string;
  lessons: number;
  duration: string;
  color: string;
  topics: string[];
  icon: ReactNode;
}

const COURSES: CourseData[] = [
  {
    title: "Web Application Security",
    description: "Master the fundamentals of web security including HTTP, XSS, and SQL injection. Learn to identify and prevent the most common web vulnerabilities.",
    lessons: 9,
    duration: "4 hours",
    color: "#ef4444",
    topics: ["HTTP Fundamentals", "Security Headers", "Cookies & Sessions", "Cross-Site Scripting", "SQL Injection", "Input Sanitization"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Network Recon & Analysis",
    description: "Learn network protocols, reconnaissance techniques, and traffic analysis. Master tools like Nmap and Wireshark for security assessments.",
    lessons: 9,
    duration: "5 hours",
    color: "#f59e0b",
    topics: ["TCP/IP Model", "DNS Architecture", "TLS Encryption", "Port Scanning with Nmap", "Service Enumeration", "Packet Capture with Wireshark"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    title: "Applied Cryptography",
    description: "Dive into symmetric and asymmetric encryption, hash functions, digital signatures, and PKI. Understand the math behind modern security.",
    lessons: 9,
    duration: "5 hours",
    color: "#ec4899",
    topics: ["Block Cipher Modes", "AES Deep Dive", "RSA Fundamentals", "Elliptic Curve Crypto", "Digital Signatures", "PKI & Certificates"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
  },
  {
    title: "Linux Fundamentals",
    description: "Master the Linux command line from basics to advanced system administration. Learn file systems, permissions, networking, and shell scripting.",
    lessons: 12,
    duration: "6 hours",
    color: "#00ff41",
    topics: ["File System Navigation", "Permissions & Users", "Process Management", "Shell Scripting", "Network Tools"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    title: "Windows Fundamentals",
    description: "Explore Windows internals, security mechanisms, Active Directory, and privilege escalation techniques in enterprise environments.",
    lessons: 10,
    duration: "5 hours",
    color: "#06b6d4",
    topics: ["PowerShell Essentials", "Registry & Services", "Active Directory", "Windows Firewall", "Event Logs"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Brute Force Concepts",
    description: "Understand password cracking methodologies, dictionary attacks, hash functions, and how to build resilient authentication systems.",
    lessons: 8,
    duration: "4 hours",
    color: "#a855f7",
    topics: ["Hash Functions", "Dictionary Attacks", "Rainbow Tables", "Rate Limiting", "Password Policies"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
];

export function CourseCarousel(): ReactNode {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const activeCourse = COURSES[activeIndex]!;

  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-200">Training</span>{" "}
            <span className="text-accent-purple" style={{ textShadow: "0 0 12px rgba(168,85,247,0.4)" }}>
              Modules
            </span>
          </h2>
          <p className="text-gray-500 font-mono text-sm sm:text-base">
            Structured courses to build your foundation
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {COURSES.map((course, i) => (
            <button
              key={course.title}
              onClick={() => {
                setActiveIndex(i);
                setExpanded(false);
              }}
              className="relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[10px] sm:text-xs transition-all duration-300 border"
              style={{
                borderColor: i === activeIndex ? `${course.color}60` : "rgba(30,41,59,0.5)",
                color: i === activeIndex ? course.color : "#6b7280",
                background: i === activeIndex ? `${course.color}10` : "transparent",
                boxShadow: i === activeIndex ? `0 0 15px ${course.color}20` : "none",
              }}
            >
              {course.title.split(" ")[0]}
              {i === activeIndex && (
                <motion.div
                  layoutId="course-indicator"
                  className="absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
              )}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="terminal-border rounded-xl overflow-hidden"
            style={{
              boxShadow: `0 0 30px ${activeCourse.color}10`,
            }}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div
                  className="hidden sm:flex w-16 h-16 rounded-xl border items-center justify-center shrink-0"
                  style={{
                    borderColor: `${activeCourse.color}30`,
                    background: `${activeCourse.color}10`,
                    color: activeCourse.color,
                  }}
                >
                  {activeCourse.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-xl sm:text-2xl font-bold font-mono mb-2"
                    style={{ color: activeCourse.color }}
                  >
                    {activeCourse.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {activeCourse.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                      </svg>
                      {activeCourse.lessons} Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {activeCourse.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs font-mono font-bold tracking-wider transition-colors"
                    style={{ color: activeCourse.color }}
                  >
                    {expanded ? "COLLAPSE" : "VIEW TOPICS"} {expanded ? "\u25B2" : "\u25BC"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-6 border-t border-terminal-border">
                      <h4 className="text-xs text-gray-500 font-mono tracking-wider mb-3">
                        COURSE TOPICS
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCourse.topics.map((topic, i) => (
                          <motion.div
                            key={topic}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 text-sm font-mono text-gray-300"
                          >
                            <span style={{ color: activeCourse.color }}>{">"}</span>
                            {topic}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
