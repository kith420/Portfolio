import { WorkProject } from "./types";

export const workHeading = {
  title: "What I've dropped.",
};

/**
 * Projects in priority order (array order = slot order; slot 1 leads).
 * Facts come from the résumé and each project's README. Images live in
 * public/images/work/; a figure without `src` shows the tinted placeholder.
 */
export const work: WorkProject[] = [
  {
    name: "Cut the Crap",
    tag: "A browser extension that rewrites the corporate bloat on any page, or piles more on",
    tags: ["JavaScript", "Manifest V3", "LLM APIs", "Vite"],
    status: "Shipped",
    year: "2026",
    desc: "A browser extension with one switch per site. Decrapify turns a 200-word LinkedIn humblebrag into \"I got a new job.\" Crapify does the reverse. We built it at the Dumb Duber Dumber Hackathon, placed 3rd, then shipped it to both browser stores.",
    hi: [
      "3rd place at the Dumb Duber Dumber Hackathon",
      "Content-hashed cache, so repeated text never reaches the paid model twice",
      "Viewport-first queue: blocks you scroll to jump ahead of off-screen ones",
    ],
    figures: [
      {
        caption: "a Reddit post, before and after",
        src: "/images/work/cut-the-crap-before-after.jpg",
        position: "50% 0%",
      },
      {
        caption: "the per-site mode switch and lifetime stats",
        src: "/images/work/cut-the-crap-popup.jpg",
        position: "50% 0%",
      },
      {
        caption: "promo banner",
        src: "/images/work/cut-the-crap-banner.jpg",
        fit: "contain",
        bg: "#c9e3ee",
      },
    ],
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chromewebstore.google.com/detail/cut-the-crap/hfaognddjjlmadcmnbdenkfpcgaifffl",
      },
      {
        label: "Firefox Add-ons",
        href: "https://addons.mozilla.org/en-US/firefox/addon/cut-the-crap/",
      },
      {
        label: "GitHub",
        href: "https://github.com/Sup3rFire/dum-duber-dumber-hackathon",
        secondary: true,
      },
    ],
  },
  {
    name: "SMRT Digital Twin",
    tag: "A live 3D train that points at the part that needs fixing, and explains why",
    tags: ["React", "Three.js", "FastAPI", "Cloud Run"],
    status: "Shipped",
    year: "2026",
    desc: "Built by a team of 4 at the LTA NebulaX Hackathon. Drop a maintenance file onto the train and the fault shows up as a bubble on the exact component, with a plain explanation of what the model found. I built the full-stack integration layer and the 3D twin itself.",
    hi: [
      "4 subsystem ML models surfaced on the train: physics-based, Rainflow fatigue, ensembles",
      "Upload a case file and the camera flies to the top-ranked car of an 8-car consist",
      "Live on Firebase Hosting, with a REST API backend on Cloud Run",
    ],
    figures: [
      {
        caption: "findings pinned to car 4",
        src: "/images/work/smrt-twin-train.jpg",
        position: "50% 55%",
      },
      {
        caption: "close-up of a flagged part",
        src: "/images/work/smrt-twin-closeup.jpg",
      },
      {
        caption: "asking the Conductor",
        src: "/images/work/smrt-twin-conductor.jpg",
      },
    ],
    links: [
      { label: "Live demo", href: "https://smrt-digital-twin-2026.web.app/" },
      {
        label: "Demo video",
        href: "https://www.youtube.com/watch?v=UMJg3YVWSgY",
      },
      {
        label: "GitHub",
        href: "https://github.com/KidSmithy/nebulax_p3",
        secondary: true,
      },
    ],
  },
  {
    name: "RoomU",
    tag: "Roommate-finding app for 40,000+ UC Davis students, built with AggieWorks",
    tags: ["React Native", "iOS", "Docker", "Hono", "PostgreSQL"],
    status: "Shipped",
    year: "2026",
    desc: "Built with AggieWorks, UC Davis's student-run product club, during my spring exchange. My contributions:",
    hi: [
      "Reusable Applied Filters Bar and confirmation dialogs (NativeWind, Reanimated)",
      "Full-stack semver versioning system with a REST API on Hono and Drizzle",
      "Extended the filter bar to the subleasing listings feed (in review)",
    ],
    figures: [
      {
        caption: "profile, matches and chat",
        src: "/images/work/roomu-screens.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
      {
        caption: "the lifestyle quiz",
        src: "/images/work/roomu-quiz.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
      {
        caption: "a roommate profile",
        src: "/images/work/roomu-profile.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
    ],
    links: [{ label: "Visit RoomU", href: "https://roomu.aggieworks.org/" }],
  },
  {
    name: "Tappin' Queen",
    tag: "A Simon-style memory game in pure digital logic, with no CPU on the board",
    tags: ["FPGA", "Lucid HDL", "Alchitry Au", "Digital Logic"],
    status: "Shipped",
    year: "2025",
    desc: "A memory game on an Alchitry Au FPGA, with no microcontroller and no soft CPU. Everything from the adder up is hand-written in Lucid HDL. Built for SUTD's Computation Structures course.",
    hi: [
      "32-bit ALU from logic gates: adder, multiplier, shifter, comparator",
      "41-state control unit driving the datapath and register files",
      "One 16-bit random draw per round, sliced into an 8-color sequence",
    ],
    figures: [
      {
        caption: "the arcade cabinet, CAD render",
        src: "/images/work/tappin-queen-cabinet.jpg",
        fit: "contain",
        bg: "#000",
      },
      {
        caption: "the built prototype",
        src: "/images/work/tappin-queen-prototype.jpg",
      },
      {
        caption: "41-state control unit",
        src: "/images/work/tappin-queen-fsm.jpg",
        fit: "contain",
        bg: "#fff",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/kith420/50.002-1D" }],
  },
  {
    name: "Ascenda Hotel Booking",
    tag: "Hotel search, map, and Stripe checkout for a travel loyalty platform",
    tags: ["React", "Node.js", "MySQL", "Vitest"],
    status: "Shipped",
    year: "2025",
    desc: "A full-stack hotel booking system built on Ascenda's hotel data, with destination search, live pricing and Stripe checkout. My part was the interactive map and the account side of the backend.",
    hi: [
      "Map clustering that groups nearby hotels and splits apart as you zoom",
      "Node.js/Express REST API on MySQL, with cascading deletes and role-based auth",
      "78% test coverage with Vitest and React Testing Library",
    ],
    figures: [
      {
        caption: "hotel listings with the clustered map",
        src: "/images/work/ascenda-listings.jpg",
        position: "50% 0%",
      },
      {
        caption: "destination search",
        src: "/images/work/ascenda-search.jpg",
        position: "50% 60%",
      },
      {
        caption: "rooms and live prices",
        src: "/images/work/ascenda-rooms.jpg",
        position: "50% 0%",
      },
    ],
    links: [
      {
        label: "Frontend",
        href: "https://github.com/how2fps/esc-booking-frontend",
      },
      {
        label: "Backend",
        href: "https://github.com/how2fps/esc-booking-backend",
        secondary: true,
      },
    ],
  },
  {
    name: "TROC #33",
    tag: "Problems, tests, and editorials for an open programming contest with 300+ entrants",
    tags: ["C++", "TCFrame", "Algorithms", "Problemsetting"],
    status: "Held",
    year: "2023",
    desc: "I was lead author of TOKI Regular Open Contest #33. I wrote the problems, their solutions and test suites, and the editorials people read after the contest ended.",
    hi: [
      "300+ participants from around the world",
      "Test data generated and checked with TCFrame",
      "Editorials written alongside the problems",
    ],
    figures: [
      {
        caption: "the contest page on TLX",
        src: "/images/work/troc-33-overview.jpg",
        position: "50% 0%",
      },
      {
        caption: "the final scoreboard",
        src: "/images/work/troc-33-scoreboard.jpg",
        position: "50% 0%",
      },
      {
        caption: "editorials, published after the contest",
        src: "/images/work/troc-33-editorial.jpg",
        position: "50% 0%",
      },
    ],
    links: [
      { label: "Contest page", href: "https://tlx.toki.id/contests/troc-33" },
    ],
  },
];
