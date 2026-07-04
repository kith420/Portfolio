# Work Section — Design Spec
**Portfolio: Nathan "Kith" — Section 03**
Last updated: 2026-07-02

---

## 1. Visual Direction

### Concept
The Work section borrows its structural metaphor from a **sneaker drop calendar / release manifest**. Each project is treated as a product release — catalogued with a serial number, displayed on a clean product-stage surface, stamped with a status indicator, and assigned a FIG-captioned technical figure. The aesthetic register sits closer to a Kith release sheet or a Nike spec card than to a conventional dev portfolio project grid.

This is the **only section with a warm light palette**. The switch from the dark backgrounds of Hero and Experience to `#f0eeea` creates a deliberate visual beat and signals to the visitor that this section is categorically different from what came before. This palette distinction is load-bearing — do not globalise it or reuse it in other sections.

### Design Principles
- Typography leads. Images enhance but do not replace typographic confidence.
- Every project card is a **drop sheet**: photo moment (image), identifier (SKU), headline (name), pitch (tagline), spec (highlights), and call to action (links).
- The **stamp** is the only decorative element. It overlaps the image corner — physically stamped onto the product shot, not placed beside it.
- Duotone treatment on all images keeps the section chromatically unified regardless of what screenshots look like in colour.
- **Oswald** for all label/utility text. It signals a product catalogue rather than a terminal prompt. IBM Plex Mono is intentionally absent from this section.

---

## 2. Colour Reference

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#f0eeea` | Section background, stamp background |
| `--card` | `#ffffff` | Card surface |
| `--surface` | `#e8e4da` | Image stage background |
| `--border` | `#d8d4ca` | Default hairline border |
| `--border-hover` | `#b8b4aa` | Card hover border |
| `--border-active` | `#1f5d80` | Card active + panel top border |
| `--accent` | `#6BAED6` | Duotone tint, highlight dots |
| `--accent-ink` | `#1f5d80` | SKU text, stamp text, category accent |
| `--ink` | `#111111` | Body text, headings |
| `--muted` | `#888888` | Secondary labels |
| `--faint` | `#bbbbbb` | FIG captions, tertiary text |
| `--panel-border` | `#e8e4da` | Panel internal dividers |

---

## 3. Typography Reference

| Element | Font | Weight | Size | Tracking | Case | Notes |
|---|---|---|---|---|---|---|
| Section title | Barlow Condensed | 800 | 46px | — | Upper | Scrambles on scroll entry |
| Card name | Barlow Condensed | 800 | 20px | — | Upper | |
| Panel name | Barlow Condensed | 800 | 28px | — | Upper | |
| Eyebrow | Oswald | 400 | 11px | .08em | Upper | `// 03 — work` |
| SKU | Oswald | 400 | 11px | .04em | Upper | Auto-generated |
| Category badge | Oswald | 400 | 9px | .06em | Upper | `GRAPHICS`, `TOOLS`, etc. |
| Chips | Oswald | 400 | 9px | .03em | Upper | Stack identifiers |
| Links | Oswald | 400 | 11px | .05em | Upper | Underline style |
| Close button | Oswald | 400 | 10px | .06em | Upper | `collapse ✕` |
| Tagline (card) | DM Sans | 300 italic | 10.5px | — | Sentence | One-line descriptor |
| Tagline (panel) | DM Sans | 300 italic | 11px | — | Sentence | |
| Description | DM Sans | 300 | 11px | — | Sentence | Line-height 1.75 |
| Highlights | DM Sans | 400 | 10.5px | — | Sentence | Line-height 1.55 |
| FIG caption | Oswald | 300 | 8px (approx) | .07em | Upper | `FIG. 01 — interface, dark mode` |
| Stamp status | Barlow Condensed | 800 | 8–9px | .03em | Upper | Inside stamp circle |
| Stamp year | Oswald | 300 | 6.5–7px | .05em | — | Below status in stamp |

