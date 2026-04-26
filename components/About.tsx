"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { about, siteConfig } from "@/lib/data";

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".about-paragraph", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-text",
          start: "top 80%",
        },
      });

      gsap.from(".about-stat", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-stats",
          start: "top 85%",
        },
      });

      gsap.from(".about-image", {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".about-image",
          start: "top 85%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <SectionHeading
        eyebrow="01 — About"
        title={about.heading}
        description="A bit about who I am, how I work, and what I'm building toward."
      />

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="about-text lg:col-span-7 space-y-6">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className="about-paragraph text-lg md:text-xl text-ink-muted leading-relaxed"
            >
              {p}
            </p>
          ))}

          <div className="about-stats grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-6 border-t border-line">
            {about.stats.map((s) => (
              <div key={s.label} className="about-stat">
                <div className="font-display text-3xl md:text-4xl font-medium text-ink">
                  {s.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-image lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-line glow-ring">
            <Image
              src={siteConfig.avatar}
              alt={`${siteConfig.name} — ${siteConfig.role}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-50" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs font-mono uppercase tracking-widest text-accent mb-1">
                Currently
              </div>
              <div className="text-ink font-medium">
                Senior Developer @ NepseTrading
              </div>
              <div className="text-ink-muted text-sm">
                Studying BCSIT @ Shubhashree College
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
