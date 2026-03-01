import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { ScrambleText } from "../ui/ScrambleText";
import { SiteFooter } from "../ui/SiteFooter";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Terminal", end: true },
  { to: "/dashboard/courses", label: "Courses", end: false },
  { to: "/dashboard/challenges", label: "Challenges", end: false },
  { to: "/dashboard/leaderboard", label: "Leaderboard", end: false },
  { to: "/dashboard/profile", label: "Profile", end: false },
];

export function DashboardLayout(): ReactNode {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      <header className="border-b border-terminal-border bg-terminal-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-hacker-green terminal-glow font-bold text-sm tracking-wider">
              <ScrambleText text="SHAKED HACK LAB" duration={1200} scrambleSpeed={2} />
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      isActive
                        ? "text-hacker-green bg-hacker-green/10"
                        : "text-gray-500 hover:text-gray-300"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs font-mono hidden sm:block">
              {user?.profile?.displayName ?? user?.username}
            </span>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden text-gray-400 hover:text-gray-200"
            >
              Menu
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-accent-red text-xs font-mono transition-colors hidden md:block"
            >
              Logout
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-terminal-border overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded text-xs font-mono ${
                        isActive
                          ? "text-hacker-green bg-hacker-green/10"
                          : "text-gray-500"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-xs font-mono text-accent-red"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
