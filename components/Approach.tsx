"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FluidBackdrop from "./FluidBackdrop";

// =============================================================
// "Approach" — pinned 3D-feeling card field.
// All cards exist in space simultaneously; scroll moves the
// camera through them. Multiple cards visible at once, scaled
// by distance from viewport center.
// =============================================================

type Card = {
  num: string;
  kind: "before" | "after";
  title: string;
  body: string;
};

const cards: Card[] = [
  {
    num: "01",
    kind: "before",
    title: "Ghosting",
    body:
      "Agency promises the world on the kickoff call. Then comes the silence. Slack threads die. The 'tomorrow' that never arrives. You don't even know if anyone's working on it.",
  },
  {
    num: "02",
    kind: "after",
    title: "Visibility",
    body:
      "Weekly written updates. Every commit visible on GitHub. A Loom video the moment something interesting ships. You always know what's done, what's blocked, and why — without having to ask.",
  },
  {
    num: "03",
    kind: "before",
    title: "Over-engineering",
    body:
      "A simple landing page turns into a Kubernetes microservices saga because someone read a blog post. You pay for complexity you don't need, can't debug, and can't maintain after they leave.",
  },
  {
    num: "04",
    kind: "after",
    title: "Right-sized",
    body:
      "The simplest thing that works — then iterate. I'll talk you OUT of complexity that doesn't serve your stage. Your architecture matches your traffic, not someone's resume.",
  },
  {
    num: "05",
    kind: "before",
    title: "Demo-driven dev",
    body:
      "Beautiful in the demo. Falls apart at 9 AM Monday when real users show up. Forms eat data. Real-time features lock up. You only learn this from the angry support tickets.",
  },
  {
    num: "06",
    kind: "after",
    title: "Production-first",
    body:
      "Built for the failure path, the slow path, the catch-up path. Tested against the kind of traffic you'll actually see. The happy path is the easy bit — I build for the rest.",
  },
  {
    num: "07",
    kind: "before",
    title: "Handoff hell",
    body:
      "The dev who built it leaves. Nobody else can change a button color without breaking three things. The code became unmaintainable on day one and you didn't even know.",
  },
  {
    num: "08",
    kind: "after",
    title: "Code anyone can own",
    body:
      "Clean, typed, tested code. Documented decisions you can re-read in six months. Any senior dev can take over in a day. No tribal knowledge required.",
  },
];

// Each card has a fixed X offset + rotation. Y is computed live from scroll.
const layout = [
  { x: -180, rot: -4 },
  { x: 200, rot: 3 },
  { x: -220, rot: -2 },
  { x: 160, rot: 5 },
  { x: -120, rot: -3 },
  { x: 210, rot: 4 },
  { x: -190, rot: -5 },
  { x: 140, rot: 2 },
];

// Vertical distance between adjacent cards (in viewport heights).
// Smaller = more overlap, more "depth" effect, more cards visible at once.
const CARD_GAP_VH = 55;

// Deterministic seeded RNG (no hydration mismatch)
function seeded(s: number) {
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 0xffffffff);
}
const rand = seeded(1337);
const stars = Array.from({ length: 110 }).map(() => ({
  x: rand() * 100,
  y: rand() * 100,
  size: rand() * 1.6 + 0.4,
  opacity: rand() * 0.7 + 0.25,
  twinkle: rand() > 0.85,
}));

