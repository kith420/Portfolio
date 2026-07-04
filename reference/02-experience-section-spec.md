# Experience Section — Implementation Spec

**Project:** Nathan Poernama (Kith) Portfolio
**Section:** Experience (Section 02 — directly below Hero)
**Status:** Design finalized, ready for implementation
**Last updated:** spec generated from design session

---

## 1. Visual Direction

Experience is the second section on the home scroll, immediately following the Hero, and was deliberately ordered to lead the credibility-building portion of the page (ahead of Competitions and Work) because the user's current project portfolio lacks strong visuals — internships carry more weight at this stage of the site's life.

The structural metaphor is a **tree**: cards alternate left and right off a central dotted spine, each connected by a short horizontal line to a node on the spine. This was an explicit user request, modeled after the Sui.io scroll-card-reveal interaction pattern but adapted into a literal tree/timeline shape rather than Sui's single-column expanding panel.

Each of the four internships gets its own card. Cards are interactive — clicking one expands it into a full-detail modal that grows out of the card's own screen position (not a generic centered modal fade-in).

---

## 2. Layout Structure

### Desktop (≥1024px)

```
┌───────────────────────────────────────────────┐
│  // 02 — experience          [count: 04 roles] │
│  WHERE I'VE SHIPPED.                           │
├───────────────────────────────────────────────┤
│                                                 │
│  [CARD: Simular AI] ──●                        │  ← left side, node 1
│                        │                        │
│                        ●── [CARD: AggieWorks]  │  ← right side, node 2
│                        │                        │
│  [CARD: TCS] ──────────●                        │  ← left side, node 3
│                        │                        │
│                        ●── [CARD: NTT Data]    │  ← right side, node 4
│                                                 │
└───────────────────────────────────────────────┘
```

Grid per row: `grid-template-columns: 1fr 48px 1fr;` — left card slot / center node column / right card slot. Empty slot on the opposite side of each row is just a blank flex spacer (`.card-empty { flex: 1; }`).

Center spine: a single continuous dotted vertical line running the full height of the tree container, rendered via:
```css
.tree::before {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 1px;
  background: repeating-linear-gradient(to bottom, #1e2a38 0px, #1e2a38 4px, transparent 4px, transparent 10px);
}
```

Section container max-width: 960px, padding `72-80px 40px 100px`.

### Mobile (<768px)

