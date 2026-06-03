"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { BlogPostMeta, formatDate } from "@/lib/blog";

interface Props {
  posts: BlogPostMeta[];
}

export default function Writing({ posts }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".writing-card", {
        opacity: 0,
        y: 50,
        duration: 0.9,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".writing-grid",
          start: "top 80%",
        },
      });
    },
    { scope: ref }
  );

  if (!posts.length) return null;

  return (
    <section
      ref={ref}
      id="writing"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <SectionHeading
          eyebrow="05 — Writing"
          title="Notes I've been keeping."
          description="Short essays on real-time systems, career growth, and what I'm learning lately."
        />
        <Link
          href="/blog"
          className="self-start inline-flex items-center gap-1 text-sm text-ink-muted hover:text-accent transition-colors mb-2 -mt-6 sm:mt-0"
        >
          All writing <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="writing-grid grid md:grid-cols-3 gap-5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="writing-card group relative flex flex-col p-6 md:p-7 rounded-2xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors h-full"
          >
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest mb-4">
              <span className="text-accent">{p.category}</span>
              <span className="text-ink-subtle">·</span>
              <span className="text-ink-subtle">{formatDate(p.date)}</span>
            </div>

            <h3 className="font-display text-xl md:text-2xl font-medium tracking-tight leading-snug group-hover:text-accent transition-colors mb-3">
              {p.title}
            </h3>

            <p className="text-sm text-ink-muted leading-relaxed flex-1 mb-5">
              {p.excerpt}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-line">
              <span className="text-xs font-mono text-ink-subtle">
                {p.readingTime}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-ink-muted group-hover:text-accent transition-all group-hover:gap-2">
                Read <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
