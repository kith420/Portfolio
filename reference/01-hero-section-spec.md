# Hero Section — Implementation Spec

**Project:** Nathan Poernama (Kith) Portfolio
**Section:** Hero / Landing
**Status:** Design finalized, ready for implementation
**Last updated:** spec generated from design session

---

## 1. Visual Direction

The hero establishes the entire brand in one screen: bold condensed display type, a quiet technical monospace layer, a single powder-blue accent, and a full-bleed photo/video carousel dimmed into atmosphere behind the content. The feeling target is "confident creative with deep technical roots" — not a SaaS landing page, not a generic developer portfolio.

The hero folds two jobs into one section (per design decision): the **headline** (fast, bold, 3-second read) and the **human context** (quieter line that signals personality — competitive programming, computer graphics, Gunpla). There is no separate "About" section — this is intentional.

Reference inspirations used during design: Sui.io (scroll-driven reveals, restraint, single accent on dark base, grain texture), Kith streetwear brand (box-logo wordmark treatment, all-caps tight tracking, `//` notation, monochrome restraint).

---

## 2. Layout Structure

### Desktop (≥1024px)

Split layout, two-column grid:

```
┌─────────────────────────────────────────────────┐
│  NAV (wordmark left / links center / right elem) │
├─────────────────────────────────────────────────┤
│                                                   │
│   [TEXT COLUMN — flex: 1fr]   [PHOTO — 380px]   │
│   eyebrow                                        │
│   NAME (2 lines, big)                            │
│   Title (italic accent)                          │
│   Bio (2-3 lines)                                │
│   [CTA buttons]                                  │
│                                                   │
├─────────────────────────────────────────────────┤
│  scroll hint (bottom left)    stats row (bottom right) │
└─────────────────────────────────────────────────┘
```

Grid: `grid-template-columns: 1fr 380px;` with content padding `0 48px`, `padding-top: 80px` to clear the nav.

### Mobile (<768px)

Full-bleed background photo/carousel, all text content **bottom-anchored** in a single column. No split — the two-column layout is abandoned entirely on mobile, not just stacked.

```
┌──────────────────────┐
│ NAV (wordmark + ☰)    │
│           [avail pill]│
│                       │
│   (carousel bg fills  │
│    entire frame)      │
│                       │
│  eyebrow              │
│  NATHAN               │ ← fills width, ~88px
│  POERNAMA.            │
│  Title (italic)       │
│  Bio (2 lines, short) │
│  [CTA] [Resume →]     │
│  ───────────────────  │
│  stat | stat | stat   │
└──────────────────────┘
        | (scroll line)
```

Key mobile decision: the name headline **fills the full width edge-to-edge** at large size (poster effect) rather than shrinking to fit a smaller "safe" size. Barlow Condensed was specifically chosen because condensed type performs well in narrow columns at large sizes.

---

## 3. Components

### 3.1 Nav Bar

| Element | Desktop | Mobile |
|---|---|---|
| Wordmark | `KITH` inside 1.5px powder-blue border box + `.` outside box | Same, smaller scale (~17-18px box text) |
| Nav links | Work · Experience · Blog · Resume (text links, IBM Plex Mono 11px uppercase) | Replaced with hamburger icon (3 bars, varied widths: 22px/14px/18px) |
| Right element | **Open** — under discussion (see Open Questions). Previously "Available 2026" pill, user rejected it | Pill badge moved to top-right below nav row, not inline in nav |

**Wordmark box detail (Kith brand callback):**
```css
.wordmark-inner {
  font-family: 'Barlow Condensed';
  font-size: 17px; /* desktop */
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1.5px solid #6BAED6;
  padding: 5px 10px 4px;
  border-radius: 1px;
}
.wordmark-dot {
  color: #6BAED6;
  margin-left: 2px;
  font-weight: 700;
}
```
Box contains only `KITH`. Dot sits **outside** the box, not inside — this is a deliberate match to the Kith streetwear brand's box-logo treatment.

