"use client";

import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import SectionHeading from "@/components/SectionHeading";
import { competitions, competitionsHeading } from "@/content/competitions";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Polaroid from "./Polaroid";
import styles from "./Competitions.module.css";

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

/* ------------------------------ Desktop -------------------------------- */

function Scatter() {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <>
      {competitions.map((comp, i) => (
        <Polaroid
          key={comp.fullName}
          comp={comp}
          flipped={flipped.has(i)}
          onClick={() => toggle(i)}
          className={styles.scatter}
          seamIndex={i}
          style={
            {
              left: comp.pos.left,
              top: comp.pos.top,
              zIndex: comp.pos.z,
              "--tilt": `${comp.tilt}deg`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

/* ------------------------------ Mobile --------------------------------- */

const N = competitions.length;

function MobileStack() {
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stubRef = useRef<HTMLDivElement>(null);
  const tearRef = useRef<SVGSVGElement>(null);
  const currentRef = useRef(0);
  const busy = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const [current, setCurrentState] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [hintsHidden, setHintsHidden] = useState(false);

  const setCurrent = (n: number) => {
    currentRef.current = n;
    setCurrentState(n);
  };

  const layout = useCallback((cur: number, skip = -1) => {
    cardRefs.current.forEach((el, i) => {
      if (!el || i === skip) return;
      const tilt = competitions[i].tilt;
      const slot = i - cur;
      el.style.transition = reducedRef.current ? "none" : "";
      let t: string;
      let o = 1;
      let z = 0;
      let pe = "none";
      if (slot === 0) {
        t = `rotate(${tilt}deg) translateZ(0) translateY(0) scale(1)`;
        z = 30;
        pe = "auto";
      } else if (slot === 1) {
        t = `rotate(${tilt * 0.3}deg) translateZ(-14px) translateY(5px) scale(0.96)`;
        o = 0.7;
        z = 20;
      } else if (slot === 2) {
        t = `rotate(${tilt * 0.3}deg) translateZ(-26px) translateY(10px) scale(0.92)`;
        o = 0.46;
        z = 10;
      } else if (slot < 0) {
        t = `rotate(${tilt}deg) translateX(-340px) scale(0.94)`;
        o = 0;
      } else {
        t = `rotate(${tilt * 0.3}deg) translateZ(-30px) scale(0.9)`;
        o = 0;
        z = 5;
      }
      el.style.transform = t;
      el.style.opacity = String(o);
      el.style.zIndex = String(z);
      el.style.pointerEvents = pe;
    });
  }, []);

  useLayoutEffect(() => {
    layout(currentRef.current);
  }, [layout]);

  const forward = useCallback(() => {
    if (busy.current || currentRef.current >= N - 1) return;
    setHintsHidden(true);
    setFlipped(false);
    const cur = currentRef.current;
    const next = cur + 1;
    const front = cardRefs.current[cur];
    if (!front) return;

    if (reducedRef.current) {
      setCurrent(next);
      layout(next);
      return;
    }

    busy.current = true;
    const tilt = competitions[cur].tilt;
    stubRef.current?.classList.add(styles.show);
    tearRef.current?.classList.add(styles.show);
    layout(next, cur); // promote the rest, leave the tearing card alone

    // Phase 1 — hesitation (paper gripping before release)
    front.style.transition = "transform 0.07s ease-in";
    front.style.transform = `rotate(${tilt + 1}deg) translateY(-3px) scale(1.01)`;
    front.getBoundingClientRect(); // forced reflow — else phase 1 is skipped

    window.setTimeout(() => {
      // Phase 2 — release: arc left-and-up, accelerate out
      front.style.transition =
        "transform 0.34s cubic-bezier(0.6,0,0.95,0.55), opacity 0.26s 0.05s ease";
      front.style.transform = `rotate(${tilt - 20}deg) translateX(-300px) translateY(-44px) scale(0.94)`;
      front.style.opacity = "0";
    }, 90);

    window.setTimeout(() => {
      setCurrent(next);
      stubRef.current?.classList.remove(styles.show);
      tearRef.current?.classList.remove(styles.show);
      front.style.transition = "";
      layout(next);
      busy.current = false;
    }, 490);
  }, [layout]);

  const backward = useCallback(() => {
    if (busy.current || currentRef.current <= 0) return;
    setHintsHidden(true);
    setFlipped(false);
    const cur = currentRef.current;
    const prev = cur - 1;
    const el = cardRefs.current[prev];
    if (!el) return;

    if (reducedRef.current) {
      setCurrent(prev);
      layout(prev);
      return;
    }

    busy.current = true;
    const tilt = competitions[prev].tilt;

    // Start offscreen-left
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = `rotate(${tilt - 24}deg) translateX(-310px) translateY(-42px) scale(0.94)`;
    el.style.zIndex = "40";
    el.style.pointerEvents = "none";
    el.getBoundingClientRect(); // forced reflow

    layout(prev, prev); // step the others down, skip the incoming card

    requestAnimationFrame(() => {
      // Overshoot spring settles at resting tilt
      el.style.transition =
        "transform 0.42s cubic-bezier(0.16,1.4,0.5,1), opacity 0.18s ease";
      el.style.transform = `rotate(${tilt}deg) translateZ(0) translateY(0) scale(1)`;
      el.style.opacity = "1";
    });

    window.setTimeout(() => {
      setCurrent(prev);
      el.style.transition = "";
      layout(prev);
      busy.current = false;
    }, 480);
  }, [layout]);

  // Swipe (>=36px) navigates; a tap flips the front card.
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) forward();
      else backward();
    } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      setHintsHidden(true);
      if (!busy.current) setFlipped((f) => !f);
    }
  };

  const tearPoints = Array.from({ length: 14 }, (_, i) => {
    const x = (i / 13) * 152;
    const y = i % 2 === 0 ? 1 : 5;
    return `${x.toFixed(1)},${y}`;
  }).join(" ");

  return (
    <div className={styles.mobileOnly}>
      <div className={`${styles.hints} ${hintsHidden ? styles.hidden : ""}`}>
        <span className={styles.hintPill}>
          <i>✦</i> {competitionsHeading.hintFlip}
        </span>
        <span className={styles.hintPill}>
          <i>↔</i> {competitionsHeading.hintSwipe}
        </span>
      </div>

      <div
        className={styles.stack}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className={styles.stub} ref={stubRef} aria-hidden>
          <div className={`${styles.polFace} ${styles.polFront}`} />
        </div>
        <svg
          className={styles.tearLine}
          ref={tearRef}
          viewBox="0 0 152 8"
          preserveAspectRatio="none"
          aria-hidden
        >
          <polyline
            points={tearPoints}
            fill="none"
            stroke="#bfb8a8"
            strokeWidth="1.2"
          />
          <polyline
            points={tearPoints}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.6"
            transform="translate(0,1.8)"
          />
        </svg>

        {competitions.map((comp, i) => (
          <Polaroid
            key={comp.fullName}
            comp={comp}
            flipped={i === current && flipped}
            className={styles.stackCard}
            outerRef={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}
      </div>

      <div className={styles.mobileControls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={backward}
          disabled={current <= 0}
          aria-label="Previous competition"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
        </button>
        <div className={styles.dots}>
          {competitions.map((c, i) => (
            <span
              key={c.fullName}
              className={`${styles.dot} ${i === current ? styles.activeDot : ""}`}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.arrow}
          onClick={forward}
          disabled={current >= N - 1}
          aria-label="Next competition"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
        </button>
      </div>

      <div className={styles.boardFooter}>
        <span className={styles.counter}>
          <b>{current + 1}</b> / {N}
        </span>
        <span>{competitionsHeading.hintFlip} ✦</span>
      </div>
    </div>
  );
}

/* ---------------------------- Section ---------------------------------- */

export default function Competitions() {
  const isMobile = useIsMobile();

  return (
    <>
      <section id="comp" className={styles.comp}>
        <SectionHeading
          eyebrow={null}
          classes={{
            root: styles.compHead,
            eyebrow: styles.compEyebrow,
            title: styles.compTitle,
          }}
        >
          {competitionsHeading.title}
        </SectionHeading>
      </section>

      <div className={styles.warmflow} id="warmflow">
        <div className={styles.seam}>
          <span className={styles.seamTape}>{competitionsHeading.eyebrow}</span>
        </div>
        <div className={styles.corkZone}>
          <div className={styles.boardInner} id="corkboard">
            {isMobile ? <MobileStack /> : <Scatter />}
          </div>
          {!isMobile && (
            <div className={styles.desktopHint}>
              {competitionsHeading.desktopHint
                .split(/(flip)/i)
                .map((part, i) =>
                  part.toLowerCase() === "flip" ? (
                    <em key={i} className={styles.hintAccent}>
                      {part}
                    </em>
                  ) : (
                    part
                  )
                )}
            </div>
          )}
        </div>
        <div className={styles.washTail} />
      </div>
    </>
  );
}
