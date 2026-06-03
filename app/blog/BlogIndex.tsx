"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { BlogPostMeta, formatDate } from "@/lib/blog";

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogIndex({ posts }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".idx-eyebrow", { opacity: 0, y: 16, duration: 0.6 })
        .from(".idx-title", { opacity: 0, y: 30, duration: 1 }, "-=0.3")
        .from(".idx-sub", { opacity: 0, y: 20, duration: 0.7 }, "-=0.5");

      gsap.utils.toArray<HTMLElement>(".post-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative pt-32 pb-24 bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-50" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <header className="mb-20">
          <div className="idx-eyebrow inline-flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-widest text-accent">
            <span className="h-px w-8 bg-accent" />
            Writing
          </div>
          <h1 className="idx-title font-display font-medium text-display-lg tracking-tight">
            Notes from the <span className="text-gradient">terminal</span>.
          </h1>
          <p className="idx-sub mt-6 text-lg md:text-xl text-ink-muted max-w-2xl leading-relaxed">
            Things I&apos;ve learned shipping real-time systems, growing
            in my career, and picking up new tools. Updated every few weeks.
          </p>
        </header>

        {/* Posts list */}
        <ul className="space-y-2">
          {posts.map((p, i) => (
            <li key={p.slug} className="post-row">
              <Link
                href={`/blog/${p.slug}`}
                className="group block py-8 px-2 -mx-2 border-b border-line hover:border-accent/40 transition-colors rounded-lg hover:bg-bg-soft/30 hover:px-4"
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="font-mono text-xs text-ink-subtle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    {p.category}
                  </span>
                  <span className="font-mono text-xs text-ink-subtle">
                    {formatDate(p.date)} · {p.readingTime}
                  </span>
                </div>

                <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink group-hover:text-accent transition-colors">
                  {p.title}
                </h2>

                <p className="mt-3 text-ink-muted leading-relaxed">
                  {p.excerpt}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono px-2 py-0.5 rounded-full border border-line bg-bg/40 text-ink-subtle"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-ink-muted group-hover:text-accent transition-all group-hover:gap-2">
                    Read <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Empty-state hint when no posts */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ink-muted">No posts yet — first one coming soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
