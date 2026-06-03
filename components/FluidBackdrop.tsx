"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// =============================================================
// FluidBackdrop
// -----------------------------------------------------------
// Procedural alternative to a background <video>. Layers 7 large
// heavily-blurred colored blobs that drift independently via
// GSAP `random()` + `repeatRefresh`. Looks like flowing fluid /
// aurora video, costs zero bandwidth, scales to any viewport.
// =============================================================

type Blob = {
  /** Tailwind background colour class (with alpha) */
  color: string;
  /** Initial position percent of container */
  top: string;
  left: string;
  /** Size (viewport-width units — blobs are huge & blurry by design) */
  size: number;
  /** Blur radius in px */
  blur: number;
  /** Animation duration in seconds (variety keeps motion organic) */
  duration: number;
  /** Stagger delay to break up sync */
  delay: number;
};

const blobs: Blob[] = [
  { color: "bg-sky-500/30",    top: "8%",  left: "8%",  size: 62, blur: 130, duration: 14, delay: 0.0 },
  { color: "bg-blue-600/25",   top: "55%", left: "60%", size: 55, blur: 150, duration: 18, delay: 0.6 },
  { color: "bg-indigo-500/22", top: "65%", left: "10%", size: 50, blur: 120, duration: 16, delay: 1.1 },
  { color: "bg-cyan-400/20",   top: "20%", left: "55%", size: 60, blur: 140, duration: 20, delay: 0.4 },
  { color: "bg-fuchsia-500/12", top: "40%", left: "30%", size: 45, blur: 110, duration: 22, delay: 1.8 },
  { color: "bg-rose-500/15",   top: "78%", left: "35%", size: 48, blur: 130, duration: 24, delay: 0.9 },
  { color: "bg-violet-500/15", top: "25%", left: "75%", size: 52, blur: 140, duration: 19, delay: 1.4 },
];

export default function FluidBackdrop() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const els = ref.current?.querySelectorAll<HTMLDivElement>(".fluid-blob");
      if (!els || !els.length) return;

      els.forEach((el, i) => {
        const cfg = blobs[i];
        // Each blob drifts in a random circular/elliptical path.
        // repeatRefresh: true → random() values re-roll on every iteration,
        // so the motion never repeats the same path. Looks like fluid.
        gsap.to(el, {
          xPercent: "random(-30, 30)",
          yPercent: "random(-25, 25)",
          scale: "random(0.75, 1.35)",
          duration: cfg.duration,
          delay: cfg.delay,
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Slow rotation for extra organic feel
        gsap.to(el, {
          rotation: "random(-25, 25)",
          duration: cfg.duration * 1.4,
          delay: cfg.delay,
          repeat: -1,
          repeatRefresh: true,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`fluid-blob absolute rounded-full ${b.color}`}
          style={{
            top: b.top,
            left: b.left,
            width: `${b.size}vw`,
            height: `${b.size}vw`,
            filter: `blur(${b.blur}px)`,
            willChange: "transform",
            transform: "translate3d(0,0,0)", // GPU layer hint
          }}
        />
      ))}

      {/* Subtle vignette so cards stay readable in the center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 80%)",
        }}
      />
    </div>
  );
}
