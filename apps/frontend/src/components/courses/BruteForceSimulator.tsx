import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import {
  simulateBruteForceAttempt,
  resetBruteForceSimulation,
  analyzePassword,
  type BruteForceConfig,
  type BruteForceResult,
  type PasswordAnalysis,
} from "../../services/training.service";

interface BruteForceSimulatorProps {
  mode: "login" | "analyzer" | "rate-limit";
}

const DEFAULT_CONFIG: BruteForceConfig = {
  maxAttempts: 50,
  lockoutThreshold: 5,
  lockoutDurationSeconds: 30,
  rateLimitPerMinute: 10,
  passwordComplexity: "weak",
  simulatedDelayMs: 200,
};

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong", "Excellent"];
const STRENGTH_COLORS = ["bg-red-500", "bg-red-400", "bg-amber-500", "bg-yellow-400", "bg-green-400", "bg-green-500"];

export function BruteForceSimulator({ mode }: BruteForceSimulatorProps): ReactNode {
  const [config, setConfig] = useState<BruteForceConfig>(DEFAULT_CONFIG);
  const [guess, setGuess] = useState("");
  const [results, setResults] = useState<BruteForceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [analyzeInput, setAnalyzeInput] = useState("");
  const sessionKey = useRef(`sim-${Date.now()}`);
  const logRef = useRef<HTMLDivElement>(null);

  const handleAttempt = useCallback(async () => {
    if (!guess.trim() || loading) return;
    setLoading(true);
    try {
      const result = await simulateBruteForceAttempt(
        sessionKey.current,
        guess,
        config
      );
      setResults((prev) => [...prev, result]);
      setGuess("");
      setTimeout(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch {
      setResults((prev) => [
        ...prev,
        {
          attemptNumber: prev.length + 1,
          success: false,
          locked: false,
          lockoutRemainingSeconds: 0,
          rateLimited: false,
          message: "Request failed. Check connection.",
          totalAttempts: prev.length + 1,
          estimatedCrackTime: "N/A",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [guess, config, loading]);

  const handleReset = useCallback(async () => {
    await resetBruteForceSimulation(sessionKey.current);
    sessionKey.current = `sim-${Date.now()}`;
    setResults([]);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!analyzeInput.trim()) return;
    try {
      const result = await analyzePassword(analyzeInput);
      setAnalysis(result);
    } catch {
      setAnalysis(null);
    }
  }, [analyzeInput]);

  if (mode === "analyzer") {
    return (
      <div className="terminal-border rounded-lg p-5">
        <h4 className="text-gray-200 text-sm font-bold mb-4 flex items-center gap-2">
          <span className="text-accent-cyan font-mono">#</span>
          Password Strength Analyzer
        </h4>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={analyzeInput}
            onChange={(e) => setAnalyzeInput(e.target.value)}
            placeholder="Enter a password to analyze..."
            className="input-field text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <button onClick={handleAnalyze} className="btn-primary text-xs px-4">
            Analyze
          </button>
        </div>

        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-terminal-surface rounded-full overflow-hidden flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        i < analysis.score ? STRENGTH_COLORS[analysis.score] : "bg-gray-800"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-mono font-bold ${
                  analysis.score <= 1 ? "text-red-400" : analysis.score <= 3 ? "text-amber-400" : "text-green-400"
                }`}>
                  {STRENGTH_LABELS[analysis.score]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="terminal-border rounded-lg p-3">
                  <div className="text-[10px] font-mono text-gray-500 mb-1">Entropy</div>
                  <div className="text-accent-cyan font-mono text-sm font-bold">
                    {analysis.entropy} bits
                  </div>
                </div>
                <div className="terminal-border rounded-lg p-3">
                  <div className="text-[10px] font-mono text-gray-500 mb-1">Crack Time</div>
                  <div className={`font-mono text-sm font-bold ${
                    analysis.score <= 1 ? "text-red-400" : analysis.score <= 3 ? "text-amber-400" : "text-green-400"
                  }`}>
                    {analysis.crackTime}
                  </div>
                </div>
              </div>

              {analysis.feedback.length > 0 && (
                <div className="border border-accent-amber/20 bg-accent-amber/5 rounded-lg p-3">
                  <div className="text-[10px] font-mono text-accent-amber mb-2">[RECOMMENDATIONS]</div>
                  <ul className="space-y-1">
                    {analysis.feedback.map((f, i) => (
                      <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                        <span className="text-accent-amber shrink-0">&#8250;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (mode === "rate-limit") {
    return (
      <div className="terminal-border rounded-lg p-5">
        <h4 className="text-gray-200 text-sm font-bold mb-4 flex items-center gap-2">
          <span className="text-accent-purple font-mono">#</span>
          Rate Limit Configuration Lab
        </h4>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Lockout Threshold</label>
            <input
              type="number"
              min={0}
              max={100}
              value={config.lockoutThreshold}
              onChange={(e) =>
                setConfig((c) => ({ ...c, lockoutThreshold: parseInt(e.target.value) || 0 }))
              }
              className="input-field text-xs w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Lockout Duration (s)</label>
            <input
              type="number"
              min={0}
              max={3600}
              value={config.lockoutDurationSeconds}
              onChange={(e) =>
                setConfig((c) => ({ ...c, lockoutDurationSeconds: parseInt(e.target.value) || 0 }))
              }
              className="input-field text-xs w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Rate Limit / min</label>
            <input
              type="number"
              min={1}
              max={1000}
              value={config.rateLimitPerMinute}
              onChange={(e) =>
                setConfig((c) => ({ ...c, rateLimitPerMinute: parseInt(e.target.value) || 1 }))
              }
              className="input-field text-xs w-full"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 block mb-1">Password Strength</label>
            <select
              value={config.passwordComplexity}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  passwordComplexity: e.target.value as "weak" | "medium" | "strong",
                }))
              }
              className="input-field text-xs w-full cursor-pointer appearance-none"
            >
              <option value="weak" className="bg-terminal-bg">Weak (6 char, lowercase)</option>
              <option value="medium" className="bg-terminal-bg">Medium (8 char, mixed)</option>
              <option value="strong" className="bg-terminal-bg">Strong (14 char, full)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter password guess..."
            className="input-field text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAttempt()}
          />
          <button
            onClick={handleAttempt}
            disabled={loading || !guess.trim()}
            className="btn-primary text-xs px-4 disabled:opacity-30"
          >
            {loading ? "..." : "Try"}
          </button>
          <button onClick={handleReset} className="text-xs px-3 py-1.5 border border-terminal-border rounded-lg text-gray-400 hover:text-gray-200 transition-colors">
            Reset
          </button>
        </div>

        <div
          ref={logRef}
          className="bg-terminal-bg border border-terminal-border rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-[11px]"
        >
          {results.length === 0 && (
            <span className="text-gray-600">Configure rate limiting above, then test login attempts...</span>
          )}
          {results.map((r, i) => (
            <div key={i} className={`mb-1 ${
              r.success ? "text-green-400" : r.locked ? "text-red-400" : r.rateLimited ? "text-amber-400" : "text-gray-400"
            }`}>
              [{String(r.attemptNumber).padStart(3, "0")}] {r.message}
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="terminal-border rounded p-2">
              <div className="text-[10px] text-gray-500 font-mono">Attempts</div>
              <div className="text-accent-cyan font-mono text-sm font-bold">{results.length}</div>
            </div>
            <div className="terminal-border rounded p-2">
              <div className="text-[10px] text-gray-500 font-mono">Locked</div>
              <div className={`font-mono text-sm font-bold ${
                results[results.length - 1]?.locked ? "text-red-400" : "text-green-400"
              }`}>
                {results[results.length - 1]?.locked ? "YES" : "NO"}
              </div>
            </div>
            <div className="terminal-border rounded p-2">
              <div className="text-[10px] text-gray-500 font-mono">Est. Crack</div>
              <div className="text-accent-purple font-mono text-[10px] font-bold">
                {results[results.length - 1]?.estimatedCrackTime ?? "N/A"}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="terminal-border rounded-lg p-5">
      <h4 className="text-gray-200 text-sm font-bold mb-4 flex items-center gap-2">
        <span className="text-hacker-green font-mono">$</span>
        Login Simulation
      </h4>

      <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4 mb-4">
        <div className="text-[10px] font-mono text-gray-500 mb-3">SIMULATED LOGIN FORM</div>
        <div className="mb-3">
          <label className="text-[10px] font-mono text-gray-500 block mb-1">Username</label>
          <input
            type="text"
            value="admin"
            readOnly
            className="input-field text-xs w-full opacity-60"
          />
        </div>
        <div className="mb-3">
          <label className="text-[10px] font-mono text-gray-500 block mb-1">Password</label>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess the password..."
            className="input-field text-xs w-full"
            onKeyDown={(e) => e.key === "Enter" && handleAttempt()}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAttempt}
            disabled={loading || !guess.trim()}
            className="btn-primary text-xs flex-1 disabled:opacity-30"
          >
            {loading ? "Attempting..." : "Login"}
          </button>
          <button onClick={handleReset} className="text-xs px-3 py-1.5 border border-terminal-border rounded-lg text-gray-400 hover:text-gray-200 transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div
        ref={logRef}
        className="bg-terminal-bg border border-terminal-border rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-[11px]"
      >
        {results.length === 0 && (
          <span className="text-gray-600">Login attempts will appear here...</span>
        )}
        {results.map((r, i) => (
          <div key={i} className={`mb-1 ${
            r.success ? "text-green-400" : r.locked ? "text-red-400" : "text-gray-400"
          }`}>
            [{String(r.attemptNumber).padStart(3, "0")}] {r.message}
          </div>
        ))}
      </div>
    </div>
  );
}
