# Portfolio Spec — Section Transitions

**Last updated:** July 2026
**Status:** Competitions→Work locked and prototyped; other three seams specced, not yet built
**Working files:** `portfolio-flow-prototype.html` (full flow), `seam-drop-into-section.html` (isolated Competitions→Work)

---

## 1. Philosophy

The page is one scroll with five sections. The transitions are **selective, not uniform** — a designed transition only earns its place where it adds cohesion, and stays out of the way where a hard break is the intended beat.

The governing insight: the four seams are two different kinds of problem.

- **Palette breaks** — Experience→Competitions (dark→cork) and Work→Contact (paper→dark). The colour jump *is* the beat. These want a **crisp cut**, not a blend. Morphing them would soften the one moment that should land hard.
- **Within-palette seams** — Hero→Experience (dark→dark) and Competitions→Work (cork→paper, same warm family). No break to fight, so a **designed transition** adds cohesion. These are where craft pays off.

Rule of thumb: **cut the breaks, flow the continuities.**

### Palette rhythm

`dark → dark → cork → paper → dark`

Two dark sections (professional frame) → two warm sections (human/tactile core) → one dark (close). The warm middle is bracketed by dark on both sides; the colour alone tells the story before a word is read.

---

## 2. The through-lines

What lets the site afford selective transitions rather than transitions everywhere:

- **The accent is the constant.** `#6BAED6` (and its darker sibling `#1f5d80` in the warm sections) is the only colour that survives every palette change. It is the vertical scroll-hint, the activating spine, the duotone tint, the active panel border, and the Contact cursor. When a seam needs stitching, the accent does it.
- **Three rhyming text idioms.** slideUp for headlines (Hero, Contact), left-to-right monospace scramble for labels/names (Experience, Work), typewriter for the Contact definition. Shared DNA — mechanical, swept reveals on `cubic-bezier(0.16, 1, 0.3, 1)` — without being identical.
- **The stamp motif.** The polaroid-back Kith rubber stamp and the Work dashed-circle status stamp are the same gesture in different ink; it bridges the two warm sections.

---

## 3. Seam-by-seam

### 3a. Hero → Experience — *continuity* (not yet built)

Both dark, same fonts, same accent. Maximum continuity.

