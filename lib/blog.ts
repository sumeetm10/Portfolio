// =============================================================
// Blog post registry — metadata only.
// Each post's body lives in app/blog/<slug>/page.tsx
// To add a new post:
//   1. Add an entry to this file
//   2. Create app/blog/<slug>/page.tsx that imports `getPost(<slug>)`
//   3. Done — sitemap, blog index, and home preview pick it up automatically
// =============================================================

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  // ISO date (YYYY-MM-DD) — kept as a string so SSG stays deterministic.
  date: string;
  readingTime: string;
  tags: string[];
  category: string;
}

export const posts: BlogPostMeta[] = [
  {
    slug: "shipping-realtime-data",
    title: "Shipping in real-time: lessons from a year on a trading platform",
    excerpt:
      "What I learned building live market data pipelines at NepseTrading — backpressure, reconnects, and the things you only catch at 9:30 AM on a Monday.",
    date: "2026-03-18",
    readingTime: "8 min read",
    tags: ["Real-time", "WebSockets", "NestJS", "Production"],
    category: "Engineering",
  },
  {
    slug: "internship-to-senior",
    title: "From intern to senior in three months — what actually happened",
    excerpt:
      "I joined NepseTrading as a 3-month intern. By the end of it I had a senior offer. Here's what worked, what didn't, and the advice I'd give anyone going through the same path.",
    date: "2026-02-04",
    readingTime: "6 min read",
    tags: ["Career", "Internship", "Growth"],
    category: "Career",
  },
  {
    slug: "why-rust",
    title: "Why I'm learning Rust (even though my job is JavaScript)",
    excerpt:
      "I write Next.js and NestJS every day. So why am I spending my evenings fighting the borrow checker? A short note on betting on the long game.",
    date: "2026-01-12",
    readingTime: "4 min read",
    tags: ["Rust", "Learning", "Career"],
    category: "Notes",
  },
];

export function getAllPosts(): BlogPostMeta[] {
  // Newest first
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRecentPosts(limit = 3): BlogPostMeta[] {
  return getAllPosts().slice(0, limit);
}

export function getPost(slug: string): BlogPostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
} {
  const sorted = getAllPosts();
  const idx = sorted.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}

export function formatDate(iso: string): string {
  // "2026-03-18" → "March 18, 2026"
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}
