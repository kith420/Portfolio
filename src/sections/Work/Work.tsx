"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { work, workHeading } from "@/content/work";
import { WorkFigure, WorkProject } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Work.module.css";

/* A project image, or the duotone placeholder when a figure has no src yet. */
function Figure({ figure }: { figure?: WorkFigure }) {
  return (
    <div
      className={styles.imgInner}
      style={figure?.bg ? { background: figure.bg } : undefined}
    >
      {figure?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.figImg}
          src={figure.src}
          alt={figure.caption}
          loading="lazy"
          style={{
            objectFit: figure.fit ?? "cover",
            objectPosition: figure.position,
          }}
        />
      ) : (
        <div className={styles.tint} />
      )}
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
  const setRef = useCallback(
    (el: HTMLDivElement | null) => registerRef(index, el),
    [registerRef, index],
  );

  return (
    <div
      ref={setRef}
      data-card="1"
      // Column in the three-up layout; the CSS staggers columns on scroll.
      data-col={index % 3}
      className={`${styles.pcard} ${active ? styles.active : ""}`}
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
        <Figure figure={project.figures[0]} />
        <Stamp status={project.status} year={project.year} />
      </div>
      <div className={styles.pcardBody}>
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
  ["expName", 165],
  ["expTag", 205],
  ["div", 235],
  ["expDesc", 275],
  ["highlights", 340],
  ["expLinks", 480],
];

function ExpansionPanel({ project, closing, onClosed }: PanelProps) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
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
              <Figure figure={project.figures[figIdx]} />
              <Stamp status={project.status} year={project.year} />
              <div className={styles.efig}>
                {project.figures[figIdx].caption}
              </div>
              <div className={styles.expThumbs}>
                {project.figures.length > 1 &&
                  project.figures.map((fig, fi) => (
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
                {(project.links ?? []).filter((l) => l.href && l.href !== "#").map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className={`${styles.elink} ${l.secondary ? styles.sec : ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState<number | null>(null);
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  // Briefly true after a panel closes, so the columns ease back into their
  // scroll stagger instead of snapping (see Work.module.css).
  const [releasing, setReleasing] = useState(false);

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
    setReleasing(true);
  }, []);

  useEffect(() => {
    if (!releasing) return;
    const t = window.setTimeout(() => setReleasing(false), 500);
    return () => window.clearTimeout(t);
  }, [releasing]);

  // Column count changes with viewport — close the panel on resize (spec §9).
  useEffect(() => {
    if (active === null) return;
    const onResize = () => onClosed();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, onClosed]);

  return (
    <section id="work" className={styles.work} data-nav-tint="light">
      <div className={styles.workWrap}>
        <SectionHeading
          titleId="work-title"
          classes={{ root: styles.workHead, title: styles.workTitle }}
        >
          {workHeading.title}
        </SectionHeading>

        <div
          className={`${styles.grid} ${active !== null ? styles.settled : ""} ${
            releasing ? styles.releasing : ""
          }`}
        >
          {work.map((project, i) => (
            <Fragment key={project.name}>
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
