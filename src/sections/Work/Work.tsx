"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { work, workHeading } from "@/content/work";
import { WorkProject } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScramble } from "@/hooks/useScramble";
import styles from "./Work.module.css";

const SKU_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/* Duotone image placeholder — real screenshots swap in later (spec §14). */
function Figure({ label }: { label: string }) {
  return (
    <div className={styles.imgInner}>
      <div className={styles.ph}>{label}</div>
      <div className={styles.tint} />
    </div>
  );
}

function Stamp({ status, year }: { status: string; year: string }) {
  return (
    <div className={styles.cstamp} aria-hidden>
      <span className={styles.st}>{status}</span>
      <span className={styles.sy}>{year}</span>
    </div>
  );
}

/* ------------------------------- Card ---------------------------------- */

interface CardProps {
  project: WorkProject;
  index: number;
  active: boolean;
  onToggle: (index: number, el: HTMLElement) => void;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

function WorkCard({ project, index, active, onToggle, registerRef }: CardProps) {
  // Anim 2 — scroll stagger. `inView` is React-driven (folded into className
  // below) so parent re-renders don't clobber it. Only the per-row column delay
  // is imperative — it's an inline style React never manages, so it persists.
  const { ref, active: inView } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.08,
    onEnter: (el) => {
      const grid = el.parentElement;
      if (!grid) return;
      const top = el.offsetTop;
      let col = 0;
      for (const sib of Array.from(grid.children)) {
        if (sib === el) break;
        if (
          sib instanceof HTMLElement &&
          sib.dataset.card === "1" &&
          Math.abs(sib.offsetTop - top) < 6
        ) {
          col++;
        }
      }
      el.style.transitionDelay = `${col * 70}ms`;
    },
    onExit: (el) => {
      el.style.transitionDelay = "0ms";
    },
  });

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      ref.current = el;
      registerRef(index, el);
    },
    [ref, registerRef, index],
  );

  return (
    <div
      ref={setRefs}
      data-card="1"
      data-seam-card={index}
      className={`${styles.pcard} ${inView ? styles.inView : ""} ${active ? styles.active : ""}`}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      aria-label={`${project.name} — ${project.tag}`}
      onClick={(e) => onToggle(index, e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(index, e.currentTarget);
        }
      }}
    >
      <div className={styles.pcardImg}>
        <Figure label="fig. 01" />
        <Stamp status={project.status} year={project.year} />
      </div>
      <div className={styles.pcardBody}>
        <span className={styles.pcat}>{project.cat}</span>
        <div className={styles.psku}>{project.sku}</div>
        <div className={styles.pname}>{project.name}</div>
        <div className={styles.ptag}>{project.tag}</div>
        <div className={styles.pchips}>
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Expansion panel --------------------------- */

interface PanelProps {
  project: WorkProject;
  closing: boolean;
  onClosed: () => void;
}

// Anim 6 — body content stagger (ms delays from panel open, spec §10).
const STAGGER: Array<[string, number]> = [
  ["expImg", 50],
  ["expCat", 80],
  ["expSku", 120],
  ["expName", 165],
  ["expTag", 205],
  ["div", 235],
  ["expDesc", 275],
  ["highlights", 340],
  ["expLinks", 480],
];

