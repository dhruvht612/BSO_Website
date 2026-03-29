import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";

export function PortalShell({ title, subtitle = "Management workspace", links, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[auto_1fr]">
        <aside
          className={`border-r border-white/10 bg-[#0b1220] p-4 transition-all duration-300 ${
            collapsed ? "lg:w-20" : "lg:w-72"
          }`}
        >
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-gold text-base font-semibold text-slate-950">
                  B
                </div>
                <div>
                  <p className="font-display text-base text-white">BSO Admin</p>
                  <p className="text-xs text-slate-400 capitalize">{user?.role} portal</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-xl border border-white/15 bg-white/5 p-2 text-sm hover:bg-white/10"
            >
              {collapsed ? "→" : "←"}
            </button>
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-gradient-to-r from-accent/90 to-accent-gold/80 text-slate-950"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-xs group-hover:bg-white/20">
                  {link.icon}
                </span>
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f172acc] px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl text-white">{title}</h1>
                <p className="text-sm text-slate-400">{subtitle}</p>
              </div>
              <div className="hidden flex-1 justify-center lg:flex">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search members, events, announcements..."
                  className="h-10 w-full max-w-xl rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-400 outline-none focus:border-accent"
                />
              </div>
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowNotifications((prev) => !prev)}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                  🔔
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/15 bg-[#0f172a] p-3 shadow-float">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Notifications</p>
                    <div className="space-y-2 text-xs text-slate-200">
                      <div className="rounded-lg bg-white/5 px-2.5 py-2">2 new inquiries need review</div>
                      <div className="rounded-lg bg-white/5 px-2.5 py-2">Upcoming event starts in 3 days</div>
                      <div className="rounded-lg bg-white/5 px-2.5 py-2">Membership report is ready</div>
                    </div>
                  </div>
                )}
                <ThemeToggle />
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                >
                  Logout
                </button>
                <div className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-2 py-1.5 sm:flex">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent/80 text-xs font-semibold text-slate-950">
                    {(user?.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="pr-2">
                    <p className="text-xs text-white">{user?.name}</p>
                    <p className="text-[11px] text-slate-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[calc(100vh-80px)] bg-[radial-gradient(circle_at_top_right,rgba(217,119,87,0.12),transparent_34%)] p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111a2b] p-5 shadow-card">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl text-accent">{value}</p>
    </div>
  );
}