Nav border-bottom: `0.5px solid #1a2028` (dark) / `0.5px solid #d8d4ca` (light, if light mode used).

### 3.2 Background Carousel Layer

A full-bleed, non-interactive, continuously-scrolling row of photo/video thumbnails behind all hero content. User has confirmed they will supply real photos/clips — **landscape format for desktop, separate vertical/portrait format curated specifically for mobile.**

**Desktop carousel:**
- Item dimensions: 340px wide × 100vh tall (min-height 600px)
- Gap between items: 12px
- Animation: `translateX(0)` → `translateX(-50%)` over **32s, linear, infinite**
- Track contains the asset set duplicated twice back-to-back for seamless looping (`for i in 0..N: append; for i in 0..N: append again`)

**Mobile carousel:**
- Item dimensions: 160px wide × 844px tall (full phone height) — built from **portrait/vertical curated assets**, not the same set as desktop
- Gap: 8px
- Animation: same `translateX` loop, **28s linear infinite** (slightly faster because items are narrower)

**Overlay (sits above carousel, below content):**
```css
.carousel-overlay {
  position: absolute; inset: 0; z-index: 1;
}
/* dark mode */
background: rgba(10, 11, 16, 0.82);   /* desktop */
background: rgba(10, 11, 16, 0.88);   /* mobile — slightly heavier, smaller items need more dimming */
/* light mode equivalent (if used) */
background: rgba(240, 238, 234, 0.85);
```

**Grain layer (topmost, z-index 2, non-interactive):**
```css
opacity: 0.025; /* desktop */
opacity: 0.03;  /* mobile */
background-image: url("data:image/svg+xml,...feTurbulence...");
background-size: 128px;
```
SVG feTurbulence noise filter, `baseFrequency 0.85`, `numOctaves 4`, `stitchTiles=stitch`. Same technique used elsewhere in the site (competitions section photo cards).

