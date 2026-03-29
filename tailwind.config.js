/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          muted: "rgb(var(--surface-muted) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          gold: "rgb(var(--accent-gold) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        },
        /* shadcn-compatible semantic tokens (used by ui components) */
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        float: "0 8px 32px -8px rgb(15 23 42 / 0.12), 0 4px 16px -4px rgb(15 23 42 / 0.06)",
        "float-dark": "0 8px 32px -8px rgb(0 0 0 / 0.35), 0 4px 16px -4px rgb(0 0 0 / 0.2)",
        card: "0 2px 8px -2px rgb(15 23 42 / 0.08), 0 8px 24px -8px rgb(15 23 42 / 0.06)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 120% 80% at 50% -20%, rgb(var(--accent-soft) / 0.45), transparent 55%), radial-gradient(ellipse 80% 50% at 100% 0%, rgb(var(--accent-gold) / 0.12), transparent 50%), radial-gradient(ellipse 60% 40% at 0% 100%, rgb(var(--accent) / 0.08), transparent 45%)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
