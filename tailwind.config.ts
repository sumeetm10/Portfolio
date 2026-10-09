import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme tokens are CSS variables (RGB channels) so dark/light swap
        // at runtime and Tailwind opacity modifiers (bg-bg/80) still work.
        // Values live in app/globals.css (:root = dark, html.light = light).
        bg: {
          DEFAULT: "rgb(var(--c-bg) / <alpha-value>)",
          soft: "rgb(var(--c-bg-soft) / <alpha-value>)",
          elevated: "rgb(var(--c-bg-elevated) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
          subtle: "rgb(var(--c-ink-subtle) / <alpha-value>)",
          dim: "rgb(var(--c-ink-dim) / <alpha-value>)",
        },
        line: "rgb(var(--c-ink) / var(--line-alpha))",
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          glow: "#f87171",
          deep: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "system-ui"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
      },
      animation: {
        "marquee": "marquee 40s linear infinite",
        "shine": "shine 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shine: {
          "0%, 100%": { backgroundPosition: "200% 0" },
          "50%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgb(var(--c-ink) / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-ink) / 0.03) 1px, transparent 1px)",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(239,68,68,0.15), transparent 60%)",
        "accent-gradient": "linear-gradient(135deg, #ef4444 0%, #f87171 50%, #dc2626 100%)",
      },
    },
  },
  plugins: [typography],
};

export default config;