**Google Fonts load string:**
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=Oswald:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300;1,400&display=swap
```

---

## 4. Layout

### Section Container
```css
.section {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 32px 96px;
}
```

### Grid
```css
.grid-shell {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}
```

**Column breakpoints (auto-calculated by minmax):**
| Viewport width | Approx columns |
|---|---|
| ≥ 860px | 3 columns |
| 560–860px | 2 columns |
| < 560px | 1 column |

**Gap reduction at breakpoints:**
- ≤ 720px: gap 16px
- ≤ 480px: gap 12px

---

## 5. Section Header

```html
<div class="eyebrow">// 03 — work</div>
<div class="sec-title" id="sec-title">
  <span id="title-a">SELECTED </span>
  <span id="title-b" class="accent">DROPS.</span>
</div>
```

- "SELECTED " and "DROPS." are separate spans to allow independent scramble timing
- "DROPS." renders in `--accent-ink` (#1f5d80)
- **Animation:** heading scramble fires when section reaches 60% viewport visibility (see §10)

---

## 6. Card Component (Collapsed State)

### Structure
```
card
├── card-img
│   ├── img-inner (scale wrapper)
│   │   ├── [image / svg]
│   │   └── .tint (duotone overlay)
│   └── .cstamp (status stamp)
└── card-body
    ├── .cat (category badge)
    ├── .csku (SKU code)
    ├── .cname (project name)
    ├── .ctag (tagline)
    └── .c-chips (stack chip row)
```

### Card Dimensions
- Image aspect ratio: **4:3**
- Card body padding: 18px 20px 22px
- Border: 1px solid `#d8d4ca`
- Background: `#ffffff`

### Card States
| State | Border colour | Background |
|---|---|---|
| Default | `#d8d4ca` | `#ffffff` |
| Hover | `#b8b4aa` | `#fafaf8` |
| Active (panel open) | `#1f5d80` | `#f5f3ef` |

### Category Badge
- Font: Oswald 400, 9px, 0.06em tracking, uppercase
- Border: 1px solid `#d8d4ca`
- Padding: 2px 7px
- Colour: `#888888`
- No background fill

### SKU Code
- Format: `WRK-0N · INITIALS/TAG1/TAG2`
- Generation logic:
  - `INITIALS` = first letter of each word in project name, uppercased
  - `TAG1/TAG2` = first 3 chars of first two stack tags, uppercased, joined with `/`
  - Example: "Path Tracer" + ["C++", "BVH"] → `WRK-01 · PT/CPP/BVH`
- Font: Oswald 400, 11px, 0.04em tracking, uppercase
- Colour: `#1f5d80`

### Stack Chips
- Font: Oswald 400, 9px, 0.03em tracking, uppercase
- Border: 1px solid `#d8d4ca`
- Padding: 2px 6px
- Text colour: `#555555`
- Background: `#f0eeea`

---

## 7. Duotone Image Treatment

Applied to all project images — both on card and in expansion panel.

```css
/* wrapper for scale animation */
.img-inner {
  position: absolute;
  inset: 0;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* the image or SVG itself */
.img-inner img, .img-inner svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: grayscale(1) contrast(1.08);
}

/* blue colour wash */
.tint {
  position: absolute;
  inset: 0;
  background: #6BAED6;
  mix-blend-mode: color;
  opacity: 0.88;
}
```

**Implementation note:** The `.tint` opacity of 0.88 is calibrated for dark UI screenshots. Lighter screenshots (e.g. light-mode app interfaces) will appear washed out — adjust per-project if needed, or standardise screenshots to dark mode wherever possible. The `contrast(1.08)` on the image boosts mid-range definition before the tint is applied.

---

## 8. Stamp Component

```css
.cstamp {
  position: absolute;
  top: -13px;
  right: -11px;
  width: 60px;
  height: 60px;
  border: 1.5px dashed #1f5d80;
  border-radius: 50%;
  background: #f0eeea; /* must match section bg — creates "stamped on" illusion */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: rotate(-9deg);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 3;
}

/* hover state */
.pcard:hover .cstamp {
  transform: rotate(-16deg) scale(1.05);
}

/* active (panel open) — snap back */
.pcard.active .cstamp {
  transform: rotate(-9deg);
}
```