- The Hero scroll-hint is a vertical powder-blue stroke; the Experience spine is a vertical dotted line that activates to powder-blue on entry. **Make them the same line:** as the hero scrolls out, the hint draws downward and lands as the top of the tree spine; the first node lights.
- **Axis flip for free:** the hero carousel drifts *horizontally*, the tree climbs *vertically* — the moment reads as "stopped drifting, now ascending a structure."
- **Dependency:** on desktop the hint currently sits bottom-left (48px) while the spine is centered. For a pixel-continuous hand-off, re-center the hint (also cleans up the hero's bottom edge: hint center, stats right).

### 3b. Experience → Competitions — *staged hard cut* (not yet built)

First warm break. Keep the colour cut crisp; put the energy into the arrival.

- The `// competitions / Competed.` header sits on the **dark** background above the cork — a built-in airlock that eases across the fold before the warm surface begins.
- The cork surface begins full-bleed with a crisp top edge + a 2px accent hairline (`inset 0 2px 0 rgba(107,174,214,.22)`) and a soft top vignette, so it reads as the warm world starting rather than a boxed slab.
- **Entrance:** currently static (crisp cut). A gentle rise/fade on the cork as it enters is still open. The break is the beat — do **not** morph the colour.

### 3c. Competitions → Work — *the blend* — **LOCKED & PROTOTYPED**

The one seam where morphing is correct (warm→warm). See §4 for the full mechanic.

The cork is **full-bleed** (matching the Competitions spec's "full-bleed warm surface" intent, not a contained slab) and flows straight down through the warm wash into the paper of Work — no dark gap between board and bridge. The polaroids unpin off that surface and reorganize into the real cards.

Narrative: the pinboard of personal mementos reorganizes into the curated product catalogue — analog → editorial. Caveat handwriting gives way to Oswald print; scattered/tilted becomes aligned/upright.

### 3d. Work → Contact — *crisp cut* (spec from Contact doc)

Return to dark; closes the loop to the Hero's world.

- 1px `#6BAED6` hairline at the seam + a ~52px warm-to-transparent gradient sliver at the top of the dark. No blend/morph.
- Justification: the accent is the only colour that crosses every palette change, so the hairline isn't decoration — **the accent stitches the cut.**
- Contact is built to rhyme with Hero (slideUp title, brand name, dark), so the cut lands you "home."

---

## 4. Competitions → Work — full mechanic

**Concept:** the polaroids pinned on the cork board **unpin, fall, and reorganize into the real project cards.** They are the same objects continuing — not a decorative layer, not a duplicate grid.

### 4a. Structure

```
[ dark — // competitions / Competed. header ]
[ cork-zone — FULL-BLEED cork, texture + accent hairline at the top edge; real pinned polaroids in a centered inner ]
[ .wash-tail — 34vh warm wash: cork → paper (the bottom of the same continuous surface) ]
[ Work section — real .pcard grid on paper (cards start at opacity 0) ]
[ .stage — fixed, pointer-events:none overlay holding the transient travellers ]
```

- **Full-bleed, no dark gap.** The cork is one continuous surface that starts at the dark header (crisp edge + accent hairline = the Experience→Competitions cut) and runs straight down through the wash into the paper of Work. No contained slab sitting on dark below the board.
- **No duplicate grid.** The cards the polaroids land in *are* the Selected Drops cards; the transition just populates them.
- **No top-fly.** Each traveller originates from its real board polaroid's measured position, so it reads as coming off the board.

### 4b. Warm wash (`.wash-tail`)

`linear-gradient(180deg, #b8845a 0%, #d0a074 26%, #dcc0a0 52%, #e9e0d2 78%, #f0eeea 100%)`, height `34vh` — the bottom stretch of the continuous full-bleed cork surface. The board polaroids travel from the tan (analog) end down into the paper (editorial) end — the colour ramp maps to the motion. The 34vh height is tuned so the board is still on screen when the polaroids release and off-screen by the time they land.

### 4c. Scroll progress

Scrubbed to scroll position (reversible), driven by the grid's entry:

```
p = clamp( (1.12·vh − gridTop) / (0.74·vh), 0, 1 )
  p = 0  when grid top ≈ 1.12·vh  (grid just below the fold, board still visible)
  p = 1  when grid top ≈ 0.38·vh  (grid settled)
```

Per-traveller local progress, gentle left-to-right stagger:

```
pi = clamp( (p − i·0.05) / 0.86, 0, 1 )
```

### 4d. Per-traveller motion

Anchors are measured **live every frame** (both board polaroid and card move with scroll):

```
fall       = ease(seg(pi, 0,   0.9))    // position, board → card
straighten = ease(seg(pi, 0.32, 1))     // resting tilt → 0
ease(t)    = 1 − (1 − t)^2.2

centre  = lerp(boardPolaroidCentre, cardCentre, fall)
rotate  = lerp(boardTilt, 0, straighten)
scale   = lerp(1, 0.9, fall)
```

- **Pushpin release:** `lift = seg(pi, 0, 0.2)` → pin `translateY(−lift·16px)` and `opacity 1→0`. The pin pops off as the polaroid detaches.
- **Handoff (no double-render):** source board polaroid `opacity = 1 − seg(pi, 0, 0.1)`; traveller `opacity = seg(pi, 0, 0.05) · (1 − seg(pi, 0.72, 0.95))`. The real polaroid fades exactly as its traveller takes over; the traveller fades exactly as its card resolves.
- **Card develops:** target card `opacity = seg(pi, 0.72, 1)` (duotone resolves in place at the landing).

### 4e. Responsive count

The number of polaroids that animate = **the number of cards in the visible top row** = the column count.

- Desktop (3-col): 3 polaroids unpin into the top row.
- Tablet (2-col): 2.
- Mobile (1-col): 1 — collapses to a single polaroid developing in, which is the correct mobile priority.

Computed live from `pcard.offsetTop` (cards sharing the first card's top = top row). Board polaroids beyond the count scroll away normally; cards below the top row settle in just after (`opacity/translateY` on `seg(p, 0.6, 1)`).

### 4f. Reduced motion

`.stage` hidden; all cards shown at rest; no scroll driving. Never traps the user in a scrubbed region.

### 4g. Tuning knobs (in the code)

| Knob | Where | Effect |
|---|---|---|
| Trigger window | `1.12·vh` / `0.74·vh` in `p` | when the fall starts / how long it lasts |
| Stagger | `i·0.05` in `pi` | tighter/looser cascade |
| Straighten start | `seg(pi, 0.32, 1)` | how long they stay tilted mid-fall |
| Bridge height | `.wash-tail{height:34vh}` | board visibility at release; wash length |
| Land scale | `lerp(1, 0.9, fall)` | polaroid size on touchdown |

---

## 5. Coherence dependencies

Cross-cutting issues the seams surface; track separately.

1. **Scroll-trigger discipline.** Experience, Work, and Contact re-fire on every entry and reset on exit (never `unobserve`). Competitions must adopt the same, or scrolling back up through the warm middle feels inconsistent (Work re-animates, Competitions sits static).
2. **Prose type is split-brained.** Contact's three-role system (mono → tags only; proportional for prose) is half-adopted: Work uses DM Sans and Competitions uses Caveat for body, but Hero's bio and Experience's descriptions still use IBM Plex Mono *as prose*. Until migrated, the dark sections read "terminal" and the rest read "editorial."
3. **Eyebrow numbering hole.** Only Experience (`// 02`) and Work (`// 03`) are numbered; Hero, Competitions, Contact aren't — there is no `01`. Commit to numbering all five or drop numbers entirely.

---

## 6. Open questions

- [ ] Hero→Experience: re-center the desktop scroll hint to make the line→spine hand-off pixel-continuous?
- [ ] Experience→Competitions: exact board-entrance timing/curve.
- [ ] Competitions→Work: is 34vh the right bridge length once the real Competitions board height (360px) is in place in the full flow? May need a trigger nudge in-context.
- [ ] Should the two hard-cut seams share a treatment vocabulary (both a thin accent hairline) so entry-into-warm and exit-from-warm rhyme as bookends?
- [ ] Real project data — the drop cards and the polaroid→card order are still placeholders. Slot order = priority order.

---

## 7. Reference — motion tokens

| Token | Value | Usage |
|---|---|---|
| Primary ease | `cubic-bezier(0.16, 1, 0.3, 1)` | all expand/open motion |
| Fall ease (seam) | `1 − (1 − t)^2.2` | polaroid descent |
| Flip ease | `cubic-bezier(0.23, 1, 0.32, 1)` | polaroid front→back |
| Spring (breathing) | `cubic-bezier(0.34, 1.15, 0.64, 1)` | Competitions stack step-up |
| Accent | `#6BAED6` / `#1f5d80` | the constant across every seam |
| Warm wash | `#b8845a → #f0eeea` | Competitions→Work bridge |
