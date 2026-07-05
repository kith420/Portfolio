"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { experience, experienceHeading } from "@/content/experience";
import { ExperienceRole, LogoVariant, RichText } from "@/content/types";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScramble } from "@/hooks/useScramble";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import ExperienceModal from "./ExperienceModal";
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

interface TreeRowProps {
  role: ExperienceRole;
  side: "left" | "right";
  onOpen: (role: ExperienceRole, rect: DOMRect) => void;
}

function TreeRow({ role, side, onOpen }: TreeRowProps) {
  const reduced = useReducedMotion();
  const scramble = useScramble(reduced);
  const coRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { ref, active } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.35,
    onEnter: () => {
      const el = coRef.current;
      if (!el) return;
      // Fire after the slide-in has mostly landed (secondary flourish).
      window.setTimeout(() => scramble(el, role.company, { duration: 700 }), 300);
    },
    onExit: () => {
      const el = coRef.current;
      if (el && !reduced) el.textContent = role.company[0];
    },
  });

  // Initial collapsed placeholder (single char), owned imperatively so
  // re-renders don't clobber the scramble.
  useEffect(() => {
    const el = coRef.current;
    if (el) el.textContent = reduced ? role.company : role.company[0];
  }, [reduced, role.company]);

  const open = () => {
    const el = cardRef.current;
    if (el) onOpen(role, el.getBoundingClientRect());
  };

  return (
    <div
      ref={ref}
      className={`${styles.row} ${styles[side]} ${active ? styles.active : ""}`}
    >
      <div
        ref={cardRef}
        className={styles.card}
        role="button"
        tabIndex={0}
        aria-label={`${role.company} — ${role.role}`}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
      >
        <div className={styles.cardHead}>
          <div className={styles.cardNum}>{role.num}</div>
          <div
            className={`${styles.cardLogo} ${LOGO_CLASS[role.logoVariant]}${
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
          <span className={styles.cardCo} ref={coRef} />
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardLoc}>{role.location}</div>
          <div className={styles.cardRole}>{role.role}</div>
          <p className={styles.cardDesc}>
            <Rich text={role.desc} />
          </p>
        </div>
        <div className={styles.cardFoot}>
          <div className={styles.chips}>
            {role.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className={styles.cardYear}>{role.year}</div>
        </div>
      </div>
      <div className={styles.node} />
    </div>
  );
}

export default function Experience() {
  const { ref: treeRef, active: lit } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.15,
  });
  const [modalRole, setModalRole] = useState<ExperienceRole | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const clearTimer = useRef<number | null>(null);

  const openModal = useCallback((role: ExperienceRole, rect: DOMRect) => {
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    setOriginRect(rect);
    setModalRole(role);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    // Keep the content mounted until the close animation finishes.
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    clearTimer.current = window.setTimeout(() => {
      setModalRole(null);
      setOriginRect(null);
    }, 540);
  }, []);

  useEffect(() => {
    return () => {
      if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    };
  }, []);

  const count = `${String(experience.length).padStart(2, "0")} roles`;

  return (
    <section id="exp" className={styles.exp}>
      <div className={styles.expWrap}>
        <SectionHeading
          eyebrow={experienceHeading.eyebrow}
          count={count}
          classes={{ root: styles.secHead }}
        >
          {experienceHeading.titleLead}
          <span className={styles.ac}>{experienceHeading.titleAccent}</span>
        </SectionHeading>

        <div
          ref={treeRef}
          className={`${styles.tree} ${lit ? styles.lit : ""}`}
        >
          <div className={styles.spine} />
          {experience.map((role, i) => (
            <TreeRow
              key={role.num}
              role={role}
              side={i % 2 === 0 ? "left" : "right"}
              onOpen={openModal}
            />
          ))}
        </div>
      </div>

      <ExperienceModal
        role={modalRole}
        open={modalOpen}
        originRect={originRect}
        onClose={closeModal}
      />
    </section>
  );
}
