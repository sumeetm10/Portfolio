"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MousePointer2, Hand } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

// =============================================================
// Intermission — anime.js-style interactive playground.
//   • DotGrid: click anywhere → radial wave of scale+color ripples
//     out from the click point (anime.js grid-stagger signature).
//   • DraggableBall: throw it around, springs back to center on
//     release with elastic overshoot.
// A breather between the story's acts. Fully interactive.
// =============================================================

const COLS = 19;
const ROWS = 9;

export default function Intermission() {
  const ref = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLButtonElement>(null);
  const ballWrapRef = useRef<HTMLDivElement>(null);
  const [poked, setPoked] = useState(false);

  useGSAP(
    () => {
      // Section entrance
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
        defaults: { ease: "expo.out" },
      });
      tl.from(".inter-eyebrow", { opacity: 0, y: 16, duration: 0.5 })
        .from(".inter-title", { opacity: 0, y: 24, duration: 0.7 }, "-=0.2")
        .from(".inter-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
        .from(
          ".dot",
          {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.7)",
            // immediateRender:false → dots stay visible until the trigger
            // actually fires. If ScrollTrigger never runs (edge timing,
            // trigger skipped), the grid is still shown rather than stuck
            // at scale 0.
            immediateRender: false,
            stagger: { each: 0.004, grid: [ROWS, COLS], from: "center" },
          },
          "-=0.3"
        )
        .from(
          ".inter-ball",
          { scale: 0, duration: 0.6, ease: "back.out(2)", immediateRender: false },
          "-=0.4"
        );

      // Idle breathing pulse on the ball until first interaction.
      const pulse = gsap.to(".inter-ball", {
        scale: 1.08,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Draggable ball with elastic spring-back to origin
      let drag: Draggable | undefined;
      if (ballRef.current) {
        drag = Draggable.create(ballRef.current, {
          type: "x,y",
          bounds: ballWrapRef.current || undefined,
          onPress() {
            pulse.kill(); // stop idle breathing once engaged
            gsap.to(this.target, { scale: 1.15, duration: 0.2, overwrite: "auto" });
          },
          onDragStart() {
            setPoked(true);
          },
          onRelease() {
            // Spring home with elastic overshoot
            gsap.to(this.target, {
              x: 0,
              y: 0,
              scale: 1,
              duration: 1.1,
              ease: "elastic.out(1, 0.4)",
              overwrite: "auto",
            });
          },
        })[0];
      }

      // useGSAP auto-reverts tweens in scope, but NOT Draggable instances —
      // kill it explicitly so its listeners don't leak on unmount.
      return () => {
        drag?.kill();
      };
    },
    { scope: ref }
  );

  // Radial wave on grid click — the anime.js grid-stagger effect,
  // recomputed live from the actual click coordinates.
  const rippleFrom = (clientX: number, clientY: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const dots = grid.querySelectorAll<HTMLElement>(".dot");
    // Kill any in-flight ripple so rapid clicks don't stack unbounded
    // timelines on the same dots.
    gsap.killTweensOf(dots);
    let maxDist = 1;
    const dists: number[] = [];
    dots.forEach((dot) => {
      const r = dot.getBoundingClientRect();
      const dx = r.left + r.width / 2 - clientX;
      const dy = r.top + r.height / 2 - clientY;
      const d = Math.hypot(dx, dy);
      dists.push(d);
      if (d > maxDist) maxDist = d;
    });
    // Resting dot colour comes from the active theme (--c-ink at 14%),
    // so the wave settles back correctly in both dark and light mode.
    const ink = getComputedStyle(document.documentElement)
      .getPropertyValue("--c-ink")
      .trim()
      .split(/\s+/)
      .join(",");
    const restColor = `rgba(${ink},0.14)`;
    dots.forEach((dot, i) => {
      const delay = (dists[i] / maxDist) * 0.35;
      gsap
        .timeline({ delay })
        .to(dot, {
          scale: 2.4,
          backgroundColor: "rgb(239,68,68)",
          duration: 0.22,
          ease: "power2.out",
        })
        .to(dot, {
          scale: 1,
          backgroundColor: restColor,
          duration: 0.5,
          ease: "power2.inOut",
          // Hand colour back to the CSS class so a later theme switch applies
          clearProps: "backgroundColor",
        });
    });
    setPoked(true);
  };

  return (
    <section
      ref={ref}
      id="intermission"
      className="relative py-28 px-6 lg:px-10 overflow-hidden"
      aria-label="Interactive intermission"
    >
      <div className="max-w-5xl mx-auto text-center mb-12">
        <div className="inter-eyebrow inline-flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-[0.3em] text-accent">
          <span className="h-px w-8 bg-accent" />
          Intermission
          <span className="h-px w-8 bg-accent" />
        </div>
        <h2 className="inter-title font-display font-medium text-display-md tracking-tight">
          Go on — poke it.
        </h2>
        <p className="inter-sub mt-4 font-mono text-sm text-ink-muted">
          {poked ? (
            <span className="text-accent">Nice. Now drag the ball around.</span>
          ) : (
            <>Click the grid. Drag the ball. Everything here reacts.</>
          )}
        </p>
      </div>

      {/* Interactive stage */}
      <div className="relative max-w-5xl mx-auto">
        {/* Dot grid */}
        <div
          ref={gridRef}
          onClick={(e) => rippleFrom(e.clientX, e.clientY)}
          className="relative grid gap-3 sm:gap-4 p-8 sm:p-12 rounded-3xl border border-line bg-bg-soft/20 cursor-pointer select-none"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          role="button"
          tabIndex={0}
          aria-label="Click to send a ripple across the dot grid"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              const r = gridRef.current!.getBoundingClientRect();
              rippleFrom(r.left + r.width / 2, r.top + r.height / 2);
            }
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => (
            <span
              key={i}
              className="dot mx-auto h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-ink/[0.14]"
              style={{ willChange: "transform" }}
            />
          ))}

          {/* Draggable ball floats over the grid */}
          <div
            ref={ballWrapRef}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <button
              ref={ballRef}
              aria-label="Draggable ball — throw it, it springs back"
              className="inter-ball pointer-events-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-accent-gradient shadow-lg shadow-accent/30 grid place-items-center cursor-grab active:cursor-grabbing"
              style={{ willChange: "transform" }}
            >
              <Hand size={20} className="text-bg" />
            </button>
          </div>
        </div>

        {/* Corner hint */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-mono text-ink-subtle">
          <MousePointer2 size={12} />
          click grid · drag ball · it all springs back
        </div>
      </div>
    </section>
  );
}
