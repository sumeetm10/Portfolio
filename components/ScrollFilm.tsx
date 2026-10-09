"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// =============================================================
// ScrollFilm — a scroll-scrubbed motion-graphics "film".
// -----------------------------------------------------------
// Pinned viewport; a master GSAP timeline is scrubbed by scroll
// position, so the user literally drags the playhead by
// scrolling. Three kinetic-typography scenes with parallax
// shapes, running timecode, and a seekbar.
//
// Optional `videoSrc`: when provided (e.g. a Higgsfield-generated
// clip in /public/video/), a background <video> layer is scrubbed
// frame-by-frame via currentTime alongside the graphics.
// =============================================================

const FILM_SECONDS = 8; // fake film length shown on the timecode
const FPS = 24;

function Chars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span key={i} aria-hidden className="fchar inline-block will-change-transform">
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function ScrollFilm({ videoSrc }: { videoSrc?: string }) {
  const ref = useRef<HTMLElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // ---- Master timeline (paused — scroll is the playhead) ----
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

      // SCENE 1 — "EVERY SYSTEM"
      tl.fromTo(
        ".s1 .fchar",
        { yPercent: 130, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.035, duration: 0.8, ease: "expo.out" },
        0
      )
        .fromTo(".film-cross-h", { scaleX: 0 }, { scaleX: 1, duration: 0.7 }, 0.1)
        .fromTo(".film-cross-v", { scaleY: 0 }, { scaleY: 1, duration: 0.7 }, 0.25)
        .fromTo(
          ".film-circle",
          { scale: 0.4, opacity: 0, rotation: -90 },
          { scale: 1, opacity: 1, rotation: 0, duration: 1 },
          0.2
        )
        // Scene 1 exit
        .to(".s1 .fchar", { yPercent: -130, opacity: 0, stagger: 0.02, duration: 0.6 }, 2.2)
        .to(".film-cross-h, .film-cross-v", { opacity: 0.15, duration: 0.5 }, 2.3);

      // SCENE 2 — "HAS A STORY."
      tl.fromTo(
        ".s2 .fchar",
        { yPercent: 130, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.8, ease: "expo.out" },
        3.0
      )
        .fromTo(
          ".film-bar",
          { xPercent: -120 },
          { xPercent: 120, stagger: 0.15, duration: 1.6, ease: "power1.inOut" },
          2.9
        )
        .fromTo(
          ".film-square",
          { rotation: 0, scale: 0, opacity: 0 },
          { rotation: 135, scale: 1, opacity: 1, duration: 1.2 },
          3.1
        )
        .to(".film-circle", { xPercent: 240, rotation: 180, duration: 1.6 }, 3.0)
        // Scene 2 exit
        .to(".s2 .fchar", { yPercent: -130, opacity: 0, stagger: 0.018, duration: 0.6 }, 5.2)
        .to(".film-square", { scale: 0, opacity: 0, duration: 0.5 }, 5.3);

      // SCENE 3 — "THIS ONE'S MINE." + red flood
      tl.fromTo(
        ".film-flood",
        { scale: 0 },
        { scale: 1, duration: 1.2, ease: "power3.inOut" },
        5.8
      )
        .fromTo(
          ".s3 .fchar",
          { yPercent: 130, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.8, ease: "expo.out" },
          6.3
        )
        .to(".film-circle", { xPercent: 0, scale: 2.4, opacity: 0.25, duration: 1.4 }, 6.0)
        // Final settle — everything eases to rest, holds to end of film
        .to(".film-stage", { scale: 0.985, duration: 1.0, ease: "power1.out" }, 7.0)
        .to({}, { duration: 0.4 }); // tail padding so last frame holds

      const filmDuration = tl.duration();

      // ---- Scroll drives the playhead ----
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "+=280%",
        pin: ".film-pin",
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          tl.time(p * filmDuration);

          // Timecode: SS:FF over the fake film length
          const t = p * FILM_SECONDS;
          const ss = String(Math.floor(t)).padStart(2, "0");
          const ff = String(Math.floor((t % 1) * FPS)).padStart(2, "0");
          if (timecodeRef.current) {
            timecodeRef.current.textContent = `00:00:${ss}:${ff}`;
          }

          // Seekbar fill
          if (seekRef.current) {
            seekRef.current.style.transform = `scaleX(${p})`;
          }

          // Scene label
          if (sceneRef.current) {
            const scene = p < 0.36 ? "01" : p < 0.68 ? "02" : "03";
            sceneRef.current.textContent = `SCENE ${scene} / 03`;
          }

          // Optional real video layer — scrub currentTime with scroll
          const v = videoRef.current;
          if (v && v.duration && v.readyState >= 2) {
            v.currentTime = v.duration * p;
          }
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} aria-label="Prologue film" className="force-dark relative bg-black isolate">
      <div className="film-pin relative h-screen overflow-hidden">
        {/* Optional scrubbed video layer */}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}

        {/* Stage — everything scales slightly at the end */}
        <div className="film-stage absolute inset-0">
          {/* Crosshair lines */}
          <div className="film-cross-h absolute top-1/2 left-0 right-0 h-px bg-white/10 origin-center" />
          <div className="film-cross-v absolute left-1/2 top-0 bottom-0 w-px bg-white/10 origin-center" />

          {/* Dashed circle */}
          <div className="film-circle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[42vmin] w-[42vmin] rounded-full border border-dashed border-accent/40" />

          {/* Spinning square outline */}
          <div className="film-square absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[30vmin] w-[30vmin] border border-accent/50" />

          {/* Sweeping bars */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="film-bar absolute left-0 right-0 h-[6vh] bg-accent/[0.06]"
              style={{ top: `${24 + i * 22}%` }}
            />
          ))}

          {/* Red flood for scene 3 */}
          <div className="film-flood absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150vmax] w-[150vmax] rounded-full bg-accent/[0.10]" />

          {/* Kinetic type — three stacked scenes */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <h2 className="relative text-center font-display font-bold tracking-tight leading-none">
              <span className="s1 absolute inset-0 grid place-items-center overflow-hidden whitespace-nowrap text-[9vw]">
                <Chars text="EVERY SYSTEM" />
              </span>
              <span className="s2 absolute inset-0 grid place-items-center overflow-hidden whitespace-nowrap text-[9vw]">
                <Chars text="HAS A STORY." />
              </span>
              <span className="s3 grid place-items-center overflow-hidden whitespace-nowrap text-[9vw] text-gradient">
                <Chars text="THIS ONE'S MINE." />
              </span>
            </h2>
          </div>
        </div>

        {/* ---- Film HUD ---- */}
        <div className="absolute top-8 left-6 lg:left-10 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-subtle">
          Prologue — a film you scrub by scrolling
        </div>
        <div className="absolute top-8 right-6 lg:right-10 flex items-center gap-4 font-mono text-xs text-ink-muted tabular-nums">
          <span ref={sceneRef}>SCENE 01 / 03</span>
          <span className="text-accent" ref={timecodeRef}>
            00:00:00:00
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
            REC
          </span>
        </div>

        {/* Seekbar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div ref={seekRef} className="h-full w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-subtle">
          scroll = playhead
        </div>
      </div>
    </section>
  );
}
