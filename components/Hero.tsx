"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/data";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Initial cinematic entrance
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".hero-eyebrow", {
        y: 20,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".hero-line",
          {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.1,
          },
          "-=0.4"
        )
        .from(
          ".hero-sub",
          {
            y: 20,
            opacity: 0,
            duration: 0.9,
          },
          "-=0.6"
        )
        .from(
          ".hero-cta > *",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
          },
          "-=0.5"
        )
        .from(
          ".hero-meta",
          {
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
          },
          "-=0.4"
        );

      // Parallax on scroll for hero content
      gsap.to(".hero-parallax", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Fade out hero content as user scrolls
      gsap.to(".hero-content", {
        opacity: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-grid"
    >
      {/* Radial gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="hero-content hero-parallax relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-32 pb-20">
        <div className="hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-bg-soft/50 backdrop-blur-sm text-xs font-mono text-ink-muted mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Available for freelance · Based in {siteConfig.location}
        </div>

        <h1 className="font-display font-medium text-display-xl leading-[0.95] tracking-tight mb-8">
          <span className="block overflow-hidden">
            <span className="hero-line block">Sumeet</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block text-gradient">Shrestha.</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line block text-ink-muted text-[0.5em] font-normal mt-2">
              Full-Stack Developer.
            </span>
          </span>
        </h1>

        <p className="hero-sub max-w-xl text-lg md:text-xl text-ink-muted leading-relaxed mb-10">
          Senior Developer at{" "}
          <a
            href="https://nepsetrading.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink magnetic-underline"
          >
            NepseTrading
          </a>
          . I build real-time trading platforms, interactive charts, and full-stack apps that hold up
          under pressure.
        </p>

        <div className="hero-cta flex flex-wrap items-center gap-4 mb-16">
          <MagneticButton
            href="#work"
            variant="primary"
            ariaLabel="See my work"
          >
            See my work
            <ArrowDown size={16} className="ml-1 -rotate-45" />
          </MagneticButton>

          <MagneticButton
            href={siteConfig.links.email}
            variant="ghost"
            ariaLabel="Email Sumeet"
          >
            sthasumit676@gmail.com
          </MagneticButton>
        </div>

        <div className="flex items-center gap-5 text-ink-muted">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hero-meta hover:text-accent transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hero-meta hover:text-accent transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href={siteConfig.links.email}
            aria-label="Email"
            className="hero-meta hover:text-accent transition-colors"
          >
            <Mail size={20} />
          </a>
          <span className="hero-meta text-line">|</span>
          <span className="hero-meta text-xs font-mono uppercase tracking-widest">
            v1.0 — 2026
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-subtle text-xs font-mono uppercase tracking-widest">
        <span>Scroll</span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-ink-subtle to-transparent" />
      </div>
    </section>
  );
}
