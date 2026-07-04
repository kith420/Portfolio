# Build Brief — Kith Portfolio

Handoff doc for building the portfolio in Cursor. Read this and the files in `/reference` before writing code.

---

## 0. What this is

A single scrollable one-page portfolio, five sections in scroll order:
**Hero → Experience → Competitions → Work → Contact.**
Each section has its own structural metaphor (no repeated card pattern). The section-to-section transitions ("seams") are designed and matter as much as the sections.

## 1. Source of truth — read before building

Two kinds of reference, and they rank differently:

- **Prototypes (`/reference/*.html`) = source of truth for BEHAVIOR.** They contain the exact easing, timing, scroll-scrubbed transforms, forced-reflow ordering, and the seam mechanics. **Do not reinvent the animations.** Port the behavior faithfully; if in doubt, match the prototype frame-for-frame.
  - `portfolio-flow-prototype.html` — all five sections + all four seams, current.
  - `seam-drop-into-section.html` — the Competitions→Work seam in isolation (the polaroid-unpin-into-cards mechanic), if you need it clean.
- **Specs (`/reference/*-spec.md`) = source of truth for INTENT.** Layout, typography, colour, copy direction, open questions. `05-transitions-spec.md` covers the seams; the numbered specs cover each section.

When spec and prototype disagree on *motion*, the prototype wins. When they disagree on *intent/content*, the spec wins.

## 2. Stack

- Next.js (App Router) + TypeScript.
- **Plain CSS: global design tokens (CSS variables) + one CSS Module per section.** No Tailwind — the design is bespoke and the tokens are exact.
- Fonts via `next/font` (Google): Barlow Condensed, IBM Plex Mono, IBM Plex Sans, Oswald, DM Sans, Caveat.
- No other UI/animation libraries unless a section genuinely needs one. The prototypes use vanilla rAF + IntersectionObserver; keep that.

## 3. Non-negotiable behaviors (see `.cursor/rules/portfolio-core.mdc`)

