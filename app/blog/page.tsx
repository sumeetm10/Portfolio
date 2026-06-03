import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "Writing",
  description: `Notes, lessons, and essays from ${siteConfig.name} — full-stack developer at NepseTrading. Real-time systems, career growth, and what I'm learning.`,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Writing — ${siteConfig.name}`,
    description: `Notes, lessons, and essays from ${siteConfig.name}.`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return <BlogIndex posts={posts} />;
}