export default function Approach() {
  const ref = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const totalScrollVh = (cards.length + 1) * CARD_GAP_VH;
      const endValue = () => "+=" + (totalScrollVh / 100) * window.innerHeight;

      // Cache card refs at mount for fast onUpdate access
      const cardEls = cards
        .map((_, i) => document.getElementById(`approach-card-${i}`))
        .filter(Boolean) as HTMLElement[];

      // One master ScrollTrigger drives everything — counter, card positions,
      // scale, opacity. Manual math avoids per-card trigger conflicts.
      const trigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: endValue,
        pin: ".pin-wrap",
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeFloat = progress * (cards.length - 1);

          // Counter — nearest card index
          const idx = Math.min(
            cards.length - 1,
            Math.round(activeFloat)
          );
          if (counterRef.current) {
            counterRef.current.textContent = `[ ${String(idx + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")} ]`;
          }

          // Reposition every card based on its distance from the active index.
          // distance = 0 means the card is dead-center (full scale).
          // distance grows as the card sits further from the active.
          cardEls.forEach((el, i) => {
            const distance = i - activeFloat;
            const absD = Math.abs(distance);

            // Vertical position: each unit of "distance" pushes the card
            // by CARD_GAP_VH (in vh) up or down from the viewport center.
            const yVh = distance * CARD_GAP_VH;

            // Scale: 1.05 at center, fades to ~0.55 four cards out.
            // Eased so the falloff is gentle near the middle.
            const eased = Math.min(1, absD * 0.45);
            const scale = 1.05 - eased * 0.55;

            // Opacity: full at center, ~0.15 four cards out.
            const opacity = Math.max(0.12, 1 - absD * 0.32);

            // Z-index so closer cards paint on top
            el.style.zIndex = String(100 - Math.round(absD * 10));

            el.style.setProperty("--card-y", `${yVh}vh`);
            el.style.setProperty("--card-scale", String(scale));
            el.style.opacity = String(opacity);
          });
        },
      });

      // Parallax: stars drift slowly opposite to camera, watermark drifts the same way
      gsap.to(".star-field", {
        y: () => -window.innerHeight * 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: endValue,
          scrub: 1,
        },
      });

      gsap.to(".approach-watermark", {
        y: () => window.innerHeight * 0.15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: endValue,
          scrub: 1,
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="approach" className="relative bg-black isolate">
      <div className="pin-wrap relative h-screen overflow-hidden">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#020207] to-black" />

        {/* Flowing fluid backdrop — procedural "video" replacement */}
        <FluidBackdrop />

        {/* Stars */}
        <div className="star-field absolute inset-0 pointer-events-none">
          {stars.map((s, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-white ${s.twinkle ? "animate-pulse-soft" : ""}`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        {/* Watermark */}
        <div className="approach-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display font-bold text-[22vw] leading-none tracking-tighter text-white/[0.025] whitespace-nowrap">
            {"//SUMEET©"}
          </span>
        </div>

        {/* HUD — top-left */}
        <div className="absolute top-8 left-6 lg:left-10 z-[200]">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-accent mb-2">
            <span className="h-px w-8 bg-accent" />
            Chapter 06 — The Difference
          </div>
          <div className="font-display text-xl md:text-2xl font-medium text-ink-muted max-w-xs">
            Working with me vs working with the usual.
          </div>
        </div>

        {/* HUD — top-right (counter) */}
        <div className="absolute top-8 right-6 lg:right-10 z-[200] text-right">
          <span
            ref={counterRef}
            className="font-mono text-sm text-ink-muted block tabular-nums"
          >
            [ 01 / {String(cards.length).padStart(2, "0")} ]
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
            scroll to explore
          </span>
        </div>

        {/* Card field — all 8 cards exist simultaneously, positions driven by scroll */}
        <div className="absolute inset-0">
          {cards.map((card, i) => {
            const pos = layout[i % layout.length];
            const isBefore = card.kind === "before";
            // Initial position: at the very bottom so cards drift in nicely
            const initialY = i * CARD_GAP_VH;
            return (
              <article
                key={i}
                id={`approach-card-${i}`}
                className={`absolute left-1/2 top-1/2 w-[clamp(280px,42vw,520px)] p-6 md:p-9 rounded-2xl border backdrop-blur-md shadow-2xl
                  ${isBefore
                    ? "bg-zinc-900/50 border-zinc-700/40 shadow-zinc-950/40"
                    : "bg-red-950/40 border-red-500/40 shadow-red-900/30"}`}
                style={{
                  transform: `translate(-50%, -50%) translateY(var(--card-y, ${initialY}vh)) translateX(${pos.x}px) rotate(${pos.rot}deg) scale(var(--card-scale, 0.65))`,
                  opacity: 0.2,
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.25em] ${
                      isBefore ? "text-zinc-400" : "text-red-400"
                    }`}
                  >
                    {isBefore ? "Without me" : "With me"}
                  </span>
                  <span
                    className={`font-mono text-xs font-medium ${
                      isBefore ? "text-zinc-400" : "text-red-400"
                    }`}
                  >
                    [{card.num}]
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase mb-4 text-ink">
                  {card.title}.
                </h3>

                <p className="font-mono text-sm md:text-[15px] leading-relaxed text-ink-muted">
                  {card.body}
                </p>

                {!isBefore && (
                  <span
                    aria-hidden
                    className="absolute -top-px -right-px h-6 w-6 border-t-2 border-r-2 border-red-400 rounded-tr-2xl"
                  />
                )}
              </article>
            );
          })}
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[200] font-mono text-[10px] uppercase tracking-[0.3em] text-ink-subtle pointer-events-none">
          ↓ keep scrolling
        </div>
      </div>
    </section>
  );
}
