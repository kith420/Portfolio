import Image from "next/image";
import { hero } from "@/content/hero";
import type { HeroMedia } from "@/content/types";
import styles from "./Hero.module.css";

/**
 * Fallback carousel tiles — procedurally-shaded gradients used when no real
 * media is listed in `hero.carousel` (01-hero-section-spec.md §3.2).
 */
const SHADES = [
  "#171a22",
  "#12151c",
  "#1a1e28",
  "#141821",
  "#181c26",
  "#10131a",
  "#191d27",
  "#13161f",
];

function MediaTile({ item }: { item: HeroMedia }) {
  if (item.type === "video") {
    return (
      <div className={styles.tile}>
        <video
          className={styles.media}
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }
  return (
    <div className={styles.tile}>
      <Image
        className={styles.media}
        src={item.src}
        alt={item.alt ?? ""}
        fill
        sizes="320px"
      />
    </div>
  );
}

export default function Hero() {
  const { carousel } = hero;
  // Duplicate the list so the -50% drift loops seamlessly (see .module.css).
  const media = carousel.length ? [...carousel, ...carousel] : null;

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.carousel} aria-hidden>
        <div className={styles.track}>
          {media
            ? media.map((item, i) => <MediaTile key={i} item={item} />)
            : [...SHADES, ...SHADES].map((shade, i) => (
                <div
                  key={i}
                  className={styles.tile}
                  style={{ background: `linear-gradient(160deg, ${shade}, #0d0f14)` }}
                />
              ))}
        </div>
      </div>
      <div className={styles.overlay} aria-hidden />
      <div className={styles.grain} aria-hidden />

      <div className={styles.inner}>
      <div className={styles.content}>
        <div className={styles.eyebrow}>{hero.eyebrow}</div>
        <h1 className={styles.name}>
          {hero.name.map((line, i) => (
            <span key={i} className={styles.line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <div className={styles.tagline}>{hero.tagline}</div>
        <p className={styles.bio}>
          {hero.bio.map((seg, i) =>
            seg.hi ? (
              <span key={i} className={styles.hi}>
                {seg.text}
              </span>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </p>
        <div className={styles.cta}>
          <a href={hero.cta.primary.href} className={styles.btnPrimary}>
            {hero.cta.primary.label}
          </a>
          <a
            href={hero.cta.ghost.href}
            className={styles.btnGhost}
            target="_blank"
            rel="noopener"
          >
            {hero.cta.ghost.label}
          </a>
        </div>
      </div>

      <div className={styles.photo} aria-hidden>
        <span>photo — tbd</span>
      </div>
      </div>

      <div className={styles.scrollHint} aria-hidden>
        <div className={styles.hintLabel}>{hero.scrollHint}</div>
        <div className={styles.bar} />
      </div>
    </section>
  );
}
