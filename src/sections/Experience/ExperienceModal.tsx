"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExperienceRole,
  LogoVariant,
  ModalImage,
  RichText,
} from "@/content/types";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Experience.module.css";

const LOGO_CLASS: Record<LogoVariant, string> = {
  simular: styles.logoSimular,
  aggie: styles.logoAggie,
  tcs: styles.logoTcs,
  ntt: styles.logoNtt,
  koko: styles.logoKoko,
};

/** Matches the modalOut / sheetOut keyframe duration in the stylesheet. */
const CLOSE_MS = 200;

function Rich({
  text,
  onJump,
}: {
  text: RichText;
  onJump: (id: string) => void;
}) {
  return (
    <>
      {text.map((seg, i) =>
        seg.href?.startsWith("#") ? (
          // In-page link: the dialog closes first, then the target opens.
          <a
            key={i}
            className={styles.link}
            href={seg.href}
            onClick={(e) => {
              e.preventDefault();
              onJump(seg.href!.slice(1));
            }}
          >
            {seg.text}
          </a>
        ) : seg.href ? (
          <a
            key={i}
            className={styles.link}
            href={seg.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {seg.text}
          </a>
        ) : seg.hi ? (
          <span key={i} className={styles.hi}>
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

interface LightboxProps {
  image: ModalImage;
  index: number;
  count: number;
  onClose: () => void;
  onStep: (dir: number) => void;
}

/* Full-screen view of a picture, after the project dialog's. Its own modal
   <dialog>, so it stacks above the role dialog and Escape closes only this. */
function Lightbox({ image, index, count, onClose, onStep }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label={image.alt}
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.lbImg}
        src={image.src}
        alt={image.alt}
        onClick={(e) => e.stopPropagation()}
      />
      {(count > 1 || image.caption) && (
        <div className={styles.lbCount}>
          {count > 1 && `${index + 1} / ${count}`}
          {count > 1 && image.caption && " · "}
          {image.caption}
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

const noStep = () => {};

function Figure({ image }: { image: ModalImage }) {
  const [zoomed, setZoomed] = useState(false);
  const closeZoom = useCallback(() => setZoomed(false), []);
  return (
    <figure className={styles.modalFigure}>
      <button
        type="button"
        className={styles.zoomBtn}
        onClick={() => setZoomed(true)}
        aria-label={`Enlarge ${image.alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} loading="lazy" />
      </button>
      {image.caption && <figcaption>{image.caption}</figcaption>}
      {zoomed && (
        <Lightbox
          image={image}
          index={0}
          count={1}
          onClose={closeZoom}
          onStep={noStep}
        />
      )}
    </figure>
  );
}

/** Per-picture crop for the gallery's cover fit. */
function crop(image: ModalImage): React.CSSProperties {
  return {
    objectPosition: image.position,
    scale: image.zoom,
    transformOrigin: image.position,
  };
}

/* One picture at a time with a thumbnail picker in the corner, after the
   project dialog's viewer. Arrow keys and sideways swipes step through. */
function Gallery({ images }: { images: ModalImage[] }) {
  const [idx, setIdx] = useState(0);
  const count = images.length;
  const step = useCallback(
    (dir: number) => setIdx((i) => (i + dir + count) % count),
    [count],
  );
  const image = images[idx];
  const [zoomed, setZoomed] = useState(false);
  const closeZoom = useCallback(() => setZoomed(false), []);

  // The lightbox handles its own arrows, so this stands down while it's up.
  useEffect(() => {
    if (count < 2 || zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, zoomed, step]);

  // The tap that ends a swipe must not also open the lightbox, hence `swiped`.
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
    if (!from || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    const dy = t.clientY - from.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swiped.current = true;
    step(dx < 0 ? 1 : -1);
  };

  return (
    <figure className={styles.gallery}>
      <div
        className={styles.galleryStage}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          className={styles.zoomBtn}
          onClick={() => {
            if (swiped.current) swiped.current = false;
            else setZoomed(true);
          }}
          aria-label={`Enlarge ${image.alt}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            style={crop(image)}
          />
        </button>
        {count > 1 && (
          <div className={styles.galleryThumbs}>
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={`${styles.galleryThumb} ${i === idx ? styles.galleryThumbActive : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`View ${img.alt}`}
                aria-pressed={i === idx}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt=""
                  loading="lazy"
                  style={crop(img)}
                />
              </button>
            ))}
          </div>
        )}
      </div>
      <figcaption>
        {count > 1 && `${idx + 1} / ${count}`}
        {count > 1 && image.caption && " · "}
        {image.caption}
      </figcaption>
      {zoomed && (
        <Lightbox
          image={image}
          index={idx}
          count={count}
          onClose={closeZoom}
          onStep={step}
        />
      )}
    </figure>
  );
}

interface Props {
  /** Role to show; null = closed. Stays set until the close animation ends. */
  role: ExperienceRole | null;
  onClose: () => void;
}

/**
 * Detail view for one role. A native <dialog> opened with showModal(), so the
 * browser handles the focus trap, Escape, the backdrop, and handing focus back
 * to the card's Details button on close. Centered panel on desktop, bottom
 * sheet on mobile (CSS only).
 */
export default function ExperienceModal({ role, onClose }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const timer = useRef(0);
  // Id of the element an in-page link points at, opened once this closes.
  const jumpTo = useRef<string | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !role) return;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [role]);

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

  const jump = useCallback(
    (id: string) => {
      jumpTo.current = id;
      requestClose();
    },
    [requestClose],
  );

  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${closing ? styles.closing : ""}`}
      aria-label={role ? `${role.company} — ${role.role}` : undefined}
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
        const target = jumpTo.current && document.getElementById(jumpTo.current);
        jumpTo.current = null;
        if (target) {
          target.scrollIntoView({ block: "center", behavior: "instant" });
          // Focus first, so the target's own dialog hands focus back to it.
          target.focus({ preventScroll: true });
          target.click();
        }
      }}
      // The panel fills the dialog box, so a click that lands on the dialog
      // element itself is a click on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      {role && (
        <div className={styles.modalPanel}>
          <div className={styles.modalHeader}>
            <div
              className={`${styles.modalLogo} ${LOGO_CLASS[role.logoVariant]}${
                role.logoSrc ? ` ${styles.logoImg}` : ""
              }`}
            >
              {role.logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={role.logoSrc} alt={`${role.company} logo`} />
              ) : (
                role.logo
              )}
            </div>
            <div className={styles.modalTitles}>
              <div className={styles.modalCompany}>{role.company}</div>
              <div className={styles.modalMeta}>{role.modal.meta}</div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={requestClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </button>
          </div>

          <div className={styles.modalScroll}>
            <div className={styles.modalRoleRow}>
              <h3 className={styles.modalRole}>{role.role}</h3>
              <div className={styles.cardYear}>{role.year}</div>
            </div>
            <p className={styles.modalPara}>
              <Rich text={role.modal.overview} onJump={jump} />
            </p>

            {/* A lone picture keeps its own shape; several share the viewer. */}
            {role.modal.gallery?.length === 1 ? (
              <Figure image={role.modal.gallery[0]} />
            ) : (
              role.modal.gallery && (
                <Gallery key={role.num} images={role.modal.gallery} />
              )
            )}

            {role.modal.sections ? (
              role.modal.sections.map((section) => (
                <section key={section.title}>
                  <h4 className={styles.modalLabel}>{section.title}</h4>
                  {section.body.map((para, i) => (
                    <p key={i} className={styles.modalPara}>
                      <Rich text={para} onJump={jump} />
                    </p>
                  ))}
                  {section.image && <Figure image={section.image} />}
                </section>
              ))
            ) : (
              <>
                <h4 className={styles.modalLabel}>What I built</h4>
                {role.modal.points ? (
                  <ul className={`${styles.modalPara} ${styles.modalPoints}`}>
                    {role.modal.points.map((point, i) => (
                      <li key={i}>
                        <Rich text={point} onJump={jump} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  role.modal.built && (
                    <p className={styles.modalPara}>
                      <Rich text={role.modal.built} onJump={jump} />
                    </p>
                  )
                )}
              </>
            )}

            {[role.modal.image ?? []].flat().map((image) => (
              <Figure key={image.src} image={image} />
            ))}

            <div className={`${styles.chips} ${styles.modalChips}`}>
              {role.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
