import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button, Container, ThemeToggle } from "@/components/ui/Primitives";
import { NavLink } from "react-router-dom";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
  { href: "/membership", label: "Membership" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Portal" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <Container className="pointer-events-auto">
        <nav
          className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 shadow-float backdrop-blur-xl transition-all duration-300 ${
            scrolled ? "border-border-subtle/80 bg-surface/85" : "border-white/40 bg-surface/70"
          }`}
        >
          <NavLink to="/" className="flex items-center gap-2.5 rounded-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/12 font-display font-semibold text-accent">
              B
            </span>
            <span className="hidden min-[380px]:block">
              <span className="block font-display text-sm font-semibold">Brahmin Samaj</span>
              <span className="block text-[11px] uppercase tracking-widest text-ink-muted">Ontario</span>
            </span>
          </NavLink>
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-muted text-ink"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button to="/membership" className="hidden sm:inline-flex">Join Now</Button>
            <button className="rounded-xl border border-border-subtle p-2.5 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              ☰
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden lg:hidden">
              <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-float">
                {links.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className="block rounded-xl px-4 py-3 text-base hover:bg-surface-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
