# Portfolio Spec — Competitions Section

**Last updated:** June 2026  
**Status:** Design locked, ready for implementation

---

## 1. Visual direction

The Competitions section is intentionally differentiated from Experience. Where Experience uses a structured tree/timeline layout, Competitions goes fully physical and tactile — a cork pinboard with scattered polaroid photographs. The goal is "memento wall", not "resume line item".

This is also the only section that breaks from the site's dark background. The cork board is a full-bleed warm surface that creates a deliberate visual punctuation point when scrolling.

**The anti-AI-generated test:** The polaroid + cork board combination was chosen because it references a specific physical object. It should feel like something you'd find in someone's bedroom, not a template.

---

## 2. Section header

```
// competitions          ← IBM Plex Mono, 11px, 300 weight, #6BAED6, 0.18em tracking, uppercase
Competed.               ← Barlow Condensed, 800 weight, italic, #f0eeea
```

Sits above the cork board on the dark site background before the board begins.

---

## 3. Cork board

- **Background colour:** `#b8845a`
- **Texture:** CSS repeating-linear-gradient grid pattern (horizontal + vertical, low opacity)
- **Vignette:** `inset 0 0 70px rgba(0,0,0,0.22)` — darkens edges to give depth
- **Border radius:** 3px
- **Desktop height:** ~340px
- **Mobile height:** ~320px
- **Overflow:** hidden on the board, cards can visually poke out slightly at top (pin area)

---

## 4. Polaroid card

### 4a. Dimensions
- **Desktop:** 164px × 210px
- **Mobile:** 152px × 196px

### 4b. Front face

**Structure (top to bottom):**
1. White border top/sides: 7–8px padding
2. Photo area: fills remaining height minus caption strip
3. Caption strip: ~42–46px

**Photo area:**
- Background: `#13161c` (dark placeholder until real photos added)
- Inset recess shadow: `inset 0 0 0 1.5px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(0,0,0,0.15)`
- Real photos should be portrait-oriented competition shots — team photos, venue, or screenshot of ranking

**Caption strip:**
- Font: **Caveat** 500 weight, ~17px — competition name
- Font: **Caveat** 400 weight, ~13px, muted — date · location
- Colour: `#2e2820` (name), `#7a6e60` (date)
- Background: `#f0ece3` with `feTurbulence` paper texture filter applied

**Paper texture (SVG feTurbulence):**
```
type="fractalNoise"
baseFrequency="0.65 0.15"   ← directional horizontal fibres
numOctaves="4"
seed="2"
```
Blended in multiply mode. Slope ~0.08 on RGB channels, intercept ~0.92. Creates visible paper grain without looking digital.

**Front face content — final:**
- Competition name (Caveat)
- Date · Location (Caveat, muted)
- ~~Result badge~~ — removed. Result lives on the back only.

**Physical details:**
- Dog-eared bottom-right corner (CSS border trick)
- Faint age yellowing on left edge (`rgba(160,120,50,0.07)` gradient)
- `box-shadow`: `0 1px 0 rgba(255,255,255,0.1) inset, 1px 2px 0 rgba(0,0,0,0.07), 2px 6px 16px rgba(0,0,0,0.3)`

### 4c. Back face

**Structure:**
- Faint ruled lines (SVG lines, `#ccc4b4`, 0.5px, spaced 14px apart)
- Red margin line: 1px, `rgba(180,140,140,0.2)`, at x=28px from left
- Faint fingerprint smudge (decorative, very subtle)
- `feTurbulence` paper texture — slightly rougher than front (`baseFrequency="0.7 0.25"`, `numOctaves="5"`, `seed="14"`)

**Content hierarchy:**
1. `#6BAED6` accent bar — 18px × 2px
2. Competition name — IBM Plex Mono, 9px, 300 weight, uppercase, `#8a7a6a`
3. Result / medal — **Barlow Condensed, 800 weight, italic, 40px**, `#1a1410`
4. Body notes — **Caveat** 400 weight, 14px, `#3a3028`, line-height 1.8 (feels handwritten)
5. Hairline divider — `#cec6b8`
6. Date · Location — IBM Plex Mono, 9px, 300 weight, `#9a9080`

**KITH stamp** (bottom-right corner):
- Font: IBM Plex Mono, 9px, uppercase, `letter-spacing: 0.22em`
- Colour: `rgba(107,174,214,0.28)` — very faded
- Border: `1.5px solid rgba(107,174,214,0.18)`
- Rotated: `rotate(-8deg)`
- Mimics a rubber stamp

### 4d. Pushpin

Alternating pin colours per card (not all identical):
- Red: `#8b3a3a` / border `#6a2a2a`
- Blue: `#2a4a8b` / border `#1a3060`
- Green: `#3a6a2a` / border `#2a4a1a`
- Brown: `#6a4a2a` / border `#4a3020`

