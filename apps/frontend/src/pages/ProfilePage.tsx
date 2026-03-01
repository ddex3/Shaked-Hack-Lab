import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ScrambleText } from "../components/ui/ScrambleText";
import type { ReactNode } from "react";

export function ProfilePage(): ReactNode {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-hacker-green terminal-glow text-lg font-bold mb-6">
        <ScrambleText text="Operator Profile" duration={800} scrambleSpeed={2} />
      </h2>

      <div className="terminal-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1"><ScrambleText text="Alias" duration={500} scrambleSpeed={2} /></div>
              <div className="text-hacker-green font-mono">@{user?.username}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Display Name" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-gray-200">{user?.profile?.displayName ?? "-"}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Secure Channel" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-gray-200 font-mono">{user?.email}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Focus Track" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-accent-cyan">{user?.profile?.focusTrack ?? "-"}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1"><ScrambleText text="Role" duration={500} scrambleSpeed={2} /></div>
              <div className="text-accent-purple capitalize">{user?.role?.toLowerCase()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Total Score" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-hacker-green terminal-glow text-2xl font-bold">
                {user?.profile?.score ?? 0}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Global Rank" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-accent-cyan text-2xl font-bold">
                #{user?.profile?.rank ?? "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                <ScrambleText text="Member Since" duration={500} scrambleSpeed={2} />
              </div>
              <div className="text-gray-400 font-mono text-sm">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
