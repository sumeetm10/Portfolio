"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { projects } from "@/lib/data";
import { ArrowUpRight, Github } from "lucide-react";

export default function Projects() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        });

        // Hover tilt — subtle
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 4,
            rotateX: -y * 4,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "power2.out",
          });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
      });
    },
    { scope: ref }
  );

  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <section
      ref={ref}
      id="work"
      className="relative py-32 px-6 lg:px-10 max-w-7xl mx-auto"
    >
      <SectionHeading
        eyebrow="04 — Selected Work"
        title="Things I've built, broken, and shipped."
        description="A mix of production work, side projects, and learning experiments. Each one taught me something I now use daily."
      />

      {/* Featured projects — large cards */}
      <div className="space-y-6 mb-16">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} variant="featured" />
        ))}
      </div>

      {/* Smaller projects grid */}
      {others.length > 0 && (
        <>
          <div className="mb-8 flex items-end justify-between">
            <h3 className="text-sm font-mono uppercase tracking-widest text-ink-subtle">
              More projects
            </h3>
            <a
              href="https://github.com/sumeetm10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-muted hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              All on GitHub <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} variant="grid" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ProjectCard({
  project,
  variant,
  index,
}: {
  project: (typeof projects)[number];
  variant: "featured" | "grid";
  index?: number;
}) {
  if (variant === "featured") {
    const reverse = (index ?? 0) % 2 === 1;
    return (
      <article
        className="project-card group relative grid lg:grid-cols-12 gap-6 p-6 md:p-10 rounded-3xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""} flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-ink-subtle mb-4">
              <span className="text-accent">{project.category}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>

            <h3 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-3">
              {project.name}
            </h3>
            <p className="text-lg text-ink-muted mb-2">{project.tagline}</p>
            <p className="text-base text-ink-muted leading-relaxed mb-6">
              {project.description}
            </p>

            <ul className="space-y-2 mb-6">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-ink-muted"
                >
                  <span className="text-accent">▸</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs font-mono px-2.5 py-1 rounded-full border border-line bg-bg/40 text-ink-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-bg text-sm font-medium hover:bg-accent transition-colors"
                >
                  Visit live <ArrowUpRight size={14} />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-sm font-medium hover:border-accent hover:text-accent transition-colors"
                >
                  <Github size={14} /> Code
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
          <ProjectVisual project={project} />
        </div>
      </article>
    );
  }

  return (
    <article
      className="project-card group relative p-6 rounded-2xl border border-line bg-bg-soft/30 hover:border-accent/40 transition-colors flex flex-col"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">
            {project.category} · {project.year}
          </div>
          <h3 className="font-display text-2xl font-medium tracking-tight">
            {project.name}
          </h3>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit live"
              className="p-2 rounded-full border border-line hover:border-accent hover:text-accent"
            >
              <ArrowUpRight size={14} />
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View code"
              className="p-2 rounded-full border border-line hover:border-accent hover:text-accent"
            >
              <Github size={14} />
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-ink-muted leading-relaxed mb-5 flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="text-xs font-mono px-2 py-0.5 rounded-full border border-line bg-bg/40 text-ink-subtle"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  // Stylized visual placeholder — gradient + initials/name + dot grid
  // + animated hover sheen
  return (
    <div className="relative aspect-[4/3] lg:aspect-[5/6] rounded-2xl overflow-hidden border border-line bg-gradient-to-br from-bg-elevated via-bg-soft to-bg">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(239,68,68,0.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(248,113,113,0.2), transparent 50%)",
        }}
      />

      {/* Hover sheen — a diagonal light sweep */}
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(239,68,68,0.18) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shine 3s ease-in-out infinite",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="text-center transition-transform duration-500 group-hover:scale-105">
          <div className="font-mono text-xs uppercase tracking-widest text-accent mb-3">
            {project.category}
          </div>
          <div className="font-display text-4xl md:text-6xl font-medium text-ink leading-none">
            {project.name.split(" ").map((w, i) => (
              <span key={i} className="block">
                {w}
              </span>
            ))}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg/60 border border-line text-xs font-mono text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {project.year}
          </div>

          {/* View case arrow — slides in on hover */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-accent opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            View case →
          </div>
        </div>
      </div>

      {/* Corner accents — brighten on hover */}
      <div className="absolute top-3 left-3 h-3 w-3 border-l border-t border-accent/40 group-hover:border-accent transition-colors duration-500" />
      <div className="absolute top-3 right-3 h-3 w-3 border-r border-t border-accent/40 group-hover:border-accent transition-colors duration-500" />
      <div className="absolute bottom-3 left-3 h-3 w-3 border-l border-b border-accent/40 group-hover:border-accent transition-colors duration-500" />
      <div className="absolute bottom-3 right-3 h-3 w-3 border-r border-b border-accent/40 group-hover:border-accent transition-colors duration-500" />
    </div>
  );
}
