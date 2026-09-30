"use client";

import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiClaude,
  SiCplusplus,
  SiCursor,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiGithubactions,
  SiGooglecloud,
  SiLangchain,
  SiLinux,
  SiMeilisearch,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiThreedotjs,
  SiTypescript,
  SiVitest,
} from "react-icons/si";
import { FaAws, FaDatabase, FaJava } from "react-icons/fa";
import SectionHeading from "@/components/SectionHeading";
import { skillsHeading, skillTiers } from "@/content/skills";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import styles from "./Skills.module.css";

/** Data references icons by string key; this map keeps content JSX-free. */
const ICONS: Record<string, IconType> = {
  SiClaude,
  SiCplusplus,
  SiCursor,
  SiDocker,
  SiFastapi,
  SiFirebase,
  SiGit,
  SiGithubactions,
  SiGooglecloud,
  SiLangchain,
  SiLinux,
  SiMeilisearch,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpencv,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiThreedotjs,
  SiTypescript,
  SiVitest,
  FaAws,
  FaDatabase,
  FaJava,
};

export default function Skills() {
  const { ref, active: lit } = useRevealOnScroll<HTMLDivElement>({
    threshold: 0.12,
  });

  // Running index across all tiers so the reveal cascades top-left -> base.
  let step = 0;

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.wrap}>
        <SectionHeading classes={{ root: styles.secHead, title: styles.title }}>
          {skillsHeading.title}
        </SectionHeading>

        <div ref={ref} className={`${styles.pyramid} ${lit ? styles.lit : ""}`}>
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
