"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/data";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".contact-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        scrollTrigger: { trigger: ".contact-block", start: "top 80%" },
      });
      gsap.from(".contact-line", {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-block", start: "top 75%" },
      });
      gsap.from(".contact-link", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        scrollTrigger: { trigger: ".contact-block", start: "top 70%" },
      });
      // Film-credits sign-off
      gsap.from(".contact-credits > *", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        stagger: 0.18,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-credits", start: "top 92%" },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-40 px-6 lg:px-10 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="contact-block">
        <div className="contact-eyebrow inline-flex items-center gap-2 mb-8 text-xs font-mono uppercase tracking-widest text-accent">
          <span className="h-px w-8 bg-accent" />
          Epilogue — Your Move
        </div>

        <h2 className="font-display font-medium text-display-xl tracking-tighter leading-[0.95]">
          <span className="block overflow-hidden">
            <span className="contact-line block">Let&apos;s build</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-line block text-gradient">something</span>
          </span>
          <span className="block overflow-hidden">
            <span className="contact-line block text-ink-muted">together.</span>
          </span>
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-3">
              Drop a line
            </div>
            <a
              href={siteConfig.links.email}
              className="contact-link inline-flex items-center gap-3 text-2xl md:text-3xl font-display font-medium text-ink hover:text-accent transition-colors group"
            >
              {siteConfig.email}
              <ArrowUpRight
                size={24}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
            <p className="mt-4 text-ink-muted">
              I read every email. Expect a reply within 24–48 hours.
            </p>
          </div>

          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-ink-subtle mb-3">
              Find me online
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link group flex items-center justify-between py-3 border-b border-line hover:border-accent/60 transition-colors"
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Github size={18} /> GitHub
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link group flex items-center justify-between py-3 border-b border-line hover:border-accent/60 transition-colors"
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Linkedin size={18} /> LinkedIn
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.email}
                  className="contact-link group flex items-center justify-between py-3 border-b border-line hover:border-accent/60 transition-colors"
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Mail size={18} /> Email
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-subtle transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Film-credits sign-off */}
        <div className="contact-credits mt-32 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-subtle">
            ✦ &nbsp;The end — of the beginning&nbsp; ✦
          </div>
          <p className="mt-4 font-mono text-xs text-ink-subtle">
            Written, designed &amp; engineered by {siteConfig.name} · Kathmandu, Nepal
          </p>
          <p className="mt-1 font-mono text-[10px] text-ink-dim">
            No template was harmed in the making of this portfolio.
          </p>
        </div>
      </div>
    </section>
  );
}
