"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "@/lib/data";

const marqueeRow1 = [
  "Next.js", "React", "TypeScript", "NestJS", "Node.js", "PostgreSQL",
  "Tailwind CSS", "Docker", "Prisma", "WebSockets",
];
const marqueeRow2 = [
  "Rust", "Kubernetes", "Git", "Linux", "REST APIs", "GSAP",
  "Vercel", "CI/CD", "System Design", "HTML5",
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".skill-card", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 80%",
        },
      });

      gsap.from(".skill-pill", {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        stagger: 0.02,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 70%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} id="skills" className="relative py-32 overflow-hidden">
      <div className="px-6 lg:px-10 max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="02 — Stack"
          title="Tools I reach for."
          description="I prefer to go deep on a few tools rather than know everything shallowly. The stack below is what I ship with daily — plus a few things I'm actively learning."
        />

        <div className="skills-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="skill-card group relative p-6 rounded-2xl border border-line bg-bg-soft/30 backdrop-blur-sm hover:border-accent/40 transition-colors"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
                {group.title}
              </div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="skill-pill flex items-center justify-between text-sm"
                  >
                    <span className="text-ink">{item.name}</span>
                    <span className="text-xs text-ink-subtle font-mono">
                      {item.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Dual marquee — row 1 left, row 2 right */}
      <div className="relative border-y border-line py-6 overflow-hidden space-y-2">
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg to-transparent z-10" />

        <Marquee items={marqueeRow1} direction="left" />
        <Marquee items={marqueeRow2} direction="right" />
      </div>
    </section>
  );
}

function Marquee({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  // Double the items for seamless loop
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-track gap-10 whitespace-nowrap ${direction === "right" ? "reverse" : ""}`}>
      {doubled.map((tech, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-10 text-3xl md:text-5xl font-display font-medium text-ink-subtle hover:text-accent transition-colors cursor-default"
        >
          {tech}
          <span className="text-accent">✦</span>
        </span>
      ))}
    </div>
  );
}
