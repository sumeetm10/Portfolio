"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

// Routes where the native cursor should stay (e.g. printable resume).
const NATIVE_CURSOR_ROUTES = ["/resume"];

// Selectors that should switch the cursor into "interactive" mode.
const INTERACTIVE_SEL = "a, button, [role='button'], [data-cursor='hover'], summary, label";
const TEXT_SEL = "input[type='text'], input[type='email'], input[type='search'], input:not([type]), textarea";

/**
 * Build the label that pops up next to the cursor on hover.
 * Reads either `data-cursor-label` for an explicit override, or infers
 * from the tag/href.
 */
function labelFor(el: HTMLElement): string {
  const override = el.dataset.cursorLabel;
  if (override) return override.toUpperCase();

  if (el.tagName === "A") {
    const href = el.getAttribute("href") || "";
    if (href.startsWith("mailto:")) return "EMAIL";
    if (/^https?:\/\//.test(href)) return "OPEN ↗";
    if (href.startsWith("#")) return "JUMP";
    return "OPEN";
  }
  if (el.tagName === "BUTTON") {
    return el.getAttribute("aria-label")?.toUpperCase().slice(0, 14) || "CLICK";
  }
  return "VIEW";
}

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const ibeamRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const skip = NATIVE_CURSOR_ROUTES.some((r) => pathname?.startsWith(r));

  // -------------------------------------------------------------------
  // 1. Decide whether to mount at all
  // -------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skip) {
      document.body.classList.remove("has-custom-cursor");
      setEnabled(false);
      return;
    }
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fineHover) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }
    document.body.classList.add("has-custom-cursor");
    setEnabled(true);
  }, [skip]);

  // -------------------------------------------------------------------
  // 2. Position tracking + state transitions
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    const reticle = reticleRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const ibeam = ibeamRef.current;
    if (!cursor || !reticle || !ring || !dot || !label || !ibeam) return;

    // Hardware-accelerated position followers
    const setX = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power3.out" });
    const setY = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };

    // Continuous slow rotation of the reticle (target-finder vibe)
    const spin = gsap.to(reticle, {
      rotation: 360,
      duration: 22,
      repeat: -1,
      ease: "none",
    });

    // ---------- state transitions ----------
    const toDefault = () => {
      gsap.to(".cursor-line", { scale: 1, opacity: 0.9, duration: 0.3, ease: "power3.out" });
      gsap.to(ring, { scale: 1, opacity: 0, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(label, { opacity: 0, x: -6, duration: 0.2 });
      gsap.to(ibeam, { opacity: 0, scaleY: 0, duration: 0.2 });
      spin.timeScale(1);
    };

    const toInteractive = (text: string) => {
      gsap.to(".cursor-line", { scale: 0, opacity: 0, duration: 0.25, ease: "power3.in" });
      gsap.to(ring, { scale: 2.4, opacity: 0.85, duration: 0.45, ease: "elastic.out(1, 0.55)" });
      gsap.to(dot, { scale: 0.6, opacity: 0.8, duration: 0.25 });
      gsap.to(ibeam, { opacity: 0, scaleY: 0, duration: 0.2 });
      label.textContent = text;
      gsap.to(label, { opacity: 1, x: 0, duration: 0.3, delay: 0.05 });
      spin.timeScale(0); // freeze rotation on hover
    };

    const toText = () => {
      gsap.to(".cursor-line", { scale: 0, opacity: 0, duration: 0.2 });
      gsap.to(ring, { scale: 0.4, opacity: 0.3, duration: 0.2 });
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
      gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(ibeam, { opacity: 1, scaleY: 1, duration: 0.2 });
    };

    // Click pulse — quick contract + bounce
    const onDown = () => {
      gsap.to(ring, { scale: "*=0.7", duration: 0.12, ease: "power2.out", overwrite: "auto" });
      gsap.to(dot, { scale: "*=2", duration: 0.12, ease: "power2.out", overwrite: "auto" });
    };
    const onUp = () => {
      gsap.to(ring, { scale: "+=0", duration: 0.25, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
      gsap.to(dot, { scale: 1, duration: 0.25, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
    };

    // ---------- delegated hover detection ----------
    // Uses mouseover/mouseout (bubble) so dynamic content (terminal modal,
    // mobile menu, etc.) gets the right cursor without re-binding.
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const textEl = t.closest(TEXT_SEL) as HTMLElement | null;
      if (textEl) {
        toText();
        return;
      }
      const intEl = t.closest(INTERACTIVE_SEL) as HTMLElement | null;
      if (intEl) {
        toInteractive(labelFor(intEl));
        return;
      }
    };
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const related = e.relatedTarget as HTMLElement | null;
      if (!t) return;
      const wasInteractive = t.closest(`${INTERACTIVE_SEL}, ${TEXT_SEL}`);
      const stillInteractive = related?.closest(`${INTERACTIVE_SEL}, ${TEXT_SEL}`);
      if (wasInteractive && wasInteractive !== stillInteractive) {
        toDefault();
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      spin.kill();
    };
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[120] h-10 w-10 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: "transform" }}
    >
      {/* Slowly-rotating reticle (4 line segments forming a +) */}
      <div ref={reticleRef} className="absolute inset-0">
        {/* top */}
        <span className="cursor-line absolute left-1/2 top-0 -translate-x-1/2 h-2.5 w-px bg-accent origin-bottom" />
        {/* bottom */}
        <span className="cursor-line absolute left-1/2 bottom-0 -translate-x-1/2 h-2.5 w-px bg-accent origin-top" />
        {/* left */}
        <span className="cursor-line absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-px bg-accent origin-right" />
        {/* right */}
        <span className="cursor-line absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-px bg-accent origin-left" />
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[3px] w-[3px] rounded-full bg-accent"
      />

      {/* Expanding ring (revealed on hover) */}
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-accent opacity-0"
      />

      {/* I-beam (for text inputs) */}
      <div
        ref={ibeamRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-px bg-accent opacity-0 origin-center"
        style={{ transform: "translate(-50%, -50%) scaleY(0)" }}
      />

      {/* Label that appears next to the cursor on hover */}
      <div
        ref={labelRef}
        className="absolute left-full top-1/2 ml-4 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.2em] text-accent border border-accent/60 rounded bg-bg/30 backdrop-blur-sm whitespace-nowrap opacity-0"
        style={{ transform: "translate(-6px, -50%)" }}
      >
        CLICK
      </div>
    </div>
  );
}
