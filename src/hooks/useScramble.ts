"use client";

import { useEffect, useRef } from "react";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-/";

interface ScrambleOptions {
  /** Total sweep duration in ms (Experience ~700, Work ~380–580). */
  duration?: number;
  /** Pool of noise characters. */
  chars?: string;
  /** Characters passed through unscrambled (e.g. spaces, "·", "/"). */
  preserve?: string;
}

type ScrambleFn = (
  el: HTMLElement | null,
  finalText: string,
  options?: ScrambleOptions,
) => void;

/**
 * Monospace text scramble — resolves left-to-right, unresolved characters keep
 * randomising until their index locks. rAF/time-based sweep (matches the Work
 * prototype's easing behaviour; visually identical to Experience's tick loop).
 *
 * Pass `reduced = true` to skip the animation and set the final text directly.
 * Cancels any in-flight run on the same element and cleans up on unmount.
 */
export function useScramble(reduced = false): ScrambleFn {
  const timers = useRef(new Map<HTMLElement, number>());

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((id) => cancelAnimationFrame(id));
      map.clear();
    };
  }, []);

  return (el, finalText, options = {}) => {
    if (!el) return;

    const existing = timers.current.get(el);
    if (existing !== undefined) cancelAnimationFrame(existing);

    if (reduced) {
      el.textContent = finalText;
      return;
    }

    const { duration = 700, chars = DEFAULT_CHARS, preserve = " " } = options;
    const len = finalText.length;
    let start: number | null = null;

    const frame = (now: number) => {
      if (start === null) start = now;
      const p = Math.min((now - start) / duration, 1);
      const resolved = Math.floor(p * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = finalText[i];
        out +=
          i < resolved || preserve.includes(ch)
            ? ch
            : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (p < 1) {
        timers.current.set(el, requestAnimationFrame(frame));
      } else {
        el.textContent = finalText;
        timers.current.delete(el);
      }
    };

    timers.current.set(el, requestAnimationFrame(frame));
  };
}
