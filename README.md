# MOTIONA

**A place where art, identity and technology connect.**

MOTIONA is a creative art platform and artist-discovery site — a single-page,
editorially art-directed landing experience for an independent art platform. It
is built as a production-quality Next.js application: typed data, reusable
motion primitives, a token-driven design system, and generated original artwork
so the project ships with no third-party imagery.

The brand, copy, artwork, artist profiles and editorial content are all original
to this project.

---

## Screenshots

Add captures here once you have deployed or run the site locally.

| View | File |
| --- | --- |
| Desktop — hero and artwork cluster | `docs/screenshot-hero.png` |
| Desktop — editorial grid | `docs/screenshot-editorial.png` |
| Desktop — membership | `docs/screenshot-membership.png` |
| Mobile — navigation panel | `docs/screenshot-mobile-menu.png` |

> `docs/` is not created by the repo — add the folder alongside your captures.

---

## Features

**Page composition (14 sections)**

1. Sticky navigation with scroll-progress rule and full-screen mobile panel
2. Hero with masked line-by-line headline and a pointer-reactive artwork cluster
3. Scroll-driven artwork stack that fans out of a centre pile
4. Gateway carousel — three audiences, three artists, animated slide changes
5. Partner strip (marquee on mobile, static grid from `sm`)
6. Asymmetric curated collage with per-tile tilt that normalises on hover
7. Vision section with a Business / Personal switcher inside a browser panel
8. Community marquees running in opposite directions, pausable on hover
9. Magazine-style editorial grid with five distinct card treatments
10. Creative tools tab set with an animated pill indicator
11. Featured-artist feature with a clip-path portrait reveal and sticky column
12. Membership pricing with a working monthly/yearly toggle
13. Full-bleed lime manifesto banner with two counter-running text marquees
14. Journal stories, final call to action, and a detailed footer

**Interaction**

- Lenis smooth scrolling with anchor links that glide and move focus
- Scroll-linked parallax on images and drifting artwork fragments
- Magnetic pointer response on the hero cluster
- Newsletter form with native validation and a local confirmation state
- Follow toggle, plan toggle, tab groups and carousels all hold real state

**Verified**

- No horizontal overflow at 320 / 375 / 430 / 640 / 768 / 1024 / 1280 / 1440 / 1920
- Both signature animations run at every one of those widths
- No console or page errors at any breakpoint
- `prefers-reduced-motion` respected in both CSS and Framer Motion
- Keyboard-navigable throughout, with a focus-trapped mobile dialog
- Clean `next build`, `eslint` and `tsc --noEmit`

---

## Technology

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| Animation | Framer Motion 12 |
| Smooth scroll | Lenis |
| Icons | lucide-react |
| Images | `next/image`, local WebP generated with sharp |
| Linting | ESLint 9 with `eslint-config-next` |

No jQuery, no Bootstrap, no component library.

---

## Project structure

```
src/
  app/
    layout.tsx          Root shell, fonts, metadata, JSON-LD, skip link
    page.tsx            Section assembly; below-fold sections code-split
    globals.css         Design tokens, type scale, marquee keyframes
    sitemap.ts          Generated sitemap
    robots.ts           Generated robots.txt
  components/
    layout/             Navbar, MobileMenu, Footer, Logo
    sections/           One file per page section
    motion/             FadeUp, RevealText, ParallaxImage, MagneticButton,
                        ArtworkMarquee, ScrollProgress, FloatingCardStack,
                        SmoothScroll, MotionProvider
    ui/                 Button, SectionLabel, ArtworkCard, ArrowButton,
                        PricingCard
  data/                 artworks, artists, articles, pricing, navigation
  hooks/                useMediaQuery, useReducedMotion
  lib/utils.ts          cn(), accent maps, aspect maps
  types/index.ts        Artwork, Artist, Article, MembershipPlan, …
scripts/
  generate-images.mjs   Original artwork generator (see below)
public/
  images/
    artworks/           30 pieces
    artists/            6 covers + 6 avatars
    editorial/          8 story images
    collections/        6 collection covers
    og-cover.webp       Social preview
  mark.svg              Logo mark / favicon
```

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run gen:images` | Regenerate all artwork in `public/images` |
| `npm run video` | Record the social promo videos (see below) |

### Environment

Copy `.env.example` to `.env.local`. The single variable is optional in
development and only affects absolute URLs:

```
NEXT_PUBLIC_SITE_URL=https://motiona.studio
```

It feeds canonical URLs, the sitemap, `robots.txt` and Open Graph image
resolution. Set it in your hosting provider for production.

---

## Animation architecture

Motion is centralised in `src/components/motion` so sections stay declarative.

### The three signature moves

Everything else is supporting motion; these carry the identity of the page.

**1. Word-by-word heading reveal.** Every heading is built from `RevealText`.
Each word starts pale (`#C6C6C0`), then rises a fraction of a line and settles
to its final colour, staggered 55ms apart. Colour is animated per word rather
than through a class, so an accent word can settle to orange in the same pass:

