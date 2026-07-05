import { ExperienceRole } from "./types";

/** Section heading copy (title is placeholder — spec §3.1). */
export const experienceHeading = {
  eyebrow: "// 02 — experience",
  titleLead: "Where I've ",
  titleAccent: "shipped.",
};

/**
 * PLACEHOLDER COPY — roles, tech stacks, dates, modal overview/build text and
 * the "thinking note" lines are all illustrative (02-experience-section-spec.md
 * §8). The thinking-note component/tone is final; its content is not.
 * Array order = display order down the tree.
 */
export const experience: ExperienceRole[] = [
  {
    num: "01",
    company: "SIMULAR AI",
    logo: "SI",
    logoVariant: "simular",
    logoSrc: "/images/experience/simular.svg",
    location: "Singapore",
    role: "SWE Intern",
    desc: [
      { text: "Worked on " },
      { text: "autonomous computer-use agents", hi: true },
      { text: " — reliability, recovery, and the messy middle of long action chains." },
    ],
    tech: ["Python", "TypeScript", "Docker"],
    year: "2024",
    modal: {
      meta: "AI Agents · 2024 · Singapore",
      overview: [
        { text: "Built and hardened parts of an " },
        { text: "autonomous agent", hi: true },
        { text: " that drives real desktop software — the interesting problems all live in recovery and long-horizon reliability." },
      ],
      thinkingNote:
        "What does a good 'undo' look like when an agent has already taken 40 steps?",
      built: [
        { text: "Instrumentation and replay tooling for agent runs, plus guardrails that let a run " },
        { text: "fail softly and recover", hi: true },
        { text: " rather than wedge." },
      ],
    },
  },
  {
    num: "02",
    company: "AGGIEWORKS",
    logo: "AW",
    logoVariant: "aggie",
    logoSrc: "/images/experience/aggieworks.svg",
    location: "UC Davis, California",
    role: "SWE for RoomU",
    desc: [
      { text: "Built " },
      { text: "student-facing web tools", hi: true },
      { text: " shipped to real users on campus — fast feedback, faster iteration." },
    ],
    tech: ["React", "Node.js", "PostgreSQL"],
    year: "Jan 2026 - Mar 2026",
    modal: {
      meta: "Campus Tools · 2023 · UC Davis, California",
      overview: [
        { text: "Shipped features on a product used by " },
        { text: "students every day", hi: true },
        { text: ", where the person filing the bug report was often three rows behind me in lecture." },
      ],
      thinkingNote:
        "You learn fast when the person filing the bug report sits three rows behind you in lecture.",
      built: [
        { text: "Full-stack features end to end — React front ends against a " },
        { text: "Node + Postgres", hi: true },
        { text: " backend, with the reliability real users demand." },
      ],
    },
  },
  {
    num: "03",
    company: "TCS PACE PORT",
    logo: "TC",
    logoVariant: "tcs",
    logoSrc: "/images/experience/tcs.svg",
    location: "Singapore",
    role: "Enterprise",
    desc: [
      { text: "Prototyped inside an innovation lab — " },
      { text: "enterprise-scale services", hi: true },
      { text: " and the constraints that shape them." },
    ],
    tech: ["Java", "Spring", "AWS"],
    year: "2023",
    modal: {
      meta: "Enterprise · 2023 · Singapore",
      overview: [
        { text: "Prototyped inside a corporate innovation lab, where the hard part was less the code and more the " },
        { text: "constraints of scale", hi: true },
        { text: " and integration." },
      ],
      thinkingNote:
        "A prototype that ignores the org chart never ships.",
      built: [
        { text: "Service prototypes on a " },
        { text: "Java / Spring", hi: true },
        { text: " stack deployed to AWS, tuned for enterprise integration paths." },
      ],
    },
  },
  {
    num: "04",
    company: "NTT DATA INC",
    logo: "NT",
    logoVariant: "ntt",
    logoSrc: "/images/experience/ntt.svg",
    location: "Jakarta, Indonesia",
    role: "Frontend Engineer Intern",
    desc: [
      { text: "First taste of " },
      { text: "production backend work", hi: true },
      { text: " — data models, APIs, and the discipline of shipping." },
    ],
    tech: ["Java", "SQL", "REST"],
    year: "Jun 2024 - Aug 2024",
    modal: {
      meta: "Backend · 2022 · Jakarta, Indonesia",
      overview: [
        { text: "My first taste of " },
        { text: "production backend work", hi: true },
        { text: " — where a schema decision follows you around for months." },
      ],
      thinkingNote:
        "The first time a migration scares you is the first time you actually understand the data.",
      built: [
        { text: "Data models and " },
        { text: "REST APIs", hi: true },
        { text: " on a Java/SQL stack, and the shipping discipline that comes with a real codebase." },
      ],
    },
  },
  {
    num: "05",
    company: "KOKOCODER",
    logo: "KC",
    logoVariant: "koko",
    logoSrc: "/images/experience/kokocoder.svg",
    location: "Jakarta, Indonesia · Remote",
    role: "Competitive Programming Coach (C++ & Python)",
    desc: [
      { text: "Coached high-schoolers for Indonesia's " },
      { text: "National Olympiad in Informatics", hi: true },
      { text: " — 300+ hours of algorithms, data structures, and contest craft." },
    ],
    tech: ["C++", "Python", "Algorithms"],
    year: "2023–25",
    modal: {
      meta: "CP Coach · 2023–2025 · Remote",
      overview: [
        { text: "Coached high-school students preparing for Indonesia's " },
        { text: "National Olympiad in Informatics", hi: true },
        { text: " (NOI) — a national contest with ~20,000 participants a year." },
      ],
      thinkingNote:
        "You don't really understand an algorithm until you've had to teach it to someone at 11pm before a contest.",
      built: [
        { text: "300+ hours of lectures and problem-solving sessions, plus custom problem sets and mock contests — the org's students collectively took " },
        { text: "19 of 30 medals at NOI 2023", hi: true },
        { text: "." },
      ],
    },
  },
];
