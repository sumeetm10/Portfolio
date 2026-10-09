"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Sun, Moon } from "lucide-react";

// =============================================================
// ThemeToggle — dark ⇄ light.
// -----------------------------------------------------------
// • Persists to localStorage ("ss-theme"); first visit follows
//   the OS preference (the inline script in layout.tsx applies
//   it before paint, so there's no flash).
// • Where the View Transitions API exists, the new theme wipes in
//   as a circle growing out of the button. Otherwise a short
//   colour cross-fade.
// • Icon does a spin-swap with GSAP.
// • Broadcasts "ss:theme" so other code (terminal) can react.
// =============================================================

export type Theme = "dark" | "light";
export const THEME_EVENT = "ss:theme";

function currentTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

/** Apply a theme with the best available transition. */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  if (currentTheme() === next) return;

  const commit = () => {
    root.classList.toggle("light", next === "light");
    try {
      localStorage.setItem("ss-theme", next);
    } catch {
      /* private mode — theme just won't persist */
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  type VTDoc = Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };
  const doc = document as VTDoc;

  if (!reduced && doc.startViewTransition) {
    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const vt = doc.startViewTransition(commit);
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
    return;
  }

  // Fallback: brief global colour cross-fade
  if (!reduced) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 550);
  }
  commit();
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setThemeState(currentTheme());
    setMounted(true);
    const onChange = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0, scale: 1 },
        { rotation: 360, scale: 1, duration: 0.6, ease: "back.out(1.6)" }
      );
    }
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
      data-cursor-label={isLight ? "DARK" : "LIGHT"}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-accent hover:border-accent/60 transition-colors ${className ?? ""}`}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      <span ref={iconRef} className="inline-flex">
        {mounted && isLight ? <Moon size={15} /> : <Sun size={15} />}
      </span>
    </button>
  );
}
