"use client";

import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "#exp", label: "Experience" },
  { href: "#comp", label: "Competitions" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

/**
 * Fixed top nav. The tint flips dark-on-light while the nav overlaps the warm
 * Work section (detected via a thin top-of-viewport IntersectionObserver band),
 * and a live Singapore clock fills the right slot (a quiet timezone flex — the
 * resolved answer to the Hero spec's "right nav element" open question).
 */
export default function Nav() {
  const [light, setLight] = useState(false);
  const [clock, setClock] = useState("—");

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

  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) return;
    // Root shrunk to a thin band at the very top: fires while Work sits under
    // the nav, regardless of how tall the section is.
    const io = new IntersectionObserver(
      ([entry]) => setLight(entry.isIntersecting),
      { rootMargin: "0px 0px -92% 0px" },
    );
    io.observe(work);
    return () => io.disconnect();
  }, []);

  return (
    <nav className={`${styles.nav} ${light ? styles.light : ""}`}>
      <a href="#hero" aria-label="Kith — home">
        <Wordmark />
      </a>
      <div className={styles.links}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className={styles.clock}>
        <span className={styles.pip} />
        <span>{clock}</span>
      </div>
    </nav>
  );
}
