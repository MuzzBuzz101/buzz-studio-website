# Buzz Studio — Cinematic Portfolio

A premium, cinematic, OLED-dark portfolio for Syed Muzammil Shah Kazmi (Buzz Studio) — Creative Producer, Cinematographer, Editor & Commercial Photographer. Content is sourced from the real CV: food & beverage retainers, real estate, fashion, and music-video work for clients like Raccoon Restaurant, Big Bites Fast Food, Shawn X, Keyvant Real Estate, and LADRE.

> **Note:** No placeholder photography ships with the site. Case-study copy, roles, clients, and specs come from the real CV; cover photos, galleries, and stills are intentionally empty until real assets are added — see "Adding Real Media" below.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 + `tailwindcss-animate` |
| Animation | Framer Motion (UI/scroll reveals) + GSAP `ScrollTrigger` (parallax) |
| Smooth Scroll | Lenis (paired with GSAP's ticker for inertia scroll) |
| UI Primitives | Radix UI (Dialog, Tabs, Select) styled as shadcn-style components |
| Icons | Lucide React |
| Fonts | Playfair Display (display/serif) + Inter (body) + JetBrains Mono (specs/labels) |

## Getting Started

```bash
npm install
npm run dev
```

> Measure performance against `npm run build && npm run start`, not `npm run dev` — the
> dev server compiles on demand and is not representative.

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project Structure

```
src/
  app/
    layout.tsx            Root layout — fonts, metadata, header/footer, providers
    page.tsx               Homepage — assembles all sections
    globals.css             Theme tokens, scrollbar, selection, film-grain utility
    work/[slug]/page.tsx    Case study detail template (SSG via generateStaticParams)
  components/
    ui/                     Reusable primitives: Button, CustomCursor, Dialog, Tabs,
                            Select, VideoPlayer, VideoModal, VimeoEmbed, ProjectCard, Lightbox
    layout/                 Header, Footer, SmoothScrollProvider
    sections/               Hero, SelectedWorks, MotionStillsSection, PipelineSection,
                            ClientsTicker, ContactSection, case-study-reveal
  data/                     Mock content — projects.ts, stills.ts, pipeline.ts, site.ts
  types/                    Shared TypeScript interfaces (Project, StillPhoto, etc.)
  lib/utils.ts              `cn()` class merge helper
```

## Content Model

All content is mock JSON-style data in `src/data/`, fully typed via `src/types/index.ts`. Swap in real content by editing:

- `src/data/projects.ts` — case studies (specs, gear, gallery, Vimeo ID)
- `src/data/stills.ts` — photography grid (camera/lens/lighting metadata)
- `src/data/pipeline.ts` — capability pillars, gear manifesto, client logos, awards
- `src/data/site.ts` — site name, tagline, contact links, nav

## Adding Real Media

- **Hero showreel**: drop a muted looping `.mp4` at `public/videos/showreel.mp4`, then pass it to the hero: `<Hero videoSrc="/videos/showreel.mp4" />` in `src/app/page.tsx`. Until then, the hero renders an animated grain/gradient placeholder — never a broken video.
- **Case study video**: each project supports a self-hosted `videoSrc` (rendered via `LocalVideoEmbed`, see `raw-footage/README.md` for the compression workflow) or a `vimeoId` (rendered via `VimeoEmbed`). Omit both to fall back to the "available on request" state.
- **Images**: `coverImage` is optional on `Project` — leave it unset and the UI shows a clean dark placeholder tile instead of a broken image. Add real photos to `public/images/` and reference them via `coverImage` / `gallery` on projects in `src/data/projects.ts`, and via `stills` in `src/data/stills.ts`. If you move assets to a CDN, add the host to `images.remotePatterns` in `next.config.mjs`.

## Performance Notes

The rules below are deliberate; changing them will regress load or scroll performance.

- **Above-the-fold content never depends on JS.** The hero reveal is a CSS animation with
  staggered `animation-delay`, not Framer Motion, so it paints on first render instead of
  waiting for the bundle to hydrate. Don't reintroduce `initial={{ opacity: 0 }}` in the hero.
- **Scroll reveals use `components/ui/reveal.tsx`** (IntersectionObserver + a CSS transition,
  one re-render per element) rather than Framer Motion `whileInView`. A `<noscript>` rule in
  the root layout un-hides them when JS is unavailable.
- **Animate transforms and opacity only.** The hero sheen animates `translate3d` rather than
  `background-position`, and the custom cursor animates `scale` rather than `width`/`height` —
  both avoid per-frame layout and full-viewport repaints.
- **The custom cursor never calls `setState` on `mousemove`.** Position goes through motion
  values and hit-testing is throttled to one DOM traversal per animation frame.
- **Heavy dependencies load on demand:** GSAP + ScrollTrigger and Lenis are dynamically
  imported inside effects, the lightbox mounts on first photo click, and case-study video is a
  click-to-load facade instead of an eager Vimeo iframe.
- **Images are local and pre-sized** so the optimizer never makes a third-party round trip.

## Design System Notes

- **Custom cursor** (`components/ui/custom-cursor.tsx`) reads `data-cursor` / `data-cursor-text` attributes on any element to morph into "View", "Drag", "Close", etc. Disabled automatically on touch devices.
- **Smooth scroll**: `SmoothScrollProvider` wires Lenis into GSAP's ticker so `ScrollTrigger`-based parallax (see `Hero`) stays in sync with inertia scrolling.
- **OLED theme**: colors live in `tailwind.config.ts` under `obsidian` (background/foreground scale), `silver` (muted text), and `accent` (gold callouts). Adjust there to reskin globally.

## Known Trade-offs

- Pinned to **Next.js 14.2.x** / React 18 / Tailwind 3 per spec (rather than the latest Next 16 / Tailwind 4 that `create-next-app` ships by default). `npm audit` will flag a couple of high-severity advisories that only have fixes in Next 15/16 — acceptable for this stack choice, but worth revisiting if you later upgrade.
- No backend/CMS is wired up. The contact form composes a `mailto:` link client-side; swap `handleSubmit` in `contact-section.tsx` for a real API route or form service (Resend, Formspree, etc.) when ready.
