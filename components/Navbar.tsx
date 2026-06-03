"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { navLinks, siteConfig } from "@/lib/data";
import { Menu, X } from "lucide-react";

// Routes that have their own header — don't render the global Navbar there.
const STANDALONE_ROUTES = ["/resume"];

// Threshold (in px) at which the navbar transitions from "full bar"
// to "floating pill" mode.
const COMPACT_AT = 40;

// ---------- Dimensions for the two states ----------
const STATES = {
  expanded: {
    maxWidth: 1280,
    height: 64,
    marginTop: 0,
    borderRadius: 0,
    paddingX: 24,
  },
  compact: {
    maxWidth: 720,
    height: 50,
    marginTop: 14,
    borderRadius: 999,
    paddingX: 18,
  },
};

/** Split text into per-character spans for the hover wave. */
function CharSplit({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`inline-block ${className ?? ""}`} aria-label={text}>
      {Array.from(text).map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="nav-char inline-block"
          style={{ willChange: "transform" }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const resumeBtnRef = useRef<HTMLAnchorElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // -------------------------------------------------------------------
  // Scroll detection — flips the compact flag past a threshold
  // -------------------------------------------------------------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > COMPACT_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // -------------------------------------------------------------------
  // Entrance — staggered slide-down on mount
  // -------------------------------------------------------------------
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".nav-brand", { y: -20, opacity: 0, duration: 0.7 })
        .from(
          ".nav-item",
          { y: -16, opacity: 0, duration: 0.6, stagger: 0.06 },
          "-=0.4"
        )
        .from(
          ".nav-cta-group > *",
          { y: -16, opacity: 0, duration: 0.6, stagger: 0.08 },
          "-=0.5"
        );

      gsap.fromTo(
        ".brand-shimmer",
        { backgroundPosition: "-150% 0" },
        {
          backgroundPosition: "250% 0",
          duration: 1.6,
          delay: 1.2,
          ease: "power2.inOut",
        }
      );
    },
    { scope: headerRef }
  );

  // -------------------------------------------------------------------
  // Compact ⇄ Expanded transition (the COMIC BOUNCE)
  //
  // Three-step squash-and-stretch:
  //   1. Squash on the axis we're shrinking along (scaleY)
  //   2. Tween the actual dimensions with elastic.out for overshoot
  //   3. Children (brand text, resume button, CTA) ease into place
  //      with their own slightly-delayed back.out / power2 tweens
  // -------------------------------------------------------------------
  useEffect(() => {
    const pill = pillRef.current;
    const inner = navInnerRef.current;
    const brandText = brandTextRef.current;
    const cta = ctaRef.current;
    const resumeBtn = resumeBtnRef.current;
    if (!pill || !inner) return;

    const target = scrolled ? STATES.compact : STATES.expanded;
    const tl = gsap.timeline();

    // 1. Squash — quick anticipation
    tl.to(pill, {
      scaleY: scrolled ? 0.72 : 0.86,
      scaleX: scrolled ? 1.02 : 0.98,
      duration: 0.14,
      ease: "power2.in",
    });

    // 2. Bounce into final dimensions
    tl.to(
      pill,
      {
        maxWidth: target.maxWidth,
        height: target.height,
        marginTop: target.marginTop,
        borderRadius: target.borderRadius,
        scaleX: 1,
        scaleY: 1,
        duration: 0.65,
        ease: scrolled
          ? "elastic.out(1.15, 0.5)" // bouncier going DOWN to compact
          : "elastic.out(1, 0.55)",
      },
      ">-0.02"
    );

    // 3. Inner padding follows
    gsap.to(inner, {
      paddingLeft: target.paddingX,
      paddingRight: target.paddingX,
      duration: 0.5,
      ease: "power3.out",
      delay: 0.05,
    });

    // Brand "Sumeet" text — fold away when compact
    if (brandText) {
      gsap.to(brandText, {
        opacity: scrolled ? 0 : 1,
        maxWidth: scrolled ? 0 : 100,
        marginLeft: scrolled ? 0 : 8,
        duration: 0.4,
        ease: scrolled ? "power3.in" : "back.out(1.7)",
        delay: scrolled ? 0 : 0.15,
      });
    }

    // Resume button — collapse out of the compact pill, pop back when expanded
    if (resumeBtn) {
      gsap.to(resumeBtn, {
        opacity: scrolled ? 0 : 1,
        maxWidth: scrolled ? 0 : 120,
        paddingLeft: scrolled ? 0 : 16,
        paddingRight: scrolled ? 0 : 16,
        marginRight: scrolled ? -8 : 0,
        scale: scrolled ? 0.6 : 1,
        duration: scrolled ? 0.35 : 0.5,
        ease: scrolled ? "back.in(1.7)" : "back.out(1.7)",
        delay: scrolled ? 0 : 0.2,
      });
    }

    // CTA — shrinks padding + font in compact mode
    if (cta) {
      gsap.to(cta, {
        paddingLeft: scrolled ? 14 : 16,
        paddingRight: scrolled ? 14 : 16,
        paddingTop: scrolled ? 6 : 8,
        paddingBottom: scrolled ? 6 : 8,
        fontSize: scrolled ? 12 : 14,
        duration: 0.4,
        ease: "power3.out",
        delay: 0.1,
      });
    }
  }, [scrolled]);

  // -------------------------------------------------------------------
  // Magnetic CTA
  // -------------------------------------------------------------------
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const fineHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!fineHover) return;

    const setX = gsap.quickTo(el, "x", {
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
    const setY = gsap.quickTo(el, "y", {
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setX((e.clientX - (r.left + r.width / 2)) * 0.25);
      setY((e.clientY - (r.top + r.height / 2)) * 0.25);
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
  }, []);

  // -------------------------------------------------------------------
  // Bail out on standalone routes (after all hooks)
  // -------------------------------------------------------------------
  if (STANDALONE_ROUTES.some((r) => pathname?.startsWith(r))) {
    return null;
  }

  const onAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setMobileOpen(false);
    if (pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/${href}`);
    }
  };

  const onLinkEnter = (e: React.MouseEvent<HTMLElement>) => {
    const chars = e.currentTarget.querySelectorAll(".nav-char");
    if (!chars.length) return;
    gsap.to(chars, {
      y: -3,
      duration: 0.3,
      stagger: { each: 0.025, from: "start" },
      ease: "power2.out",
    });
  };
  const onLinkLeave = (e: React.MouseEvent<HTMLElement>) => {
    const chars = e.currentTarget.querySelectorAll(".nav-char");
    if (!chars.length) return;
    gsap.to(chars, {
      y: 0,
      duration: 0.4,
      stagger: { each: 0.02, from: "end" },
      ease: "power3.out",
    });
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div
        ref={pillRef}
        className={`pointer-events-auto mx-auto overflow-hidden border transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? "bg-bg/85 backdrop-blur-xl border-line shadow-2xl shadow-black/30"
            : "bg-transparent border-transparent"
        }`}
        style={{
          maxWidth: STATES.expanded.maxWidth,
          height: STATES.expanded.height,
          marginTop: STATES.expanded.marginTop,
          borderRadius: STATES.expanded.borderRadius,
          transformOrigin: "center top",
          willChange: "transform, height, max-width, margin-top, border-radius",
        }}
      >
        <div
          ref={navInnerRef}
          className="h-full flex items-center justify-between"
          style={{
            paddingLeft: STATES.expanded.paddingX,
            paddingRight: STATES.expanded.paddingX,
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            className="nav-brand flex items-center group relative shrink-0"
            aria-label="Home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 border border-accent/30 font-mono text-sm font-bold text-accent overflow-hidden transition-colors group-hover:bg-accent/20">
              <span
                className="brand-shimmer absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
                  backgroundSize: "300% 100%",
                  backgroundPosition: "-150% 0",
                }}
              />
              <span className="relative">{siteConfig.initials}</span>
            </span>
            <span
              ref={brandTextRef}
              className="text-sm font-medium tracking-tight whitespace-nowrap overflow-hidden inline-block"
              style={{ marginLeft: 8, maxWidth: 100 }}
            >
              {siteConfig.shortName}
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("#");
              const isActive =
                !isAnchor &&
                pathname?.startsWith(link.href) &&
                link.href !== "/";
              const content = (
                <span
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={onLinkLeave}
                  className="inline-flex items-center gap-1.5"
                >
                  <span
                    className={`h-1 w-1 rounded-full transition-all duration-300 ${
                      isActive ? "bg-accent scale-100" : "bg-accent scale-0"
                    }`}
                  />
                  <CharSplit text={link.label} />
                </span>
              );

              return (
                <li key={link.href} className="nav-item">
                  {isAnchor ? (
                    <a
                      href={link.href}
                      onClick={(e) => onAnchorClick(e, link.href)}
                      className="block px-3 py-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-3 py-1.5 text-sm transition-colors ${
                        isActive ? "text-accent" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* CTAs */}
          <div className="nav-cta-group flex items-center gap-2.5 shrink-0">
            <Link
              ref={resumeBtnRef}
              href="/resume"
              className="hidden sm:inline-flex items-center gap-2 rounded-full text-sm font-medium border border-line hover:border-accent/60 hover:text-accent transition-colors overflow-hidden whitespace-nowrap"
              style={{
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 16,
                paddingRight: 16,
                maxWidth: 120,
              }}
            >
              Resume
            </Link>
            <a
              ref={ctaRef}
              href={siteConfig.links.email}
              className="hidden sm:inline-flex items-center gap-2 rounded-full font-medium bg-ink text-bg hover:bg-accent hover:text-bg transition-colors will-change-transform whitespace-nowrap"
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 14,
              }}
            >
              Get in touch
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-ink"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="pointer-events-auto md:hidden border-t border-line bg-bg/95 backdrop-blur-xl">
          <ul className="px-6 py-4 space-y-2">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("#");
              return (
                <li key={link.href}>
                  {isAnchor ? (
                    <a
                      href={link.href}
                      onClick={(e) => onAnchorClick(e, link.href)}
                      className="block py-2 text-base text-ink-muted hover:text-ink"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base text-ink-muted hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li>
              <Link
                href="/resume"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-base text-ink-muted hover:text-ink"
              >
                Resume
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
