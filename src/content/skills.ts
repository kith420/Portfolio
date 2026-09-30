import { SkillTier } from "./types";

/** Section heading copy. */
export const skillsHeading = {
  title: "What I build with.",
};

/**
 * Mirrors the Skills section of the résumé. Tiers run APEX -> BASE (top to
 * bottom) so the widths step up (6, 7, 9, 9) into a pyramid that narrows to
 * the AI/ML point. Within each tier, skills keep the résumé's order.
 *
 * `color` is the real brand hex, used ONLY for the hover colour-flash; every
 * tile sits monochrome (accent) at rest. Skills with no clean logo render as
 * text monograms via `mono`.
 */
export const skillTiers: SkillTier[] = [
  {
    label: "AI / ML",
    skills: [
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C" },
      { name: "LangChain", icon: "SiLangchain", color: "#ffffff" },
      { name: "Vertex AI ADK", icon: "SiGooglecloud", color: "#4285F4" },
      { name: "RAG", mono: "RAG" },
      { name: "Embeddings", mono: "EMB" },
      { name: "OpenCV", icon: "SiOpencv", color: "#5C3EE8" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { name: "C / C++", icon: "SiCplusplus", color: "#00599C" },
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "TS / JS", icon: "SiTypescript", color: "#3178C6" },
      { name: "Java", icon: "FaJava", color: "#E76F00" },
      { name: "SQL", icon: "FaDatabase", color: "#6baed6" },
      { name: "Verilog / Lucid", mono: "HDL" },
      { name: "Assembly", mono: "ASM" },
    ],
  },
  {
    label: "Web & Databases",
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#ffffff" },
      { name: "Three.js", icon: "SiThreedotjs", color: "#ffffff" },
      { name: "FastAPI", icon: "SiFastapi", color: "#009688" },
      { name: "Node / Express", icon: "SiNodedotjs", color: "#5FA04E" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1" },
      { name: "MySQL", icon: "SiMysql", color: "#4479A1" },
      { name: "Firestore", icon: "SiFirebase", color: "#FFCA28" },
      { name: "Meilisearch", icon: "SiMeilisearch", color: "#FF5CAA" },
    ],
  },
  {
    label: "Practices & Tools",
    skills: [
      { name: "Git / GitHub", icon: "SiGit", color: "#F05032" },
      { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF" },
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "GCP", icon: "SiGooglecloud", color: "#4285F4" },
      { name: "AWS", icon: "FaAws", color: "#FF9900" },
      { name: "Linux", icon: "SiLinux", color: "#FCC624" },
      { name: "Vitest", icon: "SiVitest", color: "#6E9F18" },
      { name: "Claude Code", icon: "SiClaude", color: "#D97757" },
      { name: "Cursor", icon: "SiCursor", color: "#ffffff" },
    ],
  },
];
