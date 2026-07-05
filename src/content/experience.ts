import { ExperienceRole } from "./types";

/** Section heading copy (title is placeholder — spec §3.1). */
export const experienceHeading = {
  eyebrow: "// 02 — experience",
  titleLead: "Where I've ",
  titleAccent: "shipped.",
};

/**
 * Facts reconciled against the actual resume: company, role, dates, location,
 * tech stacks, and the concrete metrics in overview/built are now accurate.
 * The prose *voice* (desc / overview / built wording and the thinkingNote lines)
 * is a draft in the section's tone — swap in your own words as needed.
 * The thinking-note component/tone is final; its content is not (spec §8).
 * Array order = display order down the tree (matches resume: newest first).
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
      { text: "Built an " },
      { text: "institutional-AI knowledge layer", hi: true },
      { text: " on Simular's Sai agent platform — company activity across Slack, Gmail, Drive and more, made queryable in plain English." },
    ],
    tech: ["Python", "FastAPI", "React"],
    year: "May 2026 – Present",
    modal: {
      meta: "AI Agents · 2026 · Singapore",
      overview: [
        { text: "Built a company-wide " },
        { text: "knowledge layer", hi: true },
        { text: " on top of Simular's Sai agent platform — a FastAPI service and a three-skill suite ingesting structured activity across Slack, Gmail, Calendar, Drive, and GitHub so 38 employees can query the whole org in natural language." },
      ],
      thinkingNote:
        "A search box that can't tell 'no results' from 'the backend broke' quietly teaches people to stop trusting it.",
      built: [
        { text: "The knowledge layer end to end — a Python/FastAPI service on Cloud Run (Firestore, GCS, dual-token auth) — plus a Cmd+K cross-workspace search palette and a long-context LLM chat prototype where " },
        { text: "prompt caching cut input tokens ~60%", hi: true },
        { text: "." },
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
    role: "Software Engineer",
    desc: [
      { text: "Shipped features to " },
      { text: "RoomU", hi: true },
      { text: ", a React Native housing + roommate app used by 190+ students on campus — fast feedback, faster iteration." },
    ],
    tech: ["React Native", "Hono", "Drizzle"],
    year: "Jan 2026 - Mar 2026",
    modal: {
      meta: "Campus App · 2026 · UC Davis, California",
      overview: [
        { text: "Shipped features on " },
        { text: "RoomU", hi: true },
        { text: ", a housing and roommate-discovery app used by 190+ students day to day, where the person filing the bug report was often three rows behind me in lecture." },
      ],
      thinkingNote:
        "You learn fast when the person filing the bug report sits three rows behind you in lecture.",
      built: [
        { text: "An applied-filters bar and confirmation dialog in React Native (NativeWind + Reanimated), plus RoomU's " },
        { text: "app-versioning system end to end", hi: true },
        { text: " — a Hono/Drizzle backend, a TanStack Query hook, and an animated update modal to keep every client on the same version." },
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
    role: "SWE Intern",
    desc: [
      { text: "Cut a " },
      { text: "Misty II robot's", hi: true },
      { text: " response time from 7s to 3s and gave it a personality — inside TCS's Pace Port innovation lab." },
    ],
    tech: ["PyTorch", "OpenCV", "React"],
    year: "Sep 2025 - Dec 2025",
    modal: {
      meta: "Innovation Lab · 2025 · Singapore",
      overview: [
        { text: "Prototyped inside TCS's Pace Port innovation lab — most memorably a " },
        { text: "Misty II robot", hi: true },
        { text: " whose response time I cut from 7s to 3s, with a custom AI personality framework (face tracking, idle behaviors) demoed to Toyota and UBS." },
      ],
      thinkingNote:
        "A robot that takes seven seconds to react doesn't read as slow — it reads as broken. Three seconds and it feels alive.",
      built: [
        { text: "A Misty II personality framework in " },
        { text: "PyTorch / OpenCV / YOLO", hi: true },
        { text: ", plus a full-stack booking system for 50+ staff in six weeks (React/Node/Postgres, 30+ endpoints, double-booking prevention) and a LangChain RAG chatbot grounded in internal docs." },
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
      { text: "Shipped " },
      { text: "React / Next.js UI", hi: true },
      { text: " for REGLA — NTT's flagship IFRS compliance platform, serving banks like MUFG and Bank Mandiri." },
    ],
    tech: ["React", "Next.js", "TypeScript"],
    year: "Jun 2024 - Aug 2024",
    modal: {
      meta: "Frontend · 2024 · Jakarta, Indonesia",
      overview: [
        { text: "Shipped production " },
        { text: "React / Next.js UI", hi: true },
        { text: " for REGLA, NTT's flagship IFRS 7/9/15/16 compliance platform — the regulatory-reporting software that banks like MUFG, JTrust, and Bank Mandiri file against." },
      ],
      thinkingNote:
        "A wrong number on an IFRS report isn't a bug — it's an audit finding.",
      built: [
        { text: "Front-end work on REGLA's " },
        { text: "regulatory-reporting flows", hi: true },
        { text: " — the React/Next.js compliance screens behind IFRS 7/9/15/16 filings for enterprise banking clients." },
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
      { text: " — 180+ hours of algorithms, data structures, and contest craft." },
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
        { text: "180+ hours of lectures and problem-solving sessions, plus custom problem sets and mock contests — the org's students collectively took " },
        { text: "19 of 30 medals at NOI 2023", hi: true },
        { text: "." },
      ],
    },
  },
];