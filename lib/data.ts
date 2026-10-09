// =============================================================
// Single source of truth for all portfolio content.
// Edit here — every section reads from this file.
// =============================================================

export const siteConfig = {
  name: "Sumeet Shrestha",
  shortName: "Sumeet",
  initials: "SS",
  role: "Full-Stack Developer",
  tagline: "Full-Stack Developer crafting real-time, data-driven web experiences.",
  description:
    "Senior Developer at NepseTrading. I build fast, reliable web platforms — real-time data feeds, interactive charts, and full-stack applications with Next.js, NestJS, and Postgres.",
  // ⚠️ Swap this with your real domain before deploy (e.g. https://sumeetshrestha.dev)
  url: "https://sumeetshrestha.vercel.app",
  ogImage: "/og.png",
  location: "Kathmandu, Nepal",
  email: "sthasumit676@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/245657544?v=4",
  resumeFile: "/resume", // Routes to printable resume page
  links: {
    github: "https://github.com/sumeetm10",
    linkedin: "https://www.linkedin.com/in/sumeet-shrestha-435650345/",
    email: "mailto:sthasumit676@gmail.com",
  },
  keywords: [
    "Sumeet Shrestha",
    "Full-Stack Developer",
    "Next.js Developer",
    "NestJS Developer",
    "React Developer Nepal",
    "TypeScript Engineer",
    "NepseTrading",
    "Real-time Data Developer",
    "Postgres Developer",
    "Portfolio",
    "Web Developer Kathmandu",
    "Freelance Developer Nepal",
  ],
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Writing", href: "/blog" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

// =============================================================
// ABOUT
// =============================================================
export const about = {
  heading: "Building things that move markets — and minds.",
  paragraphs: [
    "I'm Sumeet — a full-stack developer based in Kathmandu, currently shipping production features at NepseTrading while finishing my BCSIT at Shubhashree College of Management.",
    "I gravitate toward the parts of the stack where things have to be right: real-time data pipelines, interactive charts, and APIs that don't blink under load. I care about details — the kind users feel but can't name.",
    "When I'm not at work or in class, I'm experimenting with Rust and Kubernetes, or building side projects to learn out loud.",
  ],
  stats: [
    { value: "8+", label: "Months in production" },
    { value: "10+", label: "Features shipped" },
    { value: "3+", label: "Years coding" },
    { value: "∞", label: "Curiosity" },
  ],
};

// =============================================================
// SKILLS
// =============================================================
export const skillGroups = [
  {
    title: "Frontend",
    items: [
      { name: "React", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "HTML5", level: "Advanced" },
      { name: "JavaScript", level: "Advanced" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "NestJS", level: "Advanced" },
      { name: "Node.js", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Prisma", level: "Intermediate" },
      { name: "REST APIs", level: "Advanced" },
      { name: "WebSockets", level: "Intermediate" },
    ],
  },
  {
    title: "DevOps & Tools",
    items: [
      { name: "Docker", level: "Intermediate" },
      { name: "Kubernetes", level: "Beginner" },
      { name: "Git", level: "Advanced" },
      { name: "Linux", level: "Intermediate" },
      { name: "CI/CD", level: "Intermediate" },
      { name: "Vercel", level: "Advanced" },
    ],
  },
  {
    title: "Currently Learning",
    items: [
      { name: "Rust", level: "Beginner" },
      { name: "Kubernetes", level: "Beginner" },
      { name: "System Design", level: "Intermediate" },
      { name: "Distributed Systems", level: "Beginner" },
    ],
  },
];

// =============================================================
// EXPERIENCE TIMELINE
// =============================================================
export const experience = [
  {
    role: "Senior Developer",
    company: "NepseTrading",
    companyUrl: "https://nepsetrading.com",
    period: "2025 — Present",
    location: "Kathmandu, Nepal",
    description:
      "Building and maintaining the core of NepseTrading — from real-time market data feeds to interactive trading charts. Bring technical excellence and creative problem-solving to every feature.",
    bullets: [
      "Architect and ship core features for the NepseTrading platform serving Nepali market traders",
      "Build real-time data pipelines for live market quotes and order book streaming",
      "Develop interactive charting modules with smooth, performant rendering",
      "Collaborate across product, design, and ops to deliver production-ready releases",
    ],
    tech: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "WebSockets", "Docker"],
  },
  {
    role: "Full-Stack Developer Intern",
    company: "NepseTrading",
    companyUrl: "https://nepsetrading.com",
    period: "2024 — 2025 (3 months)",
    location: "Kathmandu, Nepal",
    description:
      "Three-month internship that converted into a full-time Senior Developer offer. Onboarded into the codebase and contributed to live features from week one.",
    bullets: [
      "Picked up the production stack quickly — Next.js, NestJS, Postgres, Docker",
      "Shipped real features alongside the senior team during the internship",
      "Earned a full-time conversion offer at the end of the program",
    ],
    tech: ["Next.js", "NestJS", "TypeScript", "PostgreSQL"],
  },
  {
    role: "BCSIT — Bachelor of Computer Science & IT",
    company: "Shubhashree College of Management",
    companyUrl: "https://shubhashreecollege.edu.np/",
    period: "Currently Enrolled",
    location: "Kathmandu, Nepal",
    description:
      "Pursuing a Bachelor's in Computer Science & Information Technology while working full-time. Balancing academic fundamentals with hands-on production engineering.",
    bullets: [
      "Coursework: Data Structures, DBMS, Web Tech, OS, Networks, Software Engineering",
      "Applying classroom theory directly to NepseTrading's production work",
    ],
    tech: ["Computer Science", "Software Engineering", "Databases", "Networks"],
  },
];

// =============================================================
// PROJECTS
// =============================================================
export const projects = [
  {
    slug: "nepsetrading",
    name: "NepseTrading Platform",
    tagline: "Real-time trading platform for the Nepali stock market.",
    description:
      "Production trading platform I build and maintain at NepseTrading. Live market data, interactive charts, order management, and a UI that traders actually trust during open-market hours.",
    role: "Senior Developer",
    year: "2025 — Present",
    tech: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "WebSockets", "Docker"],
    highlights: [
      "Real-time price streams with millisecond-level updates",
      "Interactive charting with smooth zoom and pan",
      "Production-grade auth, rate limiting, and observability",
    ],
    liveUrl: "https://nepsetrading.com",
    repoUrl: null,
    featured: true,
    category: "Production",
  },
  {
    slug: "wired-future",
    name: "Wired Future",
    tagline: "Agent-native 3D canvas — a human and an AI agent drive the same screen.",
    description:
      "Built for the OpenAI WebMCP Challenge. Human UI events and AI agent tool calls flow through a single state-patch path, so when the agent recolours the scene the human's controls move to match — no sync code. Verified live on stable Chrome via the WebMCP origin trial, exposing 20 tools to the agent.",
    role: "Solo Developer",
    year: "2026",
    tech: ["TypeScript", "React", "Three.js", "Zustand", "WebMCP"],
    highlights: [
      "One code path for human and agent actions — every change attributed [HUMAN] / [AGENT]",
      "React and Three.js fully decoupled through a single zustand store",
      "20 WebMCP tools live on stable Chrome, no flags required",
    ],
    liveUrl: "https://sumeetm10.github.io/wired-future/",
    repoUrl: "https://github.com/sumeetm10/wired-future",
    featured: true,
    category: "Hackathon",
  },
  {
    slug: "learnify",
    name: "Learnify",
    tagline: "Study companion for BBA, BCSIT, and BHM students.",
    description:
      "Educational platform giving college students one place to access course materials, take MCQ quizzes with instant feedback, and track their progress across the semester.",
    role: "Solo Developer",
    year: "2026",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
    highlights: [
      "Browser-based PDF reader for course materials",
      "Interactive MCQ quizzes with instant feedback",
      "Per-user progress tracking across subjects",
    ],
    liveUrl: "https://learnify-next.vercel.app",
    repoUrl: "https://github.com/sumeetm10/learnify-next",
    featured: true,
    category: "Side Project",
  },
  {
    slug: "atlas-on-foot",
    name: "Atlas On Foot",
    tagline: "Automated YouTube Shorts channel — “Can you walk from X to Y?”",
    description:
      "Map journeys and geography questions drawn in code from real borders on NASA satellite imagery. GitHub Actions builds and posts two Shorts a day, with Gemini-written narration checked against computed facts.",
    role: "Solo Developer",
    year: "2026",
    tech: ["TypeScript", "Remotion", "Python", "GitHub Actions", "Gemini"],
    highlights: [
      "Fully automated pipeline: render → narrate → upload, twice daily",
      "Narration fact-checked against computed geographic data",
      "Redundant cron triggers so a skipped run never misses a post",
    ],
    liveUrl: null,
    repoUrl: "https://github.com/sumeetm10/geo-shorts",
    featured: false,
    category: "Automation",
  },
  {
    slug: "storytime-ink",
    name: "Story_time10",
    tagline: "Hand-drawn ink history episodes, rendered entirely in code.",
    description:
      "Animated episodes about how ancient humans lived, drawn in a hand-drawn ink style with Remotion, narrated with a free voice, scored with synthesized music, and auto-published every two days.",
    role: "Solo Developer",
    year: "2026",
    tech: ["Remotion", "TypeScript", "Python", "GitHub Actions"],
    highlights: [
      "Wikipedia-checked facts and shot lists per episode",
      "Voice, render, music and mix fully scripted",
      "Two-day publishing cycle on GitHub Actions",
    ],
    liveUrl: null,
    repoUrl: "https://github.com/sumeetm10/storytime-ink",
    featured: false,
    category: "Automation",
  },
  {
    slug: "human-manual",
    name: "The Human Manual",
    tagline: "“What if…?” Shorts told through the human body.",
    description:
      "A YouTube Shorts channel drawn in code — what-if scenarios and food journeys through the body. Every fact is hand-written and rounded; no model writes or changes a number.",
    role: "Solo Developer",
    year: "2026",
    tech: ["Python", "Remotion", "TypeScript", "GitHub Actions"],
    highlights: [
      "No stock footage — every frame drawn in code",
      "Facts hand-curated; AI used only for voice",
      "Two scheduled posts a day via GitHub Actions",
    ],
    liveUrl: null,
    repoUrl: "https://github.com/sumeetm10/human-manual",
    featured: false,
    category: "Automation",
  },
  {
    slug: "news-tools",
    name: "NEPSE News Tools",
    tagline: "Announcement scraper + OCR pipeline feeding the NepseTrading backend.",
    description:
      "Scrapes ShareSansar announcements, uses Gemini as OCR for image-based notices, and batch-posts bilingual (English/Nepali) news to the NepseTrading API — with a dry-run mode and a two-step confirmation before anything goes live.",
    role: "Senior Developer",
    year: "2026",
    tech: ["Node.js", "JavaScript", "Gemini", "REST APIs"],
    highlights: [
      "Gemini OCR extracts text from image announcements",
      "Bilingual English / Nepali posting",
      "Safety rails: dry-run flag and typed double confirmation",
    ],
    liveUrl: null,
    repoUrl: "https://github.com/sumeetm10/Announcement",
    featured: false,
    category: "Tooling",
  },
  {
    slug: "jw-landscaping",
    name: "J&W Landscaping",
    tagline: "One-page business site concept with motion and a before/after gallery.",
    description:
      "Website mockup for a landscaping business — responsive one-pager with Motion animations, a before/after photo gallery, a scripted image-processing pipeline, and data-driven content.",
    role: "Freelance",
    year: "2026",
    tech: ["React", "TypeScript", "Vite", "Tailwind v4", "Motion"],
    highlights: [
      "Before/after gallery from a scripted image pipeline",
      "Verified at 1440 / 768 / 375 / 320 breakpoints",
      "All business content driven from one data file",
    ],
    liveUrl: "https://jw-landscaping.vercel.app",
    repoUrl: "https://github.com/sumeetm10/jw-landscaping",
    featured: false,
    category: "Client Work",
  },
  {
    slug: "dashboard-ui",
    name: "Dashboard UI",
    tagline: "Modern admin dashboard interface kit.",
    description:
      "A polished dashboard UI exploring layout patterns, data-density, and responsive breakpoints. Built as a reference implementation for admin-style projects.",
    role: "Solo Developer",
    year: "2025",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Responsive layout with sidebar navigation",
      "Reusable widget and chart components",
      "Clean, accessible design system",
    ],
    liveUrl: null,
    repoUrl: "https://github.com/sumeetm10/dashboard_ui",
    featured: false,
    category: "Side Project",
  },
];