**Implementation note:** carousel images should be real photo/video poster-frame thumbnails. In the placeholder build these were `<canvas>` elements with procedurally drawn gradient + grid-line textures per a small palette array — **replace with real `<img>` or `<video>` (muted, no controls, poster frame only since it's non-interactive)** elements when assets are ready. Folder structure recommendation: `/assets/carousel-desktop/` and `/assets/carousel-mobile/`.

### 3.3 Photo Placeholder (Desktop only — "Photo" column)

Right-column element, 280×360px, rounded 6px corners.

```css
.photo-placeholder {
  width: 280px; height: 360px;
  border-radius: 6px;
  background: #13161c;       /* dark mode */
  border: 0.5px solid #1e2535;
}
```

Blue corner-bracket accent (top-left and bottom-right corners only, diagonal symmetry):
```css
.photo-placeholder::before { /* top-left */
  border-top: 1.5px solid #6BAED6;
  border-left: 1.5px solid #6BAED6;
  width: 40px; height: 40px;
  opacity: 0.6;
}
.photo-placeholder::after { /* bottom-right */
  border-bottom: 1.5px solid #6BAED6;
  border-right: 1.5px solid #6BAED6;
  width: 40px; height: 40px;
  opacity: 0.6;
}
```

**Flagged in design review as a common pattern** (corner-bracket treatment appears on many developer-portfolio templates) — worth reconsidering once the real photo is in place, or keeping only if it still feels distinct against the final photo treatment.

User has not yet decided on final photo treatment (cutout / framed / circular) — selected "placeholder, decide later" during design session. **On mobile, no separate photo placeholder exists — the carousel itself serves as the visual/personality layer.**

### 3.4 Headline Block (Text Column)

**Eyebrow (top label):**
- Text: `CS × Design — SUTD Singapore` (placeholder copy, needs user's final wording)
- Font: IBM Plex Mono, 11px (desktop) / 10px (mobile), uppercase, letter-spacing 0.14em
- Color: `#6BAED6` (dark mode)
- Preceded by a small horizontal rule: `width: 24px; height: 1px; background: #6BAED6; opacity: 0.6;` (18px wide on mobile)

**Name (big headline):**
- Two lines: `NATHAN` / `POERNAMA.` (user's full surname — chosen over nickname for the headline specifically so the name is recruiter-searchable; "KITH." remains the nav wordmark/brand)
- Font: Barlow Condensed, weight 800, uppercase
- Size: `clamp(64px, 9vw, 108px)` desktop / `88px` fixed mobile (fills width edge-to-edge — do not scale down further)
- Line-height: 0.92 (desktop) / 0.88 (mobile)
- Letter-spacing: -0.01em
- Color: `#dde3ec` (dark) / `#111` (light)

**Title (italic accent line):**
- Text: `Engineer with an eye.` — **flagged explicitly as placeholder/AI-sounding copy during design review. User needs to replace with their own voice before launch.**
- Font: Barlow Condensed, weight 700, *italic*, uppercase
- Size: `clamp(32px, 4.5vw, 52px)` desktop / `38px` mobile
- Color: `#6BAED6` (the one place the accent color is used at large display scale)

**Bio (supporting line):**
- Text: `Building software that performs and interfaces that feel inevitable. Into computer graphics, competitive programming, and the occasional Gunpla build.` — **also flagged as placeholder copy needing the user's authentic voice.**
- Font: IBM Plex Mono, weight 300, 12px (desktop) / 11px (mobile)
- Line-height: 1.8
- Color: `#3a4d60` (dark) / `#888` (light)
- One highlighted span (`.hi` class) per line at a slightly lighter/brighter shade to pick out a key phrase (e.g. "computer graphics", "Gunpla build") — `color: #6BAED6` for the highlight span
- Max-width: 420px (desktop) — keeps line length readable, prevents bio from stretching full container width

### 3.5 CTA Row

Two elements side by side, gap 16px:

**Primary button:**
```css
.btn-primary {
  font: IBM Plex Mono 500, 11px (desktop) / 10px (mobile), uppercase, letter-spacing 0.08em;
  color: #0f1014;          /* dark text on light accent bg */
  background: #6BAED6;
  padding: 10px 22px (desktop) / 10px 20px (mobile);
  border-radius: 3px;
  hover: opacity 0.85, transition 0.2s;
}
```
Text: "View work" (links to Work section, anchor scroll)

**Ghost/secondary link:**
```css
.btn-ghost {
  color: #3a4d60 (dark) / #aaa (light);
  font: same mono style as primary but no background;
  display: flex; gap: 6px; /* for arrow */
  hover: color → #dde3ec (dark) / #111 (light); gap → 10px (arrow nudges right);
  transition: color 0.2s, gap 0.2s;
}
```
Text: "LinkedIn →" (desktop) — consider whether mobile should point to Resume instead given limited space (mobile mock used "Resume →").

### 3.6 Stats Row

Three compact credential blocks. **Flagged during design critique as feeling like generic template filler** — content is placeholder, layout pattern is fine but copy/selection of stats should be reconsidered by user.

Desktop: positioned bottom-right of hero, `position: absolute; bottom: 28px; right: 48px;`, flex row gap 28px.
Mobile: becomes a horizontal 3-column strip directly under CTA row, with a top border divider and internal vertical dividers between each stat (`border-right: 0.5px solid #1a2028`, last child has none).

Each stat:
```
[BIG VALUE]      ← Barlow Condensed 700, 22px desktop / 20px mobile, color #dde3ec
[small label]    ← IBM Plex Mono, 9px, uppercase, letter-spacing 0.08em, color #2e3a48
```
Current placeholder content: `4×` Internships / `ICPC` Regional / `CG` Graphics focus.

### 3.7 Scroll Hint

Desktop: bottom-left, `position: absolute; bottom: 28px; left: 48px;` — vertical 1px line (32px tall, powder blue, opacity 0.3) + text "Scroll" (10px mono uppercase).
Mobile: centered at the very bottom of the screen, line only, no text label (space-constrained), 28px tall.

Pulse animation on the line:
```css
@keyframes scrollPulse { 0%,100% { opacity: 0.15; } 50% { opacity: 0.5; } }
/* duration: 2s ease-in-out infinite */
```

### 3.8 Availability Indicator

**Status: contested — see Open Questions.** Original "Available 2026" pill was explicitly rejected by user mid-design. Replacement copy not yet finalized. Layout slot exists in both desktop nav (right side) and mobile (floating pill below nav, `top: 100px; right: 24px;`).

Pulsing dot if retained:
```css
.avail-dot {
  width: 6px; height: 6px; /* desktop */
  width: 5px; height: 5px; /* mobile */
  background: #4caf76;
  border-radius: 50%;
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
```

---

## 4. Animation & Interaction Specs

All entrance animations fire **once on page load** (not scroll-triggered — this is the very first thing the user sees, no scroll has happened yet). Sequenced with staggered delays to create a deliberate reveal rhythm rather than everything appearing at once.

| Element | Animation | Duration | Easing | Delay |
|---|---|---|---|---|
| Eyebrow | fadeUp (opacity 0→1, translateY 10px→0) | 0.5s | ease | 0.1s |
| Name line 1 ("NATHAN") | slideUp (translateY 100%→0, clip via overflow:hidden parent) | 0.7s | `cubic-bezier(0.16,1,0.3,1)` | 0.1s |
| Name line 2 ("POERNAMA.") | slideUp, same mechanism | 0.7s | `cubic-bezier(0.16,1,0.3,1)` | 0.22s |
| Title (italic line) | slideUp, same mechanism | 0.7s | `cubic-bezier(0.16,1,0.3,1)` | 0.34s / 0.36s |
| Bio paragraph | fadeUp | 0.6s | ease | 0.5s / 0.55s |
| Photo placeholder (desktop) | fadeUp | 0.7s | ease | 0.5s |
| CTA row | fadeUp | 0.6s | ease | 0.62s / 0.68s |
| Availability badge (mobile) | fadeUp | 0.5s | ease | 0.8s |
| Stats row | fadeUp | 0.6s | ease | 0.75s / 0.9s |
| Scroll hint | fadeUp | 0.5s / 0.6s | ease | 1.0s / 1.1s |

**slideUp mechanism (used for name + title):**
```css
.line { display: block; overflow: hidden; } /* clipping mask */
.line span {
  display: block;
  transform: translateY(100%);
  animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes slideUp { to { transform: translateY(0); } }
```
Each line is wrapped in its own `overflow:hidden` container so the inner span appears to rise up from below a mask, rather than simply fading in. This is the same line-by-line reveal technique referenced from the Sui site exploration earlier in the design process.

**fadeUp mechanism (used for everything else):**
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Carousel scroll (continuous, looping, not scroll-linked):**
```css
@keyframes scrollTrack {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.carousel-track {
  animation: scrollTrack 32s linear infinite; /* desktop */
  animation: scrollTrack 28s linear infinite; /* mobile */
}
```
This is a CSS-only animation, no JS scroll listener involved — it runs independent of user scroll and never stops.

**Pulsing elements** (scroll-hint line, availability dot): both use simple opacity-oscillation keyframes, 2-2.5s ease-in-out infinite, no delay coordination needed since they're ambient/looping rather than entrance animations.

---

## 5. Typography Reference Table

| Use | Font | Weight | Style | Size (desktop) | Size (mobile) | Letter-spacing | Color (dark) |
|---|---|---|---|---|---|---|---|
| Wordmark box text | Barlow Condensed | 700 | upright | 17px | ~17px | 0.1em | `#dde3ec` |
| Wordmark dot | Barlow Condensed | 700 | upright | 17px | ~17px | — | `#6BAED6` |
| Nav links | IBM Plex Mono | 400 | upright | 11px | (hidden, hamburger instead) | 0.08em | `#3a4d60` |
| Eyebrow | IBM Plex Mono | 400 | upright | 11px | 10px | 0.14em | `#6BAED6` |
| Name headline | Barlow Condensed | 800 | upright | clamp(64-108px) | 88px | -0.01em | `#dde3ec` |
| Italic title | Barlow Condensed | 700 | italic | clamp(32-52px) | 38px | 0.01em | `#6BAED6` |
| Bio | IBM Plex Mono | 300 | upright | 12px | 11px | normal | `#3a4d60` |
| Bio highlight span | IBM Plex Mono | 300 | upright | 12px | 11px | normal | `#6BAED6` |
| Primary button | IBM Plex Mono | 500 | upright | 11px | 10px | 0.08em | `#0f1014` (on blue bg) |
| Ghost button | IBM Plex Mono | 400 | upright | 11px | 10px | 0.08em | `#3a4d60` |
| Stat value | Barlow Condensed | 700 | upright | 22px | 20px | 0.02em | `#dde3ec` |
| Stat label | IBM Plex Mono | 400 | upright | 9px | 8px | 0.08em | `#2e3a48` |
| Scroll hint text | IBM Plex Mono | 400 | upright | 10px | (hidden) | 0.1em | `#1e2a38` |
| Availability text | IBM Plex Mono | 400 | upright | 11px | 9px | 0.06-0.08em | `#3a4d60` |

Font files: Barlow Condensed (Google Fonts, weights 600/700/800, italic 700/800) + IBM Plex Mono (Google Fonts, weights 300/400/500).

---

## 6. Color Reference Table

| Token | Hex | Usage |
|---|---|---|
| `--bg-dark` | `#0f1014` | Primary hero background (dark mode — current default) |
| `--bg-light` | `#f0eeea` | Alternate light mode background (explored, not committed as default) |
| `--ink-dark` | `#dde3ec` | Primary text on dark bg |
| `--ink-light` | `#111111` | Primary text on light bg |
| `--accent` | `#6BAED6` | UNC powder blue — sole accent color, used sparingly (eyebrow, title, wordmark box/dot, CTA bg, highlight spans, scroll line) |
| `--muted-dark` | `#3a4d60` | Secondary text on dark (bio, nav links, ghost button) |
| `--muted-light` | `#888888` | Secondary text on light |
| `--faint-dark` | `#2e3a48` | Tertiary text on dark (stat labels) |
| `--faint-light` | `#bbbbbb` | Tertiary text on light |
| `--border-dark` | `#1a2028` | Hairline borders / dividers on dark |
| `--border-light` | `#d8d4ca` | Hairline borders / dividers on light |
| `--surface-dark` | `#13161c` | Photo placeholder background |
| `--surface-light` | `#e8e4da` | Photo placeholder background (light mode) |
| `--success` | `#4caf76` | Availability pulse dot only |

**Carousel overlay tint (dark mode):** `rgba(10, 11, 16, 0.82)` desktop, `rgba(10, 11, 16, 0.88)` mobile.
**Carousel overlay tint (light mode):** `rgba(240, 238, 234, 0.85)` desktop, `rgba(240, 238, 234, 0.88)` mobile.

**Open decision:** dark vs light as the committed default. Design exploration built both with a live toggle; recommendation given during the session was to commit to **dark** as default (stronger accent pop, better alignment with Sui-adjacent technical energy) but final user sign-off on this was not explicitly captured in the conversation transcript before moving on to other sections.

---

## 7. Mobile vs Desktop — Behavioural Differences Summary

| Aspect | Desktop | Mobile |
|---|---|---|
| Layout | 2-column split (text / photo) | Single column, bottom-anchored over full-bleed carousel |
| Photo | Dedicated placeholder element, right column | No separate photo element — carousel serves this role |
| Carousel asset orientation | Landscape | Portrait/vertical (separate curated asset set) |
| Carousel item width | 340px | 160px |
| Carousel loop duration | 32s | 28s |
| Name headline sizing | `clamp(64px, 9vw, 108px)` — responsive | Fixed 88px — chosen deliberately as a "poster" moment, not scaled smaller |
| Nav links | Full text link list visible | Hidden, replaced by hamburger icon |
| Availability indicator | Inline in nav, right side | Separate floating pill badge below nav |
| Stats row position | `absolute bottom-right` | Horizontal strip with dividers, inline below CTAs (part of normal flow, not absolutely positioned) |
| Scroll hint | Has "Scroll" text label | Line only, no text (space constraint) |

---

## 8. Assets Needed Before Implementation

- [ ] **Desktop carousel media** — landscape photos/video poster-frames, multiple clips, looping set (user confirmed will supply)
- [ ] **Mobile carousel media** — separate portrait/vertical curated set (user confirmed will supply, explicitly different from desktop set)
- [ ] **Hero photo** — treatment undecided (cutout / framed-rectangular / circular crop) — user deferred this decision ("placeholder — I'll decide later")
- [ ] **Final hero copy** — eyebrow line, italic title line, and bio paragraph are all currently placeholder text flagged as "sounds AI-generated" in design review; needs user's authentic voice
- [ ] **Stats row content decision** — current 3 stats (4× internships / ICPC / CG) are placeholder; user may want different/more personal stat selection
- [ ] **Availability/right-nav-element copy** — explicitly rejected "Available 2026", replacement not finalized (see Open Questions)
- [ ] **Resume PDF** — linked from ghost CTA button, file not yet provided

---

## 9. Open Questions

1. **Dark vs light mode commitment.** Both were built and demonstrated via toggle. Verbal recommendation was dark-as-default; explicit final sign-off from user not confirmed in this conversation. **Resolve before build.**
2. **Right-side nav element.** User rejected "Available 2026" pill as feeling presumptuous/desperate. Alternatives discussed: live Singapore time display (recommended — subtle technical flex, communicates timezone implicitly), simple "Say hello →" contact link, social link icons, or removing the element entirely and letting the nav breathe with just wordmark + links. **No final decision was made — user said "we can continue for now, I'll edit the other stuff later."**
3. **Photo treatment (desktop hero photo).** Cutout silhouette vs framed rectangular crop vs circular — undecided.
4. **Blue corner-bracket detail on photo frame.** Flagged as a common pattern across generic dev-portfolio templates; worth revisiting once a real photo is dropped in to see if it still feels distinctive or should be dropped/redesigned.
5. **Hero copy voice.** All current headline/bio copy was authored by Claude during the design process as placeholder and was explicitly called out by the user as reading like generic AI-generated portfolio copy ("Engineer with an eye" in particular was flagged as repeating across every mockup). This must be rewritten in the user's own voice before launch — not a structural/visual open question, but a critical content gap.
6. **Ghost CTA target on mobile.** Desktop version points to LinkedIn; mobile mockup substituted Resume due to space. Confirm intended behavior — should both platforms point to the same destination, or is the substitution intentional?

---

## 10. Implementation Notes (Misc)

- The hero is built with vanilla CSS + a small amount of JS for: (a) carousel item generation/duplication for seamless looping, (b) entrance animation triggering on load (no IntersectionObserver needed here — this is page-load, not scroll-triggered), (c) light/dark mode class toggling if a toggle is retained.
- No `localStorage`/`sessionStorage` should be used for mode persistence in any web environment that disallows it (e.g. Claude.ai artifacts) — use in-memory state only, or server-side/cookie persistence in the real production build.
- Grain texture SVG data-URI can be reused verbatim across this section and others (Experience, Competitions) for visual consistency — it was authored once and intentionally reused.
- All `0.5px` border widths render correctly only on high-DPI/retina displays; verify fallback rendering (some browsers round sub-pixel borders to 1px or 0px) — consider `border-width: 1px` with a more transparent border color as a safer cross-device alternative if hairline borders disappear on certain displays.
