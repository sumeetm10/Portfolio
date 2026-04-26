import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, experience, skillGroups, projects } from "@/lib/data";
import { Mail, Github, Linkedin, MapPin, Globe, ArrowLeft } from "lucide-react";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Professional resume of ${siteConfig.name} — ${siteConfig.role}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      {/* Toolbar — hidden in print */}
      <div className="no-print sticky top-0 z-40 bg-bg/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Resume sheet */}
      <article className="print-page max-w-4xl mx-auto my-10 p-10 md:p-14 bg-bg-soft border border-line rounded-2xl print:max-w-none print:my-0 print:p-10 print:bg-white print:border-0 print:rounded-none">
        {/* Header */}
        <header className="pb-6 border-b border-line print:border-black/20">
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight print:text-black">
            {siteConfig.name}
          </h1>
          <p className="text-lg text-accent print:text-black mt-1 font-medium">
            {siteConfig.role}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted print:text-black/70">
            <a
              href={siteConfig.links.email}
              className="inline-flex items-center gap-1.5 hover:text-accent print:hover:text-black"
            >
              <Mail size={14} /> {siteConfig.email}
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent print:hover:text-black"
            >
              <Github size={14} /> github.com/sumeetm10
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-accent print:hover:text-black"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> {siteConfig.location}
            </span>
            <a
              href={siteConfig.url}
              className="inline-flex items-center gap-1.5 hover:text-accent print:hover:text-black"
            >
              <Globe size={14} /> {siteConfig.url.replace("https://", "")}
            </a>
          </div>
        </header>

        {/* Summary */}
        <Section title="Summary">
          <p className="text-ink-muted print:text-black/80 leading-relaxed">
            Full-stack developer with hands-on production experience at NepseTrading,
            building real-time trading platforms with Next.js, NestJS, and PostgreSQL.
            Comfortable across the stack — from streaming data pipelines and APIs to
            interactive charts and pixel-perfect UIs. Currently pursuing a BCSIT degree
            while shipping features that thousands of traders use daily.
          </p>
        </Section>

        {/* Experience */}
        <Section title="Experience">
          {experience
            .filter((e) => !e.role.toLowerCase().startsWith("bcsit"))
            .map((e, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-base print:text-black">
                    {e.role}{" "}
                    <span className="text-ink-muted print:text-black/70">
                      · {e.company}
                    </span>
                  </h3>
                  <span className="text-sm font-mono text-ink-subtle print:text-black/60">
                    {e.period}
                  </span>
                </div>
                <p className="text-sm text-ink-muted print:text-black/80 mt-1.5 mb-2">
                  {e.description}
                </p>
                <ul className="space-y-1 text-sm text-ink-muted print:text-black/80">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-accent print:text-black select-none">
                        •
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-line bg-bg/40 text-ink-muted print:bg-transparent print:border-black/30 print:text-black/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </Section>

        {/* Education */}
        <Section title="Education">
          {experience
            .filter((e) => e.role.toLowerCase().startsWith("bcsit"))
            .map((e, i) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-base print:text-black">
                    {e.role}
                  </h3>
                  <span className="text-sm font-mono text-ink-subtle print:text-black/60">
                    {e.period}
                  </span>
                </div>
                <p className="text-sm text-ink-muted print:text-black/70">
                  {e.company} · {e.location}
                </p>
              </div>
            ))}
        </Section>

        {/* Skills */}
        <Section title="Skills">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {skillGroups.map((g) => (
              <div key={g.title}>
                <div className="text-xs font-mono uppercase tracking-widest text-accent print:text-black mb-1">
                  {g.title}
                </div>
                <p className="text-sm text-ink-muted print:text-black/80">
                  {g.items.map((i) => i.name).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section title="Selected Projects">
          {projects.map((p) => (
            <div key={p.slug} className="mb-4 last:mb-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-medium text-base print:text-black">
                  {p.name}
                </h3>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent print:text-black/70"
                  >
                    {p.liveUrl.replace("https://", "")}
                  </a>
                )}
                <span className="ml-auto text-sm font-mono text-ink-subtle print:text-black/60">
                  {p.year}
                </span>
              </div>
              <p className="text-sm text-ink-muted print:text-black/80 mt-1">
                {p.description}
              </p>
              <p className="text-xs font-mono text-ink-subtle print:text-black/60 mt-1">
                {p.tech.join(" · ")}
              </p>
            </div>
          ))}
        </Section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-line print:border-black/20 text-xs font-mono text-ink-subtle print:text-black/60 text-center">
          References & detailed work samples available on request.
        </div>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="text-xs font-mono uppercase tracking-widest text-accent print:text-black mb-3 pb-1 border-b border-line print:border-black/20">
        {title}
      </h2>
      {children}
    </section>
  );
}
