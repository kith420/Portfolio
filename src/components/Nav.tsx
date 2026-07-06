"use client";

import { useEffect, useRef, useState } from "react";
import Wordmark from "./Wordmark";
import styles from "./Nav.module.css";

const LINKS = [
  { id: "exp", label: "Experience" },
  { id: "comp", label: "Competitions" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Every scroll target on the page, in document order. Includes the hero so
// that "scrolled to the very top" resolves to no highlighted link.
const SECTION_IDS = ["hero", ...LINKS.map((l) => l.id)];

/**
 * Fixed top nav.
 *
 * A single scroll listener (rAF-coalesced, idle when not scrolling) drives three
 * things off live element geometry — no hard-coded viewport percentages:
 *   - `active`: which section currently sits under the nav (→ link highlight)
 *   - `light`: whether a warm/paper region (tagged `data-nav-tint="light"`)
 *     overlaps the nav, flipping the tint dark-on-light
 *   - `scrolled`: past the hero, so the bar can solidify + cast a shadow
 * A live Singapore clock fills the right slot, and a hamburger reveals the
 * links on narrow screens.
 */
export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const lockRef = useRef(0); // timestamp until which a clicked link stays pinned
  const selectRef = useRef<string | null>(null);
  const [active, setActive] = useState("hero");
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [clock, setClock] = useState("--:--:--");

  // Live SGT clock.
  useEffect(() => {
    const fmt = () => {
      try {
        const t = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Singapore",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setClock(`${t} SGT`);
      } catch {
        setClock("SGT");
      }
    };
    fmt();
    const id = window.setInterval(fmt, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Scroll-spy: active link + tint + solidify, all from one coalesced handler.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const navH = navRef.current?.offsetHeight ?? 64;
      const winH = window.innerHeight;
      const doc = document.documentElement;
      const atBottom = winH + window.scrollY >= doc.scrollHeight - 2;

      // A section becomes active once its top rises past a probe line ~a third
      // of the way down the viewport — not just under the nav. This matters
      // because the final sections (Contact is 72vh) can never scroll their
      // top up to the bar, so a line pinned to the nav would never reach them
      // and the previous link would stay lit. The probe sits well below where
      // an anchored click lands (scroll-padding-top), yet above the next
      // section's top, so clicks resolve to the clicked section.
      const line = Math.max(navH + 8, winH * 0.32);
      const band = navH * 0.5; // a point inside the bar

      let nextActive = SECTION_IDS[0];
      if (atBottom) {
        // Guarantee the very last section wins once the page bottoms out.
        nextActive = SECTION_IDS[SECTION_IDS.length - 1];
      } else {
        for (const id of SECTION_IDS) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) nextActive = id;
        }
      }

      // A fresh click pins its target while the smooth scroll settles, so the
      // link lights immediately and doesn't flicker through the sections it
      // scrolls past.
      if (Date.now() < lockRef.current && selectRef.current) {
        setActive(selectRef.current);
      } else {
        selectRef.current = null;
        setActive(nextActive);
      }

      let nextLight = false;
      document
        .querySelectorAll<HTMLElement>('[data-nav-tint="light"]')
        .forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top <= band && r.bottom >= band) nextLight = true;
        });
      setLight(nextLight);

      setScrolled(window.scrollY > 40);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // While the mobile panel is open: lock scroll + close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onNavClick = (id: string) => {
    selectRef.current = id;
    lockRef.current = Date.now() + 900;
    setActive(id);
    setOpen(false);
  };

  const navClass = [
    styles.nav,
    light ? styles.light : "",
    scrolled ? styles.scrolled : "",
    open ? styles.open : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav ref={navRef} className={navClass}>
        <a href="#hero" aria-label="Kith — home" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={active === l.id ? styles.activeLink : ""}
                onClick={() => onNavClick(l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.right}>
          <div className={styles.clock}>
            <span className={styles.pip} />
            <span>{clock}</span>
          </div>
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        id="nav-menu"
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        hidden={!open}
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={active === l.id ? styles.activeLink : ""}
                onClick={() => onNavClick(l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.panelClock}>
          <span className={styles.pip} />
          <span>{clock}</span>
        </div>
      </div>
    </>
  );
}
