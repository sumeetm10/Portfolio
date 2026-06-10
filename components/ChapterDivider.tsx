"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// =============================================================
// ChapterDivider — full-bleed act interstitial.
// A film-style "ACT II — THE WORK" slate between page sections:
// giant roman-numeral watermark with scroll parallax, ruled
// lines that draw outward from a center diamond, title rising
// out of an overflow mask.
// =============================================================

interface Props {
  /** Anchor id so the StoryRail can target it (e.g. "act-2") */
  id: string;
  /** Eyebrow label, e.g. "ACT II" */
  act: string;
  /** Roman numeral watermark behind the text, e.g. "II" */
  numeral: string;
  /** Big title, e.g. "The Work" */
  title: string;
  /** One-line subtitle under the rule */
  sub?: string;
}

export default function ChapterDivider({ id, act, numeral, title, sub }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Reveal timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
        },
        defaults: { ease: "expo.out" },
      });

      tl.from(".divider-act", { opacity: 0, y: 16, duration: 0.5 })
        .from(
          ".divider-title",
          { yPercent: 120, duration: 0.9 },
          "-=0.25"
        )
        .from(
          ".divider-rule",
          { scaleX: 0, duration: 0.7, ease: "power3.inOut" },
          "-=0.5"
        )
        .from(
          ".divider-diamond",
          { scale: 0, rotation: 180, duration: 0.6, ease: "back.out(2)" },
          "-=0.55"
        )
        .from(".divider-sub", { opacity: 0, y: 12, duration: 0.5 }, "-=0.3");

      // Watermark drifts slower than scroll (parallax depth)
      gsap.fromTo(
        ".divider-numeral",
        { yPercent: 18 },
        {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id={id}
      aria-label={`${act} — ${title}`}
      className="relative h-[62vh] min-h-[420px] flex items-center justify-center overflow-hidden"
    >
      {/* Roman numeral watermark */}
      <div
        aria-hidden
        className="divider-numeral pointer-events-none select-none absolute inset-0 flex items-center justify-center"
      >
        <span className="font-display font-bold text-[44vh] leading-none text-white/[0.03]">
          {numeral}
        </span>
      </div>

      {/* Soft red wash */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[560px] rounded-full bg-accent/[0.07] blur-[110px]" />

      <div className="relative text-center px-6">
        <div className="divider-act font-mono text-xs uppercase tracking-[0.45em] text-accent mb-5">
          {act}
        </div>

        <h2 className="overflow-hidden">
          <span className="divider-title block font-display font-medium text-display-md tracking-tight">
            {title}
          </span>
        </h2>

        {/* Rule with center diamond */}
        <div className="relative mt-7 flex items-center justify-center gap-3">
          <span className="divider-rule h-px w-24 sm:w-36 bg-gradient-to-r from-transparent to-accent/60 origin-right" />
          <span className="divider-diamond h-1.5 w-1.5 rotate-45 bg-accent" />
          <span className="divider-rule h-px w-24 sm:w-36 bg-gradient-to-l from-transparent to-accent/60 origin-left" />
        </div>

        {sub && (
          <p className="divider-sub mt-5 font-mono text-xs sm:text-sm text-ink-subtle">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}
