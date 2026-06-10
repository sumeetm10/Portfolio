"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// =============================================================
// CinematicIntro — film-style opening title card.
// -----------------------------------------------------------
// Plays ONCE per browser session (sessionStorage), ~2.6s total,
// skippable with any click/keypress. Dispatches "ss:intro-done"
// so the Hero can hold its entrance until the curtain lifts.
//
// Skipped entirely for repeat visits and prefers-reduced-motion.
// =============================================================

const INTRO_KEY = "ss-intro-seen";
export const INTRO_DONE_EVENT = "ss:intro-done";

function safeGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, v: string) {
  try {
    window.sessionStorage.setItem(key, v);
  } catch {
    /* private mode — intro just replays next visit */
  }
}

export default function CinematicIntro() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Decide once on mount whether the intro should play.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (safeGet(INTRO_KEY) || reduced) {
      if (reduced) safeSet(INTRO_KEY, "1");
      // Anyone waiting on the event shouldn't wait forever.
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      return;
    }
    setShow(true);
  }, []);

  // Run the title sequence when shown.
  useEffect(() => {
    if (!show || !ref.current) return;

    const finish = () => {
      safeSet(INTRO_KEY, "1");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      setShow(false);
    };

    let tl: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      tl = gsap.timeline({ onComplete: finish });
      tl.to(ref.current, { opacity: 1, duration: 0.18, ease: "none" })
        .from(
          ".intro-eyebrow",
          { opacity: 0, y: 14, duration: 0.4, ease: "expo.out" },
          0.15
        )
        .from(
          ".intro-name .char",
          {
            yPercent: 120,
            duration: 0.7,
            stagger: 0.035,
            ease: "expo.out",
          },
          0.3
        )
        .from(
          ".intro-tag",
          { opacity: 0, y: 10, duration: 0.45, ease: "expo.out" },
          "-=0.35"
        )
        .from(
          ".intro-line",
          { scaleX: 0, duration: 0.5, ease: "power3.inOut" },
          "-=0.3"
        )
        .to({}, { duration: 0.35 }) // brief hold on the full card
        .to(".intro-inner", {
          opacity: 0,
          y: -14,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(
          ref.current,
          { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
          "-=0.05"
        );
    }, ref);

    // Any input skips straight to the end (onComplete still fires).
    const skip = () => tl?.progress(1);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      ctx.revert();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden
      className="fixed inset-0 z-[180] bg-bg opacity-0 flex items-center justify-center"
    >
      {/* Soft red glow behind the title */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[680px] rounded-full bg-accent/10 blur-[130px]" />

      <div className="intro-inner relative text-center px-6">
        <div className="intro-eyebrow font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-ink-subtle mb-5">
          A portfolio by
        </div>

        <div className="intro-name overflow-hidden font-display font-medium text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none">
          {Array.from("SUMEET SHRESTHA").map((c, i) => (
            <span key={i} className="char inline-block will-change-transform">
              {c === " " ? " " : c}
            </span>
          ))}
        </div>

        <div className="intro-tag mt-5 font-mono text-xs sm:text-sm text-ink-muted">
          Full-stack developer — told in three acts
        </div>

        <div className="intro-line h-px w-44 bg-accent mx-auto mt-7 origin-center" />

        <div className="mt-10 font-mono text-[9px] uppercase tracking-[0.3em] text-ink-dim">
          click anywhere to skip
        </div>
      </div>
    </div>
  );
}
