"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/data";
import { Menu, X } from "lucide-react";

// Routes that have their own header — don't render the global Navbar there.
const STANDALONE_ROUTES = ["/resume"];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (STANDALONE_ROUTES.some((r) => pathname?.startsWith(r))) {
    return null;
  }

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-line"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 border border-accent/30 font-mono text-sm font-bold text-accent transition group-hover:bg-accent/20">
            {siteConfig.initials}
          </span>
          <span className="hidden sm:inline text-sm font-medium tracking-tight">
            {siteConfig.shortName}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => onNavClick(e, link.href)}
                className="px-4 py-2 text-sm text-ink-muted hover:text-ink transition-colors magnetic-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-line hover:border-accent/60 hover:text-accent transition-all"
          >
            Resume
          </Link>
          <a
            href={siteConfig.links.email}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-ink text-bg hover:bg-accent hover:text-bg transition-all"
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
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-bg/95 backdrop-blur-xl">
          <ul className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => onNavClick(e, link.href)}
                  className="block py-2 text-base text-ink-muted hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
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