**Stamp sizes:**
| Context | Diameter |
|---|---|
| Card (collapsed) | 60px |
| Panel (expanded) | 64px |

**Stamp content:**
```html
<div class="cstamp">
  <div class="cst">
    Shipped
    <span class="csy">2024</span>
  </div>
</div>
```
- Status text: Barlow Condensed 800, ~8px, uppercase, `#1f5d80`
- Year: Oswald 300, ~7px, `#1f5d80`

**Background note:** The stamp background must always match the section's background colour (`#f0eeea`). If the section ever gains a dark mode variant, this value must update in tandem.

---

## 9. Expansion Panel

Clicking a card opens a full-width detail panel below that card's row. The panel uses `grid-column: 1 / -1` to span all columns.

### Insertion Logic
```javascript
// detect which row the clicked card is in
const rowTop = card.offsetTop;
const sameRow = allCards.filter(c => c.offsetTop === rowTop);
const lastInRow = sameRow[sameRow.length - 1];

// insert after last card in row
expansionEl = buildExpansion(project, index);
lastInRow.after(expansionEl);
```

**Critical:** `card.offsetTop` comparison for row detection is valid only after layout has completed. Never call before first paint.

### Open/Close Mechanics

**Opening (grid-template-rows trick):**
```css
.exp-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.44s cubic-bezier(0.16, 1, 0.3, 1);
}
.exp-wrap.open {
  grid-template-rows: 1fr;
}
.exp-inner {
  overflow: hidden;
}
```

**Switching between cards (same or different row):**
- **Same card click:** animate close (remove `.open`, wait for `transitionend`, then `remove()`)
- **Different card click:** `expansionEl.remove()` immediately (no animation) then insert new panel. This prevents the layout glitch caused by two `grid-column: 1/-1` elements coexisting during reflow.
- **Close button:** animated close (same as same-card click)
- **Window resize:** immediate `remove()` — row positions change with column count

### Panel Structure

```
.expansion (grid-column: 1/-1)
└── .exp-wrap (grid-template-rows animation)
    └── .exp-inner (overflow: hidden)
        └── .exp-panel (grid: 46% 54%)
            ├── .exp-img (LEFT COLUMN)
            │   ├── [image + .tint]
            │   ├── .pstamp (stamp)
            │   ├── .efig (FIG caption)
            │   └── .exp-thumbs (3 thumbnail figures)
            └── .exp-body (RIGHT COLUMN)
                ├── .exp-cat (category badge)
                ├── .exp-sku (SKU — scrambles on open)
                ├── .exp-name (project name)
                ├── .exp-tag (tagline)
                ├── hr.div (divider)
                ├── .exp-desc (description)
                ├── .highlights (3 × .hl items)
                ├── .exp-chips (stack chips)
                └── .exp-links (primary + secondary links)
```

### Panel Image Column
- Aspect ratio: **16:9**
- Same duotone treatment as card
- Stamp: 64px diameter, same positioning rules
- FIG caption: bottom-left of image, Oswald 300, ~8px, `#bbbbbb`
- Thumbnail strip: bottom-right, 3 thumbnails × 38×28px, click to swap main image
  - Inactive: opacity 0.5, border `#d8d4ca`
  - Active: opacity 1, border `#1f5d80`

### Panel Content Column
- Padding: 22px 24px 24px
- Divider: 1px solid `#e8e4da` (lighter than card border — internal only)
- Panel top border: **2px solid `#1f5d80`** — this is the only 2px border in the section; it signals "detail view open"

### Highlights
- 3 items per project
- Accent dot: 5×5px circle, `#6BAED6`, `border-radius: 50%`, `margin-top: 5px` (aligns to first text line)
- Text: DM Sans 400, 10.5px, line-height 1.55, `#3a3a3a`
- Must be specific and metric-driven: e.g. "40× speedup via BVH" not "implemented BVH"
- The `// HIGHLIGHTS` label has been removed — dots are sufficient affordance

### Links
```css
/* primary */
.elink { font-size:11px; text-transform:uppercase; color:#111; border-bottom:1px solid #111; }

/* secondary */
.elink.sec { color:#888; border-color:#ccc; }
```

