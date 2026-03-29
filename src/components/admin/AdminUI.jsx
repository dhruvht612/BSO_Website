import { motion } from "framer-motion";

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-display text-3xl tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({ title, subtitle, children, action }) {
  return (
    <section className="rounded-2xl border border-border-subtle/80 bg-surface p-5 shadow-card">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            {title && <h3 className="font-display text-xl">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusPill({ value }) {
  const tone =
    value === "active" || value === "published" || value === "resolved"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : value === "inactive" || value === "archived"
        ? "bg-slate-500/20 text-slate-700 dark:text-slate-300"
        : value === "in_progress"
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
          : "bg-accent/15 text-accent";
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>
      {String(value).replaceAll("_", " ")}
    </span>
  );
}

export function Toolbar({ children }) {
  return <div className="mb-4 flex flex-wrap items-center gap-2">{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-10 min-w-[220px] rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none transition focus:border-accent"
    />
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-10 rounded-xl border border-border-subtle bg-surface px-3 text-sm outline-none transition focus:border-accent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-border-subtle bg-surface-muted/40 p-8 text-center"
    >
      <h4 className="font-display text-xl">{title}</h4>
      <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
    </motion.div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-3xl rounded-2xl border border-border-subtle bg-surface p-5 shadow-float"
      >
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-display text-xl">{title}</h4>
          <button type="button" onClick={onClose} className="rounded-lg border border-border-subtle px-2.5 py-1.5 text-sm">
            Close
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
