import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ScrambleText } from "../components/ui/ScrambleText";
import { SiteFooter } from "../components/ui/SiteFooter";
import type { ReactNode, FormEvent } from "react";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

export function LoginPage(): ReactNode {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/dashboard";

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};
    if (!identifier.trim()) errors.identifier = "Alias or email required";
    if (!password) errors.password = "Access key required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [identifier, password]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!validate()) return;
      setSubmitting(true);
      try {
        await login(identifier, password);
        navigate(from, { replace: true });
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setError(message ?? "Authentication failed");
      } finally {
        setSubmitting(false);
      }
    },
    [identifier, password, login, navigate, from, validate]
  );

  return (
    <div className="min-h-screen flex flex-col bg-terminal-bg">
      <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="terminal-border rounded-lg p-8">
          <div className="mb-8">
            <div className="text-hacker-green text-xs opacity-60 mb-1 font-mono">
              shaked-hack-lab://auth
            </div>
            <h1 className="text-hacker-green terminal-glow text-xl font-bold">
              <ScrambleText text="Authenticate" duration={1000} scrambleSpeed={2} />
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                <ScrambleText text="Alias or Email" duration={600} scrambleSpeed={2} />
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (fieldErrors.identifier) setFieldErrors((p) => ({ ...p, identifier: undefined }));
                }}
                className={`input-field ${fieldErrors.identifier ? "!border-accent-red" : ""}`}
                placeholder="operator@domain.com"
                autoFocus
              />
              <AnimatePresence>
                {fieldErrors.identifier && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-accent-red text-xs mt-1.5 font-mono"
                  >
                    {fieldErrors.identifier}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-wider">
                <ScrambleText text="Access Key" duration={600} scrambleSpeed={2} />
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`input-field ${fieldErrors.password ? "!border-accent-red" : ""}`}
                placeholder="Enter access key"
              />
              <AnimatePresence>
                {fieldErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-accent-red text-xs mt-1.5 font-mono"
                  >
                    {fieldErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-accent-red text-xs"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-sm"
            >
              {submitting ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 font-mono">
          No identity yet?{" "}
          <a href="/onboarding" className="text-hacker-green hover:underline">
            Create one
          </a>
        </p>
      </motion.div>
      </div>
      <SiteFooter />
    </div>
  );
}
