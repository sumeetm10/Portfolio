"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// =============================================================
// StoryRail — fixed act tracker on the right edge (desktop only).
// Shows where the reader is in the story; click a dot to jump.
// Active detection: the last stop whose element top has crossed
// the viewport's vertical center wins.
// =============================================================

const STOPS = [
  { id: "top", label: "Prologue" },
  { id: "act-1", label: "Act I · The Person" },
  { id: "act-2", label: "Act II · The Work" },
  { id: "act-3", label: "Act III · The Partnership" },
  { id: "contact", label: "Epilogue" },
];

export default function StoryRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // --- active stop tracking (rAF-throttled scroll listener) ----------
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let current = 0;
      STOPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // --- entrance ---------------------------------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dots = el.querySelectorAll(".rail-stop");
    const tween = gsap.from(dots, {
      opacity: 0,
      x: 16,
      duration: 0.6,
      stagger: 0.08,
      delay: 1.6,
      ease: "expo.out",
    });
    return () => {
      tween.kill();
    };
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={ref}
      aria-label="Story progress"
      className="hidden lg:flex fixed right-7 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-4"
    >
      {STOPS.map((s, i) => {
        const isActive = i === active;
        return (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive ? "true" : undefined}
            className="rail-stop group flex items-center gap-3"
          >
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.25em] whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "opacity-100 text-accent translate-x-0"
                  : "opacity-0 group-hover:opacity-70 text-ink-subtle translate-x-1"
              }`}
            >
              {s.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "h-2.5 w-2.5 bg-accent shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                  : "h-1.5 w-1.5 bg-ink-subtle/50 group-hover:bg-ink-muted"
              }`}
            />
          </button>
        );
      })}

      {/* Thin guide line behind the dots */}
      <span
        aria-hidden
        className="absolute right-[2.5px] top-0 bottom-0 -z-10 w-px bg-gradient-to-b from-transparent via-line to-transparent"
      />
    </div>
  );
}
