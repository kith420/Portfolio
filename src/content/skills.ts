import { SkillTier } from "./types";

/** Section heading copy. */
export const skillsHeading = {
  eyebrow: "// skills",
  titleLead: "What I ",
  titleAccent: "build with.",
};

/**
 * Tiers run APEX -> BASE (top to bottom) so the widths step up (4, 6, 6, 7, 8)
 * into a pyramid that narrows to the AI/ML point — the thing the stack builds
 * toward. Within each tier, skills run most-relevant -> least (left to right),
 * since recruiters scan the left edge first.
 *
 * `color` is the real brand hex, used ONLY for the hover colour-flash; every
 * tile sits monochrome (accent) at rest. Skills with no clean logo (RAG,
 * NativeWind) render as text monograms via `mono`.
 */
export const skillTiers: SkillTier[] = [
  {
    label: "AI / ML",
    skills: [
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C" },
      { name: "LangChain", icon: "SiLangchain", color: "#ffffff" },
      { name: "RAG", mono: "RAG" },
      { name: "OpenCV", icon: "SiOpencv", color: "#5C3EE8" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#ffffff" },
      { name: "React Native", icon: "SiReact", color: "#61DAFB" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
      { name: "Expo", icon: "SiExpo", color: "#ffffff" },
      { name: "NativeWind", mono: "NW" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "JS / TS", icon: "SiTypescript", color: "#3178C6" },
      { name: "Java", icon: "FaJava", color: "#E76F00" },
      { name: "C / C++", icon: "SiCplusplus", color: "#00599C" },
      { name: "SQL", icon: "FaDatabase", color: "#6baed6" },
      { name: "HTML / CSS", icon: "SiHtml5", color: "#E34F26" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node / Express", icon: "SiNodedotjs", color: "#5FA04E" },
      { name: "FastAPI", icon: "SiFastapi", color: "#009688" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1" },
      { name: "Firebase", icon: "SiFirebase", color: "#FFCA28" },
      { name: "MySQL", icon: "SiMysql", color: "#4479A1" },
      { name: "Bun", icon: "SiBun", color: "#FBF0DF" },
      { name: "Drizzle", icon: "SiDrizzle", color: "#C5F74F" },
      { name: "Hono", icon: "SiHono", color: "#E36002" },
    ],
  },
  {
    label: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: "SiDocker", color: "#2496ED" },
      { name: "AWS", icon: "FaAws", color: "#FF9900" },
      { name: "GCP", icon: "SiGooglecloud", color: "#4285F4" },
      { name: "Git", icon: "SiGit", color: "#F05032" },
      { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF" },
      { name: "Linux", icon: "SiLinux", color: "#FCC624" },
      { name: "Vite", icon: "SiVite", color: "#646CFF" },
      { name: "Vitest", icon: "SiVitest", color: "#6E9F18" },
      { name: "Playwright", mono: "PW" },
    ],
  },
];
