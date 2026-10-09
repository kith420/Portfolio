import { ExperienceRole } from "./types";

/** Section heading copy (title is placeholder — spec §3.1). */
export const experienceHeading = {
  title: "Where I've shipped.",
};

/**
 * Facts reconciled against the actual resume: company, role, dates, location,
 * tech stacks, and the concrete metrics in overview/built are now accurate.
 * The prose *voice* (desc / overview / built wording) is a draft in the
 * section's tone — swap in your own words as needed. Add a `photo` per role
 * (drop the file in public/images/experience/) to fill the card's photo slot.
 * Array order = display order down the tree (matches resume: newest first).
 */
export const experience: ExperienceRole[] = [
  {
    num: "01",
    company: "SIMULAR AI (NVIDIA & FELICIS Backed)",
    logo: "SI",
    logoVariant: "simular",
    logoSrc: "/images/experience/simular.svg",
    location: "Singapore",
    role: "Software Engineer Intern",
    desc: [
      { text: "Building agent infra, search, and knowledge systems for " },
      { text: "Sai", href: "https://sai.work/" },
      // U+2011 non-breaking hyphen keeps "computer-use" on one line.
      { text: ", Simular's computer\u2011use agent." },
    ],
    tech: ["Python", "TypeScript", "Meilisearch"],
    year: "May 2026 – Present",
    photo: { src: "/images/experience/simular-team.jpg", alt: "The Simular team" },
    modal: {
      meta: "AI Agents · 2026 · Singapore",
      overview: [
        { text: "Sai is Simular's computer-use agent. I spent the summer building " },
        { text: "its hands and senses", hi: true },
        { text: ": how it searches the web, reads a page, finds things in its own workspace, and asks before it guesses. Most of it shipped." },
      ],
      points: [
        [
          { text: "Web fetch", hi: true },
          { text: " — cut the page context the agent reads by 45× on Wikipedia's Apollo 11 article, from 100,175 characters to 2,217. A fetch now returns a lazy page object instead of raw text: it opens on an outline capped at 4,000 characters, then the agent greps, reads, or asks the page a question, so context cost stopped scaling with page size." },
        ],
        [
          { text: "Web search", hi: true },
          { text: " — built a search primitive on Exa's neural index so the agent skips the browser. 1.7× faster (16s vs 27.9s) with 36% fewer input tokens, across 21 queries and 3 graded runs. The index lags the live web, so recency queries fall back to the browser." },
        ],
        [
          { text: "Link walking", hi: true },
          { text: " — for pages the search index never saw, the agent live-crawls a URL it constructs, hops through real resolved links, or crawls a page's neighbourhood in one call. Capped at 20 pages or 60 seconds, same-origin by default." },
        ],
        [
          { text: "Knowledge service", hi: true },
          { text: " — wrote the founding tech design, then built idempotent ingestion across Slack, Gmail, Calendar, Drive, and GitHub and a semantic search REST API (BGE-M3) on FastAPI, Cloud Run, and Firestore." },
        ],
        [
          { text: "⌘K search", hi: true },
          { text: " — one search across messages, workflows, drafts, and files. ~70K records indexed in a week on Meilisearch, with four ranked sources merged by reciprocal rank fusion." },
        ],
        [
          { text: "Choice cards", hi: true },
          { text: " — a task can pause, ask the user, and resume, on desktop, iMessage/SMS, and Telegram. A lock stops two sessions answering the same prompt." },
        ],
        [
          { text: "And the rest", hi: true },
          { text: " — 30 merged PRs over the summer. Beyond the features above: shareable session links, composer drafts that survive a reload or restart, and 11 smaller fixes, from a modal that silently no-opped in production builds to a CI runner pinned after a toolchain update broke untouched builds." },
        ],
      ],
      image: {
        src: "/images/experience/simular/team-collage.jpg",
        alt: "Collage of photos with the Simular team: dinners, a conference booth, a team outing, a Simular cake, and desk shots",
        caption: "The Simular team.",
      },
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
      { text: "Shipped UI features for " },
      { text: "RoomU", href: "https://roomu.aggieworks.org/" },
      { text: ", a roommate-finding app for 40,000+ UC Davis students." },
    ],
    tech: ["React Native", "Ios", "Hono", "Drizzle"],
    year: "Jan 2026 – Mar 2026",
    photo: {
      src: "/images/experience/aggieworks-team.jpg",
      alt: "The AggieWorks team in front of a snowy cabin",
      position: "50% 90%",
    },
    modal: {
      meta: "Campus App · 2026 · UC Davis, California",
      overview: [
        { text: "Shipped features on " },
        { text: "RoomU", hi: true },
        { text: ", a housing and roommate-discovery app used by 190+ students day to day, where the person filing the bug report was often three rows behind me in lecture." },
      ],
      built: [
        { text: "An applied-filters bar and confirmation dialog in React Native (NativeWind + Reanimated), plus RoomU's " },
        { text: "app-versioning system end to end", hi: true },
        { text: " — a REST API on Hono/Drizzle, a TanStack Query hook, and an animated update modal to keep every client on the same version." },
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
    role: "AI Research & Innovation Intern",
    desc: [{ text: "Tackled 3 projects across robotics, full-stack, and applied AI: a Misty II robot, a booking system, and a RAG chatbot." }],
    tech: ["PyTorch", "React", "LangChain"],
    year: "Sep 2025 – Dec 2025",
    photo: {
      src: "/images/experience/tcs-team.jpg",
      alt: "The TCS Pace Port team",
      position: "50% 72%",
    },
    modal: {
      meta: "Innovation Lab · 2025 · Singapore",
      overview: [
        { text: "Worked across " },
        { text: "three projects", hi: true },
        { text: " at TCS's Pace Port innovation lab, spanning robotics, full-stack, and applied AI: a personality framework for a Misty II robot, a meeting room booking system, and a RAG chatbot." },
      ],
      points: [
        [
          { text: "Misty II robot", hi: true },
          { text: " — a custom personality framework in PyTorch, OpenCV, and YOLO. Cut response time from 7s to 3s by optimizing frame processing, and built face tracking plus idle behaviors (wave greetings, backtracking search, jokes, sleeping, grumbling) so the robot stays present between interactions. Demoed to Toyota and UBS." },
        ],
        [
          { text: "Booking system", hi: true },
          { text: " — led a full-stack meeting room booking app for 50+ staff (React, Node.js, PostgreSQL on GCP). 30+ REST API endpoints covering auth, bookings, admin approvals, and email notifications, with transactional constraints so concurrent requests can't claim the same slot. Guided 3 teammates through weekly code reviews." },
        ],
        [
          { text: "RAG chatbot", hi: true },
          { text: " — built with LangChain, grounding LLM responses in indexed internal docs and real-time database checks." },
        ],
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
    desc: [{ text: "Learned React from scratch, then fixed shared UI in REGLA IFRS 9, NTT's compliance platform for banks." }],
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    year: "Jun 2024 – Aug 2024",
    photo: {
      src: "/images/experience/ntt-team.jpg",
      alt: "The NTT DATA team",
      position: "50% 62%",
    },
    modal: {
      meta: "Frontend · 2024 · Jakarta, Indonesia",
      overview: [
        { text: "My first engineering internship. Learned " },
        { text: "JavaScript, React, and Next.js from scratch", hi: true },
        { text: ", then contributed UI fixes to REGLA IFRS 9, NTT's compliance platform for banks." },
      ],
      points: [
        [
          { text: "Shared layout fixes", hi: true },
          { text: " — fixed sidebar menus that opened behind page content, and reworked the dashboard grid and cards for tablet and desktop widths." },
        ],
        [
          { text: "Responsive toolbar", hi: true },
          { text: " — table actions now collapse to icon-only buttons on smaller screens." },
        ],
        [
          { text: "Team workflow", hi: true },
          { text: " — worked in agile sprints with about ten developers, merging through GitLab with enforced lint and commit checks." },
        ],
      ],
      image: {
        src: "/images/experience/ntt/regla-login.jpg",
        alt: "REGLA's sign-in screen: a username field beside an isometric illustration of people working around servers and a chip",
        caption: "REGLA's sign-in screen.",
      },
    },
  },
  {
    num: "05",
    company: "KOKOCODER",
    logo: "KC",
    logoVariant: "koko",
    logoSrc: "/images/experience/kokocoder.svg",
    location: "Jakarta, Indonesia",
    role: "Competitive Programming Coach (C++ & Python)",
    desc: [{ text: "Spent 300+ hours coaching high-schoolers for Indonesia's National Olympiad in Informatics." }],
    tech: ["C++", "Python", "Algorithms"],
    year: "Jun 2023 – Feb 2025",
    photo: {
      src: "/images/experience/kokocoder-team.jpg",
      alt: "The KokoCoder team",
      position: "50% 85%",
    },
    modal: {
      meta: "CP Coach · 2023–2025 · Remote",
      overview: [
        { text: "Coached high-school students preparing for Indonesia's " },
        { text: "National Olympiad in Informatics", hi: true },
        { text: " (NOI) — a national contest with ~20,000 participants a year." },
      ],
      built: [
        { text: "300+ hours of lectures and problem-solving sessions, plus custom problem sets and mock contests — the org's students collectively took " },
        { text: "19 of 30 medals at NOI 2023", hi: true },
        { text: "." },
      ],
    },
  },
];