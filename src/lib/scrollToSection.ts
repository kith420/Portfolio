import { subscribe } from "./raf";

export const DURATION = 700;
/** Keep correcting for this long after arriving, while sections above settle. */
export const SETTLE = 1200;

let cancelActive: (() => void) | null = null;

/**
 * Smooth-scroll to a section and land on it even if the page above it changes
 * height mid-scroll. A native anchor jump computes its target once, at click
 * time; the Experience cards then open as they're scrolled past and push every
 * later section down, so the jump lands short. This re-reads the target's live
 * position every frame, then keeps it pinned until the layout settles.
 *
 * Any wheel / touch / key input from the reader cancels it.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  cancelActive?.();

  const pad =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduced ? 0 : DURATION;
  const startY = window.scrollY;
  let t0: number | null = null;

  const jumpTo = (y: number) =>
    // `html { scroll-behavior: smooth }` would otherwise animate every step.
    window.scrollTo({ top: y, behavior: "instant" });

  const unsubscribe = subscribe((now) => {
    if (t0 === null) t0 = now;
    const elapsed = now - t0;
    const target = el.getBoundingClientRect().top + window.scrollY - pad;

    if (elapsed < duration) {
      const p = elapsed / duration;
      const eased = 1 - Math.pow(1 - p, 3);
      jumpTo(startY + (target - startY) * eased);
      return;
    }

    jumpTo(target);
    if (elapsed >= duration + SETTLE) stop();
  });

  const stop = () => {
    unsubscribe();
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
    if (cancelActive === stop) cancelActive = null;
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  cancelActive = stop;
}
