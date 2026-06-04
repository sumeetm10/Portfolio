"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { about, siteConfig } from "@/lib/data";

// =============================================================
// About — cinematic image composition
// -----------------------------------------------------------
// New layout:
//   Background:  big "FULL-STACK · DEVELOPER" marquee text
//   Left col:    bio paragraphs
//   Right col:   photo with corner brackets + scanline + 4 floating chips
//   Below:       full-width stat row with animated counters
// =============================================================

function parseStat(value: string): { number: number | null; suffix: string } {
  const m = value.match(/^(\d+)(.*)$/);
  if (!m) return { number: null, suffix: value };
  return { number: parseInt(m[1], 10), suffix: m[2] };
}

// Marquee row repeated so it loops seamlessly
const marqueeText = "FULL-STACK · DEVELOPER · ";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // -------------------- Entrance animations --------------------
      gsap.from(".about-paragraph", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-text", start: "top 80%" },
      });

      gsap.from(".about-stat", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-stats", start: "top 85%" },
      });

      // Animated counter for stats with digits
      gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.target || "0");
        const suffix = el.dataset.suffix || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });

      // -------------------- Photo entrance --------------------
      gsap.from(".about-photo", {
        opacity: 0,
        scale: 0.85,
        rotation: -3,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
      });

      // Corner brackets pop in
      gsap.from(".photo-bracket", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.6,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".about-photo", start: "top 85%" },
      });

      // Chip entrance — each one pops in from a random angle
      gsap.from(".about-chip", {
        opacity: 0,
        scale: 0,
        rotation: () => gsap.utils.random(-25, 25),
        y: () => gsap.utils.random(30, 60),
        duration: 0.9,
        stagger: 0.15,
        ease: "back.out(1.6)",
        delay: 0.4,
        scrollTrigger: { trigger: ".photo-composition", start: "top 75%" },
      });

      // -------------------- Continuous (idle) animations --------------------

      // Photo gently bobs up and down
      gsap.to(".about-photo", {
        y: -8,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.4, // after entrance settles
      });

      // Scanline sweeps across the photo every ~5s
      gsap.set(".photo-scanline", { top: "0%" });
      gsap.to(".photo-scanline", {
        top: "100%",
        duration: 3.5,
        repeat: -1,
        ease: "none",
        repeatDelay: 1.5,
      });

      // REC indicator pulses
      gsap.to(".rec-dot", {
        opacity: 0.3,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Each chip drifts subtly on its own rhythm
      gsap.utils.toArray<HTMLElement>(".about-chip").forEach((chip, i) => {
        gsap.to(chip, {
          y: `+=${gsap.utils.random(-10, 10)}`,
          rotation: `+=${gsap.utils.random(-2, 2)}`,
          duration: gsap.utils.random(4, 7),
          delay: 1.2 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // -------------------- Mouse parallax on the photo composition --------------------
      const comp = compositionRef.current;
      if (comp) {
        const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (fineHover) {
          // NB: parallax is intentionally applied ONLY to the photo, not the
          // chips. Animating .about-chip's y here would overwrite the chips'
          // continuous Y-drift tween (they share the y property), killing the
          // ambient float after the first hover.
          const onMove = (e: MouseEvent) => {
            const r = comp.getBoundingClientRect();
            const x = (e.clientX - (r.left + r.width / 2)) / r.width;
            const y = (e.clientY - (r.top + r.height / 2)) / r.height;
            gsap.to(".about-photo", {
              rotateY: x * 6,
              rotateX: -y * 6,
              duration: 0.6,
              ease: "power2.out",
              transformPerspective: 1000,
              overwrite: "auto",
            });
          };
          const onLeave = () => {
            gsap.to(".about-photo", {
              rotateY: 0,
              rotateX: 0,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });
          };
          comp.addEventListener("mousemove", onMove);
          comp.addEventListener("mouseleave", onLeave);
          return () => {
            comp.removeEventListener("mousemove", onMove);
            comp.removeEventListener("mouseleave", onLeave);
          };
        }
      }
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto overflow-hidden"
    >
      <SectionHeading
        eyebrow="01 — About"
        title={about.heading}
        description="A bit about who I am, how I work, and what I'm building toward."
      />

      {/* Background watermark marquee — slowly scrolls behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden select-none"
      >
        <div className="marquee-track text-[16vw] lg:text-[14vw] font-display font-bold tracking-tighter text-white/[0.025] whitespace-nowrap leading-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-block pr-8">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left — bio paragraphs */}
        <div className="about-text lg:col-span-6 space-y-6">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className="about-paragraph text-lg md:text-xl text-ink-muted leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>

        {/* Right — photo composition with floating chips */}
        <div
          ref={compositionRef}
          className="photo-composition lg:col-span-6 relative flex items-center justify-center min-h-[560px]"
        >
          {/* Main photo container */}
          <div
            ref={photoRef}
            className="about-photo relative w-[280px] sm:w-[340px] lg:w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-line will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <Image
              src={siteConfig.avatar}
              alt={`${siteConfig.name} — ${siteConfig.role}`}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority={false}
            />

            {/* Subtle accent vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
              }}
            />

            {/* Scanline */}
            <div
              className="photo-scanline absolute inset-x-0 h-[2px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(239,68,68,0.7), transparent)",
                boxShadow: "0 0 12px rgba(239,68,68,0.6)",
              }}
            />

            {/* REC indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-accent">
              <span className="rec-dot h-1.5 w-1.5 rounded-full bg-accent" />
              REC
            </div>

            {/* Timecode-style label */}
            <div className="absolute top-3 right-3 font-mono text-[10px] text-accent/70">
              00:01:42:18
            </div>

            {/* Corner brackets — viewfinder feel */}
            <span className="photo-bracket absolute top-2 left-2 h-3 w-3 border-l-2 border-t-2 border-accent" />
            <span className="photo-bracket absolute top-2 right-2 h-3 w-3 border-r-2 border-t-2 border-accent" />
            <span className="photo-bracket absolute bottom-2 left-2 h-3 w-3 border-l-2 border-b-2 border-accent" />
            <span className="photo-bracket absolute bottom-2 right-2 h-3 w-3 border-r-2 border-b-2 border-accent" />
          </div>

          {/* Floating chips around the photo */}
          <FloatingChip
            className="absolute top-[6%] -right-2 sm:-right-6"
            icon={<Briefcase size={12} className="text-emerald-400" />}
            eyebrow="Working at"
            label="NepseTrading"
            sublabel="Senior Developer"
          />

          <FloatingChip
            className="absolute top-[34%] -left-4 sm:-left-10"
            icon={<MapPin size={12} className="text-red-400" />}
            eyebrow="Based in"
            label="Kathmandu"
            sublabel="Nepal · GMT+5:45"
          />

          <FloatingChip
            className="absolute bottom-[18%] -right-4 sm:-right-12"
            icon={<GraduationCap size={12} className="text-amber-400" />}
            eyebrow="Studying"
            label="BCSIT"
            sublabel="Shubhashree College"
          />

          <FloatingChip
            className="absolute bottom-[2%] left-2 sm:-left-4"
            icon={<Sparkles size={12} className="text-accent" />}
            eyebrow="Status"
            label="Open to freelance"
            sublabel="Replies in ~24h"
            pulse
          />
        </div>
      </div>

      {/* Stats row — full width, below */}
      <div className="about-stats relative mt-20 pt-10 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-6">
        {about.stats.map((s) => {
          const { number, suffix } = parseStat(s.value);
          return (
            <div key={s.label} className="about-stat">
              {number !== null ? (
                <div
                  className="font-display text-4xl md:text-5xl font-medium text-ink tabular-nums"
                  data-counter
                  data-target={number}
                  data-suffix={suffix}
                >
                  0{suffix}
                </div>
              ) : (
                <div className="font-display text-4xl md:text-5xl font-medium text-ink">
                  {s.value}
                </div>
              )}
              <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mt-2">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// =============================================================
// FloatingChip — small info card that floats around the photo
// =============================================================
function FloatingChip({
  className,
  icon,
  eyebrow,
  label,
  sublabel,
  pulse = false,
}: {
  className?: string;
  icon: React.ReactNode;
  eyebrow: string;
  label: string;
  sublabel: string;
  pulse?: boolean;
}) {
  return (
    <div
      className={`about-chip rounded-xl border border-line bg-bg-soft/90 backdrop-blur-md p-3 pl-3.5 pr-4 shadow-lg shadow-black/20 will-change-transform ${className ?? ""}`}
      style={{ minWidth: 160 }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {pulse && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
        )}
        {icon}
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-ink-subtle">
          {eyebrow}
        </span>
      </div>
      <div className="font-medium text-sm text-ink leading-tight">{label}</div>
      <div className="text-[11px] text-ink-muted mt-0.5">{sublabel}</div>
    </div>
  );
}
