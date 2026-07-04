/**
 * THE single shared requestAnimationFrame ticker.
 *
 * Every scroll-scrubbed animation on the site subscribes to this one loop and
 * writes `transform` / `opacity` imperatively via refs inside its callback.
 * Do NOT create per-component rAF loops, and never drive per-frame scroll
 * animation through React state (it re-renders every frame and janks).
 *
 * The loop only runs while at least one subscriber is registered.
 */

type Ticker = (now: number) => void;

const subscribers = new Set<Ticker>();
let rafId: number | null = null;

function loop(now: number) {
  // Snapshot so a subscriber unsubscribing mid-tick can't corrupt iteration.
  for (const fn of Array.from(subscribers)) fn(now);
  rafId = subscribers.size > 0 ? requestAnimationFrame(loop) : null;
}

/**
 * Register a per-frame callback. Returns an unsubscribe function.
 * Safe to call only in the browser (i.e. inside effects).
 */
export function subscribe(fn: Ticker): () => void {
  subscribers.add(fn);
  if (rafId === null && typeof window !== "undefined") {
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
