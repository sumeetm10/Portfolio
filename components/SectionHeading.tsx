"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        });
        tl.from(".heading-eyebrow", {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
        })
          .from(
            ".heading-title",
            { opacity: 0, y: 30, duration: 0.9, ease: "expo.out" },
            "-=0.4"
          )
          .from(
            ".heading-desc",
            { opacity: 0, y: 20, duration: 0.7, ease: "expo.out" },
            "-=0.5"
          );
      }, ref);
      return () => ctx.revert();
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={`mb-16 ${align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}
    >
      <div className="heading-eyebrow inline-flex items-center gap-2 mb-4 text-xs font-mono uppercase tracking-widest text-accent">
        <span className="h-px w-8 bg-accent" />
        {eyebrow}
      </div>
      <h2 className="heading-title font-display font-medium text-display-md tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="heading-desc mt-4 text-lg text-ink-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
