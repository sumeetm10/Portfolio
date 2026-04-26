"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { services, siteConfig } from "@/lib/data";
import { ArrowUpRight, Check } from "lucide-react";

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".service-card", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <SectionHeading
        eyebrow="05 — Services"
        title="Available for freelance."
        description="I'm taking on a small number of freelance projects alongside my full-time role. If you need something built fast and built right, here's how I can help."
      />

      <div className="services-grid grid sm:grid-cols-2 gap-5">
        {services.map((s) => (
          <div
            key={s.title}
            className="service-card group relative p-7 md:p-8 rounded-2xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors"
          >
            <h3 className="font-display text-2xl font-medium tracking-tight mb-3">
              {s.title}
            </h3>
            <p className="text-ink-muted leading-relaxed mb-6">
              {s.description}
            </p>
            <ul className="space-y-2">
              {s.deliverables.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <Check
                    size={14}
                    className="text-accent flex-shrink-0"
                    strokeWidth={2.5}
                  />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 rounded-2xl border border-accent/30 bg-accent/5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-1">
            Currently accepting projects
          </div>
          <div className="text-lg text-ink">
            Have something in mind? Let&apos;s figure out if we&apos;re a fit.
          </div>
        </div>
        <a
          href={siteConfig.links.email}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:bg-accent transition-colors"
        >
          Start a conversation <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
