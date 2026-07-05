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
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C", href: "https://pytorch.org" },
      { name: "LangChain", icon: "SiLangchain", color: "#ffffff", href: "https://www.langchain.com" },
      { name: "RAG", mono: "RAG", href: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation" },
      { name: "OpenCV", icon: "SiOpencv", color: "#5C3EE8", href: "https://opencv.org" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { name: "React", icon: "SiReact", color: "#61DAFB", href: "https://react.dev" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#ffffff", href: "https://nextjs.org" },
      { name: "React Native", icon: "SiReact", color: "#61DAFB", href: "https://reactnative.dev" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", href: "https://tailwindcss.com" },
      { name: "Expo", icon: "SiExpo", color: "#ffffff", href: "https://expo.dev" },
      { name: "NativeWind", mono: "NW", href: "https://www.nativewind.dev" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { name: "Python", icon: "SiPython", color: "#3776AB", href: "https://www.python.org" },
      { name: "JS / TS", icon: "SiTypescript", color: "#3178C6", href: "https://www.typescriptlang.org" },
      { name: "Java", icon: "FaJava", color: "#E76F00", href: "https://www.java.com" },
      { name: "C / C++", icon: "SiCplusplus", color: "#00599C", href: "https://isocpp.org" },
      { name: "SQL", icon: "FaDatabase", color: "#6baed6", href: "https://en.wikipedia.org/wiki/SQL" },
      { name: "HTML / CSS", icon: "SiHtml5", color: "#E34F26", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node / Express", icon: "SiNodedotjs", color: "#5FA04E", href: "https://nodejs.org" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#4169E1", href: "https://www.postgresql.org" },
      { name: "Firebase", icon: "SiFirebase", color: "#FFCA28", href: "https://firebase.google.com" },
      { name: "MySQL", icon: "SiMysql", color: "#4479A1", href: "https://www.mysql.com" },
      { name: "Bun", icon: "SiBun", color: "#FBF0DF", href: "https://bun.sh" },
      { name: "Drizzle", icon: "SiDrizzle", color: "#C5F74F", href: "https://orm.drizzle.team" },
      { name: "Hono", icon: "SiHono", color: "#E36002", href: "https://hono.dev" },
    ],
  },
  {
    label: "DevOps & Tools",
    skills: [
      { name: "Docker", icon: "SiDocker", color: "#2496ED", href: "https://www.docker.com" },
      { name: "AWS", icon: "FaAws", color: "#FF9900", href: "https://aws.amazon.com" },
      { name: "GCP", icon: "SiGooglecloud", color: "#4285F4", href: "https://cloud.google.com" },
      { name: "Git", icon: "SiGit", color: "#F05032", href: "https://git-scm.com" },
      { name: "GitHub Actions", icon: "SiGithubactions", color: "#2088FF", href: "https://github.com/features/actions" },
      { name: "Linux", icon: "SiLinux", color: "#FCC624", href: "https://www.kernel.org" },
      { name: "Vitest", icon: "SiVitest", color: "#6E9F18", href: "https://vitest.dev" },
      { name: "Testing Library", icon: "SiTestinglibrary", color: "#E33332", href: "https://testing-library.com" },
    ],
  },
];
