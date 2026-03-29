import { animate, motion, useInView } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export function Container({ children, className = "", as: Tag = "div", id }) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}

const variants = {
  primary:
    "bg-gradient-to-r from-accent to-accent/90 text-white shadow-sm hover:from-accent/95 hover:to-accent focus-visible:ring-accent/40",
  secondary:
    "bg-surface border border-border-subtle text-ink shadow-card hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface-muted",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-muted/80",
};

export const Button = forwardRef(function Button(
  { variant = "primary", className = "", href, to, children, ...props },
  ref
) {
  const style =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold tracking-tight transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface " +
    variants[variant] +
    " " +
    className;
  if (to) {
    return (
      <Link ref={ref} to={to} className={style} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={style} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={style} {...props}>
      {children}
    </button>
  );
});

export function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={`rounded-3xl border border-border-subtle/90 bg-surface p-6 shadow-card transition-all duration-300 ease-smooth ${
        hover ? "hover:-translate-y-1 hover:border-accent/25 hover:shadow-float" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function ScrollReveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        )}
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem]">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AnimatedNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.35,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {display.toLocaleString("en-CA")}
      {suffix}
    </span>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface/80 text-ink shadow-sm backdrop-blur-sm hover:border-accent/25"
    >
      <motion.span initial={false} animate={{ opacity: dark ? 1 : 0, rotate: dark ? 0 : 90 }}>
        🌙
      </motion.span>
      <motion.span
        initial={false}
        animate={{ opacity: dark ? 0 : 1, rotate: dark ? -90 : 0 }}
        className="absolute"
      >
        ☀️
      </motion.span>
    </button>
  );
}
