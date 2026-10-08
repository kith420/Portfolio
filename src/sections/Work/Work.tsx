"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import {
  SiApple,
  SiChromewebstore,
  SiCplusplus,
  SiDocker,
  SiFastapi,
  SiFirefoxbrowser,
  SiGithub,
  SiGooglecloud,
  SiHono,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiThreedotjs,
  SiVite,
  SiVitest,
  SiYoutube,
} from "react-icons/si";
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

/** Tag label -> logo. Tags without a recognisable logo stay text-only. */
const TAG_ICONS: Record<string, IconType> = {
  JavaScript: SiJavascript,
  React: SiReact,
  "React Native": SiReact,
  "Three.js": SiThreedotjs,
  FastAPI: SiFastapi,
  "Cloud Run": SiGooglecloud,
  Vite: SiVite,
  Vitest: SiVitest,
  iOS: SiApple,
  Docker: SiDocker,
  Hono: SiHono,
  "Node.js": SiNodedotjs,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  "C++": SiCplusplus,
};

function TagLabel({ tag }: { tag: string }) {
  const Icon = TAG_ICONS[tag];
  return (
    <>
      {Icon && <Icon className={styles.chipIcon} aria-hidden />}
      {tag}
    </>
  );
}

/** Link host -> logo. Anything else gets the generic "opens elsewhere" arrow. */
const LINK_ICONS: Record<string, IconType> = {
  "github.com": SiGithub,
  "chromewebstore.google.com": SiChromewebstore,
  "addons.mozilla.org": SiFirefoxbrowser,
  "www.youtube.com": SiYoutube,
};

function linkIcon(href: string): IconType {
  try {
    return LINK_ICONS[new URL(href).hostname] ?? FiArrowUpRight;
  } catch {
    return FiArrowUpRight;
  }
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
            <span key={t}>
              <TagLabel tag={t} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Lightbox ------------------------------- */

interface LightboxProps {
  figure: WorkFigure;
  /** Position among the project's figures, for the "2 / 3" counter. */
  index: number;
  count: number;
  onClose: () => void;
  /** Step to the previous (-1) or next (1) figure. */
  onStep: (dir: number) => void;
}

/* Full-screen view of a figure. Portalled to <body>: the panel's reveal
   transforms would otherwise trap a fixed-position child. */
function Lightbox({ figure, index, count, onClose, onStep }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, [onClose, onStep]);

  return createPortal(
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={figure.caption}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.lbClose}
        aria-label="Close image"
        onClick={onClose}
      >
        <FiX aria-hidden />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.lbImg}
        src={figure.src}
        alt={figure.caption}
        onClick={(e) => e.stopPropagation()}
      />
      <div className={styles.lbCaption}>
        {figure.caption}
        {count > 1 && (
          <span className={styles.lbCount}>
            {index + 1} / {count}
          </span>
        )}
      </div>
      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbPrev}`}
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
          >
            <FiChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            className={`${styles.lbNav} ${styles.lbNext}`}
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
          >
            <FiChevronRight aria-hidden />
          </button>
        </>
      )}
    </div>,
    document.body,
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
  const [zoomed, setZoomed] = useState(false);
  const figCount = project.figures.length;
  const closeZoom = useCallback(() => setZoomed(false), []);
  const stepFig = useCallback(
    (dir: number) => setFigIdx((i) => (i + dir + figCount) % figCount),
    [figCount],
  );
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
            <div className={styles.expMedia} data-anim="expImg">
              <div className={styles.expImg}>
                {project.figures[figIdx].src ? (
                  <button
                    type="button"
                    className={styles.zoomBtn}
                    onClick={() => setZoomed(true)}
                    aria-label={`Enlarge ${project.figures[figIdx].caption}`}
                  >
                    <Figure figure={project.figures[figIdx]} />
                  </button>
                ) : (
                  <Figure figure={project.figures[figIdx]} />
                )}
                <Stamp status={project.status} year={project.year} />
              </div>
              {project.figures.length > 1 && (
                <div className={styles.expThumbs}>
                  {project.figures.map((fig, fi) => (
                    <button
                      key={fig.caption}
                      type="button"
                      className={`${styles.thumb} ${fi === figIdx ? styles.thumbActive : ""}`}
                      onClick={() => setFigIdx(fi)}
                      aria-label={`View ${fig.caption}`}
                      aria-pressed={fi === figIdx}
                    >
                      <Figure figure={fig} />
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.efig}>
                {project.figures[figIdx].caption}
              </div>
              {zoomed && (
                <Lightbox
                  figure={project.figures[figIdx]}
                  index={figIdx}
                  count={figCount}
                  onClose={closeZoom}
                  onStep={stepFig}
                />
              )}
            </div>
            <div className={styles.expBody}>
              <div className={styles.expName} data-anim="expName">
                {project.name}
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
                    <TagLabel tag={t} />
                  </span>
                ))}
              </div>
              <div className={styles.expLinks} data-anim="expLinks">
                {(project.links ?? []).filter((l) => l.href && l.href !== "#").map((l) => {
                  const Icon = linkIcon(l.href);
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      className={`${styles.elink} ${l.secondary ? styles.sec : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className={styles.elinkIcon} aria-hidden />
                      {l.label}
                    </a>
                  );
                })}
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

  // Every card takes the tallest card's height, across rows too. Chips wrap
  // differently per width, so this is measured rather than fixed in CSS.
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      grid.style.removeProperty("--card-h");
      const tallest = Math.max(
        ...cardEls.current.map((c) => c?.offsetHeight ?? 0),
      );
      grid.style.setProperty("--card-h", `${tallest}px`);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    measure();
    return () => ro.disconnect();
  }, []);

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
          ref={gridRef}
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
