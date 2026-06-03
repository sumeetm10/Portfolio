import type { Metadata } from "next";
import PostLayout from "@/components/blog/PostLayout";
import { getPost } from "@/lib/blog";

const SLUG = "shipping-realtime-data";

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
        I work on a real-time trading platform. Most days it works. Some days it
        doesn&apos;t, and those days teach you more than the good ones. Here&apos;s
        what running live market data for a year has shown me.
      </p>

      <h2>The 9:30 AM problem</h2>
      <p>
        Markets in Nepal open at 11:00 AM. By 10:45, our connections start
        warming up. By 11:00:00, a hundred WebSocket clients want to know what
        just printed. Everything works on a Wednesday at noon. The interesting
        questions are: what happens at 11:00:00 sharp on a Monday after a
        weekend of news?
      </p>
      <p>
        Three things matter at that exact moment:
      </p>
      <ul>
        <li>
          <strong>Backpressure.</strong> The upstream feed bursts. Clients can&apos;t
          drain that fast. Without something between them, the slow ones lock up
          the fast ones.
        </li>
        <li>
          <strong>Reconnects.</strong> When the upstream blips, every client
          notices within a second. Restarting them in a thundering herd is how
          you turn one outage into two.
        </li>
        <li>
          <strong>Stale state.</strong> Reconnects need a snapshot. Snapshots
          drift if you don&apos;t version them. Drift looks like phantom trades.
        </li>
      </ul>

      <h2>The shape of the fix</h2>
      <p>
        We sit a NestJS gateway between the upstream feed and the browser. It
        does three things, none of them clever on their own — but together they
        keep things calm at the open.
      </p>

      <h3>1. Drop, don&apos;t queue</h3>
      <p>
        For tick data, last-write-wins. If a client is 200ms behind, the price
        from 200ms ago is just noise. The gateway holds a small ring buffer per
        client and overwrites entries when they fill. Slow consumers never feel
        the burst — they just see the latest.
      </p>

      <pre>
        <code>{`// Pseudocode of the per-client buffer
class ClientBuffer {
  private latest: Map<string, Tick> = new Map();

  push(t: Tick) {
    // Symbol becomes the key — newer ticks overwrite older.
    this.latest.set(t.symbol, t);
  }

  drain(): Tick[] {
    const out = [...this.latest.values()];
    this.latest.clear();
    return out;
  }
}`}</code>
      </pre>

      <h3>2. Stagger the reconnect storm</h3>
      <p>
        When the gateway restarts, every client comes back at once. We add
        per-client jitter to the reconnect delay — 0 to 800ms — so the wave
        becomes a trickle. It&apos;s one of those changes that looks pointless
        until you watch the CPU graph at 11:00:00 with and without it.
      </p>

      <h3>3. Version the snapshot</h3>
      <p>
        Every tick has a sequence number. When a client reconnects, it sends
        its last <code>seq</code>. The gateway either returns the diff since
        that seq, or — if the gap is too wide — sends a full snapshot with a
        new base seq. The client knows which one it got and reconciles.
      </p>

      <h2>What I&apos;d tell past me</h2>
      <p>
        Real-time isn&apos;t about going fast — it&apos;s about going{" "}
        <strong>predictably</strong>. The fast path is easy. The slow path,
        the failure path, and the catch-up path are where reliability hides.
      </p>
      <p>
        If you&apos;re building anything that streams, write the
        backpressure-and-reconnect story first, even on a napkin. Don&apos;t
        wait for it to break in production at 11:00:00 on a Monday.
      </p>

      <blockquote>
        The fast path is easy. The slow path, the failure path, and the
        catch-up path are where reliability hides.
      </blockquote>

      <p>
        I&apos;ll write more about the snapshot-versioning bit specifically —
        there&apos;s a whole class of bugs hiding in that handshake that took
        me a month to track down.
      </p>
    </PostLayout>
  );
}
