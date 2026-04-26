# Sumeet Shrestha — Portfolio

A cinematic, SEO-optimized portfolio built with **Next.js 15**, **Tailwind CSS**, **GSAP**, and **Lenis**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

**Everything you'd want to edit lives in one file:** [`lib/data.ts`](lib/data.ts).

- `siteConfig` — name, role, tagline, URL, email, social links, keywords
- `about` — bio paragraphs, stats
- `skillGroups` — tech stack grouped by category
- `experience` — timeline entries (work + education)
- `projects` — featured & grid projects
- `services` — freelance offerings
- `jsonLd` — Schema.org structured data

Change a value, save, and the entire site updates.

## Project structure

```
app/
  layout.tsx              Root layout, fonts, metadata, JSON-LD
  page.tsx                Home — composes all sections
  globals.css             Tailwind layers + animations + print styles
  resume/page.tsx         Printable resume (Save as PDF in browser)
  resume/PrintButton.tsx  Triggers window.print()
  sitemap.ts              Dynamic sitemap.xml
  robots.ts               Dynamic robots.txt
  manifest.ts             PWA manifest
  opengraph-image.tsx     Generated 1200×630 OG image (edge runtime)

components/
  Navbar.tsx              Sticky nav with smooth-scroll
  Hero.tsx                Cinematic intro with GSAP timeline
  About.tsx               Bio + stats + photo
  Skills.tsx              Tech stack grid + marquee
  Experience.tsx          Timeline with scrub-animated line
  Projects.tsx            Featured + grid with 3D tilt on hover
  Services.tsx            Freelance services
  Contact.tsx             Big CTA + social links
  Footer.tsx
  SmoothScroll.tsx        Lenis wrapper, integrates with GSAP ticker
  CustomCursor.tsx        Magnetic dot + ring (desktop only)
  MagneticButton.tsx      Pull-toward-cursor button
  SectionHeading.tsx      Reusable animated heading

lib/data.ts               Single source of truth for all content
```

## SEO checklist

Already wired:

- [x] Title + description metadata template
- [x] Open Graph + Twitter Card
- [x] Generated 1200×630 OG image at `/opengraph-image`
- [x] `metadataBase` set in layout
- [x] Canonical URLs
- [x] `robots.txt` with sitemap reference
- [x] `sitemap.xml` listing every public route
- [x] **JSON-LD Person schema** including `worksFor`, `alumniOf`, `sameAs`
- [x] Semantic HTML — `<main>`, `<header>`, `<article>`, `<section>` with proper headings
- [x] `prefers-reduced-motion` respected
- [x] PWA manifest + theme color
- [x] Image optimization via `next/image`

## Before deploying — swap your domain

In [`lib/data.ts`](lib/data.ts), update `siteConfig.url`:

```ts
url: "https://your-real-domain.com",
```

That single line propagates to: page metadata, OG tags, canonical URL, sitemap URLs, JSON-LD, robots.txt sitemap reference.

## Deploy to Vercel (free)

1. Push this folder to a new GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Next.js — click **Deploy**.
4. You'll get `your-project.vercel.app` instantly.
5. (Optional) Buy a domain on Porkbun/Namecheap (~$12/yr) and add it under **Settings → Domains**.

## Resume

The `/resume` route renders a printer-friendly resume. Click **Save as PDF**
(top-right) — the browser's print dialog opens with print styles applied,
and `Save as PDF` produces the file.

To customize, edit the relevant sections of `lib/data.ts` (`experience`,
`skillGroups`, `projects`).

## Tech

- **Framework**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS v3
- **Animation**: GSAP 3 + ScrollTrigger + `@gsap/react`
- **Smooth scroll**: Lenis
- **Fonts**: Geist Sans + Geist Mono via `geist` package
- **Icons**: lucide-react

## Customizing the look

- **Accent color**: change `accent` in `tailwind.config.ts`. Currently `#38bdf8` (electric blue).
- **Avatar**: change `siteConfig.avatar` in `lib/data.ts`. Currently the GitHub avatar.
- **Animation intensity**: each component has a `useGSAP(() => { ... })` block. Tweak durations and easings there.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```

---

Built by Sumeet Shrestha · sthasumit676@gmail.com
