"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { competitions } from "@/content/competitions";
import { work } from "@/content/work";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { subscribe } from "@/lib/raf";
import { clamp, lerp, seg, fallEase } from "@/lib/easing";
import Polaroid from "../Competitions/Polaroid";
import polStyles from "../Competitions/Competitions.module.css";
import styles from "./CompetitionsToWork.module.css";

/* Desktop board polaroid dimensions — travellers match so the hand-off is 1:1
   (see Competitions.module.css .polaroid). The seam only runs >820px, where the
   board renders as the scatter; below that Competitions is the mobile stack and
   the seam disables itself (spec §4e collapses mobile to a plain reveal). */
const TW = 164;
const TH = 210;
const COUNT = Math.min(competitions.length, work.length);

/* Keep card hover transitions but drop opacity/transform from them so the seam
   can scrub those per-frame without the .55s reveal transition smearing it. */
const SEAM_CARD_TRANSITION = "border-color 0.3s ease, background-color 0.3s ease";

export default function CompetitionsToWork() {
  const reduced = useReducedMotion();
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;

    let grid: HTMLElement | null = null;
    let sources: HTMLElement[] = [];
    let cards: HTMLElement[] = [];
    let cols = 0;

    // Cache the sibling-section elements; the top-row count (= column count) is
    // what decides how many polaroids unpin (spec §4e).
    const build = () => {
      // Undo any styles a previous (wider) layout left behind.
      cards.forEach((c) => {
        c.style.transition = "";
        c.style.transform = "";
        c.style.opacity = "";
      });
      sources.forEach((s) => (s.style.opacity = ""));

      grid = document.querySelector<HTMLElement>("[data-seam-grid]");
      sources = Array.from(
        document.querySelectorAll<HTMLElement>("[data-seam-pol]"),
      );
      cards = Array.from(
        document.querySelectorAll<HTMLElement>("[data-seam-card]"),
      );

      if (!grid || sources.length === 0 || cards.length === 0) {
        cols = 0;
        outerRefs.current.forEach((el) => el && (el.style.opacity = "0"));
        return;
      }

      const top = cards[0].offsetTop;
      cols = cards.filter((c) => Math.abs(c.offsetTop - top) < 6).length;

      // The seam now owns these cards' reveal — scrub opacity/transform directly.
      cards.forEach((c) => {
        c.style.transition = SEAM_CARD_TRANSITION;
        c.style.transform = "none";
      });

      // Travellers mirror the board's flip state instantly (no .55s spin) so a
      // card that was flipped to its back flies down showing the back.
      outerRefs.current.forEach((tv) => {
        if (!tv) return;
        const inner = tv.getElementsByClassName(
          polStyles.polInner,
        )[0] as HTMLElement | undefined;
        if (inner) inner.style.transition = "none";
      });
    };

    const frame = () => {
      if (!grid || cols === 0) return;
      const vh = window.innerHeight;
      const gr = grid.getBoundingClientRect();
      // p: 0 when the grid is just below the fold (board still visible),
      // 1 once it has settled near the top (spec §4c).
      const p = clamp((1.12 * vh - gr.top) / (0.74 * vh), 0, 1);

      for (let i = 0; i < COUNT; i++) {
        const tv = outerRefs.current[i];
        if (!tv) continue;
        const src = sources[i];
        const card = cards[i];
        if (i >= cols || !src || !card) {
          tv.style.opacity = "0";
          continue;
        }

        // Carry the board card's live flip state onto its traveller.
        tv.classList.toggle(
          polStyles.flipped,
          src.classList.contains(polStyles.flipped),
        );

        // Per-traveller local progress with a gentle left-to-right stagger.
        const pi = clamp((p - i * 0.05) / 0.86, 0, 1);
        const fall = fallEase(seg(pi, 0, 0.9));
        const straighten = fallEase(seg(pi, 0.32, 1));

        // Anchors measured live every frame — both ends move with the scroll.
        const sr = src.getBoundingClientRect();
        const cr = card.getBoundingClientRect();
        const cx = lerp(sr.left + sr.width / 2, cr.left + cr.width / 2, fall);
        const cy = lerp(sr.top + sr.height / 2, cr.top + cr.height / 2, fall);
        const rot = lerp(competitions[i].tilt, 0, straighten);
        const s = lerp(1, 0.9, fall);

        tv.style.transform = `translate(${(cx - TW / 2).toFixed(1)}px, ${(
          cy -
          TH / 2
        ).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;

        // Pushpin pops off as the polaroid detaches.
        const pin = pinRefs.current[i];
        const lift = seg(pi, 0, 0.2);
        if (pin) {
          pin.style.transform = `translateX(-50%) translateY(${(-lift * 16).toFixed(
            1,
          )}px)`;
          pin.style.opacity = (1 - lift).toFixed(3);
        }

        // Hand-off with no double-render: the board polaroid fades as its
        // traveller takes over; the traveller fades as its card resolves.
        src.style.opacity = (1 - seg(pi, 0, 0.1)).toFixed(3);
        tv.style.opacity = (
          seg(pi, 0, 0.05) *
          (1 - seg(pi, 0.72, 0.95))
        ).toFixed(3);
        card.style.opacity = seg(pi, 0.72, 1).toFixed(3);
      }

      // Cards below the top row settle in just after the travellers land.
      const rest = seg(p, 0.6, 1);
      for (let k = cols; k < cards.length; k++) {
        cards[k].style.opacity = rest.toFixed(3);
        cards[k].style.transform = `translateY(${lerp(18, 0, rest).toFixed(1)}px)`;
      }
    };

    build();
    const unsubscribe = subscribe(frame);

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      // Hand reveal control back to the sections.
      cards.forEach((c) => {
        c.style.transition = "";
        c.style.transform = "";
        c.style.opacity = "";
      });
      sources.forEach((s) => (s.style.opacity = ""));
    };
  }, [reduced]);

  return (
    <div className={styles.stage} aria-hidden>
      {Array.from({ length: COUNT }).map((_, i) => (
        <Polaroid
          key={competitions[i].fullName}
          comp={competitions[i]}
          className={styles.traveller}
          style={{ "--tilt": "0deg" } as CSSProperties}
          outerRef={(el) => {
            outerRefs.current[i] = el;
          }}
          pinRef={(el) => {
            pinRefs.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
