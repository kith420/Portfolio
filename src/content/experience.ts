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
    company: "SIMULAR (NVIDIA & FELICIS Backed)",
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
    tech: ["Python", "TypeScript", "FastAPI", "GCP", "AI Agents"],
    year: "May 2026 – Present",
    photo: { src: "/images/experience/simular-team.jpg", alt: "The Simular team" },
    modal: {
      meta: "AI Agents · 2026 · Singapore",
      overview: [
        { text: "Sai is Simular's computer-use agent. I've been building " },
        { text: "its hands and senses", hi: true },
        { text: ": how it searches the web, reads a page, finds things in its own workspace, and asks before it guesses." },
      ],
      gallery: [
        {
          src: "/images/experience/simular/team-collage.jpg",
          alt: "Collage of photos with the Simular team: dinners, a conference booth, a team outing, a Simular cake, and desk shots",
          caption: "A small collage I built documenting key moments for my end-of-summer presentation.",
        },
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
      { text: "Joined the 8-person team behind " },
      { text: "RoomU", href: "https://roomu.aggieworks.org/" },
      { text: ", a roommate-finding app for 40,000+ UC Davis students, and merged my first PR in week one." },
    ],
    tech: ["React Native", "TypeScript", "Hono", "Drizzle"],
    year: "Jan 2026 – Mar 2026",
    photo: {
      src: "/images/experience/aggieworks-team.jpg",
      alt: "The AggieWorks team in front of a snowy cabin",
      position: "50% 90%",
    },
    modal: {
      meta: "Campus App · 2026 · UC Davis, California",
      overview: [
        { text: "AggieWorks is UC Davis's student-run product club. I joined for one quarter while on exchange, on the 8-person team behind " },
        { text: "RoomU", hi: true },
        { text: ", a roommate-finding app for the university's 40,000+ students." },
      ],
      gallery: [
        {
          src: "/images/experience/aggieworks/photoshoot.jpg",
          alt: "The AggieWorks club in a group photo under a row of trees on campus, standing and sitting cross-legged on the road, most of them laughing at each other",
          caption: "Winter 2026",
        },
      ],
      sections: [
        {
          title: "My quarter there",
          body: [
            [
              { text: "Merged my first PR in week one, then built the app's versioning system and a reusable filter bar. " },
              { text: "See the RoomU project", href: "#project-roomu" },
              { text: " for the details. The rest were experiences with the team: a 2 night retreat at Lake Tahoe, a bunch of socials, and a team photoshoot. Definitely a memorable way to spend my time during exchange!" },
            ],
          ],
        },
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
    desc: [{ text: "Tackled 4 projects across robotics, full-stack, and applied AI: a Misty II robot, a booking system, an AI video avatar, and a RAG chatbot." }],
    tech: ["PyTorch", "LangChain", "React", "Node.js", "PostgreSQL"],
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
        { text: "four projects", hi: true },
        { text: " at TCS's Pace Port innovation lab, spanning robotics, full-stack, and applied AI: a personality framework for a Misty II robot, a booking system for customer visits, a real-time AI video avatar, and a RAG chatbot." },
      ],
      gallery: [
        {
          src: "/images/experience/tcs/misty-face-tracking.jpg",
          alt: "A white Misty II robot on a meeting-room table, turned to face a seated colleague, while a laptop beside it shows the robot's camera feed of him",
          caption: "Working on optimizing the Misty II's face tracking feature.",
        },
        {
          src: "/images/experience/tcs/booking-admin.jpg",
          alt: "The booking app's admin dashboard: a VIP customers strip, a week calendar with approved, pending and blocked visits in green, yellow and brown, and a list of visits waiting for approval with Approve and Reject buttons",
          caption: "The booking app's admin dashboard mocked with made-up customers.",
        },
        {
          src: "/images/experience/tcs/booking-request.jpg",
          alt: "The booking app's request form, titled Pace Port Registration Form, with fields for the customer, industry and visit details",
          caption: "The booking form staff fill in.",
          position: "50% 0%",
        },
        {
          src: "/images/experience/tcs/tavus-demo.jpg",
          alt: "A photo of a screen showing the test app, titled Tavus AI Conversation: a video call with a lifelike AI avatar of a man in a zip-up jumper, and my own camera in the corner",
          caption: "The Tavus avatar in my test app.",
        },
        {
          src: "/images/experience/tcs/team-seniors.jpg",
          alt: "Six of us standing in a row in front of the plant wall at the TCS Pace Port office",
          caption: "Last day of my 4 month internship.",
          // The group stands left of centre, under a lot of ceiling.
          position: "0% 100%",
          zoom: 1.11,
        },
      ],
      sections: [
        {
          title: "Misty II robot",
          body: [[{ text: "A custom personality framework in PyTorch, OpenCV, and YOLO. Cut response time from 7s to 3s by optimizing frame processing, and built face tracking plus idle behaviors (wave greetings, backtracking search, jokes, sleeping, grumbling) so the robot stays present between interactions. Demoed to Toyota and UBS." }]],
        },
        {
          title: "Booking system",
          body: [
            [
              { text: "Led 4 teammates", hi: true },
              { text: " building a full-stack app for booking customer visits to the Pace Port, used by 50+ staff. I designed the API, the database schema, the frontend, and the Docker setup, then ran weekly code reviews." },
            ],
            [
              { text: "Staff request a slot, admins approve or block out dates, and the lab's chatbot checks availability through the same API. " },
              { text: "30+ REST endpoints", hi: true },
              { text: " on React, Node.js, and PostgreSQL on GCP. Transactional constraints stop two requests claiming the same slot." },
            ],
          ],
        },
        {
          title: "AI video avatar",
          body: [[{ text: "Tested five real-time avatar platforms for the Pace Port website's chatbot in a React and Node.js test app, and picked Tavus for the lowest latency. Built an OpenAI-to-Gemini format converter so it could run on Gemini. Demoed it to the head of Pace Port in week three, who approved it for future projects." }]],
        },
        {
          title: "RAG chatbot",
          body: [[{ text: "Built with LangChain, grounding LLM responses in indexed internal docs and real-time database checks." }]],
        },
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
    desc: [
      { text: "Spent 300+ hours at " },
      { text: "Kokocoder", href: "https://kokocoder.com/" },
      { text: " coaching high-schoolers for Indonesia's National Olympiad in Informatics." },
    ],
    tech: ["C++", "Python", "Data Structures & Algorithms"],
    year: "Jun 2023 – Feb 2025",
    photo: {
      src: "/images/experience/kokocoder-team.jpg",
      alt: "The KokoCoder team",
      position: "50% 85%",
    },
    modal: {
      meta: "CP Coach · 2023–2025 · Jakarta, Indonesia",
      overview: [
        { text: "Coached high-school students for Indonesia's " },
        { text: "National Olympiad in Informatics", hi: true },
        { text: " (NOI), a national contest with ~20,000 participants a year. The org's students took " },
        { text: "19 of 30 medals at NOI 2023", hi: true },
        { text: "." },
      ],
      points: [
        [
          { text: "Daily virtual contests", hi: true },
          { text: " — started a daily virtual contest for students heading into the NOI national round, and about 50 took part. I compiled 20 five-hour, NOI-style contests from oj.uz, TLX, Codeforces, and CodeChef. Then I led a team of 3 to rewrite the statements and editorials in English with new character names and wording, so nobody could paste a sentence into a search engine and find the original. Each night we went through the problems on Zoom." },
        ],
        [
          { text: "Knight Camp 3.0", hi: true },
          { text: " — Kokocoder's 2023 camp, a week in Lembang where students trained from morning to night. I was a supporting coach for the red class: the 12 strongest of our students competing in the NOI finals." },
        ],
        [
          { text: "Teaching", hi: true },
          { text: " — 300+ hours of lectures and problem-solving sessions in C++ and Python." },
        ],
      ],
    },
  },
];