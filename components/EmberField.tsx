"use client";

import { useEffect, useRef } from "react";

// =============================================================
// EmberField — canvas particle layer of glowing embers rising
// like sparks off a fire. Matches the red theme.
// -----------------------------------------------------------
// • additive blending ("lighter") for the glow
// • pauses when the tab is hidden or the canvas leaves viewport
// • respects prefers-reduced-motion (renders nothing)
// • ~3 KB of logic, zero dependencies
// =============================================================

type Ember = {
  x: number;
  y: number;
  radius: number;
  vy: number; // upward speed
  swayAmp: number; // horizontal sway amplitude
  swayFreq: number;
  swayPhase: number;
  life: number; // 0..1, grows then dies
  maxLife: number; // seconds
  hue: number; // 0–40 (red → amber)
};

export default function EmberField({
  density,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let lastT = performance.now();
    let visible = true; // section in viewport
    let tabActive = !document.hidden;

    const count =
      density ?? (window.innerWidth < 768 ? 22 : 42);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (e: Ember, initial = false) => {
      e.x = Math.random() * width;
      // Initial fill scatters embers through the whole height;
      // respawns start just below the bottom edge.
      e.y = initial ? Math.random() * height : height + 10 + Math.random() * 30;
      e.radius = 0.8 + Math.random() * 1.8;
      e.vy = 14 + Math.random() * 26; // px/second
      e.swayAmp = 6 + Math.random() * 18;
      e.swayFreq = 0.3 + Math.random() * 0.7;
      e.swayPhase = Math.random() * Math.PI * 2;
      e.life = initial ? Math.random() : 0;
      e.maxLife = 6 + Math.random() * 8;
      e.hue = Math.random() * 40; // red→amber
    };

    const embers: Ember[] = Array.from({ length: count }, () => {
      const e = {} as Ember;
      spawn(e, true);
      return e;
    });

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - lastT) / 1000); // clamp big gaps
      lastT = now;
      if (!visible || !tabActive) return;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const t = now / 1000;
      for (const e of embers) {
        e.life += dt / e.maxLife;
        e.y -= e.vy * dt;
        const sway = Math.sin(t * e.swayFreq * Math.PI * 2 + e.swayPhase) * e.swayAmp;

        // Died of old age or floated past the top → recycle
        if (e.life >= 1 || e.y < -20) {
          spawn(e);
          continue;
        }

        // Fade in fast, fade out slow (sin curve over life)
        const alpha = Math.sin(Math.min(1, e.life) * Math.PI) * 0.65;
        const x = e.x + sway;

        const grad = ctx.createRadialGradient(x, e.y, 0, x, e.y, e.radius * 4);
        grad.addColorStop(0, `hsla(${e.hue}, 95%, 62%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${e.hue}, 90%, 50%, ${alpha * 0.45})`);
        grad.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, e.y, e.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);

    // --- battery savers -------------------------------------------------
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      tabActive = !document.hidden;
      lastT = performance.now(); // avoid a giant dt jump on resume
    };
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
