"use client";

import { useEffect, useRef } from "react";
import { ExperienceRole, LogoVariant, RichText } from "@/content/types";
import { EASE } from "@/lib/easing";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Experience.module.css";

const LOGO_CLASS: Record<LogoVariant, string> = {
  simular: styles.logoSimular,
  aggie: styles.logoAggie,
  tcs: styles.logoTcs,
  ntt: styles.logoNtt,
  koko: styles.logoKoko,
};

function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((seg, i) =>
        seg.hi ? (
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

interface Props {
  /** Content to show — retained by the parent through the close animation. */
  role: ExperienceRole | null;
  /** Drives the open/close animation. */
  open: boolean;
  originRect: DOMRect | null;
  onClose: () => void;
}

/**
 * Single reused modal. On desktop it snaps to the clicked card's rect then
 * animates out to a centered panel — the `offsetWidth` read between the snap
 * and the transition re-enable is the required forced reflow (spec §4.4).
 * On mobile it's a bottom-sheet slide-up instead. Fully prop-controlled: the
 * parent keeps `role` populated until the close animation finishes, so no
 * component state is needed here.
 */
export default function ExperienceModal({
  role,
  open,
  originRect,
  onClose,
}: Props) {
  const reduced = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    if (!modal || !backdrop) return;

    const mobile = window.matchMedia("(max-width: 820px)").matches;

    if (open) {
      document.body.style.overflow = "hidden";
      backdrop.classList.add(styles.open);
      if (mobile) {
        modal.classList.add(styles.sheet);
        modal.style.removeProperty("width");
        modal.style.removeProperty("height");
        modal.style.removeProperty("top");
        modal.style.removeProperty("left");
        void modal.offsetWidth; // reflow before height transition
        requestAnimationFrame(() => modal.classList.add(styles.open));
      } else {
        modal.classList.remove(styles.sheet);
        openDesktop(modal, originRect, reduced);
      }
    } else {
      document.body.style.overflow = "";
      backdrop.classList.remove(styles.open);
      modal.style.opacity = "0";
      modal.classList.remove(styles.open);
      const t = window.setTimeout(() => {
        modal.classList.remove(styles.sheet);
        modal.style.width = "0";
        modal.style.height = "0";
      }, 520);
      return () => window.clearTimeout(t);
    }
  }, [open, originRect, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onResize = () => onClose();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div
        ref={backdropRef}
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={role?.company}
      >
        <div className={styles.dragHandle} aria-hidden />
        {role && (
          <div className={styles.modalScroll}>
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
                onClick={onClose}
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
            <div className={styles.modalContent}>
              <div className={styles.modalHeroImg}>fig — hero image</div>
              <div className={styles.modalThumbs}>
                <div className={styles.modalThumb}>fig. 02</div>
                <div className={styles.modalThumb}>fig. 03</div>
              </div>
              <div className={styles.modalLabel}>{"// overview"}</div>
              <p className={styles.modalPara}>
                <Rich text={role.modal.overview} />
              </p>
              <div className={styles.thinkingNote}>{role.modal.thinkingNote}</div>
              <div className={styles.modalLabel}>{"// what I built"}</div>
              <p className={styles.modalPara}>
                <Rich text={role.modal.built} />
              </p>
              <div className={styles.modalChips}>
                {role.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function openDesktop(
  modal: HTMLDivElement,
  rect: DOMRect | null,
  reduced: boolean,
) {
  const targetW = Math.min(840, window.innerWidth - 48);
  const targetH = Math.min(620, window.innerHeight * 0.86);
  const targetLeft = (window.innerWidth - targetW) / 2;
  const targetTop = (window.innerHeight - targetH) / 2;

  const settle = () => {
    modal.style.width = `${targetW}px`;
    modal.style.height = `${targetH}px`;
    modal.style.left = `${targetLeft}px`;
    modal.style.top = `${targetTop}px`;
    modal.style.opacity = "1";
    modal.classList.add(styles.open);
  };

  if (reduced || !rect) {
    modal.style.transition = "none";
    settle();
    return;
  }

  modal.style.transition = "none";
  modal.style.width = `${rect.width}px`;
  modal.style.height = `${rect.height}px`;
  modal.style.left = `${rect.left}px`;
  modal.style.top = `${rect.top}px`;
  modal.style.opacity = "0";
  void modal.offsetWidth; // forced reflow — else the snap + animate batch

  modal.style.transition = `width 0.55s ${EASE}, height 0.55s ${EASE}, top 0.55s ${EASE}, left 0.55s ${EASE}, opacity 0.15s ease`;
  requestAnimationFrame(settle);
}
