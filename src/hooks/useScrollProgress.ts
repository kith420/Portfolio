"use client";

import { RefObject, useEffect, useRef } from "react";
import { subscribe } from "@/lib/raf";
import { clamp } from "@/lib/easing";

type ComputeFn = (rect: DOMRect, vh: number) => number;
type FrameFn = (progress: number, rect: DOMRect, vh: number) => void;

/**
 * Default 0->1 mapping: 0 when the element's top sits at the bottom of the
 * viewport, 1 once it has fully passed the top. Sections that need bespoke
 * timing (the Competitions->Work seam) pass their own `compute`.
 */
const defaultCompute: ComputeFn = (rect, vh) =>
  clamp((vh - rect.top) / (vh + rect.height), 0, 1);

/**
 * Subscribes the target element to the shared rAF ticker and calls `onFrame`
 * every frame with the current scroll progress. IMPERATIVE by design — write
 * transforms/opacity to refs inside `onFrame`; never route this through state.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onFrame: FrameFn,
  compute: ComputeFn = defaultCompute,
  enabled = true,
): void {
  const onFrameRef = useRef(onFrame);
  const computeRef = useRef(compute);

  useEffect(() => {
    onFrameRef.current = onFrame;
    computeRef.current = compute;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const unsubscribe = subscribe(() => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = computeRef.current(rect, vh);
      onFrameRef.current(p, rect, vh);
    });
    return unsubscribe;
  }, [ref, enabled]);
}
