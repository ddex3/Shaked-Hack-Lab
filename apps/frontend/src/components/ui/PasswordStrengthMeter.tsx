import { useMemo } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
}

function calculateStrength(password: string): StrengthResult {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (password.length >= 20) score += 1;

  if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 4) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 6) return { score, label: "Strong", color: "#06b6d4" };
  return { score, label: "Excellent", color: "#00ff41" };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps): ReactNode {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const percentage = Math.min(100, (strength.score / 8) * 100);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-terminal-bg rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: strength.color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs mt-1 font-mono" style={{ color: strength.color }}>
        {strength.label}
      </p>
    </div>
  );
}