Tree collapses to a **single left-aligned vertical spine** — no left/right alternation (doesn't fit a narrow viewport). All four cards stack top to bottom, each connected to the spine via a node dot and the spine sits at a fixed left offset rather than centered.

```
┌──────────────────┐
│ // 02 — experience │
│ WHERE I'VE         │
│ SHIPPED.           │
│                    │
│ ● [CARD: Simular]  │
│ │                  │
│ ● [CARD: AggieW.]  │
│ │                  │
│ ● [CARD: TCS]      │
│ │                  │
│ ● [CARD: NTT Data] │
└──────────────────┘
```

Spine position: `.m-timeline { padding-left: 20px; }`, spine line at `left: 4px`, node dots at `left: -16px` relative to each item.

---

## 3. Components

### 3.1 Section Header

```
section-eyebrow: "// 02 — experience"     (IBM Plex Mono, 10px, uppercase, letter-spacing 0.14em, color #2e3a48)
section-title:   "Where I've / shipped."  (Barlow Condensed 800, 48px desktop / 36px mobile, uppercase, line-height 1)
                  — second word "shipped." rendered in accent color #6BAED6
section-count:   "04 roles"               (IBM Plex Mono, 10px, color #2e3a48, right-aligned opposite the title)
```
Header has a `border-bottom: 0.5px solid #1a2028` and `margin-bottom: 64-72px` separating it from the tree.

Title copy ("Where I've shipped.") is placeholder — not yet confirmed as final by user.

### 3.2 Tree Spine & Nodes

**Node dot (default/inactive state):**
```css
.node-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #0f1014;
  border: 1.5px solid #1e2a38;
}
```

**Node dot (active state — card has scrolled into view):**
```css
.node-dot.active / .tree-row.active .node-dot {
  border-color: #6BAED6;
  background: #6BAED6; /* fills solid */
}
```

**Connector line (node → card), only on the side the card occupies:**
```css
.tree-row.left-card .tree-node::before  { /* line pointing left toward card */
  width: 24px; height: 1px; background: #1e2a38; right: 100%;
}
.tree-row.right-card .tree-node::after  { /* line pointing right toward card */
  width: 24px; height: 1px; background: #1e2a38; left: 100%;
}
/* active state */
.tree-row.active .tree-node::before,
.tree-row.active .tree-node::after {
  background: rgba(107,174,214,0.35);
}
```

### 3.3 Experience Card — Collapsed/Default State

Each card is `max-width: 390px` (desktop), border `1px solid #222b38` (upgraded from initial `0.5px` per design feedback requesting clearer borders), `border-radius: 4-6px`, background `#0c0f13`.

**Card anatomy (top to bottom):**

1. **Header row** — flex row, `border-bottom: 1px solid #1e2535`, min-height 48px (44px mobile):
   - **Number cell**: `01`–`04`, IBM Plex Mono 11px, color `#556070` (changed from earlier `#dde3ec` — softened so it doesn't compete with company name), background `#13161c`, bordered-right divider, fixed width 44px (38px mobile)
   - **Logo cell**: company logo/mark, background `#0e1118` (slightly darker than card body — creates an "inset stamp" feel), bordered-right divider, min-width 52px (mobile: same pattern, narrower)
   - **Company name cell**: flex-grow, padding 16px, contains the scramble-text company name (see §4 Interactions)

2. **Body** — padding `16-18px`:
   - **Location line**: small uppercase mono label with a preceding 4px powder-blue dot (`opacity: 0.4-0.5`), e.g. "Singapore", "UC Davis, California", "Jakarta, Indonesia"
   - **Role title**: Barlow Condensed 700 *italic*, uppercase, color `#6BAED6`, size 20-22px (18px mobile) — this is the single most visually dominant text element in the card
   - **Description**: IBM Plex Mono 300, 11px, color `#3a4d60`, line-height 1.75, with one highlighted `<span class="hi">` per description tying back to the core value-prop phrase (e.g. "autonomous AI agents", "student-facing campus tools")

3. **Footer row** — `border-top: 1px solid #1e2535`, background `#0a0d11` (darkest layer in the card — footer reads as a distinct "base" layer), padding `10-12px 18-20px`, flex row `justify-content: space-between`:
   - **Tech icon row** (left) — see §3.4 below
   - **Year** (right) — IBM Plex Mono 10px, color `#2e3a48`

**Click hint (desktop only, decorative):**
```css
.exp-card::after {
  content: '// click to expand';
  position: absolute; bottom: 10px; right: 14px;
  font-size: 9px; color: #1e2a38; font-style: italic;
}
.exp-card:hover::after { color: #2e3a48; }
```

**Card hover state:**
```css
.exp-card:hover {
  border-color: rgba(107,174,214,0.4); /* desktop comparison build used 0.3, later iteration used 0.4 — use 0.4 as final */
}
.exp-card:hover .card-header { background: #13161c; }
```

### 3.4 Tech Stack Icons (Footer)

**Decision history:** initial build used plain text chips (`<span class="stack-chip">Python</span>`). User requested upgrading to individual SVG brand icons after referencing an external example (EShopMicroservices README screenshot showing colored brand icons + tooltip). Color icons were considered but rejected in favor of **monochrome white icons** to preserve the restrained palette — colored brand icons (.NET purple, Docker blue, Redis red, etc.) would have introduced 5-6 uncontrolled colors into a deliberately limited system.

**Implementation:**
```css
.tech-icon svg {
  width: 20px; height: 20px;
  opacity: 0.35;                      /* resting state */
  filter: brightness(0) invert(1);    /* forces any colored SVG to pure white */
  transition: opacity 0.2s;
}
.tech-icon:hover svg { opacity: 0.75; }
```

The `brightness(0) invert(1)` filter trick means **any** SVG sourced from any icon library (recommended source: simpleicons.org — free single-path brand SVGs) automatically renders as pure white, regardless of original brand color. No need to manually recolor source files.

**Tooltip on hover:**
```css
.tech-icon::after {
  content: attr(data-name);
  position: absolute; bottom: calc(100% + 6px); left: 50%;
  transform: translateX(-50%);
  font: IBM Plex Mono 9px, letter-spacing 0.08em;
  color: #6BAED6;
  background: #0c0f13; border: 0.5px solid #1e2535;
  padding: 3px 7px; border-radius: 2px;
  white-space: nowrap; opacity: 0;
  transition: opacity 0.15s;
}
.tech-icon:hover::after { opacity: 1; }
```
Tooltip text comes from a `data-name` attribute on the wrapping `.tech-icon` div (e.g. `data-name="Python"`), not from visible text elsewhere — this is what allows the footer to stay icon-only with no chip labels, while remaining accessible/identifiable on hover.

**Per-card icon sets (current placeholder assignments, confirm against actual stack used at each role):**
| Company | Icons |
|---|---|
| Simular AI | Python, TypeScript, Docker |
| AggieWorks | React, Node.js, PostgreSQL |
| TCS Pace Port | Java, Spring, AWS |
| NTT Data | Java, MySQL/SQL, REST API (generic icon used as placeholder — no universal "REST" brand icon exists) |

### 3.5 Company Logo Badges (Header Cell)

Currently placeholder letter-mark badges (not real company logos), each with a distinct background/border/text color so they're visually differentiated even before real logos are dropped in:

```css
.logo-mark {
  width: 26px; height: 26px; border-radius: 4px;
  font: Barlow Condensed 800, 11px;
}
.logo-simular { background: #0d1f2e; color: #6BAED6; border: 0.5px solid #1a3048; }
.logo-aggie   { background: #1a1f10; color: #8ab870; border: 0.5px solid #2a3018; }
.logo-tcs     { background: #1a1018; color: #c87ab8; border: 0.5px solid #2e1828; }
.logo-ntt     { background: #1a1010; color: #c87a5a; border: 0.5px solid #2e1818; }
```

**To replace with real logos:** AggieWorks, TCS, and NTT Data all have publicly available logo assets — use monochrome (white or powder-blue) SVG versions to stay on-brand, same `brightness(0) invert(1)` filter trick as tech icons if sourced in color. Simular AI is a smaller/newer company — check for a public press kit; if none exists, the letter-badge fallback (`SI`) is an acceptable permanent solution, not just a placeholder.

---

## 4. Interactions & Animation Specs

### 4.1 Scroll-triggered reveal (repeating — critical behavior)

**This is the most important interaction spec in this document and was explicitly corrected mid-design.** The initial build only animated cards in once (using `observer.unobserve()` after the first trigger). The user explicitly requested that cards **animate out when scrolled past, and re-animate from scratch every time they re-enter the viewport** — in both directions (scrolling down past a card and back up should both reset and replay it), on both desktop and mobile.

**Correct implementation pattern:**
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const row = entry.target;
    const companyEl = row.querySelector('.card-company');

    if (entry.isIntersecting) {
      row.classList.add('active');
      if (companyEl?.dataset.text) {
        setTimeout(() => scramble(companyEl, companyEl.dataset.text, 700), 320);
      }
    } else {
      // Reset on exit — critical, do not skip this branch
      row.classList.remove('active');
      if (companyEl?.dataset.text) {
        companyEl.textContent = companyEl.dataset.text[0]; // collapse back to single char
      }
    }
  });
}, { threshold: 0.3 }); // 0.25-0.3 used across builds, 0.3 is the settled value

