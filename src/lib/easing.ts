/**
 * Easing tokens (as CSS strings) + the scalar math the scrubbed seams use.
 * Mirrors the "motion tokens" table in 05-transitions-spec.md and the
 * prototypes' inline helpers, kept in one place so numbers can't drift.
 */

/** Opens / expands — the site's primary curve. */
export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Polaroid front -> back flip. */
export const EASE_FLIP = "cubic-bezier(0.23, 1, 0.32, 1)";
/** Competitions stack step-up (slight spring overshoot). */
export const EASE_SPRING = "cubic-bezier(0.34, 1.15, 0.64, 1)";

export const clamp = (v: number, a: number, b: number): number =>
  v < a ? a : v > b ? b : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Normalised sub-progress: maps p in [a,b] -> [0,1], clamped. */
export const seg = (p: number, a: number, b: number): number =>
  clamp((p - a) / (b - a), 0, 1);

/** The seam's fall ease: 1 - (1 - t)^2.2 (fast start, soft landing). */
export const fallEase = (t: number): number => 1 - Math.pow(1 - t, 2.2);
