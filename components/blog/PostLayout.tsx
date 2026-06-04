"use client";

import { ReactNode, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Calendar } from "lucide-react";
import { BlogPostMeta, formatDate, getAdjacentPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";

interface Props {
  meta: BlogPostMeta;
  children: ReactNode;
}

export default function PostLayout({ meta, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { newer, older } = getAdjacentPosts(meta.slug);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Title and meta fade-up entrance
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".post-eyebrow", { opacity: 0, y: 16, duration: 0.6 })
        .from(".post-title", { opacity: 0, y: 30, duration: 1 }, "-=0.3")
        .from(".post-meta", { opacity: 0, y: 20, duration: 0.7, stagger: 0.06 }, "-=0.5");

      // Article body — reveal each block on scroll
      gsap.utils
        .toArray<HTMLElement>(".post-body > *")
        .forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          });
        });
    },
    { scope: ref }
  );

  return (
    <article ref={ref} className="relative pt-32 pb-24">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> All writing
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-3xl mx-auto px-6 lg:px-10 mb-12">
        <div className="post-eyebrow inline-flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent" />
          {meta.category}
        </div>

        <h1 className="post-title font-display font-medium text-display-md tracking-tight leading-[1.05]">
          {meta.title}
        </h1>

        <div className="post-meta mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-2">
            <Calendar size={14} className="text-ink-subtle" />
            {formatDate(meta.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={14} className="text-ink-subtle" />
            {meta.readingTime}
          </span>
          <span className="flex flex-wrap gap-2">
            {meta.tags.map((t) => (
              <span
                key={t}
                className="text-xs font-mono px-2 py-0.5 rounded-full border border-line bg-bg-soft/50 text-ink-muted"
              >
                {t}
              </span>
            ))}
          </span>
        </div>
      </header>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 mb-12">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10">
        <div
          className="post-body prose prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-ink-muted prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:text-ink prose-strong:font-medium
            prose-code:text-accent prose-code:before:content-none prose-code:after:content-none
            prose-code:bg-bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-pre:bg-bg-soft prose-pre:border prose-pre:border-line prose-pre:rounded-xl
            prose-blockquote:border-l-accent prose-blockquote:border-l-2 prose-blockquote:not-italic prose-blockquote:text-ink-muted
            prose-li:text-ink-muted prose-li:marker:text-accent
            prose-hr:border-line"
        >
          {children}
        </div>
      </div>

      {/* Footer — prev/next + share */}
      <footer className="max-w-3xl mx-auto px-6 lg:px-10 mt-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent mb-10" />

        {/*
          Chronological nav: "Older" = published before this one (visually
          on the left, since we read older→newer left-to-right). "Newer" =
          published after, on the right. This avoids the prev/next
          ambiguity entirely.
        */}
        <nav className="grid sm:grid-cols-2 gap-4">
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group p-5 rounded-2xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-2 inline-flex items-center gap-2">
                <ArrowLeft size={12} /> Older post
              </div>
              <div className="font-display text-lg leading-snug group-hover:text-accent transition-colors">
                {older.title}
              </div>
            </Link>
          ) : (
            <span />
          )}

          {newer ? (
            <Link
              href={`/blog/${newer.slug}`}
              className="group p-5 rounded-2xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors text-right sm:text-right"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-2 inline-flex items-center gap-2 sm:justify-end">
                Newer post <ArrowRight size={12} />
              </div>
              <div className="font-display text-lg leading-snug group-hover:text-accent transition-colors">
                {newer.title}
              </div>
            </Link>
          ) : null}
        </nav>

        {/* CTA */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl border border-accent/30 bg-accent/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-1">
              Liked this?
            </div>
            <div className="text-lg text-ink">
              I post writing like this every few weeks. Drop a line if anything resonated.
            </div>
          </div>
          <a
            href={siteConfig.links.email}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:bg-accent transition-colors whitespace-nowrap"
          >
            Get in touch <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </article>
  );
}
