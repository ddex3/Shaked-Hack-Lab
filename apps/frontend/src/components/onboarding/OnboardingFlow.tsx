import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { checkAlias } from "../../services/auth.service";
import { useDebounce } from "../../hooks/useDebounce";
import { PasswordStrengthMeter } from "../ui/PasswordStrengthMeter";
import { TerminalText } from "../ui/TerminalText";
import { ScrambleText } from "../ui/ScrambleText";
import type { ReactNode } from "react";

interface FormData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  focusTrack: string;
}

const FOCUS_TRACKS = [
  "Web Exploitation",
  "Cryptography",
  "Reverse Engineering",
  "Forensics",
  "Network Security",
  "Binary Exploitation",
  "OSINT",
  "Full Spectrum",
];

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function OnboardingFlow(): ReactNode {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    displayName: "",
    focusTrack: "",
  });
  const [aliasStatus, setAliasStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const debouncedUsername = useDebounce(formData.username, 400);

  useEffect(() => {
    if (debouncedUsername.length < 3) {
      setAliasStatus("idle");
      return;
    }
    let cancelled = false;
    setAliasStatus("checking");
    checkAlias(debouncedUsername)
      .then((available) => {
        if (!cancelled) setAliasStatus(available ? "available" : "taken");
      })
      .catch(() => {
        if (!cancelled) setAliasStatus("error");
      });
    return () => { cancelled = true; };
  }, [debouncedUsername]);

  const handleNext = useCallback(() => {
    setError(null);
    if (step === 0 && (!formData.username || aliasStatus !== "available")) {
      setError("Choose an available alias");
      return;
    }
    if (step === 1) {
      if (!formData.email) { setError("Email required"); return; }
      if (formData.password.length < 12) { setError("Access key must be at least 12 characters"); return; }
    }
    if (step === 2 && !formData.displayName) {
      setError("Display name required");
      return;
    }
    if (step === 3 && !formData.focusTrack) {
      setError("Select a focus track");
      return;
    }
    setStep((s) => s + 1);
  }, [step, formData, aliasStatus]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.displayName,
        formData.focusTrack
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(message ?? "Registration failed");
    }
  }, [formData, register, navigate]);

  if (!introComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terminal-bg p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="terminal-border rounded-lg p-8">
            <div className="text-hacker-green text-sm mb-4 opacity-60">
              root@shaked-hack-lab:~$
            </div>
            <div className="text-hacker-green text-lg terminal-glow">
              <TerminalText
                text="Welcome to Shaked Hack Lab. Initialize your operator identity to begin."
                speed={30}
                onComplete={() => {
                  setTimeout(() => setIntroComplete(true), 800);
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-terminal-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="terminal-border rounded-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-hacker-green terminal-glow text-sm font-bold">
              <ScrambleText text="IDENTITY CREATION" duration={1200} scrambleSpeed={2} />
            </h2>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i <= step ? "bg-hacker-green" : "bg-terminal-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                    <ScrambleText text="Operator Alias" duration={700} scrambleSpeed={2} />
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, username: e.target.value }));
                      if (e.target.value.length >= 3) setAliasStatus("checking");
                      else setAliasStatus("idle");
                    }}
                    className="input-field"
                    placeholder="your_alias"
                    autoFocus
                  />
                  <p className="text-xs mt-2 h-4">
                    {aliasStatus === "checking" && (
                      <span className="text-gray-500">Checking availability...</span>
                    )}
                    {aliasStatus === "available" && (
                      <span className="text-hacker-green">Alias available</span>
                    )}
                    {aliasStatus === "taken" && (
                      <span className="text-accent-red">Alias taken</span>
                    )}
                    {aliasStatus === "error" && (
                      <span className="text-accent-amber">Could not verify alias</span>
                    )}
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                      <ScrambleText text="Secure Channel (Email)" duration={700} scrambleSpeed={2} />
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                      className="input-field"
                      placeholder="operator@domain.com"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                      <ScrambleText text="Access Key" duration={700} scrambleSpeed={2} />
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((f) => ({ ...f, password: e.target.value }))}
                      className="input-field"
                      placeholder="Min 12 chars, mixed complexity"
                    />
                    <PasswordStrengthMeter password={formData.password} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                    <ScrambleText text="Display Name" duration={700} scrambleSpeed={2} />
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData((f) => ({ ...f, displayName: e.target.value }))}
                    className="input-field"
                    placeholder="How others see you"
                    autoFocus
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                    <ScrambleText text="Focus Track" duration={700} scrambleSpeed={2} />
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {FOCUS_TRACKS.map((track) => (
                      <button
                        key={track}
                        onClick={() => setFormData((f) => ({ ...f, focusTrack: track }))}
                        className={`p-3 rounded-lg text-xs font-mono text-left transition-all duration-200 border ${
                          formData.focusTrack === track
                            ? "border-hacker-green text-hacker-green bg-hacker-green/10"
                            : "border-terminal-border text-gray-400 hover:border-gray-600"
                        }`}
                      >
                        {track}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-accent-red text-xs mt-4"
            >
              {error}
            </motion.p>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                onClick={() => { setStep((s) => s - 1); setError(null); }}
                className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary text-sm">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary text-sm">
                Initialize
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 font-mono">
          Already have an identity?{" "}
          <a href="/login" className="text-hacker-green hover:underline">
            Authenticate
          </a>
        </p>
      </motion.div>
    </div>
  );
}