---

## 10. Animation Specs

All seven animations, in firing order:

### Anim 1 — Heading Scramble
**Trigger:** IntersectionObserver, threshold 0.6 on `.sec-title`
**Behaviour:** "SELECTED " and "DROPS." blank to empty, then scramble from noise to final text. Characters sweep left-to-right; resolved characters stay fixed.
```javascript
// firing
titleA.textContent = '';
titleB.textContent = '';
scramble(titleA, 'SELECTED ', 580);
setTimeout(() => scramble(titleB, 'DROPS.', 500), 80); // 80ms offset
```
**Special chars preserved:** spaces — never replaced with noise
**Fires once** per page load (observer disconnects after first trigger)

### Anim 2 — Card Scroll Stagger
**Trigger:** IntersectionObserver, threshold 0.08 on each `.pcard`
**Behaviour:** Cards start `opacity:0; transform:translateY(20px)`. On entry, `in-view` class added. Left-to-right column delay.
```javascript
const colIdx = rowCards.indexOf(card); // 0, 1, or 2
card.style.transitionDelay = `${colIdx * 70}ms`;
card.classList.add('in-view');
```
**CSS:**
```css
.pcard {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.pcard.in-view { opacity: 1; transform: translateY(0); }
```
**Fires on every scroll entry** — observer does NOT unobserve (re-fires on scroll up + back down)

### Anim 3 — Image Scale on Hover
**Trigger:** CSS `:hover` on `.pcard`
**Behaviour:** `.img-inner` scales to 1.04 within `overflow:hidden` parent
```css
.pcard:hover .img-inner { transform: scale(1.04); }
```
**Duration:** 600ms | **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`
**Note:** Do not scale `.cstamp` with this — stamp is positioned outside `.img-inner`

### Anim 4 — Stamp Nudge on Hover
**Trigger:** CSS `:hover` on `.pcard`
```css
.pcard:hover .cstamp  { transform: rotate(-16deg) scale(1.05); }
.pcard.active .cstamp { transform: rotate(-9deg); }   /* snap back when active */
```
**Duration:** 350ms | **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`

### Anim 5 — Panel Image Fade
**Trigger:** Fires after `exp-wrap.open` class added (double rAF pattern)
```javascript
// delay from panel open
imgEl.classList.add('xs');
setTimeout(() => imgEl.classList.add('in'), 50);
```
**CSS:**
```css
.xs { opacity: 0; transform: translateY(10px);
      transition: opacity 0.38s cubic-bezier(.16,1,.3,1),
                  transform 0.38s cubic-bezier(.16,1,.3,1); }
.xs.in { opacity: 1; transform: translateY(0); }
```

### Anim 6 — Panel Body Content Stagger
**Trigger:** Same as Anim 5, fires sequentially

| Element | Delay from panel open |
|---|---|
| `.exp-img` | 50ms |
| `.exp-cat` | 80ms |
| `.exp-sku` | 120ms |
| `.exp-name` | 165ms |
| `.exp-tag` | 205ms |
| `hr.div` | 235ms |
| `.exp-desc` | 275ms |
| `.highlights` | 340ms |
| `.exp-links` | 480ms |

Each element gets class `xs` (initial invisible state) then `in` after its delay.
**Duration:** 380ms | **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`

### Anim 4b — SKU Scramble (fires during Anim 6)
**Trigger:** 120ms after panel open (same timing as `.exp-sku` stagger)
```javascript
setTimeout(() => scramble(skuEl, skuString, 380), 120);
```
**Duration:** 380ms | **Sweep:** left-to-right
**Special chars preserved:** space, `·`, `/` — never replaced with noise
**Character set:** `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`

### Anim 7 — Chip Stagger (last beat)
**Trigger:** Sequential after Anim 6 sequence

```javascript
chips.forEach((chip, i) => {
  chip.classList.add('xc');
  setTimeout(() => chip.classList.add('in'), 400 + i * 50);
});
```
```css
.xc { opacity: 0; transform: translateY(4px) scale(0.94);
      transition: opacity 0.22s ease, transform 0.22s ease; }