Pin anatomy: radial-gradient head, highlight dot, cast shadow (blurred ellipse beneath).

Some cards use **washi tape** instead of a pushpin — a semi-transparent strip (`rgba(220,210,180,0.52)`) with faint vertical stripe pattern. Adds variety.

### 4e. Resting tilt

Each card has a unique resting rotation. Suggested per card:
```
ICPC:   +3deg
NOI:    -4deg
Meta:   +5deg
IOI:    -2deg
CodeVita: +4deg
```

---

## 5. Stack depth (3D)

The stack uses CSS `perspective: 700px` on the cork inner container with `preserve-3d`. Three cards visible at once:

| Slot | translateZ | translateY | scale | opacity |
|------|-----------|-----------|-------|---------|
| Front (0) | 0 | 0 | 1.0 | 1.0 |
| Mid (1) | -14px | 5px | 0.96 | 0.70 |
| Back (2) | -26px | 10px | 0.92 | 0.46 |

Behind-slot cards use `tilt * 0.3` rotation (reduced, not full card tilt).

When the front card tears away, mid and back cards simultaneously animate forward into the vacated slots — the "breathing" effect. Uses `cubic-bezier(0.34,1.15,0.64,1)` for a slight spring overshoot.

---

## 6. Tear animation

Reference: Chinese tear-off calendar. The whole card tears away from the pin point, revealing the next card already sitting underneath.

### 6a. Stub

A thin sliver (~14px tall) stays pinned at the top while the flap tears away. Achieved via:
- `.pol-stub` — `clip-path: inset(0 0 92% 0)` — only the top 8% of card height visible
- Lives inside `.stack` as a sibling to the cards
- Fades out briefly as card exits, fades back in when next card arrives

### 6b. Tear line (SVG polyline)

Jagged polyline positioned at the stub bottom edge (`top: 12px`). Two layers:
- `stroke="#bfb8a8"` 1.2px — the torn paper edge
- `stroke="rgba(0,0,0,0.08)"` 0.6px offset by 1.8px — shadow under the tear

Appears on `tearSvg.classList.add('show')`, disappears after animation completes.

### 6c. Forward tear (next card)

```
Phase 1 — hesitation (0–90ms):
  transform: rotate(tilt + 1deg) translateY(-3px) scale(1.01)
  transition: 0.07s ease-in
  → paper gripping before release

Phase 2 — release (90–430ms):
  transform: rotate(tilt - 20deg) translateX(-300px) translateY(-44px) scale(0.94)
  opacity: 0
  transition: transform 0.34s cubic-bezier(0.6, 0, 0.95, 0.55)
              opacity 0.26s 0.05s ease
  → arc left-and-up, accelerate out

Stack promote: begins at ~40ms, duration 360ms
  cubic-bezier(0.34,1.15,0.64,1) — spring overshoot on step-up
```

**Critical:** `getBoundingClientRect()` (force reflow) called between setting start state and triggering transition. Without this, browser batches both writes and skips phase 1.

Total duration: ~490ms

### 6d. Backward tear (previous card)

Card starts offscreen left, flies in and spring-settles:
```
Start:  rotate(tilt - 24deg) translateX(-310px) translateY(-42px) scale(0.94), opacity 0
  → force reflow here
Animate in: transform 0.42s cubic-bezier(0.16, 1.4, 0.5, 1)
            opacity 0.18s ease
  → overshoot spring, settles at resting tilt
```

Total duration: ~480ms

The spring overshoot on backward (1.4 in cubic-bezier) makes going back feel physically distinct from going forward.

---

## 7. Flip mechanic

**Trigger:** tap (mobile) / click (desktop)  
**Effect:** card flips from front to back, revealing competition details

```
Forward flip:
  transform: rotateY(180deg) rotate(tilt * -0.5)
  transition: 0.55s cubic-bezier(0.23, 1, 0.32, 1)

Resting tilt (not flipped):
  transform: rotate(tilt)

Hover (not flipped):
  transform: rotate(tilt * 0.2) translateY(-8px)
```

`backface-visibility: hidden` on both faces. Back face has `transform: rotateY(180deg)` as base.

**Flip and tear are separate interactions — they do not combine.**
- Tear = navigate between competitions (front → front)
- Flip = reveal details of current competition (front → back)

---

## 8. Mobile layout

Single polaroid centred on the cork board with ghost cards visible behind it at alternating tilts (opacity 0.4–0.5). Nav dots at bottom of board.

### Hint overlay (Variant B — chosen)
Two pill chips overlaid on the board:
```
[ ✦ tap to flip ]  [ ↔ swipe ]
```
- Background: `rgba(0,0,0,0.36)`
- Border: `1px solid rgba(255,255,255,0.07)`
- Border-radius: 20px
- Font: IBM Plex Mono, 9px, 300 weight
- Icon colour: `#6BAED6`

