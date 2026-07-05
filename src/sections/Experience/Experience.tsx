"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { experience, experienceHeading } from "@/content/experience";
import { ExperienceRole, LogoVariant, RichText } from "@/content/types";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import { useScramble } from "@/hooks/useScramble";
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

interface TreeRowProps {
  role: ExperienceRole;
  side: "left" | "right";
  index: number;
  /** Scroll-driven: true when this is the card nearest the viewport centre. */
  open: boolean;
}

function TreeRow({ role, side, index, open }: TreeRowProps) {
  const reduced = useReducedMotion();
  const scramble = useScramble(reduced);
  const coRef = useRef<HTMLSpanElement>(null);

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

  return (
    <div
      ref={ref}
      data-exp-row={index}
      className={`${styles.row} ${styles[side]} ${active ? styles.active : ""}`}
    >
      <article
        className={`${styles.card} ${open ? styles.open : ""}`}
        aria-label={`${role.company} — ${role.role}`}
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

        {/* Collapsible body — expands via grid-template-rows 0fr -> 1fr when the
            card scrolls to the viewport centre. */}
        <div className={styles.collapse}>
          <div className={styles.collapseInner}>
            <div className={styles.cardBody}>
              <div className={styles.cardLoc}>{role.location}</div>
              <div className={styles.cardRole}>{role.role}</div>
              <p className={styles.cardDesc}>
                <Rich text={role.desc} />
              </p>
              <div className={styles.thinkingNote}>{role.modal.thinkingNote}</div>
            </div>
          </div>
        </div>

        <div className={styles.cardFoot}>
          <div className={styles.chips}>
            {role.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className={styles.cardYear}>{role.year}</div>
        </div>
      </article>
      <div className={styles.node} />
    </div>
  );
}

export default function Experience() {
  const { ref: treeRef, active: lit } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.15,
  });
  const reduced = useReducedMotion();
  // Highest card index scrolled through so far: every card up to and including
  // this one is open (sui.io-style cumulative reveal), cards below stay closed.
  const [openThrough, setOpenThrough] = useState(-1);

  // A single rAF-throttled scroll handler finds the last card whose centre has
  // risen past the viewport centre line. State only changes when that index
  // changes (discrete, not per-frame), so React state is appropriate here.
  useEffect(() => {
    if (reduced) {
      setOpenThrough(-1);
      return;
    }
    let raf = 0;
    let ticking = false;

    const compute = () => {
      ticking = false;
      const tree = treeRef.current;
      if (!tree) return;
      const rows = tree.querySelectorAll<HTMLElement>("[data-exp-row]");
      // Trigger low on the screen (card entering from the bottom) so each card
      // finishes expanding before it reaches the reading zone — the growth then
      // happens in the periphery instead of shifting content under the cursor.
      const trigger = window.innerHeight * 0.88;
      let through = -1;
      rows.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Use the card's TOP so a card counts as reached the moment it rises
        // past the trigger line, well before its centre arrives.
        if (r.top <= trigger) {
          through = Math.max(through, Number(el.dataset.expRow));
        }
      });
      setOpenThrough((prev) => (prev === through ? prev : through));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, treeRef]);

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
              index={i}
              open={reduced || i <= openThrough}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
