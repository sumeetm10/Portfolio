"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

// Routes that should keep the native cursor (e.g. printable pages).
const NATIVE_CURSOR_ROUTES = ["/resume"];

export default function CustomCursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const skip = NATIVE_CURSOR_ROUTES.some((r) => pathname?.startsWith(r));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skip) {
      document.body.classList.remove("has-custom-cursor");
      setEnabled(false);
      return;
    }
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fineHover) {
      document.body.classList.remove("has-custom-cursor");
      return;
    }
    document.body.classList.add("has-custom-cursor");
    setEnabled(true);
  }, [skip]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotX(mouseX);
      dotY(mouseY);
      ringX(mouseX);
      ringY(mouseY);
    };

    const handleEnter = () => {
      gsap.to(ring, { scale: 2.4, opacity: 0.6, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 0.5, duration: 0.3, ease: "power3.out" });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power3.out" });
    };

    window.addEventListener("mousemove", handleMove);
    const interactive = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, [data-cursor='hover']"
    );
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-accent/60 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[101] -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent mix-blend-difference"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
