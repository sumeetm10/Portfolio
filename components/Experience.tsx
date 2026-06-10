"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { experience } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Experience() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Timeline line draw
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 70%",
          end: "bottom 70%",
          scrub: 0.5,
        },
      });

      // Each entry reveal
      gsap.utils.toArray<HTMLElement>(".timeline-entry").forEach((entry) => {
        gsap.from(entry, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 80%",
          },
        });
      });

      // Dot pop
      gsap.utils.toArray<HTMLElement>(".timeline-dot").forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: dot,
            start: "top 75%",
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="experience"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <SectionHeading
        eyebrow="Chapter 03 — The Road Here"
        title="Where I've been, what I'm building."
        description="A short trail of work, learning, and shipping in production."
      />

      <div className="timeline-container relative pl-8 md:pl-12">
        {/* Vertical line */}
        <div className="timeline-line absolute left-[7px] md:left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" />

        {experience.map((entry, i) => (
          <article
            key={`${entry.company}-${i}`}
            className="timeline-entry relative pb-16 last:pb-0"
          >
            {/* Dot */}
            <span
              className="timeline-dot absolute -left-8 md:-left-12 top-2 flex h-4 w-4 items-center justify-center"
              aria-hidden
            >
              <span className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-soft" />
              <span className="relative h-3 w-3 rounded-full bg-accent ring-4 ring-bg" />
            </span>

            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-3">
                <div className="text-xs font-mono uppercase tracking-widest text-accent">
                  {entry.period}
                </div>
                <div className="text-sm text-ink-subtle mt-1">{entry.location}</div>
              </div>

              <div className="md:col-span-9">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
                    {entry.role}
                  </h3>
                  <span className="text-ink-subtle">@</span>
                  <a
                    href={entry.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-glow inline-flex items-center gap-1 magnetic-underline"
                  >
                    {entry.company}
                    <ArrowUpRight size={16} />
                  </a>
                </div>

                <p className="mt-3 text-ink-muted leading-relaxed">
                  {entry.description}
                </p>

                <ul className="mt-5 space-y-2">
                  {entry.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-sm md:text-base text-ink-muted"
                    >
                      <span className="text-accent select-none">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono px-2.5 py-1 rounded-full border border-line bg-bg-soft/50 text-ink-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
