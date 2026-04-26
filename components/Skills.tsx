"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "@/lib/data";

const marqueeStack = [
  "Next.js",
  "React",
  "TypeScript",
  "NestJS",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "Kubernetes",
  "Rust",
  "Prisma",
  "WebSockets",
  "Git",
  "Linux",
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
        scale: 0.8,
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

      {/* Marquee */}
      <div className="relative border-y border-line py-8 overflow-hidden">
        <div className="marquee-track gap-12 whitespace-nowrap">
          {[...marqueeStack, ...marqueeStack].map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-12 text-3xl md:text-5xl font-display font-medium text-ink-subtle hover:text-accent transition-colors"
            >
              {tech}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
