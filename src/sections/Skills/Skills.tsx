"use client";

import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiPytorch,
  SiLangchain,
  SiOpencv,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiExpo,
  SiPython,
  SiTypescript,
  SiCplusplus,
  SiHtml5,
  SiNodedotjs,
  SiPostgresql,
  SiFirebase,
  SiMysql,
  SiBun,
  SiDrizzle,
  SiHono,
  SiDocker,
  SiGooglecloud,
  SiGit,
  SiGithubactions,
  SiLinux,
  SiVitest,
  SiTestinglibrary,
} from "react-icons/si";
import { FaJava, FaDatabase, FaAws } from "react-icons/fa";
import SectionHeading from "@/components/SectionHeading";
import { skillsHeading, skillTiers } from "@/content/skills";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import styles from "./Skills.module.css";

/** Data references icons by string key; this map keeps content JSX-free. */
const ICONS: Record<string, IconType> = {
  SiPytorch,
  SiLangchain,
  SiOpencv,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiExpo,
  SiPython,
  SiTypescript,
  SiCplusplus,
  SiHtml5,
  SiNodedotjs,
  SiPostgresql,
  SiFirebase,
  SiMysql,
  SiBun,
  SiDrizzle,
  SiHono,
  SiDocker,
  SiGooglecloud,
  SiGit,
  SiGithubactions,
  SiLinux,
  SiVitest,
  SiTestinglibrary,
  FaJava,
  FaDatabase,
  FaAws,
};

export default function Skills() {
  const { ref, active: lit } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.12,
  });
  const total = skillTiers.reduce((n, t) => n + t.skills.length, 0);

  // Running index across all tiers so the reveal cascades top-left -> base.
  let step = 0;

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.wrap}>
        <SectionHeading
          eyebrow={skillsHeading.eyebrow}
          count={`${total} tools`}
          classes={{
            root: styles.secHead,
            eyebrow: styles.eyebrow,
            title: styles.title,
            count: styles.count,
          }}
        >
          {skillsHeading.titleLead}
          <span className={styles.ac}>{skillsHeading.titleAccent}</span>
        </SectionHeading>

        <div ref={ref} className={`${styles.pyramid} ${lit ? styles.lit : ""}`}>
          <div className={styles.spine} aria-hidden />
          {skillTiers.map((tier) => (
            <div key={tier.label} className={styles.tier}>
              <div className={styles.tierLabel}>{tier.label}</div>
              <div className={styles.tiles}>
                {tier.skills.map((s) => {
                  const Icon = s.icon ? ICONS[s.icon] : null;
                  const delay = step++ * 40;
                  const tileStyle = s.color
                    ? ({ "--brand": s.color } as CSSProperties)
                    : undefined;
                  const inner = Icon ? (
                    <Icon className={styles.icon} aria-hidden />
                  ) : (
                    <span className={styles.mono}>{s.mono}</span>
                  );
                  return (
                    <div
                      key={s.name}
                      className={styles.tileWrap}
                      style={{ transitionDelay: `${delay}ms` }}
                    >
                      {s.href ? (
                        <a
                          className={styles.tile}
                          style={tileStyle}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${s.name} — official site`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className={styles.tile} style={tileStyle}>
                          {inner}
                        </div>
                      )}
                      <div className={styles.cap}>{s.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