// =============================================================
// SERVICES (FREELANCE)
// =============================================================
export const services = [
  {
    title: "Full-Stack Web Apps",
    description:
      "End-to-end web applications with Next.js, NestJS, and Postgres. Auth, dashboards, APIs, deployments — the full pipeline.",
    deliverables: ["Auth & user systems", "Custom dashboards", "REST/WebSocket APIs", "Database design"],
  },
  {
    title: "Real-Time Dashboards",
    description:
      "Live data dashboards with charts, streams, and high-density UIs. My specialty — what I do every day at NepseTrading.",
    deliverables: ["WebSocket streams", "Interactive charts", "Live KPI displays", "Performance tuning"],
  },
  {
    title: "Frontend Engineering",
    description:
      "Pixel-perfect, animated marketing sites and web apps. SEO-optimized, fast, and accessible.",
    deliverables: ["Next.js apps", "GSAP animations", "SEO setup", "Lighthouse 95+"],
  },
  {
    title: "Backend & APIs",
    description:
      "Robust NestJS / Node.js APIs with Postgres, Prisma, and clean architecture. Containerized and deploy-ready.",
    deliverables: ["NestJS APIs", "DB schema design", "Docker setup", "API documentation"],
  },
];

// =============================================================
// SEO METADATA HELPERS
// =============================================================
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  email: siteConfig.email,
  url: siteConfig.url,
  image: siteConfig.avatar,
  worksFor: {
    "@type": "Organization",
    name: "NepseTrading",
    url: "https://nepsetrading.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Shubhashree College of Management",
    url: "https://shubhashreecollege.edu.np/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "Nepal",
  },
  sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
  knowsAbout: [
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "Real-time systems",
  ],
};
