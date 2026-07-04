"use client";

import { useCallback, useEffect, useRef } from "react";
import { contact } from "@/content/contact";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import styles from "./Contact.module.css";

const DEFS = contact.definitions;

export default function Contact() {
  const reduced = useReducedMotion();
  const defRef = useRef<HTMLSpanElement>(null);
  const srcRef = useRef<HTMLParagraphElement>(null);
  const running = useRef(false);
  const timer = useRef<number | null>(null);
  const srcTimer = useRef<number | null>(null);

  // Typewriter state machine (spec §4.4): type → hold → erase → pause → next.
  // A single `running` flag + timer handle guard against a second concurrent
  // loop when the reveal re-fires.
  const stop = useCallback(() => {
    running.current = false;
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (srcTimer.current !== null) {
      window.clearTimeout(srcTimer.current);
      srcTimer.current = null;
    }
  }, []);

  const run = useCallback(() => {
    const defEl = defRef.current;
    const srcEl = srcRef.current;
    if (!defEl || !srcEl) return;
    let i = 0;
    running.current = true;

    const typeDef = () => {
      if (!running.current) return;
      const cur = DEFS[i];
      srcEl.style.opacity = "0";
      srcTimer.current = window.setTimeout(() => {
        if (!running.current) return;
        srcEl.textContent = cur.s;
        srcEl.style.opacity = "1";
      }, 120);

      let pos = 0;
      const erase = () => {
        if (!running.current) return;
        let len = cur.d.length;
        const back = () => {
          if (!running.current) return;
          defEl.textContent = cur.d.slice(0, len--);
          if (len >= 0) {
            timer.current = window.setTimeout(back, 22);
          } else {
            i = (i + 1) % DEFS.length;
            timer.current = window.setTimeout(typeDef, 280);
          }
        };
        back();
      };
      const type = () => {
        if (!running.current) return;
        defEl.textContent = cur.d.slice(0, pos++);
        timer.current = window.setTimeout(
          pos <= cur.d.length ? type : erase,
          pos <= cur.d.length ? 45 : 2000,
        );
      };
      type();
    };

    typeDef();
  }, []);

  const { ref, active } = useRevealOnScroll<HTMLElement>({
    threshold: 0.35,
    onEnter: () => {
      if (reduced) {
        if (defRef.current) defRef.current.textContent = DEFS[0].d;
        if (srcRef.current) srcRef.current.textContent = DEFS[0].s;
        return;
      }
      stop();
      if (defRef.current) defRef.current.textContent = "";
      run();
    },
    onExit: () => {
      if (reduced) return;
      stop();
      if (defRef.current) defRef.current.textContent = "";
    },
  });

  useEffect(() => stop, [stop]);

  return (
    <section
      ref={ref}
      id="contact"
      className={`${styles.contact} ${active ? styles.in : ""}`}
      aria-label="Contact"
    >
      <div className={styles.eyebrow}>{contact.eyebrow}</div>
      <h2 className={styles.title}>
        <span className={styles.line}>
          <span>
            {contact.title.lead}
            <span className={styles.accent}>{contact.title.accent}</span>
          </span>
        </span>
      </h2>

      <div className={styles.entry}>
        <div className={styles.head}>
          <span className={styles.w}>{contact.headword}</span>
          &nbsp;
          <span className={styles.ipa}>{contact.ipa}</span>
        </div>
        <p className={styles.def} aria-hidden="true">
          <span ref={defRef} />
          <span className={styles.cursor} />
        </p>
        <p className={styles.src} ref={srcRef} aria-hidden="true" />
        <span className="sr-only">{contact.srLine}</span>
      </div>

      <div className={styles.links}>
        {contact.links.map((link) => {
          const external = !link.href.startsWith("mailto:");
          return (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.ariaLabel}
              title={link.ariaLabel}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={link.svgPath} />
              </svg>
            </a>
          );
        })}
      </div>

      <div className={styles.foot}>{contact.footer}</div>
    </section>
  );
}
