"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExperienceRole,
  LogoVariant,
  ModalImage,
  RichText,
} from "@/content/types";
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

function Rich({ text }: { text: RichText }) {
  return (
    <>
      {text.map((seg, i) =>
        seg.href ? (
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

function Figure({ image }: { image: ModalImage }) {
  return (
    <figure className={styles.modalFigure}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} loading="lazy" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
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

  return (
    <dialog
      ref={ref}
      className={`${styles.modal} ${closing ? styles.closing : ""}`}
      aria-label={role ? `${role.company} — ${role.role}` : undefined}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClose={() => {
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
              <Rich text={role.modal.overview} />
            </p>

            {role.modal.sections ? (
              role.modal.sections.map((section) => (
                <section key={section.title}>
                  <h4 className={styles.modalLabel}>{section.title}</h4>
                  {section.body.map((para, i) => (
                    <p key={i} className={styles.modalPara}>
                      <Rich text={para} />
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
                        <Rich text={point} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  role.modal.built && (
                    <p className={styles.modalPara}>
                      <Rich text={role.modal.built} />
                    </p>
                  )
                )}
              </>
            )}

            {role.modal.image && <Figure image={role.modal.image} />}

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
