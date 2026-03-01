import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ScrambleText } from "../components/ui/ScrambleText";
import type { ReactNode } from "react";

export function DashboardHome(): ReactNode {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="terminal-border rounded-lg p-6 mb-6">
        <div className="text-hacker-green text-xs opacity-60 mb-2 font-mono">
          session://active
        </div>
        <h2 className="text-hacker-green terminal-glow text-xl font-bold mb-1">
          Welcome back, {user?.profile?.displayName ?? user?.username}
        </h2>
        <p className="text-gray-500 text-sm">
          Focus: {user?.profile?.focusTrack ?? "Not set"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="terminal-border rounded-lg p-5">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-2"><ScrambleText text="Score" duration={500} scrambleSpeed={2} /></div>
          <div className="text-hacker-green terminal-glow text-3xl font-bold">
            {user?.profile?.score ?? 0}
          </div>
        </div>
        <div className="terminal-border rounded-lg p-5">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-2"><ScrambleText text="Rank" duration={500} scrambleSpeed={2} /></div>
          <div className="text-accent-cyan text-3xl font-bold">
            #{user?.profile?.rank ?? "-"}
          </div>
        </div>
        <div className="terminal-border rounded-lg p-5">
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-2"><ScrambleText text="Role" duration={500} scrambleSpeed={2} /></div>
          <div className="text-accent-purple text-3xl font-bold capitalize">
            {user?.role?.toLowerCase() ?? "user"}
          </div>
        </div>
      </div>

      <div className="terminal-border rounded-lg p-6 mt-6">
        <div className="text-gray-500 text-xs mb-4 font-mono">
          root@shaked-hack-lab:~$ cat /etc/motd
        </div>
        <div className="text-gray-300 text-sm leading-relaxed space-y-2">
          <p>System initialized. Your operator profile is active.</p>
          <p>Navigate to Challenges to begin your training path.</p>
          <p className="text-hacker-dim-green">
            Remember: In this lab, every exploit teaches a defense.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
