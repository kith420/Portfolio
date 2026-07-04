# Contact Section — Design Spec
**Portfolio: Nathan "Kith" Poernama — Closing section**
**Status:** Design finalized, ready for implementation
**Last updated:** 2026-07-03

> Eyebrow reads `// contact` (unnumbered, matching the Competitions convention rather than the numbered `// 0N — …` used by Experience/Work).

---

## 1. Visual Direction

### Concept
Contact is the **closing** section — it should feel like a *landing*, not a footer. The visitor has seen the full portfolio; this is the moment to convert, so it earns a full screen (`min-height: 82vh`, vertically centred) rather than a cramped link row.

Its structural metaphor is a **living dictionary entry** for the word *kith*. The nickname is treated as a headword — `kith /kɪθ/` — with a rotating set of "definitions" typed out one at a time, terminal-style, each attributed to a different (semi-serious) source. This is the section's one characterful idea, and it is deliberately the *only* flourish; everything else is quiet. It is what keeps a short section from reading as a default two-link footer.

The conceit is earned, not decorative: **Kith is a real nickname**, derived from the middle name **Keith** (people couldn't land the vowel, so the *e* got dropped). "Kith" is also the visitor's handle across every platform (`kith14`), and — a genuine bonus — the archaic English word *kith* literally means *"one's friends and acquaintances,"* which is exactly what a contact section invites. All three meanings are folded into the rotating definitions.

### Design principles
- **One idea, spent well.** The dictionary conceit + typewriter is the whole personality budget. No box-logo centrepiece, no availability pill, no seam demo — those were explored and cut.
- **Understated voice.** The headline "What's next." matches the dry, declarative titles of the other sections ("Where I've shipped.", "Selected drops.", "Competed.") — no winking. (An earlier "Let's be kith." headline was rejected for trying too hard.)
- **Name ↔ handle stitched together.** The site's face is the *Kith* handle, but the legal name must be present and connected so a recruiter walks away able to find *Nathan Poernama* (ATS, referrals). The full name **Nathan Keith Poernama** appears in the footer and the screen-reader line, and the Keith→Kith origin appears explicitly in the "etymology" definition — closing the loop.
- **Direct links only, no form.** Email, LinkedIn, GitHub — presented as **icons only**.
- **Availability signal: removed.** An "Available for work · 2026" status was considered (it was the rejected-from-nav "Available 2026" idea's natural home) and deliberately dropped to keep the section calm.

### Return to dark (structural beat)
Contact returns to the dark base `#0f1014` after the Work section's warm light (`#f0eeea`). **The palette flip is the beat — recommend a crisp cut, not a blended/morph transition.** A blend would soften the one moment that should land hard. Suggested (optional) treatment carried over from an earlier exploration: a single 1px powder-blue hairline on the seam plus a ~52px faint warm-to-transparent gradient at the very top edge so the flip reads as intentional. Exact seam handling belongs to page assembly (see Open Questions).

### Type system (introduced here, applies site-wide)
This section formalises a **three-role type system**. Monospace is demoted to tags/labels only; prose moves to a proportional face.

| Role | Font | Used for |
|---|---|---|
| Display | Barlow Condensed | Headlines |
| Body / prose | IBM Plex Sans | Anything read as a sentence (here: the definition line) |
| Tags / labels | IBM Plex Mono | `//` eyebrows, headword, source tags, footer meta, SKUs, timestamps, chips |

Plex Sans and Plex Mono are drawn as siblings, so prose and tags share DNA. Rolling this split across the other sections is a follow-up dependency (see Open Questions).

---

## 2. Layout Structure

Single left-aligned column at **all** breakpoints — there is no desktop/mobile structural divergence, only fluid sizing. Content is vertically centred in the viewport.

### Container
```css
.contact{
  min-height:82vh;
  display:flex; flex-direction:column; justify-content:center;
  max-width:720px; margin:0 auto;
  padding:120px 40px 48px;   /* mobile: 100px 22px 40px */
}
```

### Desktop (≥ ~957px, headline at max size)
```
┌───────────────────────────────────────────┐
│                                             │
│   // CONTACT                                │
│   What's next.                              │  ← Barlow Condensed 800, "next." in accent
│                                             │
│   kith  /kɪθ/                               │  ← mono headword + italic IPA (tag)
│   one's friends and acquaintances.▏         │  ← Plex Sans, typed + blinking cursor
│   — NOUN · ARCHAIC                          │  ← mono source tag (rotates)
│                                             │
│   [✉]  [in]  [◧]                            │  ← 46px icon chips: email / LinkedIn / GitHub
│                                             │
│   © 2026 Nathan Keith Poernama              │  ← mono meta
│                                             │
└───────────────────────────────────────────┘
```

### Mobile (< 520px)
Identical structure; padding tightens to `100px 22px 40px`, headline clamps down to its ~44px floor, and the definition line wraps to two lines for the longer entries (see §4.4 — the reflow "bounce" is intentional).

---

## 3. Components

### 3.1 Eyebrow (tag)
```
Text: "// contact"
IBM Plex Mono, 400, 11px, letter-spacing .14em, uppercase, color #6BAED6
```

### 3.2 Title (display)
```html
<h2 class="title">
  <span class="line"><span>What's <span class="accent">next.</span></span></span>
</h2>
```
- Barlow Condensed 800, `clamp(44px, 7vw, 76px)`, line-height .98, letter-spacing -0.01em, margin-top 14px
- Base color inherits `#dde3ec`; `.accent` word ("next.") is `#6BAED6`, upright (not italic — keep dry)
- Follows the site title grammar: short phrase + accent word + period
- Reveal: line-by-line slideUp (see §4.2). The `.line` wrapper is `display:block; overflow:hidden` (clip mask); the inner span rises from `translateY(115%)`.

### 3.3 Dictionary entry (the signature)
Wrapper: `.entry { margin-top:34px; max-width:46ch }`

**Headword + IPA (tag):**
```html
<div class="head"><span class="w">kith</span> &nbsp;<span class="ipa">/kɪθ/</span></div>
```
- `.head` — IBM Plex Mono 400, 13px, letter-spacing .02em, color `#3a4d60`
- `.w` (kith) — color `#6BAED6`
- `.ipa` (/kɪθ/) — italic, color `#2e3a48`  (IPA glyph is U+026A `ɪ` + U+03B8 `θ`)

**Definition (body / prose):**
```html
<p class="def" aria-hidden="true"><span id="def"></span><span class="cursor"></span></p>
```
- IBM Plex Sans 400, `clamp(17px, 2.3vw, 22px)`, line-height 1.55, color `#dde3ec`, margin-top 9px
- **No reserved min-height** — the line reflows naturally as text types/wraps (intentional "typewriter bounce"; see §4.4)
- Text is injected by JS (see §5 for the copy); the span is `aria-hidden` and the meaning is carried by the `.sr-only` line (§3.6)
- Serif one-off option (explored, not adopted): swapping `.def` font-family to `'Newsreader',Georgia,serif` + `font-style:italic` turns it into a serif "example sentence." Left as a single-line swap if revisited.

**Cursor:**
```css
.cursor{
  display:inline-block; width:2px; height:1.05em; background:#6BAED6;
  margin-left:4px; vertical-align:-3px;
  animation:blink 1.05s steps(1) infinite;
}
@keyframes blink{ 50%{opacity:0} }
```
The cursor is always present in the DOM, so the definition line never fully collapses even when the text is empty between cycles.

**Source tag (tag, rotates):**
```html
<p class="src" id="src"></p>
```
```css
.src{ font: IBM Plex Mono 400 10px; letter-spacing:.12em; text-transform:uppercase;
      color:#2e3a48; margin-top:14px; transition:opacity .25s ease; }
.src::before{ content:"— "; color:#6BAED6; }
```
Source text is set by JS in sync with each definition (fades on change — see §4.5).

### 3.4 Icon links
```css
.links{ display:flex; gap:14px; margin-top:44px; }
.links a{
  width:46px; height:46px; display:inline-flex; align-items:center; justify-content:center;
  border:1px solid #1e2535; border-radius:2px; color:#3a4d60;
  transition:color .35s var(--ease), border-color .35s var(--ease),
             transform .35s var(--ease), background .35s var(--ease);
}
.links svg{ width:20px; height:20px; fill:currentColor; display:block; }
```
- 46×46 chips = comfortable tap target; border-radius 2px matches the box-logo motif
- Inline single-path SVGs (`fill:currentColor`), **not** an icon font; each SVG is `aria-hidden`, each `<a>` has `aria-label` + `title`

| Icon | href | aria-label | SVG path `d` (viewBox 0 0 24 24) |
|---|---|---|---|
| Email | `mailto:nathankeithp@gmail.com` | `Email nathankeithp@gmail.com` | `M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z` |
| LinkedIn | `https://www.linkedin.com/in/kith14` (`target=_blank rel=noopener`) | `LinkedIn` | `M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z` |
| GitHub | `https://github.com/kith420` (`target=_blank rel=noopener`) | `GitHub` | `M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z` |

Hover / focus-visible: `color` + `border-color` → `#6BAED6`, `transform: translateY(-3px)`, `background: rgba(107,174,214,.05)`, `outline:none`.

### 3.5 Footer (meta)
```
Text: "© 2026 Nathan Keith Poernama"
IBM Plex Mono 400, 9px, letter-spacing .06em, color #2e3a48, margin-top 60px
```
Carries the full legal name so it's connected to the Kith handle used everywhere else.

### 3.6 Screen-reader line
```html
<span class="sr-only">kith: a nickname, from the middle name Keith. Nathan Keith Poernama.</span>
```
Visually hidden (`position:absolute; width:1px; height:1px; clip:rect(0 0 0 0)`). Because the animated `.def` span is `aria-hidden`, this line is what conveys meaning to assistive tech — the rapidly-changing typed text is never announced.

---

## 4. Interactions & Animation Specs

Global easing token: `--ease: cubic-bezier(0.16, 1, 0.3, 1)` (the site's open/expand curve). Applied to title slideUp, the entry/links entrance, and icon hover transitions.

### 4.1 Scroll trigger — repeating (critical behaviour)
A single `IntersectionObserver` on `.contact`, `threshold: 0.35`, **never unobserved** — animations must replay on *every* entry and reset on *every* exit (site-wide rule).
```js
const io = new IntersectionObserver((es)=>es.forEach(e=>{
  if(e.isIntersecting){
    c.classList.add('in');
    if(reduce){ /* static: show DEFS[0] */ } else { stop(); defEl.textContent=''; run(); }
  } else {
    c.classList.remove('in');
    if(!reduce){ stop(); defEl.textContent=''; }
  }
}), { threshold:.35 });
io.observe(c);
```
On exit: `.in` removed (entrance animations reset via the transition-only-in-.in trick below), typewriter stopped, definition text cleared.

### 4.2 Title slideUp
```css
.line{ display:block; overflow:hidden; }
.line > span{ display:inline-block; transform:translateY(115%); }
.contact.in .line > span{ transform:translateY(0); transition:transform .7s var(--ease); }
```
Transition is declared only on the `.in` state → animates **in** on entry, **snaps** back on exit (ready to replay). No delay (fires at t=0 on entry).

### 4.3 Entrance stagger (entry + links)
```css
.entry, .links{ opacity:0; transform:translateY(10px); }
.contact.in .entry, .contact.in .links{
  opacity:1; transform:translateY(0);
  transition:opacity .6s ease, transform .6s var(--ease);
}
.contact.in .entry{ transition-delay:.28s; }
.contact.in .links{ transition-delay:.42s; }
```
Entry order on scroll-in: title lines rise (0.7s, t=0) → dictionary block fades/rises (delay 0.28s) → icons fade/rise (delay 0.42s). The typewriter begins at section entry, concurrent with the dictionary block's fade-in.

### 4.4 Typewriter (definitions) — full spec
A `setTimeout`-driven state machine cycling the `DEFS` array (§5): **type → hold → erase → pause → next**, looping indefinitely while the section is in view.

| Phase | Value |
|---|---|
| Type speed | 45 ms / character |
| Hold (full line shown) | 2000 ms |
| Erase speed | 22 ms / character |
| Pause (empty, before next) | 280 ms |
| Loop | cyclic: `i = (i + 1) % DEFS.length` |

```js
function run(){
  let i = 0; running = true;
  (function typeDef(){
    if(!running) return;
    const cur = DEFS[i];
    srcEl.style.opacity = 0;
    setTimeout(()=>{ srcEl.textContent = cur.s; srcEl.style.opacity = 1; }, 120);  // source fade
    let pos = 0;
    (function type(){
      if(!running) return;
      defEl.textContent = cur.d.slice(0, pos++);
      timer = setTimeout(pos <= cur.d.length ? type : erase, pos <= cur.d.length ? 45 : 2000);
    })();
    function erase(){
      if(!running) return;
      let len = cur.d.length;
      (function back(){
        if(!running) return;
        defEl.textContent = cur.d.slice(0, len--);
        if(len >= 0){ timer = setTimeout(back, 22); }
        else { i = (i + 1) % DEFS.length; timer = setTimeout(typeDef, 280); }
      })();
    }
  })();
}
function stop(){ running = false; clearTimeout(timer); }
```
- **Guard:** a `running` flag + single `timer` handle + `clearTimeout` prevent a re-entry from spawning a second concurrent loop. Always `stop()` before starting.
- **Reflow "bounce" is intentional.** `.def` has no reserved height. On desktop all four definitions fit one line within `46ch`, so nothing below moves. On mobile the longer entries wrap to two lines, so the source tag + icons shift down while that line is shown and pop back when it erases — this reads as "it's being typed" and is the desired behaviour (an earlier fixed `min-height` was removed because it left dead space at desktop width).

### 4.5 Source-tag fade
On each new definition: `.src` opacity → 0, then after 120 ms its text is swapped and opacity → 1 (`transition: opacity .25s ease`), so the source cross-fades rather than snapping.

### 4.6 Cursor blink
`blink 1.05s steps(1) infinite` (hard on/off, no fade), on a 2px accent bar. See §3.3.

### 4.7 Icon hover / focus
Color + border → accent, `translateY(-3px)` lift, faint accent bg tint, `.35s var(--ease)`. `:focus-visible` shares the hover treatment (keyboard parity), `outline:none` only because the accent border serves as the focus ring.

### 4.8 Reduced motion (`prefers-reduced-motion: reduce`)
- CSS: all animation/transition disabled; `.line > span` no transform; `.entry`/`.links` forced visible; `.cursor { display:none }`.
- JS: no typing loop — the **first** definition (`DEFS[0]`) and its source are shown statically on entry.

---

## 5. Content

### Headline
`What's next.` — "next." in accent. (Landed on; consistent with the other sections' dry declarative titles. Nathan's final call — see Open Questions.)

### Footer
`© 2026 Nathan Keith Poernama`

### Rotating definitions (`DEFS`)
Order = display order. First entry is also the reduced-motion fallback. **These four lines are Claude-drafted placeholders — Nathan to finalise in his own voice** (the etymology and disambiguation lines especially).

| # | Definition (`d`) | Source (`s`) |
|---|---|---|
| 1 | `one's friends and acquaintances.` | `noun · archaic` |
| 2 | `from "Keith" — the 'e' never quite made it.` | `etymology` |
| 3 | `@kith14, on just about every platform.` | `the internet` |
| 4 | `no relation to the streetwear label. mostly.` | `disambiguation` |

**Exact characters to reproduce:** apostrophe = U+2019 (`'`), double quotes = U+201C / U+201D (`"` `"`), dash = U+2014 (em dash `—`), middot = U+00B7 (`·`). Store as JS string escapes to be safe: `\u2019`, `\u201C`, `\u201D`, `\u2014`, `\u00B7`.

---

## 6. Mobile vs Desktop — Behavioural Summary

| Aspect | Desktop | Mobile (< 520px) |
|---|---|---|
| Structure | Single left-aligned column | Same — no structural change |
| Container padding | `120px 40px 48px` | `100px 22px 40px` |
| Headline size | up to 76px (`clamp(44,7vw,76)`) | ~44px floor |
| Definition line | fits one line (within 46ch) → no vertical shift | longer entries wrap to 2 lines → source/icons "bounce" (intended) |
| Icon chips | 46px | 46px (tap target unchanged) |
| Interactions | hover + focus | tap opens link; hover states n/a, focus parity retained |

---

## 7. Typography Reference Table

| Element | Font | Weight | Style | Size (desktop) | Size (mobile) | Tracking | Case | Color |
|---|---|---|---|---|---|---|---|---|
| Eyebrow | IBM Plex Mono | 400 | upright | 11px | 11px | .14em | upper | `#6BAED6` |
| Title | Barlow Condensed | 800 | upright | clamp(44–76px) | ~44px | -0.01em | sentence | `#dde3ec` (accent word `#6BAED6`) |
| Headword `kith` | IBM Plex Mono | 400 | upright | 13px | 13px | .02em | lower | `#6BAED6` |
| IPA `/kɪθ/` | IBM Plex Mono | 400 | *italic* | 13px | 13px | .02em | — | `#2e3a48` |
| Definition | IBM Plex Sans | 400 | upright | clamp(17–22px) | ~17px | normal | sentence | `#dde3ec` |
| Source tag | IBM Plex Mono | 400 | upright | 10px | 10px | .12em | upper | `#2e3a48` (em-dash prefix `#6BAED6`) |
| Footer meta | IBM Plex Mono | 400 | upright | 9px | 9px | .06em | — | `#2e3a48` |

**Google Fonts load string:**
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap
```
(700 Barlow / the 300 & 500 mono & sans weights are loaded for site-wide reuse; this section itself uses Barlow 800, and Plex Sans/Mono at 400.)

**Font stacks (tokens):**
```css
--display:'Barlow Condensed','Arial Narrow',sans-serif;
--body:'IBM Plex Sans',system-ui,sans-serif;
--mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;
```

---

## 8. Colour Reference Table

| Token | Hex | Usage in this section |
|---|---|---|
| `--bg` | `#0f1014` | Section background (return-to-dark beat) |
| `--ink` | `#dde3ec` | Title, definition text |
| `--ink-2` | `#8899aa` | *(system token; not used in this section)* |
| `--muted` | `#3a4d60` | Headword `kith` base, icon default color |
| `--faint` | `#2e3a48` | IPA, source tag, footer meta |
| `--border` | `#1e2535` | Icon chip borders |
| `--accent` | `#6BAED6` | Eyebrow, accent word "next.", headword `kith`, source em-dash, cursor, icon hover (color/border/focus) |
| accent tint | `rgba(107,174,214,.05)` | Icon hover background |

---

## 9. Assets Needed

- **Email:** `nathankeithp@gmail.com` — confirmed and wired (no longer a placeholder).
- **Final definition copy** — the four `DEFS` lines are Claude-drafted; rewrite in Nathan's voice (content only, non-blocking; component/motion are final).
- **Handles** — LinkedIn `linkedin.com/in/kith14` (confirmed), GitHub `github.com/kith420` (confirmed but breaks the `kith14` pattern — see Open Questions).
- **No images.** This section is intentionally asset-light — icon-only, no photography — a deliberate contrast with the image-heavy Work/Competitions sections.
- **Fonts** — Barlow Condensed, IBM Plex Sans, IBM Plex Mono (already in the site's font stack).

---

## 10. Open Questions

1. **Work → Contact seam.** Recommended = crisp palette-flip cut (dark returns), not a shared morph. Final treatment (bare cut vs 1px accent hairline vs faint warm-gradient sliver vs scroll-triggered dark wipe) to be decided during page assembly. Recommendation: 1px `#6BAED6` hairline + ~52px warm-to-transparent gradient at the top edge.
2. **Serif definition one-off.** Explored (Fraunces / Newsreader / Source Serif, roman + italic) and not adopted; final uses Plex Sans for cohesion. Documented as a one-line `.def` swap. Decide whether to keep as a live future option or close it.
3. **Email visibility.** Currently icon-only — the address surfaces only on click (mailto). Confirm this is acceptable, or add the address as visible text.
4. **GitHub handle consistency.** `kith420` is the only handle that breaks from the uniform `kith14` set, and the `420` reads loudest to the quant/HFT audience being targeted. Decide whether to unify to `kith14` (if available) — cosmetic/branding, not blocking.
5. **Definition loop cap.** The typewriter loops indefinitely while in view. Confirm forever-loop is desired, or cap the cycles after N passes to reduce ambient motion. (Reduced-motion users already get a static first line.)
6. **Site-wide type migration (dependency).** This section pioneered the three-role split (mono → tags only, Plex Sans → prose). Hero / Experience / Competitions / Work must be migrated for the site to read consistently — a separate task tracked outside this section.
7. **Headline copy.** "What's next." is the working title; treat as final pending Nathan's sign-off (same placeholder-title caveat as the other sections).

---

## 11. Implementation Notes (Misc)

- Vanilla HTML/CSS/JS, single `<section>`. No framework, no build step required.
- **Transition-only-in-`.in` pattern:** entrance transitions are declared on the `.contact.in <el>` state, not the base state — so elements animate *in* on entry and *snap* out on exit, leaving them primed to replay. This is what makes the repeating scroll trigger clean.
- **Cursor keeps the line alive:** the blinking cursor span is always in the DOM, so `.def` never collapses to zero height between cycles even with empty text.
- **Accessibility:** animated `.def` span is `aria-hidden`; meaning carried by the `.sr-only` line. Icon `<a>`s have `aria-label` + `title`; SVGs `aria-hidden`. `:focus-visible` mirrors hover (accent border acts as focus ring). Reduced-motion fully handled (§4.8).
- **No `localStorage`/`sessionStorage`** — not needed, and disallowed in some embed environments.
- Icons are inline single-path SVGs with `fill:currentColor` — no icon font dependency.
- Hairline borders use `1px` (not sub-pixel) to render reliably across displays.
