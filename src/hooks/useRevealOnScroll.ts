"use client";

import { RefObject, useEffect, useRef, useState } from "react";

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Fired every time the element enters the viewport (re-fires on re-entry). */
  onEnter?: (el: HTMLElement) => void;
  /** Fired every time the element leaves — reset text/scramble state here. */
  onExit?: (el: HTMLElement) => void;
}

/**
 * IntersectionObserver reveal that RE-FIRES on every entry and RESETS on every
 * exit — the observer is never `unobserve`d (site-wide rule). Returns a ref to
 * attach and an `active` boolean to toggle the reveal class in CSS. Discrete
 * enter/exit events only (not per-frame), so React state is appropriate here.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
): { ref: RefObject<T | null>; active: boolean } {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  });

  const { threshold = 0.3, rootMargin } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
            optsRef.current.onEnter?.(el);
          } else {
            setActive(false);
            optsRef.current.onExit?.(el);
          }
        });
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return { ref, active };
}
