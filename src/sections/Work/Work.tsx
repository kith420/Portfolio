"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaAws, FaJava } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiX,
} from "react-icons/fi";
import { RiOpenaiFill } from "react-icons/ri";
import {
  TbBinaryTree,
  TbCamera,
  TbCpu,
  TbFileCode,
  TbLogicAnd,
  TbPuzzle,
  TbSparkles,
  TbStack2,
  TbTestPipe,
  TbTrophy,
} from "react-icons/tb";
import {
  SiAndroid,
  SiApple,
  SiChromewebstore,
  SiCplusplus,
  SiDocker,
  SiExpress,
  SiFastapi,
  SiFirebase,
  SiFirefoxbrowser,
  SiGithub,
  SiGooglechrome,
  SiGooglecloud,
  SiGooglemaps,
  SiHono,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiThreedotjs,
  SiTypescript,
  SiVitest,
  SiYoutube,
} from "react-icons/si";
import SectionHeading from "@/components/SectionHeading";
import { work, workHeading } from "@/content/work";
import { WorkFigure, WorkProject } from "@/content/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Work.module.css";

/* Where each clip last was, keyed by its src. The card, the dialog and the
   lightbox each mount their own <video> for the same clip, so each one picks
   up where the previous left off instead of starting over. */
const clipClock = new Map<
  string,
  { time: number; at: number; playing: boolean }
>();

interface ClipProps {
  src: string;
  poster?: string;
  label: string;
  className: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  controls?: boolean;
  onClick?: React.MouseEventHandler<HTMLVideoElement>;
}

/* A muted, looping clip that resumes from the shared clock. */
function Clip({
  src,
  poster,
  label,
  className,
  style,
  autoPlay = true,
  controls = false,
  onClick,
}: ClipProps) {
  const note = (v: HTMLVideoElement) =>
    clipClock.set(src, {
      time: v.currentTime,
      at: performance.now(),
      playing: !v.paused,
    });

  return (
    <video
      className={className}
      src={src}
      poster={poster}
      aria-label={label}
      style={style}
      autoPlay={autoPlay}
      controls={controls}
      muted
      loop
      playsInline
      onClick={onClick}
      onLoadedMetadata={(e) => {
        const v = e.currentTarget;
        const last = clipClock.get(src);
        if (!last || !v.duration) return;
        // Count the time since the last copy went away, so the hand-over
        // between copies doesn't read as a jump back.
        const gap = last.playing ? (performance.now() - last.at) / 1000 : 0;
        v.currentTime = (last.time + gap) % v.duration;
      }}
      onTimeUpdate={(e) => note(e.currentTarget)}
      onPause={(e) => note(e.currentTarget)}
    />
  );
}

/* A project image, or the duotone placeholder when a figure has no src yet.
   While `playing`, a figure with a clip plays it over the image. */
function Figure({
  figure,
  playing = false,
}: {
  figure?: WorkFigure;
  playing?: boolean;
}) {
  const media = {
    objectFit: figure?.fit ?? "cover",
    objectPosition: figure?.position,
  };
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
          alt={figure.alt}
          loading="lazy"
          style={media}
        />
      ) : (
        <div className={styles.tint} />
      )}
      {playing && figure?.video && (
        <Clip
          className={styles.figVideo}
          src={figure.video}
          poster={figure.src}
          label={figure.alt}
          style={media}
        />
      )}
    </div>
  );
}

/** Tag label -> logo. Tags without a brand logo (concepts, small tools) get a
 *  plain Tabler icon for what they are, so every chip has one. */
const TAG_ICONS: Record<string, IconType> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  React: SiReact,
  "React Native": SiReact,
  "Three.js": SiThreedotjs,
  FastAPI: SiFastapi,
  GCP: SiGooglecloud,
  "Chrome Extension": SiGooglechrome,
  Express: SiExpress,
  AWS: FaAws,
  Vitest: SiVitest,
  iOS: SiApple,
  Docker: SiDocker,
  Hono: SiHono,
  "Node.js": SiNodedotjs,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  "C++": SiCplusplus,
  "Next.js": SiNextdotjs,
  "OpenAI API": RiOpenaiFill,
  Java: FaJava,
  Android: SiAndroid,
  "Google Maps": SiGooglemaps,
  Firebase: SiFirebase,
  // No brand logo: a generic icon for what the tag is.
  FPGA: TbCpu,
  "Lucid HDL": TbFileCode,
  "Digital Logic": TbLogicAnd,
  "Computer Architecture": TbStack2,
  "Manifest V3": TbPuzzle,
  "LLM APIs": TbSparkles,
  CameraX: TbCamera,
  TCFrame: TbTestPipe,
  "Data Structures & Algorithms": TbBinaryTree,
  "Competitive Programming": TbTrophy,
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

