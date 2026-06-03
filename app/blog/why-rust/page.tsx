import type { Metadata } from "next";
import PostLayout from "@/components/blog/PostLayout";
import { getPost } from "@/lib/blog";

const SLUG = "why-rust";

export const metadata: Metadata = {
  title: getPost(SLUG)?.title,
  description: getPost(SLUG)?.excerpt,
  alternates: { canonical: `/blog/${SLUG}` },
  openGraph: {
    title: getPost(SLUG)?.title,
    description: getPost(SLUG)?.excerpt,
    type: "article",
    publishedTime: getPost(SLUG)?.date,
  },
};

export default function Post() {
  const meta = getPost(SLUG);
  if (!meta) return null;

  return (
    <PostLayout meta={meta}>
      <p>
        I write Next.js and NestJS at work. I&apos;m good at it. My career
        won&apos;t need Rust for at least a couple more years. So why am I
        spending my evenings fighting the borrow checker?
      </p>

      <h2>The short answer</h2>
      <p>
        Because the languages I write fast in don&apos;t teach me anything new
        anymore.
      </p>
      <p>
        That&apos;s not arrogance — TypeScript is wonderful and I learn
        ecosystem things in it every week. But the <em>shape</em> of how I
        think about a problem hasn&apos;t changed in two years. I open a
        file, I write a function, I push state up, I memoize when it gets
        slow. The grooves are deep.
      </p>
      <p>
        Rust resets the grooves.
      </p>

      <h2>What it&apos;s actually teaching me</h2>

      <h3>Ownership thinking</h3>
      <p>
        Every Rust program asks: <em>who owns this data, who borrows it, and
        for how long?</em> In TypeScript I never had to answer that question
        because the garbage collector did it for me. The cost: I built bugs
        where async handlers held references they shouldn&apos;t have, and I
        couldn&apos;t articulate why.
      </p>
      <p>
        After a few weekends with Rust, I started spotting those patterns in
        the JavaScript I write daily. That&apos;s the unlock.
      </p>

      <h3>Errors as values</h3>
      <p>
        Rust&apos;s <code>Result&lt;T, E&gt;</code> doesn&apos;t let you forget
        that things fail. You get the value or the error; both are equally
        present in the type system. Coming from a world where I could
        accidentally not <code>await</code> something and silently swallow a
        failure, this feels like cheating.
      </p>

      <h3>Slowness is honest</h3>
      <p>
        I&apos;m slow in Rust. <em>Really</em> slow — fighting the compiler
        for an hour over what would be a five-minute change in TypeScript.
        That feels bad. But the slowness is honest: the compiler is teaching
        me something I&apos;d have skipped over otherwise.
      </p>

      <h2>What I&apos;m not doing</h2>
      <p>
        I&apos;m not rewriting our backend in Rust. I&apos;m not chasing it
        because someone on Hacker News said NestJS is dead. NestJS is great.
        It pays my rent.
      </p>
      <p>
        I&apos;m doing Rust for the same reason I&apos;d learn a new
        instrument — not to replace the one I play, but to hear my main
        instrument differently.
      </p>

      <blockquote>
        Learn the language that makes you uncomfortable, not the one that
        gets you the next ticket done faster.
      </blockquote>

      <h2>A specific habit, if you want to try it</h2>
      <p>
        I do <strong>30 minutes a day, 5 days a week</strong>. Tiny.
        Embarrassingly tiny. But it compounds, and crucially I don&apos;t
        burn out and quit by week three.
      </p>
      <p>
        Right now I&apos;m working through Jon Gjengset&apos;s &quot;Rust for
        Rustaceans&quot; — half my reading time on the book, half on
        Advent-of-Code-style problems. Slow but steady.
      </p>
      <p>
        Six months from now I&apos;ll write a follow-up. Either I&apos;ll
        have something to show for it, or I&apos;ll have learned why this
        plan didn&apos;t work for me. Both are interesting answers.
      </p>
    </PostLayout>
  );
}
