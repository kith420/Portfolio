import { WorkProject } from "./types";

export const workHeading = {
  title: "What I've dropped.",
};

/**
 * Projects in priority order (array order = slot order; slot 1 leads).
 * Facts come from the résumé and each project's README. Images live in
 * public/images/work/; a figure without `src` shows the tinted placeholder,
 * and one with `video` plays that clip over its image, so that image should
 * be a frame from the clip.
 */
/** The card's mat colour (--work-surface), behind clips that are shown whole. */
const MAT = "#e8e4da";

export const work: WorkProject[] = [
  {
    name: "SMRT Digital Twin",
    tag: "AI tool that analyzes maintenance logs and flags faulty parts on a live 3D SMRT train",
    tags: [
      "TypeScript",
      "Three.js",
      "Python",
      "FastAPI",
      "GCP",
      "React",
      "Docker",
    ],
    status: "Semifinalist",
    medal: "plain",
    year: "2026",
    desc: "Built by a team of 4 at the LTA NebulaX Hackathon. Drop a maintenance file onto the train and the fault shows up as a bubble on the exact component. I built the full-stack integration layer and the 3D twin itself.",
    hi: [
      "4 subsystem ML models surfaced on the train: physics-based, Rainflow fatigue, ensembles",
      "The camera flies to the top-ranked car of an 8-car consist",
      "Live on Firebase Hosting, with a REST API backend on Cloud Run",
    ],
    figures: [
      {
        alt: "a case file, from upload to diagnosis",
        src: "/images/work/smrt-twin-demo.jpg",
        video: "/images/work/smrt-twin-demo.mp4",
        fit: "contain",
        bg: MAT,
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
    name: "CareKaki",
    tag: "An AI care assistant that builds a parent's care plan, then acts on it",
    tags: [
      "Next.js",
      "FastAPI",
      "OpenAI API",
      "Docker",
      "TypeScript",
      "React",
      "Python",
    ],
    status: "Top-5 Finalist",
    medal: "plain",
    year: "2026",
    desc: "Built by a team of 4 for the Dell InnovateDash Hackathon, then reworked for the Codex for Healthcare Hackathon. Tell AiMao, a panda care companion, what's going on with a parent, and it builds a care plan from scattered community-care services. Approve it, and agents alert family on Telegram, find nursing and check medications. I built the design system and most of the screens, the Guardian safety layer, and the Docker setup.",
    hi: [
      "Top 5 at Dell InnovateDash; semifinalist at Codex for Healthcare (OpenAI × A*STAR)",
      "Guardian masks NRICs and phone numbers, flags medical advice, and holds risky actions for approval",
      "Runs in English, 中文 and Bahasa Melayu, with a spoken guide (ElevenLabs)",
    ],
    figures: [
      {
        alt: "from AiMao's greeting, to a chat message that updates the care profile, through the care plan to the care brief",
        src: "/images/work/carekaki-demo.jpg",
        video: "/images/work/carekaki-demo.mp4",
        fit: "contain",
        bg: MAT,
      },
      {
        alt: "the chat, with the care profile filling in alongside it",
        src: "/images/work/carekaki-chat.jpg",
        position: "50% 0%",
      },
      {
        alt: "the care plan's week at a glance and progress charts",
        src: "/images/work/carekaki-plan.jpg",
        position: "50% 0%",
      },
      {
        alt: "the care brief, handed over to a care coordinator",
        src: "/images/work/carekaki-brief.jpg",
        position: "50% 0%",
      },
    ],
    links: [
      { label: "Live demo", href: "https://aimao.vercel.app/" },
      {
        label: "GitHub",
        href: "https://github.com/stormragemc/CareKaki-repo",
        secondary: true,
      },
    ],
  },
  {
    name: "Tappin' Queen",
    tag: "Simon, the memory game, rebuilt on an FPGA from raw logic gates with a twist",
    tags: [
      "FPGA",
      "Lucid HDL",
      "Computer Architecture",
      "Digital Logic",
    ],
    status: "Shipped",
    year: "2025",
    desc: "Runs on an Alchitry Au FPGA. Everything from the adder up is hand-written in Lucid HDL. Built for SUTD's Computation Structures course.",
    hi: [
      "32-bit ALU from logic gates: adder, multiplier, shifter, comparator",
      "41-state control unit driving the datapath and register files",
      "One 16-bit random draw per round, sliced into an 8-color sequence",
    ],
    figures: [
      {
        alt: "how a round works: one random number, sliced into moves, then played",
        src: "/images/work/tappin-queen-explainer.jpg",
        video: "/images/work/tappin-queen-explainer.mp4",
        fit: "contain",
        bg: "#000",
      },
      {
        alt: "the built prototype",
        src: "/images/work/tappin-queen-prototype.jpg",
      },
      {
        alt: "the control unit's state machine",
        src: "/images/work/tappin-queen-fsm.jpg",
        fit: "contain",
        bg: "#fff",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/kith420/50.002-1D" }],
  },
  {
    name: "Cut the Crap",
    // A non-breaking space keeps the emoji on the punchline's line.
    tag: "Turns LinkedIn humblebrags into “I got a new job.” Or the reverse\u00a0💩",
    tags: [
      "JavaScript",
      "LLM APIs",
      "Chrome Extension",
      "Manifest V3",
    ],
    status: "3rd Place",
    medal: "bronze",
    year: "2026",
    desc: "One switch per site. Decrapify turns a 200-word LinkedIn humblebrag into \"I got a new job.\" Crapify does the reverse. You can plug in your own LLM.",
    hi: [
      "3rd place at the Dumb Duber Dumber Hackathon",
      "Content-hashed cache to block repeated text from reaching the paid model twice",
      "Viewport-first queue: whatever is on your screen gets rewritten first",
    ],
    figures: [
      {
        alt: "the extension cutting a Reddit post down, then piling it back on",
        src: "/images/work/cut-the-crap-demo.jpg",
        video: "/images/work/cut-the-crap-demo.mp4",
        fit: "contain",
        bg: MAT,
      },
      {
        alt: "a Reddit post, before and after",
        src: "/images/work/cut-the-crap-before-after.jpg",
        position: "50% 0%",
      },
      {
        alt: "the per-site mode switch and lifetime stats",
        src: "/images/work/cut-the-crap-popup.jpg",
        position: "50% 0%",
      },
      {
        alt: "promo banner",
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
        href: "https://github.com/Sup3rFire/cut-the-crap",
        secondary: true,
      },
    ],
  },
  {
    name: "RoomU",
    tag: "A roommate-matching app for 40,000+ UC Davis students",
    tags: [
      "TypeScript",
      "React Native",
      "PostgreSQL",
      "Hono",
      "iOS",
      "Docker",
    ],
    status: "Shipped",
    year: "2026",
    desc: "Take a lifestyle and personality quiz, then get matched with people you could actually live with and chat with them in the app! Subleases also get their own feed. I joined the 8-person team behind it at AggieWorks, the university's student-run product club: designers, engineers and marketers. What I added to an app that was already running:",
    hi: [
      "Built the app's semver versioning system full-stack, with its own REST API (Drizzle)",
      "Filter bar and confirmation dialogs, built as reusable components (NativeWind, Reanimated)",
      "That filter bar again, extended to the sublease feed (in review)",
    ],
    figures: [
      {
        alt: "profile, matches and chat",
        src: "/images/work/roomu-screens.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
      {
        alt: "the lifestyle quiz",
        src: "/images/work/roomu-quiz.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
      {
        alt: "a sublease listing, your profile and onboarding",
        src: "/images/work/roomu-onboarding.jpg",
        fit: "contain",
        bg: "#eceaf7",
      },
    ],
    links: [{ label: "Visit RoomU", href: "https://roomu.aggieworks.org/" }],
  },
  {
    name: "Ascenda Hotel Booking",
    tag: "A full-stack hotel booking site, from map search to Stripe checkout",
    tags: [
      "TypeScript",
      "React",
      "Node.js",
      "MySQL",
      "Vitest",
      "Docker",
      "Express",
      "AWS",
    ],
    status: "Shipped",
    year: "2025",
    desc: "A full-stack booking system built on Ascenda's hotel data. My part was the interactive map and the account side of the backend.",
    hi: [
      "Map clustering that groups nearby hotels and splits apart as you zoom",
      "Node.js/Express REST API on MySQL, with cascading deletes and role-based auth",
      "78% test coverage with Vitest and React Testing Library",
    ],
    figures: [
      {
        alt: "hotel listings with the clustered map",
        src: "/images/work/ascenda-listings.jpg",
        position: "50% 0%",
      },
      {
        alt: "destination search",
        src: "/images/work/ascenda-search.jpg",
        position: "50% 60%",
      },
      {
        alt: "rooms and live prices",
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
    name: "kNow",
    tag: "Social media on a map: see everything posted nearby in the last 24 hours",
    tags: [
      "Java",
      "Android",
      "CameraX",
      "Google Maps",
      "Firebase",
    ],
    status: "Honorable Mention",
    medal: "plain",
    year: "2025",
    desc: "Built by a team of 5 for SUTD's Information Systems & Programming course. Snap a photo or a short video, and it lands on a live map as a story others nearby can open, follow you from, and get walking directions to. I built the explore map and the Firebase backend.",
    hi: [
      "4th of 45 teams at the SUTD InfoSys–Singtel Awards",
      "Clustered story markers, kept live by Firestore listeners, with category, place and user search",
      "Walking routes drawn from your location to any story (Directions API)",
    ],
    figures: [
      {
        alt: "posting a sunset at SUTD, finding food stories in the city, then walking to one",
        src: "/images/work/know-demo.jpg",
        video: "/images/work/know-demo.mp4",
        fit: "contain",
        bg: MAT,
      },
      {
        alt: "snapping a photo, the city's stories on the map, and one opened",
        src: "/images/work/know-screens.jpg",
        fit: "contain",
        bg: "#eceee9",
      },
      {
        alt: "captioning a post and picking its category",
        src: "/images/work/know-post.jpg",
        fit: "contain",
        bg: "#eceee9",
      },
      {
        alt: "the new post, pinned where it was taken",
        src: "/images/work/know-posted.jpg",
        fit: "contain",
        bg: "#eceee9",
      },
      {
        alt: "only food stories, after the Food filter",
        src: "/images/work/know-filter.jpg",
        fit: "contain",
        bg: "#eceee9",
      },
      {
        alt: "walking directions to a story",
        src: "/images/work/know-route.jpg",
        fit: "contain",
        bg: "#eceee9",
      },
    ],
    links: [{ label: "GitHub", href: "https://github.com/ChimJohn/kNow" }],
  },
  {
    name: "TROC #33",
    tag: "Problems for an international coding contest: 320 entrants, only 6 solved all",
    tags: [
      "Competitive Programming",
      "C++",
      "TCFrame",
      "Data Structures & Algorithms",
    ],
    status: "Held",
    year: "2023",
    desc: "I was one of the lead authors of TOKI Regular Open Contest #33, a recurring online competitive programming contest from the NOI/IOI Indonesian Alumni (TOKI).",
    hi: [
      "My problems ranged from DP to sweep line to centroid decomposition",
      "Contestants from about 20 countries, including Japan, China, India and the US",
      "Only 6 solved all eight problems, and all 6 were red-rated",
    ],
    figures: [
      {
        alt: "the contest page on TLX",
        src: "/images/work/troc-33-overview.jpg",
        position: "50% 0%",
      },
      {
        alt: "the final scoreboard",
        src: "/images/work/troc-33-scoreboard.jpg",
        position: "50% 0%",
      },
      {
        alt: "editorials, published after the contest",
        src: "/images/work/troc-33-editorial.jpg",
        position: "50% 0%",
      },
    ],
    links: [
      { label: "Contest page", href: "https://tlx.toki.id/contests/troc-33" },
    ],
  },
];