/** Tag label -> docs. Linked in the details dialog's chips and highlights. */
const TAG_LINKS: Record<string, string> = {
  TCFrame: "https://tcframe.toki.id/",
};

/** A highlight with any linked tag name turned into its docs link. */
function Highlight({ text }: { text: string }) {
  const names = Object.keys(TAG_LINKS).filter((n) => text.includes(n));
  if (names.length === 0) return <>{text}</>;
  const parts = text.split(new RegExp(`(${names.join("|")})`));
  return (
    <span>
      {parts.map((part, i) =>
        TAG_LINKS[part] ? (
          <a
            key={i}
            href={TAG_LINKS[part]}
            className={styles.hlLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </span>
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

/* The card's stamp. A project with a placing gets a medal in that metal. */
function Stamp({ project }: { project: WorkProject }) {
  const { status, year, medal } = project;
  return (
    <div
      className={`${styles.cstamp} ${medal ? styles[medal] : ""}`}
      aria-hidden
    >
      {medal && <FaMedal className={styles.medal} />}
      {/* Longer results ("Semifinalist") are set smaller to stay in the ring. */}
      <span
        className={`${styles.st} ${status.length > 9 ? styles.stLong : ""}`}
      >
        {status}
      </span>
      <span className={styles.sy}>{year}</span>
    </div>
  );
}

/* ------------------------------- Card ---------------------------------- */

interface CardProps {
  project: WorkProject;
  index: number;
  active: boolean;
  onOpen: (index: number) => void;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

function WorkCard({ project, index, active, onOpen, registerRef }: CardProps) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      cardRef.current = el;
      registerRef(index, el);
    },
    [registerRef, index],
  );

  // A card's clip plays only while the card is on screen, so it isn't
  // fetched or decoded before the visitor scrolls down to it.
  const hasVideo = Boolean(project.figures[0]?.video);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !hasVideo) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  return (
    <div
      ref={setRef}
      // Anchor for in-page links, e.g. "#project-roomu".
      id={`project-${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      data-card="1"
      // Column in the three-up layout; the CSS staggers columns on scroll.
      data-col={index % 3}
      className={`${styles.pcard} ${active ? styles.active : ""}`}
    >
      <div className={styles.pcardImg}>
        <Figure
          figure={project.figures[0]}
          playing={inView && !active && !reduced}
        />
      </div>
      {/* Outside the image box, so it can overhang the card's corner. */}
      <Stamp project={project} />
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
        {/* The card's one control: the summary's ::after stretches over the
            whole card. A <details> rather than a bare button, so the write-up
            is in the HTML for crawlers, link previews and AI tools. The click
            opens the dialog instead; without JavaScript the text unfolds here. */}
        <details className={styles.pmore}>
          <summary
            className={styles.pmoreBtn}
            aria-haspopup="dialog"
            aria-label={`${project.name} — ${project.tag}`}
            onClick={(e) => {
              e.preventDefault();
              onOpen(index);
            }}
          />
          <div className={styles.pmoreText}>
            <p>{project.desc}</p>
            <ul>
              {project.hi.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <ul>
              {(project.links ?? [])
                .filter((l) => l.href && l.href !== "#")
                .map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </details>
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

/* Full-screen view of a figure. Its own modal <dialog>, so it stacks above
   the project dialog in the top layer and Escape closes only this. */
function Lightbox({ figure, index, count, onClose, onStep }: LightboxProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label={figure.alt}
      onClose={onClose}
      onClick={() => ref.current?.close()}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") onStep(-1);
        else if (e.key === "ArrowRight") onStep(1);
      }}
    >
      <button
        type="button"
        className={styles.lbClose}
        aria-label="Close image"
        // The dialog's own click handler closes it.
      >
        <FiX aria-hidden />
      </button>
      {figure.video ? (
        <Clip
          className={styles.lbImg}
          src={figure.video}
          poster={figure.src}
          label={figure.alt}
          onClick={(e) => e.stopPropagation()}
          autoPlay={!reduced}
          controls
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.lbImg}
          src={figure.src}
          alt={figure.alt}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {count > 1 && (
        <div className={styles.lbCount}>
          {index + 1} / {count}
        </div>
      )}
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
    </dialog>
  );
}

/* --------------------------- Project dialog ---------------------------- */

/* The dialog's contents. Keyed by project, so the figure picker resets. */
function ProjectDetail({ project }: { project: WorkProject }) {
  const reduced = useReducedMotion();
  const [figIdx, setFigIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const figCount = project.figures.length;
  const closeZoom = useCallback(() => setZoomed(false), []);
  const stepFig = useCallback(
    (dir: number) => setFigIdx((i) => (i + dir + figCount) % figCount),
    [figCount],
  );
  const figure = project.figures[figIdx];

  // On touch screens the picker can't hide-until-hover. Over a clip it shows
  // for a few seconds, then fades so it doesn't sit on the clip's captions;
  // tapping its corner shows it again. "Faded" is remembered per showing
  // (figure + reveal count), so changing figure or tapping resets it.
  const [reveals, setReveals] = useState(0);
  const [fadedKey, setFadedKey] = useState("");
  const showing = `${figIdx}:${reveals}`;
  const pickerFaded = fadedKey === showing;
  const isClip = Boolean(figure.video);
  useEffect(() => {
    if (!isClip || !window.matchMedia("(hover: none)").matches) return;
    const timer = window.setTimeout(() => setFadedKey(showing), 3000);
    return () => window.clearTimeout(timer);
  }, [isClip, showing]);

  // A sideways swipe on the stage steps through the figures too. The tap that
  // ends a swipe must not also open the lightbox, hence `swiped`.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
    swiped.current = false;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = touch.current;
    touch.current = null;
    if (!from || figCount < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    const dy = t.clientY - from.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swiped.current = true;
    stepFig(dx < 0 ? 1 : -1);
  };

  // Left / right arrows step through the figures while the dialog is open.
  // The lightbox handles its own arrows, so this stands down while it's up.
  useEffect(() => {
    if (figCount < 2 || zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowLeft") stepFig(-1);
      else if (e.key === "ArrowRight") stepFig(1);
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [figCount, zoomed, stepFig]);

  return (
    <div className={styles.expPanel}>
      <div className={styles.expMedia}>
        <div
          className={styles.expImg}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {figure.src ? (
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={() => {
                if (swiped.current) swiped.current = false;
                else setZoomed(true);
              }}
              aria-label={`Enlarge ${figure.alt}`}
            >
              {/* Paused while the lightbox plays the same clip. */}
              <Figure figure={figure} playing={!reduced && !zoomed} />
            </button>
          ) : (
            <Figure figure={figure} />
          )}
          {/* A clip fills the stage; the stamp would sit on top of its UI. */}
          {!figure.video && <Stamp project={project} />}
        </div>
        {/* Figure picker, laid over the stage's bottom-right corner. */}
        {figCount > 1 && (
          <div
            className={`${styles.expThumbs} ${pickerFaded ? styles.expThumbsFaded : ""}`}
          >
            {project.figures.map((fig, fi) => (
              <button
                key={fig.alt}
                type="button"
                className={`${styles.thumb} ${fi === figIdx ? styles.thumbActive : ""}`}
                onClick={() => setFigIdx(fi)}
                aria-label={`View ${fig.alt}`}
                aria-pressed={fi === figIdx}
              >
                <Figure figure={fig} />
                {fig.video && <span className={styles.thumbPlay} aria-hidden />}
              </button>
            ))}
          </div>
        )}
        {/* While the picker is faded, a counter holds its corner so it is
            still obvious there is more to see; tapping it brings the picker back. */}
        {figCount > 1 && pickerFaded && (
          <button
            type="button"
            className={styles.figCount}
            onClick={() => setReveals((n) => n + 1)}
            aria-label={`Item ${figIdx + 1} of ${figCount}. Show all`}
          >
            <FiImage aria-hidden />
            {figIdx + 1} / {figCount}
          </button>
        )}
        {zoomed && (
          <Lightbox
            figure={figure}
            index={figIdx}
            count={figCount}
            onClose={closeZoom}
            onStep={stepFig}
          />
        )}
      </div>
      <div className={styles.expBody}>
        <div>
          <p className={styles.expDesc}>{project.desc}</p>
          <div className={styles.highlights}>
            {project.hi.map((h) => (
              <div key={h} className={styles.hl}>
                <Highlight text={h} />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.expMeta}>
          <div className={styles.expChips}>
            {project.tags.map((t) =>
              TAG_LINKS[t] ? (
                <a
                  key={t}
                  href={TAG_LINKS[t]}
                  className={`${styles.expChip} ${styles.expChipLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TagLabel tag={t} />
                  <FiArrowUpRight className={styles.chipIcon} aria-hidden />
                </a>
              ) : (
                <span key={t} className={styles.expChip}>
                  <TagLabel tag={t} />
                </span>
              ),
            )}
          </div>
          <div className={styles.expLinks}>
            {(project.links ?? [])
              .filter((l) => l.href && l.href !== "#")
              .map((l) => {
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
  );
}

/** Matches the modalOut / sheetOut keyframe duration in the stylesheet. */
const CLOSE_MS = 200;

interface ModalProps {
  /** Project to show; null = closed. Stays set until the close animation ends. */
  project: WorkProject | null;
  onClose: () => void;
}

/**
 * Detail view for one project, the light-palette twin of the Experience
 * dialog: a native <dialog> opened with showModal(), so the browser handles
 * the focus trap, Escape, the backdrop, and handing focus back to the card.
 * Centered panel on desktop, bottom sheet on mobile (CSS only).
 */
function ProjectModal({ project, onClose }: ModalProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !project) return;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Play the exit animation, then close for real; the dialog's own `close`
  // event (below) is what tells the parent.
  const requestClose = useCallback(() => {
    const dialog = ref.current;
    if (!dialog?.open) return;
    if (reduced) {
      dialog.close();
      return;
    }
    setClosing(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => dialog.close(), CLOSE_MS);
  }, [reduced]);

  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${closing ? styles.closing : ""}`}
      aria-label={project ? `${project.name} — ${project.tag}` : undefined}
      onCancel={(e) => {
        // The lightbox's cancel bubbles up here; only handle our own.
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        requestClose();
      }}
      onClose={(e) => {
        if (e.target !== e.currentTarget) return;
        window.clearTimeout(timer.current);
        setClosing(false);
        onClose();
      }}
      // The panel fills the dialog box, so a click that lands on the dialog
      // element itself is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      {project && (
        <div className={styles.modalPanel}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitles}>
              <h3 className={styles.modalName}>{project.name}</h3>
              <div className={styles.modalMeta}>{project.tag}</div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={requestClose}
              aria-label="Close"
            >
              <FiX aria-hidden />
            </button>
          </div>
          <div className={styles.modalScroll}>
            <ProjectDetail key={project.name} project={project} />
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------ Section -------------------------------- */

export default function Work() {
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);

  const registerRef = useCallback((i: number, el: HTMLDivElement | null) => {
    cardEls.current[i] = el;
  }, []);

  const closeModal = useCallback(() => setActive(null), []);

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

  return (
    <section id="work" className={styles.work} data-nav-tint="light">
      <div className={styles.workWrap}>
        <SectionHeading
          titleId="work-title"
          classes={{ root: styles.workHead, title: styles.workTitle }}
        >
          {workHeading.title}
        </SectionHeading>

        <div ref={gridRef} className={styles.grid}>
          {work.map((project, i) => (
            <WorkCard
              key={project.name}
              project={project}
              index={i}
              active={active === i}
              onOpen={setActive}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={active !== null ? work[active] : null}
        onClose={closeModal}
      />
    </section>
  );
}
