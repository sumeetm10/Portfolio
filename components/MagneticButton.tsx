"use client";

import Link from "next/link";
import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

type Variant = "primary" | "ghost" | "outline";

interface Props {
  children: ReactNode;
  href: string;
  variant?: Variant;
  ariaLabel?: string;
  external?: boolean;
  strength?: number;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:bg-accent hover:text-bg border border-transparent",
  ghost:
    "bg-transparent text-ink-muted hover:text-ink border border-line hover:border-accent/60",
  outline:
    "bg-transparent text-ink border border-line hover:border-accent",
};

export default function MagneticButton({
  children,
  href,
  variant = "primary",
  ariaLabel,
  external = false,
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fineHover) return;

    const setX = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const setY = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setX((e.clientX - cx) * strength);
      setY((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      setX(0);
      setY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const isHash = href.startsWith("#");
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href);

  const base =
    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors will-change-transform";

  const className = `${base} ${variantClass[variant]}`;

  if (isHash) {
    return (
      <a
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className} ref={ref as never}>
      {children}
    </Link>
  );
}