- **Scroll-scrubbed transforms are imperative.** One shared `requestAnimationFrame` loop writing `transform`/`opacity` through refs. **Never drive per-frame scroll animation through React state** — it re-renders every frame and janks.
- **Scroll reveals re-fire on every entry and reset on exit.** Never `unobserve()` after first trigger. Elements reset (opacity/transform/text) when they leave the viewport.
- **Forced reflow before a transition:** call `getBoundingClientRect()` between setting a start transform and triggering the CSS transition, or the browser batches both writes and skips the start state.
- **Respect `prefers-reduced-motion`:** show final states, skip scrubbed motion, never trap the user in a pinned/scrubbed region.
- One easing curve for opens/expands: `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Build order — one section per pass, commit after each

Use **Plan Mode** for each step: state the goal, review the plan, then implement. Verify in the browser before moving on.

1. **Scaffold** — Next app, fonts, global tokens (`app/globals.css` with the CSS variables from the core rule), empty section components in scroll order, one `<main>` that stacks them. No content yet.
2. **Shared primitives** — the KITH wordmark, the section eyebrow/title pattern, the monospace scramble hook, a `useScrollProgress`/shared rAF utility. Build these once; sections reuse them.
3. **Sections, in scroll order** — Hero, then Experience, then Competitions, then Work, then Contact. One at a time, matching its spec + the prototype. Do **not** start a section's seam yet.
4. **Seams, after both adjacent sections exist** — in this order of value/difficulty:
   - Competitions→Work (the unpin-into-cards mechanic; port from `seam-drop-into-section.html` — full-bleed cork flows into paper, no dark gap, polaroids land in the *real* cards, responsive count = top-row columns).
   - Hero→Experience (scroll-hint line becomes the tree spine).
   - Work→Contact (crisp cut: 1px accent hairline + ~52px warm gradient sliver).
   - Experience→Competitions (crisp cut; cork begins full-bleed with an accent hairline at the top edge).
5. **Content pass** — replace all placeholder copy with real copy (see §6). Wire real project/competition data.
6. **Polish pass** — the tuning knobs called out in `05-transitions-spec.md` (seam trigger windows, fall speed, etc.), responsive checks, reduced-motion, Lighthouse.

## 5. Verification per portion

After each section/seam: does it match the prototype's motion? Do reveals re-fire on scroll up *and* down? Does reduced-motion degrade cleanly? Does it hold at mobile / tablet / desktop widths? Only then commit and move on.

## 6. Placeholders to replace (do NOT ship as-is)

Everything below is invented and flagged in the prototypes:
- Hero italic tagline and bio copy.
- All project cards (Path Tracer, CP Visualizer, KV Store…) and their SKUs — real projects, in priority order (slot 1 = the one you'd lead with).
- Competition back-of-polaroid notes.
- Contact dictionary definitions (especially the name/etymology line). This section lives or dies on that copy being in your own voice.

## 7. First prompt to paste into Cursor (Plan Mode)

> Read `/BUILD.md` and everything in `/reference`. We're building the portfolio described there. Start with **step 1 only (scaffold)** from the build order — Next.js App Router + TypeScript, `next/font` for the six fonts, a `globals.css` with the design tokens from `.cursor/rules/portfolio-core.mdc`, and five empty section components stacked in scroll order. No section content, no animations yet. Show me the plan before writing anything.

---

## 8. Project structure

Build to this layout. Even if you generate multiple sections in one pass, still follow the build order in §4 (shared primitives → sections → seams) and keep these boundaries.

```
kith-portfolio/
├── .cursor/
│   └── rules/
│       └── portfolio-core.mdc        # always-apply brand + behavior rules
├── reference/                        # specs + prototypes — source of truth, NOT shipped, never imported
│   ├── 01-hero-section-spec.md
│   ├── 02-experience-section-spec.md
│   ├── competitions-section-spec.md
│   ├── 03-work-section-spec.md
│   ├── 04-contact-section-spec.md
│   ├── 05-transitions-spec.md
│   ├── portfolio-flow-prototype.html
│   └── seam-drop-into-section.html
├── public/
│   ├── images/{hero,competitions,work}/   # carousel bg, polaroid photos, project shots
│   └── resume.pdf
├── src/
│   ├── app/
│   │   ├── layout.tsx                # next/font (the 6 fonts), <html>, metadata
│   │   ├── page.tsx                  # orchestrator: stacks the 5 sections + mounts seam overlay
│   │   └── globals.css               # design tokens (CSS vars), reset, base
│   ├── content/                      # ALL user-facing text lives here — nowhere else
│   │   ├── types.ts
│   │   ├── hero.ts                   # name, tagline, bio
│   │   ├── experience.ts             # roles
│   │   ├── competitions.ts           # competitions + back-of-polaroid notes
│   │   ├── work.ts                   # projects, SKUs (array order = priority order)
│   │   └── contact.ts                # dictionary definitions, links
│   ├── sections/                     # one folder per section, CSS co-located
│   │   ├── Hero/            Hero.tsx          Hero.module.css
│   │   ├── Experience/      Experience.tsx    Experience.module.css
│   │   ├── Competitions/    Competitions.tsx  Polaroid.tsx   Competitions.module.css
│   │   ├── Work/            Work.tsx          DropCard.tsx   Work.module.css
│   │   └── Contact/         Contact.tsx       Contact.module.css
│   ├── seams/                        # only transitions that need JS coordination
│   │   ├── CompetitionsToWork.tsx    # the unpin-into-cards overlay (reads both sections' live rects)
│   │   └── CompetitionsToWork.module.css
│   ├── hooks/
│   │   ├── useRevealOnScroll.ts      # IntersectionObserver reveal — re-fire on entry, reset on exit
│   │   ├── useScrollProgress.ts      # subscribes to the shared ticker, returns 0→1
│   │   └── useScramble.ts            # monospace text scramble
│   ├── lib/
│   │   ├── raf.ts                    # THE single shared requestAnimationFrame ticker
│   │   └── easing.ts                 # cubic-bezier tokens as JS
│   └── components/
│       ├── Wordmark.tsx              # KITH box + accent dot
│       └── SectionHeading.tsx        # eyebrow + title pattern
├── BUILD.md
└── next.config.js · tsconfig.json · package.json
```

**Why the boundaries matter:**
- `content/` — all draft text is placeholder and will be rewritten. Keep every string in these typed data files so a copy edit is one file, not a hunt through JSX. Components import data; they never hardcode text.
- `sections/*` with co-located CSS Modules — styles are scoped per section so one metaphor's CSS can't bleed into another; "refine section X" = open one folder.
- `seams/` stays small on purpose — only Competitions→Work needs a JS overlay (it measures both sections). The two crisp cuts (Experience→Competitions, Work→Contact) are pure CSS at the section edges. Hero→Experience (line→spine) is a shared visual handled across those two sections.
- `lib/raf.ts` — the ONE place that calls `requestAnimationFrame`. All scroll hooks subscribe to it. Do not create per-component rAF loops; do not drive scroll animation through React state.
- `reference/` and `.cursor/rules/` are context only — never import from them into shipped code.