.xc.in { opacity: 1; transform: translateY(0) scale(1); }
```
**Per-chip duration:** 220ms | **Between chips:** 50ms

### Scramble Function (shared)
```javascript
function scramble(el, final, duration = 420) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const len = final.length;
  let t0 = null;
  function frame(ts) {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    const revealed = Math.floor(p * len);
    let out = '';
    for (let i = 0; i < len; i++) {
      out += (i < revealed || ' ·/ '.includes(final[i]))
        ? final[i]
        : chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

### Double rAF Pattern (required for CSS transitions after DOM insertion)
```javascript
// insert expansionEl into DOM first, then:
requestAnimationFrame(() => requestAnimationFrame(() => {
  expansionEl.querySelector('.exp-wrap').classList.add('open');
  animatePanel(expansionEl, projectIndex);
}));
```
The double rAF gives the browser two frames to register the element and compute its initial layout before the transition triggers. Single rAF is insufficient on some engines.

---

## 11. Content Schema (per project)

```javascript
{
  name:     String,      // e.g. "Path Tracer"
  cat:      String,      // "GRAPHICS" | "TOOLS" | "MOBILE" | "WEB" | custom
  tag:      String,      // one-line DM Sans italic descriptor, ≤60 chars
  tags:     String[],    // stack identifiers for chips + SKU generation
  status:   String,      // "Shipped" | "In progress" | "Archived"
  year:     String,      // "2024"
  desc:     String,      // 2 sentences max: what it is, what was hard
  hi:       String[3],   // exactly 3 highlight strings, metric-driven
  links:    [{
    l: String,           // link label e.g. "View repo"
    s: Boolean           // false = primary style, true = secondary (muted)
  }]
}
```

**Writing guide:**
- `tag`: should read like a product subtitle. Sentence case. No full stop.
- `desc`: first sentence = what it is. Second sentence = what made it hard or interesting. Avoid "I built" openings.
- `hi[n]`: lead with the number or technical claim. Bad: "implemented BVH for performance". Good: "40× speedup over naive ray casting via BVH".

---

## 12. Mobile vs Desktop Behaviour

| Property | Desktop (>720px) | Mobile (≤720px) |
|---|---|---|
| Grid columns | 3 (auto) | 2 → 1 (auto) |
| Grid gap | 24px | 16px (≤720px), 12px (≤480px) |
| Card image aspect | 4:3 | 4:3 |
| Panel layout | Two-column (46% / 54%) | Single column |
| Panel image aspect | 16:9 | 16:9 |
| Panel image border | border-right | border-bottom |
| Panel body padding | 22px 24px 24px | 18px 18px 20px |
| Section padding | 64px 32px 96px | 40px 20px 72px (≤720px) / 32px 14px 56px (≤480px) |
| Section title size | 46px | 36px (≤720px) / 30px (≤480px) |
| Card body padding | 18px 20px 22px | 14px 14px 16px (≤480px) |
| Image hover scale | Yes | No (no hover on touch) |
| Stamp nudge | On hover | No (no hover on touch) |
| Scroll stagger | Yes | Yes |
| Panel stagger + scramble | Yes | Yes |
| Window resize | Close panel immediately | Close panel immediately |

**Responsive CSS breakpoints:**
```css
@media (max-width: 720px) {
  .section { padding: 40px 20px 72px; }
  .sec-title { font-size: 36px; }
  .grid-shell { gap: 16px; }
  .exp-panel { grid-template-columns: 1fr; }
  .exp-img { aspect-ratio: 16/9; border-right: none; border-bottom: 1px solid #d8d4ca; }
  .exp-body { padding: 18px 18px 20px; }
}
@media (max-width: 480px) {
  .section { padding: 32px 14px 56px; }
  .sec-title { font-size: 30px; }
  .grid-shell { gap: 12px; }
  .card-body { padding: 14px 14px 16px; }
}
```

---

## 13. Interaction Summary

| Trigger | Result |
|---|---|
| Scroll section into view (60% threshold) | Heading scramble fires |
| Card enters viewport (8% threshold) | Card fades up with column stagger |
| Hover card | Image scales 1.04, stamp rotates to -16deg |
| Click card (panel closed) | Panel opens below row, all 7 anims fire |
| Click same card (panel open) | Panel animates closed |
| Click different card (panel open) | Old panel removed instantly, new panel opens |
| Click thumbnail in panel | Main image swaps, FIG caption updates |
| Click collapse button | Panel animates closed |
| Resize window | Panel removed immediately |

---

## 14. Assets Needed

For each project (currently 6):

| Asset | Spec |
|---|---|
| **FIG. 01** (hero shot) | Min 1280×960px for card (4:3), min 1280×720px for panel (16:9). Dark mode preferred. |
| **FIG. 02** | Supporting view — output, render, or secondary UI state |
| **FIG. 03** | Third view — profiler, diagram, close-up, or behind-the-scenes |
| **FIG captions** | Written per-figure: `FIG. 01 — interface, dark mode` format |

**Image treatment notes:**
- Images are desaturated via `filter: grayscale(1) contrast(1.08)` then tinted with `#6BAED6` at `mix-blend-mode: color; opacity: 0.88`
- Dark UI screenshots work best — light backgrounds lose contrast under the tint
- Screenshots should avoid bright syntax-highlighting colour schemes; monochrome or dark themes only
- Minimum acceptable resolution for card thumbnail display: 600×450px

---

## 15. Decisions Made (Do Not Revisit)

- **IBM Plex Mono is absent** from this section. All label/utility text uses Oswald.
- **`// HIGHLIGHTS` label is removed.** The accent dots are sufficient affordance.
- **No project duration** in the content schema. The stamp year handles temporal information.
- **No context line** (`Solo · 8 wks · C++`). Cut for content economy.
- **Duotone tint is global** — all images receive the same `#6BAED6` treatment. No per-project exceptions.
- **The stamp background is `#f0eeea`** (matches section bg) — this is intentional to create the "stamped on" illusion, not a mistake.
- **Switching cards instant-removes** the old panel (no closing animation). Keeping the animation on switch caused a grid reflow glitch with two `grid-column: 1/-1` elements.
- **Chip stagger is the final beat** of the panel animation sequence — nothing fires after it.
- **The `// 03 — work` prefix is kept** on the eyebrow, even in Oswald. It reads as a design choice rather than a code comment in this context.

---

## 16. Open Questions

1. **Dark mode:** The section is built exclusively in light palette (`#f0eeea` / `#ffffff`). If the site gains a dark mode toggle, this section needs a bespoke dark variant — it cannot simply invert. The stamp background (`#f0eeea`) and card backgrounds (`#ffffff`) both need to update. Decision needed before implementation.

2. **Project count:** Currently 6 placeholder projects. If count exceeds 8–9, a "view all" control or pagination pattern should be considered — beyond ~9 cards the stagger animation becomes too long and the grid too tall relative to other sections.

3. **FIG count per project:** The panel thumbnail strip currently assumes exactly 3 figures per project. Projects with fewer than 3 figures need either: (a) fewer thumbnails displayed, (b) a placeholder state for missing figures, or (c) the strip hidden if only 1 figure exists.

4. **SKU collision:** The auto-generation algorithm (initials + first 3 chars of first 2 tags) may produce identical SKUs for projects with similar names and stacks. No collision handling is currently implemented. Consider adding the sequential number as sufficient disambiguation or implementing a uniqueness check.

5. **Category taxonomy:** Currently using `GRAPHICS`, `TOOLS`, `MOBILE`, `WEB`. This list is not formally defined. Agree on the full set of valid categories before populating real project data.

6. **Section-to-section transition:** The Competitions → Work seam was identified as one of two high-value scroll transitions (the other being Hero → Experience). The cork-board-to-warm-paper transition has not been designed yet. This is the last major unresolved visual moment.

7. **`csy` (stamp year) font size:** Currently 6.5–7px. Oswald at this size may render poorly on non-retina displays. Consider whether the year belongs in the stamp at all, or whether status alone (`Shipped` / `In progress` / `Archived`) is sufficient stamp content.