function ExpansionPanel({ project, closing, onClosed }: PanelProps) {
  const reduced = useReducedMotion();
  const scramble = useScramble(reduced);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const skuRef = useRef<HTMLDivElement>(null);
  const [figIdx, setFigIdx] = useState(0);
  const timers = useRef<number[]>([]);

  // Open: grid-rows 0fr → 1fr, then fire the staggered content reveal.
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const els = STAGGER.map(([cls]) =>
      inner.querySelector<HTMLElement>(`[data-anim="${cls}"]`),
    );

    if (reduced) {
      wrap.classList.add(styles.open);
      els.forEach((el) => el?.classList.add(styles.xs, styles.in));
      inner
        .querySelectorAll<HTMLElement>(`.${styles.xc}`)
        .forEach((c) => c.classList.add(styles.in));
      if (skuRef.current) skuRef.current.textContent = project.sku;
      return;
    }

    els.forEach((el) => el?.classList.add(styles.xs));
    inner
      .querySelectorAll<HTMLElement>("[data-chip]")
      .forEach((c) => c.classList.add(styles.xc));

    const raf1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        wrap.classList.add(styles.open);
        STAGGER.forEach(([cls, delay], i) => {
          timers.current.push(
            window.setTimeout(() => els[i]?.classList.add(styles.in), delay),
          );
        });
        // Anim 4b — SKU scramble, same beat as the .exp-sku reveal.
        timers.current.push(
          window.setTimeout(() => {
            if (skuRef.current)
              scramble(skuRef.current, project.sku, {
                duration: 380,
                chars: SKU_CHARS,
                preserve: " ·/",
              });
          }, 120),
        );
        // Anim 7 — chip stagger, the final beat.
        inner
          .querySelectorAll<HTMLElement>("[data-chip]")
          .forEach((chip, ci) => {
            timers.current.push(
              window.setTimeout(
                () => chip.classList.add(styles.in),
                400 + ci * 50,
              ),
            );
          });
      }),
    );

    const local = timers.current;
    return () => {
      cancelAnimationFrame(raf1);
      local.forEach((t) => window.clearTimeout(t));
      local.length = 0;
    };
    // Mount-only: this panel remounts (new key) on every open/switch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close: remove .open, wait for the grid-rows transition, then unmount.
  useEffect(() => {
    if (!closing) return;
    const wrap = wrapRef.current;
    if (!wrap) {
      onClosed();
      return;
    }
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.length = 0;

    if (reduced) {
      onClosed();
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onClosed();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === "grid-template-rows") finish();
    };
    wrap.addEventListener("transitionend", onEnd);
    wrap.classList.remove(styles.open);
    const fallback = window.setTimeout(finish, 520);
    return () => {
      wrap.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [closing, reduced, onClosed]);

  return (
    <div className={styles.expansion}>
      <div ref={wrapRef} className={styles.expWrap}>
        <div ref={innerRef} className={styles.expInner}>
          <div className={styles.expPanel}>
            <div className={styles.expImg} data-anim="expImg">
              <Figure label={`fig. 0${figIdx + 1}`} />
              <Stamp status={project.status} year={project.year} />
              <div className={styles.efig}>
                FIG. 0{figIdx + 1} — {project.figures[figIdx].caption}
              </div>
              <div className={styles.expThumbs}>
                {project.figures.map((fig, fi) => (
                  <button
                    key={fig.caption}
                    type="button"
                    className={`${styles.thumb} ${fi === figIdx ? styles.thumbActive : ""}`}
                    onClick={() => setFigIdx(fi)}
                    aria-label={`View ${fig.caption}`}
                  >
                    <span>0{fi + 1}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.expBody}>
              <span className={styles.expCat} data-anim="expCat">
                {project.cat}
              </span>
              <div
                className={styles.expSku}
                data-anim="expSku"
                ref={skuRef}
              >
                {project.sku}
              </div>
              <div className={styles.expName} data-anim="expName">
                {project.name}
              </div>
              <div className={styles.expTag} data-anim="expTag">
                {project.tag}
              </div>
              <hr className={styles.div} data-anim="div" />
              <p className={styles.expDesc} data-anim="expDesc">
                {project.desc}
              </p>
              <div className={styles.highlights} data-anim="highlights">
                {project.hi.map((h) => (
                  <div key={h} className={styles.hl}>
                    {h}
                  </div>
                ))}
              </div>
              <div className={styles.expChips}>
                {project.tags.map((t) => (
                  <span key={t} data-chip className={styles.expChip}>
                    {t}
                  </span>
                ))}
              </div>
              <div className={styles.expLinks} data-anim="expLinks">
                {project.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className={`${styles.elink} ${l.secondary ? styles.sec : ""}`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Section -------------------------------- */

export default function Work() {
  const reduced = useReducedMotion();
  const scramble = useScramble(reduced);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState<number | null>(null);
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);

  const leadRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  // Anim 1 — heading scramble at 60% visibility.
  const { ref: titleRef } = useRevealOnScroll<HTMLSpanElement>({
    threshold: 0.6,
    onEnter: () => {
      scramble(leadRef.current, workHeading.titleLead, { duration: 580 });
      window.setTimeout(
        () => scramble(accentRef.current, workHeading.titleAccent, { duration: 500 }),
        80,
      );
    },
  });

  useEffect(() => {
    if (leadRef.current) leadRef.current.textContent = workHeading.titleLead;
    if (accentRef.current)
      accentRef.current.textContent = workHeading.titleAccent;
  }, []);

  const registerRef = useCallback((i: number, el: HTMLDivElement | null) => {
    cardEls.current[i] = el;
  }, []);

  // Row detection (spec §9) — insert the panel after the last card sharing the
  // clicked card's row top. Measured live so it tracks the column count.
  const lastInRow = useCallback((i: number) => {
    const el = cardEls.current[i];
    if (!el) return i;
    const top = el.offsetTop;
    let last = i;
    cardEls.current.forEach((c, idx) => {
      if (c && Math.abs(c.offsetTop - top) < 6) last = Math.max(last, idx);
    });
    return last;
  }, []);

  const toggle = useCallback(
    (i: number) => {
      if (active === i && !closing) {
        setClosing(true);
        return;
      }
      // Switching cards instant-removes the old panel (spec §15).
      setClosing(false);
      setActive(i);
      setInsertAfter(lastInRow(i));
    },
    [active, closing, lastInRow],
  );

  const onClosed = useCallback(() => {
    setActive(null);
    setInsertAfter(null);
    setClosing(false);
  }, []);

  // Column count changes with viewport — close the panel on resize (spec §9).
  useEffect(() => {
    if (active === null) return;
    const onResize = () => onClosed();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, onClosed]);

  return (
    <section id="work" className={styles.work}>
      <div className={styles.workWrap}>
        <SectionHeading
          eyebrow={workHeading.eyebrow}
          titleId="work-title"
          classes={{
            root: styles.workHead,
            eyebrow: styles.workEyebrow,
            title: styles.workTitle,
          }}
        >
          <span ref={titleRef}>
            <span ref={leadRef} />
            <span ref={accentRef} className={styles.ac} />
          </span>
        </SectionHeading>

        <div className={styles.grid} data-seam-grid>
          {work.map((project, i) => (
            <Fragment key={project.sku}>
              <WorkCard
                project={project}
                index={i}
                active={active === i}
                onToggle={toggle}
                registerRef={registerRef}
              />
              {active !== null && insertAfter === i && (
                <ExpansionPanel
                  key={active}
                  project={work[active]}
                  closing={closing}
                  onClosed={onClosed}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
