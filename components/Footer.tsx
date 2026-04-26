"use client";

import Link from "next/link";
import { siteConfig, navLinks } from "@/lib/data";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg-soft/30 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 border border-accent/30 font-mono text-sm font-bold text-accent">
                {siteConfig.initials}
              </span>
              <span className="font-display text-lg font-medium">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-ink-muted max-w-sm leading-relaxed">
              {siteConfig.role} · {siteConfig.location}
            </p>
            <p className="text-ink-subtle text-sm mt-2">
              Designed & built from scratch with Next.js, Tailwind & GSAP.
            </p>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-4">
              Sections
            </div>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-ink-muted hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/resume"
                  className="text-ink-muted hover:text-accent transition-colors"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-4">
              Elsewhere
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-muted hover:text-accent transition-colors"
                >
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ink-muted hover:text-accent transition-colors"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.email}
                  className="inline-flex items-center gap-2 text-ink-muted hover:text-accent transition-colors"
                >
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row justify-between gap-3 text-xs font-mono text-ink-subtle">
          <span>© {year} {siteConfig.name}. All rights reserved.</span>
          <span>Crafted in Kathmandu, Nepal</span>
        </div>
      </div>
    </footer>
  );
}
