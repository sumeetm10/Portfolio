import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050507",
          soft: "#0a0a0f",
          elevated: "#101015",
        },
        ink: {
          DEFAULT: "#f5f5f7",
          muted: "#a1a1aa",
          subtle: "#71717a",
          dim: "#52525b",
        },
        line: "rgba(255,255,255,0.08)",
        accent: {
          DEFAULT: "#ef4444",
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
        "grid-pattern": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(239,68,68,0.15), transparent 60%)",
        "accent-gradient": "linear-gradient(135deg, #ef4444 0%, #f87171 50%, #dc2626 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