```tsx
<RevealText
  as="h2"
  lines={["A place to discover", ["what", "moves", { text: "culture.", accent: true }]]}
/>
```

The stagger index runs across the whole heading rather than restarting per
line, so a multi-line statement reads as one continuous sweep.

**2. The hero fan.** Five cards begin squared up in a single pile at the centre
and spring outward into a shallow arc, staying heavily overlapped — the deck
reads as one object being spread, not five tiles arriving. Offsets are
percentages of each card's own width, so the overlap holds at any viewport.

**3. The diagonal cascade.** In the showcase section, cards staircase from the
top-left to the bottom-right as the section scrolls through, each one opening
slightly later than the last so the run unrolls rather than expanding at once.

Both compositions run at **every** width rather than degrading to a static
fallback on small screens — see Responsive below.

### Primitives

| Primitive | Role |
| --- | --- |
| `RevealText` / `WordReveal` | Word-by-word heading reveal; body-copy variant |
| `FadeUp` / `StaggerContainer` | Viewport-triggered reveal, optionally sequenced |
| `FloatingCardStack` | Hero fan — entrance, pointer follow, idle drift |
| `useBreakpoint` | Coarse breakpoint for JS-computed geometry |
| `ParallaxImage` | Scroll-linked drift; softer on mobile, off when reduced |
| `MagneticButton` | Pointer attraction, desktop only |
| `ArtworkMarquee` / `TextMarquee` | Seamless CSS marquees |
| `ScrollProgress` | Reading-progress rule under the header |
| `SmoothScroll` | Lenis lifecycle plus anchor-link handling |
| `MotionProvider` | `MotionConfig reducedMotion="user"` |

Three conventions keep it predictable:

- **Transform-only.** Nothing animates a property that triggers layout, so no
  section can shift the page while it animates.
- **Marquees are CSS, not JavaScript.** Each track renders its content twice and
  translates exactly `-50%`, so the loop has no seam and stays off the main
  thread. `prefers-reduced-motion` stops them with a plain media query.
- **Layered transforms in the hero.** Entrance, pointer-follow and idle drift
  live on three nested elements because each has a different lifetime; none has
  to interrupt or recompute the others.

### Responsive

The two signature compositions are geometric, not CSS-layout, so media queries
alone cannot resize them — their offsets are numbers. Both read the coarse
breakpoint from `useBreakpoint()` (`base` / `md` / `lg`) and pick a geometry
config, rather than being hidden and swapped for a simpler layout:

- **Hero fan** — `cardWidth` and `spread` per breakpoint. The deck's total span
  is `cardWidth × (1 + 2 × spread ÷ 100)`, kept inside the page gutter at every
  size. Handle pills scale with it.
- **Diagonal cascade** — `cardWidth`, `stepX`, `stepY` and origin per
  breakpoint. The stage's `aspect-ratio` is *derived* from the run rather than
  hard-coded, so the last card is always inside it:
  `height ÷ width = (cardWidth × cardAspect) ÷ (100 − lastY)`. `stepX` relative
  to `cardWidth` sets the overlap, held around 55–65% so narrow screens do not
  bury the artwork.

`useBreakpoint()` returns `"base"` on the server and first client render so
hydration matches; both consumers animate in on a delay, so the real
configuration is in place before anything is visible.

Verified with no horizontal overflow and no console errors at 320, 375, 430,
640, 768, 1024, 1280, 1440 and 1920, with both compositions asserted present at
each.

### Reduced motion

Two mechanisms, because there are two kinds of animation:

- `globals.css` neutralises CSS animations and transitions, including marquees.
- `MotionProvider` sets Framer Motion's `reducedMotion="user"`, which drops
  transform and layout animation while still allowing opacity — content arrives
  without sliding or parallaxing.

