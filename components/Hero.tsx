"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import EmberField from "./EmberField";
import { INTRO_DONE_EVENT } from "./CinematicIntro";

/**
 * Splits a string into per-character spans for GSAP staggering.
 * Spaces become non-breaking spaces with the same animated treatment.
 */
function SplitText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={className} aria-label={children}>
      {Array.from(children).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="char inline-block will-change-transform"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // If the CinematicIntro is about to play (first visit this session),
      // hold the entrance until its curtain lifts so the user actually
      // sees the character reveal. Repeat visits play immediately.
      let introPending = false;
      try {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        introPending = !reduced && !window.sessionStorage.getItem("ss-intro-seen");
      } catch {
        introPending = false;
      }

      // Cinematic entrance — eyebrow → name (char stagger) → role → sub → cta → meta
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        paused: introPending,
      });

      tl.from(".hero-eyebrow", {
        y: 16,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          ".name-line-1 .char",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1.1,
            stagger: 0.035,
            ease: "expo.out",
          },
          "-=0.2"
        )
        .from(
          ".name-line-2 .char",
          {
            yPercent: 120,
            opacity: 0,
            duration: 1.1,
            stagger: 0.035,
            ease: "expo.out",
          },
          "-=0.95"
        )
        .from(
          ".role-line",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
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
          "-=0.5"
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

      // Release the entrance when the intro's curtain lifts — with a
      // safety fallback in case the event never arrives.
      let fallback: ReturnType<typeof setTimeout> | undefined;
      const release = () => {
        if (fallback) clearTimeout(fallback);
        tl.play();
      };
      if (introPending) {
        window.addEventListener(INTRO_DONE_EVENT, release, { once: true });
        fallback = setTimeout(release, 4500);
      }

      // Aurora drift — slow looping gradient blob
      gsap.to(".aurora-a", {
        x: 60,
        y: -40,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".aurora-b", {
        x: -80,
        y: 50,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax on scroll
      gsap.to(".hero-parallax", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      gsap.to(".hero-content", {
        opacity: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Non-GSAP side effects need manual cleanup
      return () => {
        window.removeEventListener(INTRO_DONE_EVENT, release);
        if (fallback) clearTimeout(fallback);
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-grid"
    >
      {/* Aurora — two drifting gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-a absolute top-[10%] left-[20%] h-[500px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="aurora-b absolute bottom-[10%] right-[15%] h-[480px] w-[700px] rounded-full bg-accent-glow/12 blur-[140px]" />
      </div>

      {/* Rising embers — matches the red theme, pure canvas */}
      <EmberField />

      {/* Radial top glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

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
            <SplitText className="name-line-1 block">Sumeet</SplitText>
          </span>
          <span className="block overflow-hidden">
            <SplitText className="name-line-2 block text-gradient">
              Shrestha.
            </SplitText>
          </span>
          <span className="role-line block text-ink-muted text-[0.5em] font-normal mt-2">
            Full-Stack Developer.
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
          <MagneticButton href="#work" variant="primary" ariaLabel="See my work">
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
            v1.1 — 2026
          </span>
          <span className="hero-meta text-line hidden sm:inline">|</span>
          <span className="hero-meta hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-ink-subtle">
            Press
            <kbd className="px-1.5 py-0.5 rounded border border-line bg-bg-soft text-ink-muted text-[10px]">⌘K</kbd>
            for terminal
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-subtle text-xs font-mono uppercase tracking-widest">
        <span>Scroll</span>
        <div className="h-8 w-[1px] bg-gradient-to-b from-ink-subtle to-transparent" />
      </div>
    </section>
  );
}