dRows.forEach(row => observer.observe(row));
// Do NOT call observer.unobserve() — the observer must keep watching indefinitely
```

Mobile uses the identical pattern but with `root: phoneScroll` (or whatever the actual scrollable container is in production — in the design mockup this was a simulated phone-frame scroll div, in production it will be the natural document scroll, so `root` should likely be omitted/null in the real build unless Experience sits inside a nested scroll container).

**What resets on exit:**
- `.tree-row` (desktop) / `.m-item` (mobile) loses `.active` class → card slides back to its offset position (20-24px horizontal translate) and fades to opacity 0, card-inner width collapses back to 56px (48-56px range used across iterations), node dot loses fill/border color
- Company name text collapses back to a single character (`dataset.text[0]`), ready to re-scramble on next entry

### 4.2 Card width reveal (open animation, part of the scroll-trigger)

The card itself is always present in the DOM at a tiny collapsed width and "opens" left-to-right when activated — this is the Sui-style reveal the user asked to borrow, adapted into the tree-card context.

```css
.card-inner {
  width: 56px; /* collapsed */
  overflow: hidden;
  transition: width 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.tree-row.active .card-inner { width: 100%; } /* expands to fill card */
```

Combined with the card's own slide-in:
```css
.tree-row.left-card  .exp-card { transform: translateX(20-24px); }
.tree-row.right-card .exp-card { transform: translateX(-20-24px); }
.tree-row.active     .exp-card { opacity: 1; transform: translateX(0); }
/* transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1) */
```

So the full sequence on entry is: card slides in from its offset (~0.55s) while simultaneously the inner width unfurls left-to-right (~0.65s) — these run concurrently, not sequentially.

### 4.3 Company name scramble effect

Triggered ~300-320ms after the card becomes active (after the slide-in has had time to mostly complete, so the scramble reads as a secondary flourish rather than competing with the slide motion).

```js
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_/';

function scramble(el, finalText, duration = 700) { // 600-800ms used across builds, 700 is the settled default
  const len = finalText.length;
  let frame = 0;
  const totalFrames = Math.floor(duration / 40); // 40ms tick interval
  el._timer && clearInterval(el._timer);
  el._timer = setInterval(() => {
    frame++;
    const resolved = Math.floor((frame / totalFrames) * len);
    let result = '';
    for (let i = 0; i < len; i++) {
      if (finalText[i] === ' ') { result += ' '; continue; }
      result += i < resolved ? finalText[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = result;
    if (frame >= totalFrames) {
      el.textContent = finalText;
      clearInterval(el._timer);
    }
  }, 40);
}
```
Resolution sweeps left-to-right: characters lock into their final value progressively from index 0 onward, while unresolved characters continue randomizing every 40ms tick. Spaces are never scrambled (passed through immediately) so multi-word company names keep readable word breaks throughout the animation.

Company name source text is stored in a `data-text` attribute on the `.card-company` span, not as the element's initial textContent (initial textContent is just the first character, acting as a zero-width placeholder before first activation).

### 4.4 Card-click → Modal expand

Clicking anywhere on a card (not just a specific button) triggers the modal. The modal is a **separate fixed-position element outside the tree**, not a child of the card — but it visually originates from the clicked card's exact screen position and size, then animates outward to a centered reading panel.

**Desktop modal expansion:**
```js
function openModal(company, cardEl) {
  const rect = cardEl.getBoundingClientRect();
  const modal = document.getElementById('modal');

  const targetW = 680, targetH = 520;
  const targetLeft = (window.innerWidth - targetW) / 2;
  const targetTop  = (window.innerHeight - targetH) / 2;

  // Snap to origin instantly (no transition)
  modal.style.transition = 'none';
  modal.style.width   = rect.width  + 'px';
  modal.style.height  = rect.height + 'px';
  modal.style.left    = rect.left   + 'px';
  modal.style.top     = rect.top    + 'px';
  modal.style.opacity = '0';
  modal.offsetWidth; // force reflow — required so the next transition isn't batched with the snap

  // Re-enable transition, then animate to target
  modal.style.transition = `width 0.55s cubic-bezier(0.16,1,0.3,1), height 0.55s cubic-bezier(0.16,1,0.3,1), top 0.55s cubic-bezier(0.16,1,0.3,1), left 0.55s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease`;

  requestAnimationFrame(() => {
    modal.style.width = targetW + 'px';
    modal.style.height = targetH + 'px';
    modal.style.left = targetLeft + 'px';
    modal.style.top = targetTop + 'px';
    modal.style.opacity = '1';
    modal.classList.add('open');
  });
}
```
The `modal.offsetWidth` read between the snap and the transition re-enable is a forced synchronous layout reflow — without it, browsers may batch both style changes into a single paint and skip the visible expansion entirely.

Backdrop overlay fades in concurrently: `background: rgba(8,10,14,0)` → `rgba(8,10,14,0.92)`, `transition: background 0.4s ease` (or `0.3s` — both values appeared across iterations; 0.3-0.4s acceptable range).

**Mobile modal — different mechanism, not an expand-from-card:**
Mobile uses a bottom-sheet slide-up instead, because the card-origin-expand doesn't translate well to small screens (cards are nearly full-width already, so "growing from the card" would look identical to a generic modal anyway). This is an intentional, justified divergence from the desktop pattern, not an oversight.
```css
.m-modal {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 0;
  border-radius: 16px 16px 0 0;
  transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.m-modal.open { height: 88%; } /* leaves 12% visible at top so user sees they can dismiss */
```
Includes a drag-handle visual (`width: 36px; height: 3px; background: #2e3a48; border-radius: 2px; margin: 12px auto 0;`) signaling native bottom-sheet affordance, even though actual drag-to-dismiss gesture handling was not implemented in the design mockup — only tap-to-dismiss (backdrop or close button) and Escape key were wired up. **Drag gesture support is a build-time addition, not yet speced behaviorally.**

**Closing (both platforms):**
```js
function closeModal() {
  modal.style.opacity = '0';
  setTimeout(() => {
    modal.classList.remove('open');
    overlay.classList.remove('open');
    modal.style.width = '0'; modal.style.height = '0'; // desktop only, reset for next open
  }, 200);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
```
Clicking the backdrop overlay also calls `closeModal()`. A close button (×, two crossed lines via inline SVG, not an icon font) sits in the modal header on both platforms.

**Guard against double-open:** an `isOpen` boolean flag prevents a second `openModal()` call from firing while one is already mid-transition or open — without this guard, rapid double-clicks could corrupt the origin-rect calculation.

### 4.5 Modal content structure (both platforms share this content template)

```
┌─────────────────────────────────┐
│ [logo] COMPANY NAME         [×] │  ← sticky header, stays visible on scroll
│        role · year · location   │
├─────────────────────────────────┤
│  [wide hero image placeholder]  │
│  [img] [img]                    │  ← 2-up grid below hero image
│                                  │
│  // OVERVIEW                    │
│  Overview paragraph text...     │
│  ↳ Thinking note (italic,       │
│    left blue border accent)     │
│                                  │
│  // WHAT I BUILT                │
│  Build details paragraph...     │
│                                  │
│  [tech][chips][row]              │
└─────────────────────────────────┘
```

**"Thinking note" component** — this is the key differentiator/personality element, directly carried over from an earlier design exploration ("Direction B — process over output") and intentionally preserved here:
```css
.thinking-note {
  background: #0a0d11;
  border-left: 2px solid #6BAED6;
  padding: 10-12px 14-16px;
  font-size: 10-11px; font-weight: 300;
  color: #2e3a48; font-style: italic; line-height: 1.7;
  border-radius: 0 3px 3px 0;
}
.thinking-note::before { content: '↳ '; color: #6BAED6; font-style: normal; }
```
Example content used in design: *"What does a good 'undo' look like when an agent has already taken 40 steps?"* (Simular AI), *"You learn fast when the person filing the bug report sits three rows behind you in lecture."* (AggieWorks). **These specific lines are placeholder/illustrative — user needs to write their own for each role, but the component and tone should be preserved exactly as designed.**

Image placeholders inside the modal are NOT yet wired to real assets — three image slots per modal (1 wide hero + 2 small supporting) is the target content shape once user provides photos per internship.

---

## 5. Typography Reference Table

| Use | Font | Weight | Style | Size (desktop) | Size (mobile) | Color |
|---|---|---|---|---|---|---|
| Section eyebrow | IBM Plex Mono | 400 | upright | 10px | 9px | `#2e3a48` |
| Section title | Barlow Condensed | 800 | upright | 48px | 36px | `#dde3ec` (accent word in `#6BAED6`) |
| Section count | IBM Plex Mono | 400 | upright | 10px | (often omitted) | `#2e3a48` |
| Card number | IBM Plex Mono | 500 | upright | 11px | 10px | `#556070` |
| Card company name | IBM Plex Mono | 500 | upright | 12px | 11px | `#8899aa` |
| Card location | IBM Plex Mono | 400 | upright | 9px | 9px | `#2e3a48` |
| Card role | Barlow Condensed | 700 | *italic* | 20-22px | 18px | `#6BAED6` |
| Card description | IBM Plex Mono | 300 | upright | 11px | 10px | `#3a4d60` |
| Card year | IBM Plex Mono | 400 | upright | 10px | 9px | `#2e3a48` |
| Tech icon tooltip | IBM Plex Mono | 400 | upright | 9px | 9px | `#6BAED6` |
| Modal company name | Barlow Condensed | 800 | upright | 22px | 20px | `#dde3ec` |
| Modal meta line | IBM Plex Mono | 400 | upright | 10px | 9-10px | `#3a4d60` |
| Modal section label | IBM Plex Mono | 400 | upright | 9px | 9px | `#6BAED6` |
| Modal body text | IBM Plex Mono | 300 | upright | 12px | 11px | `#445060` (highlighted `<strong>` spans → `#6a8090`) |
| Thinking note | IBM Plex Mono | 300 | *italic* | 10-11px | 10px | `#2e3a48` |
| Modal tech chips | IBM Plex Mono | 400 | upright | 9-10px | 9px | `#3a4d60` |

---

## 6. Color Reference Table

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0f1014` | Page/section background |
| `--card-bg` | `#0c0f13` | Card and modal background |
| `--card-header-bg` | `#13161c` | Card header row, number cell, modal logo cell area background |
| `--card-logo-bg` | `#0e1118` | Logo cell specifically — one shade darker than header for "inset" feel |
| `--card-footer-bg` | `#0a0d11` | Card footer, modal thinking-note background — darkest surface tier |
| `--border` | `#1e2535` / `#222b38` | Card/modal borders — upgraded from `0.5px` to `1px` per explicit feedback for "clearer borders" |
| `--border-subtle` | `#1a2028` / `#1e2a38` | Section divider, spine dotted line, inactive connector lines |
| `--accent` | `#6BAED6` | Role titles, active node fill, active connector lines, thinking-note border/arrow, tooltip text, section title highlight word |
| `--text-primary` | `#dde3ec` | Section title, modal company name, active node border |
| `--text-secondary` | `#8899aa` | Card company name |
| `--text-tertiary` | `#556070` | Card number |
| `--text-muted` | `#3a4d60` | Card description, card year, modal meta, tech chips |
| `--text-faint` | `#2e3a48` | Section eyebrow, location label, modal section label background-adjacent tones |
| **Logo badge colors** (placeholder, per-company) | | |
| Simular AI | bg `#0d1f2e` / text `#6BAED6` / border `#1a3048` | |
| AggieWorks | bg `#1a1f10` / text `#8ab870` / border `#2a3018` | |
| TCS Pace Port | bg `#1a1018` / text `#c87ab8` / border `#2e1828` | |
| NTT Data | bg `#1a1010` / text `#c87a5a` / border `#2e1818` | |

---

## 7. Mobile vs Desktop — Behavioural Differences Summary

| Aspect | Desktop | Mobile |
|---|---|---|
| Tree structure | Alternating left/right off centered spine | Single left-aligned vertical spine, all cards same side |
| Card max-width | 390px | Full width minus spine padding |
| Card number cell width | 44px | 38px |
| Modal mechanism | Expands from clicked card's exact rect → centered 680×520px panel | Bottom sheet slides up to 88% viewport height |
| Modal dismiss | Backdrop click, × button, Escape key | Backdrop click, × button (drag-to-dismiss not yet implemented) |
| Scroll-trigger root | Document viewport (or simulated phone-scroll container in mockup) | Same pattern, IntersectionObserver root should be the actual mobile scroll container in production |
| Click-to-expand hint text | Visible (`// click to expand`, bottom-right of card) | Replaced with explicit `→` arrow icon in card header (space-efficient alternative) |

---

## 8. Assets Needed Before Implementation

- [ ] **Real company logos** — AggieWorks, TCS Pace Port, NTT Data (all should have public assets); Simular AI logo or confirmed letter-badge fallback
- [ ] **Per-role photos for modals** — 3 images per internship (1 hero/wide + 2 supporting), user confirmed intent to add these but none yet supplied
- [ ] **Accurate tech stacks per role** — current chip/icon assignments are inferred placeholders, not confirmed against what was actually used at each internship
- [ ] **Real overview + "what I built" copy per role** — current modal body text is placeholder
- [ ] **"Thinking note" lines per role** — user's own authored voice, not Claude-generated placeholder text (component/styling is final, content is not)
- [ ] **Confirmed years/dates per role** — verify 2022/2023/2023/2024 placeholder timeline against actual employment dates
- [ ] **Section title final copy** — "Where I've shipped." is placeholder

## 9. Open Questions

1. **Tooltip vs always-visible labels for tech icons** — confirmed direction is hover-tooltip only (no visible text in the resting state). Confirm this remains the right call for touch devices where "hover" doesn't exist — mobile likely needs either always-visible small labels or a tap-to-reveal tooltip pattern, since hover-only tooltips are undiscoverable on touchscreens.
2. **Drag-to-dismiss gesture on mobile bottom sheet** — visual drag-handle is present but no actual swipe-down gesture handling was implemented in the design mockup. Needs to be built (likely via a touch/pointer event listener tracking vertical drag distance) for the bottom sheet to feel native.
3. **IntersectionObserver root in production** — design mockups simulated a phone-frame scroll container (`root: phoneScroll`). In the real production site, confirm whether Experience sits in normal document flow (root should be `null`/default) or inside any nested scroll container that would require an explicit `root`.
4. **Simular AI logo fallback** — confirm whether a real logo exists/can be obtained, or whether the `SI` letter-badge is the permanent solution.
5. **Connector-line color increments** — minor inconsistency across iterations between `0.3` and `0.4` border-color opacity on hover and `0.25` vs `0.3` IntersectionObserver threshold; both are within acceptable range but should be settled to single values during build (recommended: `0.4` opacity, `0.3` threshold, as these were the values used in the final/latest iteration).