**Behaviour:** fades out (`opacity: 0`) after first tap interaction. Does not return.

### Board footer (always visible)
```
1 / 5                    tap to flip ✦
```
- Counter: IBM Plex Mono, 10px, 300 weight. Active number in `#f0eeea`.
- "tap to flip" reminder stays permanently visible below the board.

### Swipe gesture
`pointerdown` / `pointerup` on the cork inner. Threshold: 36px drag distance to trigger advance.

---

## 9. Desktop layout

Five polaroids scattered across the board in fixed positions with individual tilts. All five visible simultaneously. Click any to flip.

```
Card 1: left: 16px,  top: 60px, z-index: 2, tilt: -6deg
Card 2: left: 140px, top: 30px, z-index: 3, tilt: +4deg
Card 3: left: 272px, top: 55px, z-index: 4, tilt: -2deg
Card 4: left: 400px, top: 28px, z-index: 3, tilt: +7deg
Card 5: left: 516px, top: 62px, z-index: 2, tilt: -4deg
```

No tear animation on desktop — flip only. Tear is a mobile-specific interaction.

---

## 10. Navigation

- **Nav dots:** 5px circles, `rgba(0,0,0,0.2)` inactive, `rgba(0,0,0,0.52)` active with `scale(1.35)`
- **Arrow buttons:** 28px circle, `rgba(0,0,0,0.3)` bg, left/right Tabler icons
- Dots and arrows both trigger the tear animation
- `busy` flag prevents double-firing during animation

---

## 11. Competition data

| Competition | Result | Date | Location |
|---|---|---|---|
| ICPC Asia Regional | Top 5% | Nov 2024 | Singapore |
| NOI Singapore | Silver | Mar 2023 | Singapore |
| Meta Hacker Cup | Top 15% | Oct 2024 | Global |
| IOI Team Selection | Selected | 2023 | Singapore |
| TCS CodeVita | Top 20% | 2022 | Global |

Back body copy to be written per card (2–3 lines, Caveat font, conversational).

---

## 12. Board decorations

**Status: deferred — to be designed in next session**

Discussed but not yet designed. Candidates:
- Red string connecting related cards
- Sticky note (small, yellow or warm tone)
- Washi tape on some cards instead of pushpin
- Faint date stamp or postmark
- Small printed label strips

Constraint: decorations must not obscure card content or make the board feel cluttered. One or two maximum.

---

## 13. Photo assets needed

Real photos are required for the polaroid fronts to reach full fidelity. Each card needs a portrait-oriented photo (taller than wide, or square-cropped).

Candidates per card:
- **ICPC:** Team photo, competition hall, or rank screenshot
- **NOI:** Medal photo, ceremony, or certificate
- **Meta HC:** Screenshot of leaderboard/result page
- **IOI Selection:** Camp photo or notification screenshot
- **CodeVita:** Result screenshot or certificate

Without real photos, a dark placeholder (`#13161c`) sits in the photo area. The design is built to accommodate real images via CSS `object-fit: cover`.

---

## 14. Open questions

- [ ] Board decorations — designs TBD (next session)
- [ ] Exact back copy per card — needs writing
- [ ] Real photo assets — to be sourced
- [ ] Scroll-trigger entrance animation — does the board fade/slide in? Not yet decided
- [ ] Desktop: does clicking a flipped card flip it back, or does clicking outside close it?
- [ ] Should flipped state persist when tearing to next card, or always reset to front?

---

## 15. Typography reference

| Element | Font | Size | Weight | Colour |
|---|---|---|---|---|
| Section eyebrow | IBM Plex Mono | 11px | 300 | #6BAED6 |
| Section title | Barlow Condensed | 48px | 800 italic | #f0eeea |
| Caption line 1 | Caveat | 17px | 500 | #2e2820 |
| Caption line 2 | Caveat | 13px | 400 | #7a6e60 |
| Back label | IBM Plex Mono | 9px | 300 | #8a7a6a |
| Back result | Barlow Condensed | 40px | 800 italic | #1a1410 |
| Back body | Caveat | 14px | 400 | #3a3028 |
| Back date | IBM Plex Mono | 9px | 300 | #9a9080 |
| KITH stamp | IBM Plex Mono | 9px | 400 | rgba(107,174,214,0.28) |
| Counter | IBM Plex Mono | 10px | 300 | #4a5060 / #f0eeea |

---

## 16. Colour reference

| Token | Value | Usage |
|---|---|---|
| Cork board | `#b8845a` | Board background |
| Card front paper | `#f0ece3` | Polaroid front |
| Card back paper | `#ede8de` | Polaroid back |
| Card ruled lines | `#ccc4b4` | Back ruled lines |
| Accent blue | `#6BAED6` | Accent bar, stamp, icons |
| Dark bg | `#0f1014` | Site background (above/below board) |
| Photo placeholder | `#13161c` | Photo area fill |