`SmoothScroll` and `MagneticButton` also opt out entirely, restoring native
scrolling and disabling pointer tracking.

---

## Images

Every image in `public/images` is generated by `scripts/generate-images.mjs`
from seeded geometry and rasterised to WebP with sharp. There is no third-party
photography, no hotlinking, and nothing to license. Output is deterministic —
the same seed always produces the same composition, so regenerating never churns
the repo.

```bash
npm run gen:images
```

The generator composes eleven abstract styles (truchet fields, strata, halftone
screens, cut-paper portrait collages, apertures, lattices and more) across a set
of named palettes, with print grain and a vignette baked in at generation time
so they cost nothing at runtime.

### Replacing images with your own

1. Drop your files into the matching folder under `public/images`, keeping the
   naming pattern (`artwork-01.webp`, `artist-01.webp`, `avatar-01.webp`, …).
2. Match the aspect ratios so nothing shifts: artworks are 3:4, 2:3, 1:1 or 8:5;
   artist covers are 2:3; avatars are 1:1; editorial is 8:5 or 3:4.
3. Update the titles, artists and `orientation` fields in `src/data/artworks.ts`
   — `orientation` drives the card shape, so it must match the file.
4. If you no longer need the generator, delete `scripts/generate-images.mjs`,
   the `gen:images` script and the `sharp` devDependency.

For remote images, add the host to `images.remotePatterns` in `next.config.ts`
first; Next.js will refuse to optimise an unconfigured origin.

---

## Deployment (Vercel)

1. Push the repository to GitHub, GitLab or Bitbucket.
2. In Vercel, **Add New → Project** and import it. The framework preset is
   detected automatically; no build settings need changing.
3. Add the environment variable `NEXT_PUBLIC_SITE_URL` with your production
   origin (for example `https://motiona.studio`) for the Production
   environment.
4. Deploy.

The build is fully static, so it also deploys cleanly to Netlify, Cloudflare
Pages, or any Node host via `npm run build && npm run start`.

---

## Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`, each
  labelled with `aria-labelledby` or `aria-label`
- Single `h1`, with a section-per-`h2` hierarchy below it
- Skip link to the main content as the first tab stop
- Mobile menu is a true dialog: `aria-modal`, focus moved in on open, Tab
  trapped, Escape to close, focus returned to the trigger, page scroll locked
- Tab groups use `role="tablist"` / `role="tab"` / `role="tabpanel"` with
  `aria-selected` and `aria-controls`
- Every icon-only control has an `aria-label`; the follow button reports
  `aria-pressed`; the carousel counter is an `aria-live` region
- Visible focus ring on all interactive elements, offset from the target
- Decorative images use empty `alt`; duplicated marquee items are `aria-hidden`
- Overlay gradients on image cards are weighted toward the type so white text
  stays legible regardless of the artwork beneath

### Known gaps

- Contrast was reviewed against the shipped artwork. If you replace the images
  with lighter ones, re-check the white text on the editorial and journal cards.
- No automated axe or Lighthouse run is committed — worth adding to CI.

---

## Performance

- All below-fold sections are `next/dynamic`, so the initial bundle carries only
  the hero and the sections above it
- Only the first two hero artworks are `priority`; everything else lazy-loads
- Every image has an explicit aspect ratio, so there is no cumulative layout
  shift
- A single variable font family (Geist, `display: swap`) — no second request
- Marquees animate on the compositor via CSS transforms
- Grain and vignette are baked into the WebP files rather than rendered as
  runtime SVG filters
- Scroll and pointer listeners are passive and cleaned up on unmount

Lighthouse was not run as part of this build — measure against your own
deployment before quoting scores.

---

## Scope

This is a front-end build. A few surfaces are deliberately visual only:

- **Membership** does not connect to a payment provider. The toggle and pricing
  are real state; checkout is not implemented.
- **The newsletter form** validates natively and confirms locally. It does not
  post anywhere, so nothing is silently dropped.
- **Search and account** buttons in the header are present and labelled but not
  wired to a destination.
- **Navigation links** resolve to in-page sections; there are no sub-routes yet.

---

## Future improvements

- Real routes for artists, collections and journal articles
- CMS or MDX behind the editorial content
- Search with filtering by discipline, colour and year
- Authentication and a real membership checkout
- Automated accessibility and visual-regression tests in CI
- `next/image` blur placeholders generated alongside the artwork
- Locale routing behind the footer language selector
