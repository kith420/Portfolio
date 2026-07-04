import { ExperienceRole } from "./types";

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
    location: "Singapore",
    role: "AI Agents",
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
    location: "UC Davis, California",
    role: "Campus Tools",
    desc: [
      { text: "Built " },
      { text: "student-facing web tools", hi: true },
      { text: " shipped to real users on campus — fast feedback, faster iteration." },
    ],
    tech: ["React", "Node.js", "PostgreSQL"],
    year: "2023",
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
    company: "NTT DATA",
    logo: "NT",
    logoVariant: "ntt",
    location: "Jakarta, Indonesia",
    role: "Backend",
    desc: [
      { text: "First taste of " },
      { text: "production backend work", hi: true },
      { text: " — data models, APIs, and the discipline of shipping." },
    ],
    tech: ["Java", "SQL", "REST"],
    year: "2022",
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
];
