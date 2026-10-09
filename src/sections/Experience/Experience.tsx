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

/** Fraction of a photo's height that must fit on screen before it opens. */
const PHOTO_REVEAL = 0.3;

interface TreeRowProps {
  role: ExperienceRole;
  side: "left" | "right";
  index: number;
  /** Scroll-driven: true once the card has risen past the trigger line. */
  open: boolean;
  /** Scroll-driven: true once enough of the photo's height fits on screen. */
  photoOpen: boolean;
  onDetails: (role: ExperienceRole) => void;
}

function TreeRow({ role, side, index, open, photoOpen, onDetails }: TreeRowProps) {
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
              <div className={styles.cardMeta}>
                <div className={styles.cardLoc}>{role.location}</div>
                <div className={styles.cardYear}>{role.year}</div>
              </div>
              <div className={styles.cardRole}>{role.role}</div>
              {role.stat && (
                <div className={styles.cardStat}>
                  <span className={styles.cardStatValue}>{role.stat.value}</span>
                  <span className={styles.cardStatLabel}>{role.stat.label}</span>
                </div>
              )}
              <p className={styles.cardDesc}>
                <Rich text={role.desc} />
              </p>
              {/* Second-stage collapse: the photo opens on its own, later
                  trigger once the card's text is already on screen. */}
              <div
                className={`${styles.photoCollapse} ${photoOpen ? styles.photoOpen : ""}`}
                data-exp-photo
              >
                <div className={styles.collapseInner}>
                  <figure className={styles.cardPhoto}>
                    {role.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={role.photo.src}
                        alt={role.photo.alt}
                        loading="lazy"
                        style={{ objectPosition: role.photo.position }}
                      />
                    ) : (
                      <span className={styles.photoEmpty}>Team photo</span>
                    )}
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardFoot}>
          <div className={styles.chips}>
            {role.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {/* The one real control on the card. Its ::after stretches over the
              whole card, so clicking anywhere opens the details while inline
              links (lifted above it) keep working. */}
          <button
            type="button"
            className={styles.detailsBtn}
            aria-haspopup="dialog"
            aria-label={`Details: ${role.company}`}
            onClick={() => onDetails(role)}
          >
            View details
            <span className={styles.detailsArrow} aria-hidden>
              →
            </span>
          </button>
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
  // Same idea for the photos, which open on a later trigger than the card.
  const [photoThrough, setPhotoThrough] = useState(-1);
  // Role shown in the details dialog (null = closed).
  const [detail, setDetail] = useState<ExperienceRole | null>(null);
  const closeDetail = useCallback(() => setDetail(null), []);

  // A single rAF-throttled scroll handler finds the last card whose centre has
  // risen past the viewport centre line. State only changes when that index
  // changes (discrete, not per-frame), so React state is appropriate here.
  useEffect(() => {
    if (reduced) {
      setOpenThrough(-1);
      setPhotoThrough(-1);
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
      const vh = window.innerHeight;
      const trigger = vh * 0.88;
      let through = -1;
      let photos = -1;
      rows.forEach((el) => {
        const idx = Number(el.dataset.expRow);
        const r = el.getBoundingClientRect();
        // Use the card's TOP so a card counts as reached the moment it rises
        // past the trigger line, well before its centre arrives.
        if (r.top <= trigger) through = Math.max(through, idx);

        // Where the photo will sit once its card is fully open. offsetTop is
        // measured inside the card and ignores the collapses' animated
        // heights, so this doesn't jump while the card is still expanding.
        const card = el.querySelector<HTMLElement>("article");
        const photo = el.querySelector<HTMLElement>("[data-exp-photo]");
        if (!card || !photo) return;
        const photoTop = card.getBoundingClientRect().top + photo.offsetTop;
        const photoHeight = (photo.offsetWidth * 9) / 16;
        if (vh - photoTop >= photoHeight * PHOTO_REVEAL) {
          photos = Math.max(photos, idx);
        }
      });
      setOpenThrough((prev) => (prev === through ? prev : through));
      // A photo never opens ahead of its own card.
      const photoIdx = Math.min(photos, through);
      setPhotoThrough((prev) => (prev === photoIdx ? prev : photoIdx));
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

  return (
    <section id="exp" className={styles.exp}>
      <div className={styles.expWrap}>
        <SectionHeading classes={{ root: styles.secHead }}>
          {experienceHeading.title}
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
              photoOpen={reduced || i <= photoThrough}
              onDetails={setDetail}
            />
          ))}
        </div>
      </div>
      <ExperienceModal role={detail} onClose={closeDetail} />
    </section>
  );
}
