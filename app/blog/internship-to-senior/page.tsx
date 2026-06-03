import type { Metadata } from "next";
import PostLayout from "@/components/blog/PostLayout";
import { getPost } from "@/lib/blog";

const SLUG = "internship-to-senior";

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
        I joined NepseTrading as a 3-month intern. By the end of it I had a
        senior developer offer. That sounds like a clean story but it
        wasn&apos;t — and I want to write down what actually happened in case
        it&apos;s useful to anyone walking the same path.
      </p>

      <h2>What I came in with</h2>
      <p>
        I wasn&apos;t the strongest candidate. I&apos;d built a couple of side
        projects (one of them was Learnify, a study app for my college
        program). I knew React. I knew enough Node to be dangerous. My
        TypeScript was Wikipedia-deep. I&apos;d never touched a real
        production codebase.
      </p>
      <p>
        What I did have: a Github graph that was mostly green, and a tendency
        to ship things end-to-end instead of finishing the easy 80%.
      </p>

      <h2>Month one: shut up and read</h2>
      <p>
        The thing nobody tells you about your first real codebase is how
        humbling it is. There are entire files you don&apos;t understand. The
        ones you do understand have decisions you wouldn&apos;t have made, and
        you don&apos;t yet know why they made them.
      </p>
      <p>
        I spent the first month doing two things:
      </p>
      <ul>
        <li>
          <strong>Reading.</strong> Not skimming — actually reading. I&apos;d
          pick a feature in the app, find where it started in the frontend,
          and trace it all the way to the database call. Then I&apos;d trace
          it back. After ten of these, the codebase stops feeling foreign.
        </li>
        <li>
          <strong>Asking why.</strong> Every time I saw a pattern I&apos;d not
          have used, I asked the senior dev about it. Half the time there was
          a great reason. The other half they&apos;d say &quot;huh, you&apos;re
          right, let&apos;s clean that up.&quot; Both were useful.
        </li>
      </ul>

      <h2>Month two: pick the boring tickets</h2>
      <p>
        When my first real tasks came in, I had a choice: pick the impressive
        feature, or pick the tickets nobody wanted. I picked the boring ones —
        flaky tests, slow queries, that one tooltip that flickered on
        Firefox.
      </p>
      <p>
        Two reasons this worked:
      </p>
      <ul>
        <li>
          Nobody else wanted them, so my PRs got reviewed fast and merged
          without competition.
        </li>
        <li>
          They forced me to understand the system from angles a feature ticket
          wouldn&apos;t. You don&apos;t debug a flaky test without learning the
          test runner, the CI config, and probably the deploy pipeline.
        </li>
      </ul>

      <h2>Month three: ship one real thing</h2>
      <p>
        By the third month I picked up one real feature end-to-end. Not the
        biggest one on the roadmap — but one with a clear shape, a real user,
        and a defined &quot;done.&quot; I shipped it on time. It worked.
      </p>
      <p>
        That single shipped feature did more for the offer conversation than
        any of the previous code I&apos;d written. Not because it was
        impressive — because it proved I could close.
      </p>

      <h2>What I&apos;d tell anyone starting</h2>

      <blockquote>
        Three months is enough time to prove you can ship, ask good
        questions, and pick up the codebase&apos;s rhythm. It&apos;s not
        enough time to be senior at anything — and that&apos;s fine.
      </blockquote>

      <ul>
        <li>
          <strong>Don&apos;t try to be the smartest person in the room.</strong>{" "}
          You&apos;re not. Try to be the most reliable.
        </li>
        <li>
          <strong>Write up what you learn.</strong> Even just for yourself.
          You&apos;ll re-read it in month two and realize how far you came.
        </li>
        <li>
          <strong>Read more code than you write.</strong> The ratio in your
          first month should be roughly 4:1.
        </li>
        <li>
          <strong>The boring tickets are the gold.</strong> Take them.
        </li>
      </ul>

      <p>
        The title on my offer letter was a bit of a surprise. I asked my
        manager what it meant in practice. He said: &quot;it means we&apos;d
        rather lose another senior than lose you.&quot; That&apos;s the only
        definition of senior I trust.
      </p>
    </PostLayout>
  );
}
