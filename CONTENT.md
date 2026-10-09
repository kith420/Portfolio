# Portfolio content

Edit anything below and hand this file back. I'll port the changes into `src/content/*.ts`.

How to edit:

- Change text in place. Keep the headings and field labels (`Tagline:`, `Card line:` etc.) so I can map things back.
- `**bold**` = the accent-highlighted words on the site. Move, add or remove the bold freely.
- `[text](url)` = a link.
- `> GAP:` lines are things that are placeholder, missing or flagged. Delete the line once you've dealt with it.
- To add a project / role / competition, copy a whole block. To remove one, delete it. Order here = order on the site.

---

## Site metadata (browser tab + link previews)

- Title: Nathan Poernama — Kith
- Description: CS × Design portfolio. Engineer with a competitive-programming habit and a soft spot for computer graphics.

---

## 1. Hero

> GAP: tagline and bio were flagged as AI-sounding in design review. Rewrite in your own voice.
> GAP: background filmstrip is empty (currently a dark gradient). List any photos/videos you want drifting behind the hero.

- Eyebrow: Computer Science & Design — SUTD’27
- Name: Nathan / Keith P.
- Tagline: Ships code. Sweats pixels.
- Bio: Four internships deep, a competitive-programming habit, and a soft spot for **computer graphics**, sneakers, and the occasional **Gunpla build**.
- Primary button: View work
- Secondary button: LinkedIn → (https://www.linkedin.com/in/kith14)
- Background filmstrip:

---

## 2. Experience

- Section title: Where I've shipped.

> GAP: the title is marked as placeholder in the code.
> GAP: facts (dates, numbers, stacks) match the résumé, but the wording of every card line / overview / built paragraph is a draft. Rewrite whichever don't sound like you.

### 01 · Simular AI

- Role: Software Engineer Intern
- Dates: May 2026 – Present
- Location: Singapore
- Tech: Python, TypeScript, Meilisearch
- Card line: Building agent infra, search, and knowledge systems for [Sai](https://sai.work/), Simular's computer-use agent.
- Modal meta: AI Agents · 2026 · Singapore
- Overview: Sai is Simular's computer-use agent. I spent the summer building **its hands and senses**: how it searches the web, reads a page, finds things in its own workspace, and asks before it guesses. Most of it shipped.
- Card stat: 45× — smaller page context for the agent
- What I built (bullets):
  - **Web fetch** — cut the page context the agent reads by 45× on Wikipedia's Apollo 11 article, from 100,175 characters to 2,217. A fetch now returns a lazy page object instead of raw text: it opens on an outline capped at 4,000 characters, then the agent greps, reads, or asks the page a question, so context cost stopped scaling with page size.
  - **Web search** — built a search primitive on Exa's neural index so the agent skips the browser. 1.7× faster (16s vs 27.9s) with 36% fewer input tokens, across 21 queries and 3 graded runs. The index lags the live web, so recency queries fall back to the browser.
  - **Link walking** — for pages the search index never saw, the agent live-crawls a URL it constructs, hops through real resolved links, or crawls a page's neighbourhood in one call. Capped at 20 pages or 60 seconds, same-origin by default.
  - **Knowledge service** — wrote the founding tech design, then built idempotent ingestion across Slack, Gmail, Calendar, Drive, and GitHub and a semantic search REST API (BGE-M3) on FastAPI, Cloud Run, and Firestore.
  - **⌘K search** — one search across messages, workflows, drafts, and files. ~70K records indexed in a week on Meilisearch, with four ranked sources merged by reciprocal rank fusion.
  - **Choice cards** — a task can pause, ask the user, and resume, on desktop, iMessage/SMS, and Telegram. A lock stops two sessions answering the same prompt.
  - **And the rest** — 30 merged PRs over the summer. Beyond the features above: shareable session links, composer drafts that survive a reload or restart, and 11 smaller fixes, from a modal that silently no-opped in production builds to a CI runner pinned after a toolchain update broke untouched builds.
- Parked long write-up (NOT on the site; needs Simular's OK before publishing):
  - **Searching the web without a browser**
    - Every web search meant opening a browser in a VM and reading the screen. That was slow, and every snapshot cost tokens. I built three things: a search primitive on Exa's neural index, per-turn cost and latency capture, and a harness to race Exa against the browser. Only the first was the product.
    - I ran 21 queries over 3 graded runs. Exa answered **1.7× faster** (16s vs 27.9s), used **36% fewer input tokens**, and scored 8.71 vs 8.14 on relevance. Asked to find three people who do not exist, neither side invented a profile.
    - One conclusion I had to take back. Run 1 said Exa skewed senior: ask for an IC product manager, get Heads of Product. Runs 2 and 3 returned a real IC PM on that exact query, so I retracted it. The one clean loss was freshness. Exa's index lags the live web by 3 weeks to 6 months, so it still had the old employer for someone who changed jobs 3 weeks earlier. I shipped Exa by default, with a browser fallback for recency-worded queries.
  - **A page is not a string**
    - Search tells you where something is. It doesn't tell you what's on the page, so fetching came next. We raised the fetch ceiling from 100K to 1,000,000 characters, and at that size printing a page's text dumps a million characters of context from one property access.
    - I swapped the string for a lazy page object. Its default view is an outline capped at 4,000 characters: a stats header, the opening, and the headings. From there the agent greps to locate a passage, reads to expand it, or just asks the page a question. Wikipedia's Apollo 11 article came out at 2,217 characters instead of 100,175. That is **45× smaller**, and the cost stopped scaling with page size.
    - Then it backfired. I made the object so opaque the agent couldn't use it: nothing to introspect meant nothing to discover, so the skill doc has to teach the methods. I also watched it fail twice. Once it sliced the tail off the outline and took the omitted headings for the end of the page. Once it noticed a clipped fetch, then rebuilt the missing section from memory instead of re-fetching. Both fixes went into the output itself, not the docs.
  - **When the index is not the web**
    - I tried to find a public repo through search. I knew it existed. I knew the handle. I had commits in it. Describing it returned ten repos like it and never the one. The rare handle failed, and so did pasting the exact URL into the query. It wasn't a phrasing problem. The page simply wasn't in the index.
    - So I stopped trying to search my way there and gave the agent enough links to walk. It can live-crawl a URL it constructs, hop through real resolved links, or crawl a page's neighbourhood in one call. Guardrails cap it at 20 pages or 60 seconds, keep a visited set, stay same-origin by default, and treat crawled text as untrusted. Search was the assignment. Knowing when not to search was the finding.
  - **⌘K: one search across everything**
    - You couldn't find your own conversations. Chats sat in a sidebar by title, so if you only remembered a phrase from inside a message, you scrolled and hoped. The first fix was one PR, 787 lines: ⌘K opens anywhere, searches every message in every workspace, and jumps to the message, not just the chat.
    - Then it kept earning the next PR. About 8 PRs and 12k lines later it covers messages, workflows, drafts, and files in one blended tab, and the agent can call it too. Indexing took a week: **~70K records** on Meilisearch.
    - Blending was the hard bit. Four sources each rank within themselves, so a chat's 0.8 and a file's 0.8 mean different things. Reciprocal rank fusion throws the scores away and keeps the ranks. Raw fusion still had the wrong instincts. At k=2 the newest result won every time, so I tuned it to k=10, bumped exact title matches, and made ties deterministic. A list that flickers is a list you cannot click.
  - **Asking instead of guessing**
    - "Book me a flight to San Jose." California, or Costa Rica? An agent that guesses is an agent you can't trust, so I shipped choice cards: the task pauses, asks, and resumes with your answer.
    - Then reality showed up. Telegram and iMessage have no buttons, so the options became a numbered list you reply to. A workflow and a chat could both ask at once, so two sessions needed a lock to stop them answering the same prompt.
    - And one I got wrong. I gave the API a free-text "Other" option. A Malay catch-all, Lain-lain, rendered as a dead duplicate pill beside the real text box, and we found it live. I could have detected catch-all labels in every language, shipped a list, missed one, and shipped another list forever. I deleted the option instead and gave every card a built-in free-text box.
  - **A memory for the company**
    - My intern project was to build the company a memory. I wrote the founding tech design, then the ingestion client and the search API on FastAPI, Cloud Run, and Firestore. It ingests **Slack, Gmail, Calendar, Drive, and GitHub**. Reads go two ways: exact filters by owner, tag, and time range, or natural language over self-hosted BGE-M3 embeddings.
    - Running it twice must change nothing. Pipelines get re-run, by retries, by backfills, by people. So each record is keyed by its own stable ID: run it a hundred times and there is still one Tuesday standup.
    - The service was the easy part. Slack user IDs are per-workspace, so a wrong guess tags a colleague's DMs as your own. Now it skips the workspace when it can't tell who you are. GitHub and Gmail filter by date, so a 24-hour window starting at 11:15 silently lost the morning. And channel search doesn't return thread replies, so a reply I wrote with no @mention just vanished.
- Detail image: simular/team-collage.jpg (closing figure, caption: The Simular team.)
- Photo: simular-team.jpg (alt: The Simular team)

### 02 · AggieWorks

- Role: Software Engineer
- Dates: Jan 2026 – Mar 2026
- Location: UC Davis, California
- Tech: React Native, Hono, Drizzle
- Card line: Shipped UI features for [RoomU](https://roomu.aggieworks.org/), a roommate-finding app for 40,000+ UC Davis students.
- Modal meta: Campus App · 2026 · UC Davis, California
- Overview: Shipped features on **RoomU**, a housing and roommate-discovery app used by 190+ students day to day, where the person filing the bug report was often three rows behind me in lecture.
- What I built: An applied-filters bar and confirmation dialog in React Native (NativeWind + Reanimated), plus RoomU's **app-versioning system end to end** — a REST API on Hono/Drizzle, a TanStack Query hook, and an animated update modal to keep every client on the same version.
- Photo: aggieworks-team.jpg (alt: The AggieWorks team in front of a snowy cabin)

### 03 · TCS Pace Port

- Role: AI Research & Innovation Intern
- Dates: Sep 2025 – Dec 2025
- Location: Singapore
- Tech: PyTorch, React, LangChain
- Card line: Tackled 3 projects across robotics, full-stack, and applied AI: a Misty II robot, a booking system, and a RAG chatbot.
- Modal meta: Innovation Lab · 2025 · Singapore
- Overview: Worked across **three projects** at TCS's Pace Port innovation lab, spanning robotics, full-stack, and applied AI: a personality framework for a Misty II robot, a meeting room booking system, and a RAG chatbot.
- What I built (bullets):
  - **Misty II robot** — a custom personality framework in PyTorch, OpenCV, and YOLO. Cut response time from 7s to 3s by optimizing frame processing, and built face tracking plus idle behaviors (wave greetings, backtracking search, jokes, sleeping, grumbling) so the robot stays present between interactions. Demoed to Toyota and UBS.
  - **Booking system** — led a full-stack meeting room booking app for 50+ staff (React, Node.js, PostgreSQL on GCP). 30+ REST API endpoints covering auth, bookings, admin approvals, and email notifications, with transactional constraints so concurrent requests can't claim the same slot. Guided 3 teammates through weekly code reviews.
  - **RAG chatbot** — built with LangChain, grounding LLM responses in indexed internal docs and real-time database checks.
- Photo: tcs-team.jpg (alt: The TCS Pace Port team)

### 04 · NTT Data Inc

- Role: Frontend Engineer Intern
- Dates: Jun 2024 – Aug 2024
- Location: Jakarta, Indonesia
- Tech: React, Next.js, TypeScript, Tailwind CSS
- Card line: Learned React from scratch, then fixed shared UI in REGLA IFRS 9, NTT's compliance platform for banks.
- Modal meta: Frontend · 2024 · Jakarta, Indonesia
- Overview: My first engineering internship. Learned **JavaScript, React, and Next.js from scratch**, then contributed UI fixes to REGLA IFRS 9, NTT's compliance platform for banks.
- What I built (bullets):
  - **Shared layout fixes** — fixed sidebar menus that opened behind page content, and reworked the dashboard grid and cards for tablet and desktop widths.
  - **Responsive toolbar** — table actions now collapse to icon-only buttons on smaller screens.
  - **Team workflow** — worked in agile sprints with about ten developers, merging through GitLab with enforced lint and commit checks.
- Photo: ntt-team.jpg (alt: The NTT DATA team)
- Modal image: ntt/regla-login.jpg (caption: REGLA's sign-in screen.)

### 05 · KokoCoder

- Role: Competitive Programming Coach (C++ & Python)
- Dates: Jun 2023 – Feb 2025
- Location: Jakarta, Indonesia · Remote
- Tech: C++, Python, Algorithms
- Card line: Spent 300+ hours coaching high-schoolers for Indonesia's National Olympiad in Informatics.
- Modal meta: CP Coach · 2023–2025 · Remote
- Overview: Coached high-school students preparing for Indonesia's **National Olympiad in Informatics** (NOI) — a national contest with ~20,000 participants a year.
- What I built: 300+ hours of lectures and problem-solving sessions, plus custom problem sets and mock contests — the org's students collectively took **19 of 30 medals at NOI 2023**.
- Photo: kokocoder-team.jpg (alt: The KokoCoder team)

---

## 3. Work

- Section title: What I've dropped.

### Cut the Crap

- One-liner: A browser extension that rewrites the corporate bloat on any page, or piles more on
- Tags: JavaScript, Manifest V3, LLM APIs, Vite
- Status: Shipped
- Year: 2026
- Description: A browser extension with one switch per site. Decrapify turns a 200-word LinkedIn humblebrag into "I got a new job." Crapify does the reverse. We built it at the Dumb Duber Dumber Hackathon, placed 3rd, then shipped it to both browser stores.
- Highlights:
  - 3rd place at the Dumb Duber Dumber Hackathon
  - Content-hashed cache, so repeated text never reaches the paid model twice
  - Viewport-first queue: blocks you scroll to jump ahead of off-screen ones
- Image captions:
  - a Reddit post, before and after
  - the per-site mode switch and lifetime stats
  - promo banner
- Links:
  - [Chrome Web Store](https://chromewebstore.google.com/detail/cut-the-crap/hfaognddjjlmadcmnbdenkfpcgaifffl)
  - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/cut-the-crap/)
  - [GitHub](https://github.com/Sup3rFire/dum-duber-dumber-hackathon)

### SMRT Digital Twin

- One-liner: A live 3D train that points at the part that needs fixing, and explains why
- Tags: React, Three.js, FastAPI, Cloud Run
- Status: Shipped
- Year: 2026
- Description: Built by a team of 4 at the LTA NebulaX Hackathon. Drop a maintenance file onto the train and the fault shows up as a bubble on the exact component, with a plain explanation of what the model found. I built the full-stack integration layer and the 3D twin itself.
- Highlights:
  - 4 subsystem ML models surfaced on the train: physics-based, Rainflow fatigue, ensembles
  - Upload a case file and the camera flies to the top-ranked car of an 8-car consist
  - Live on Firebase Hosting, with a REST API backend on Cloud Run
- Image captions:
  - findings pinned to car 4
  - close-up of a flagged part
  - asking the Conductor
- Links:
  - [Live demo](https://smrt-digital-twin-2026.web.app/)
  - [GitHub](https://github.com/KidSmithy/nebulax_p3)

### RoomU

- One-liner: Roommate-finding app for 40,000+ UC Davis students, built with AggieWorks
- Tags: React Native, iOS, Docker, Hono, PostgreSQL
- Status: Shipped
- Year: 2026
- Description: Built with AggieWorks, UC Davis's student-run product studio, during my exchange. I shipped UI features in React Native and built the app's versioning system end to end.
- Highlights:
  - Reusable Applied Filters Bar and confirmation dialogs (NativeWind, Reanimated)
  - Full-stack semver versioning system with a REST API on Hono and Drizzle
  - In the hands of 190+ students
- Image captions:
  - profile, matches and chat
  - the lifestyle quiz
  - a sublease listing, your profile and onboarding
- Links:
  - [Visit RoomU](https://roomu.aggieworks.org/)

### Tappin' Queen

- One-liner: A Simon-style memory game in pure digital logic, with no CPU on the board
- Tags: FPGA, Lucid HDL, Alchitry Au, Digital Logic
- Status: Shipped
- Year: 2025
- Description: A memory game on an Alchitry Au FPGA, with no microcontroller and no soft CPU. Everything from the adder up is hand-written in Lucid HDL. Built for SUTD's Computation Structures course.
- Highlights:
  - 32-bit ALU from logic gates: adder, multiplier, shifter, comparator
  - 41-state control unit driving the datapath and register files
  - One 16-bit random draw per round, sliced into an 8-color sequence
- Image captions:
  - the arcade cabinet, CAD render
  - the built prototype
  - 41-state control unit
- Links:
  - [GitHub](https://github.com/kith420/50.002-1D)

### Ascenda Hotel Booking

> GAP: no images. The site shows a "screenshot coming" placeholder. Send screenshots (or tell me where they are) and captions.

- One-liner: Hotel search, map, and Stripe checkout for a travel loyalty platform
- Tags: React, Node.js, MySQL, Vitest
- Status: Shipped
- Year: 2025
- Description: A full-stack hotel booking system built on Ascenda's hotel data, with destination search, live pricing and Stripe checkout. My part was the interactive map and the account side of the backend.
- Highlights:
  - Map clustering that groups nearby hotels and splits apart as you zoom
  - Node.js/Express REST API on MySQL, with cascading deletes and role-based auth
  - 78% test coverage with Vitest and React Testing Library
- Image captions:
  - screenshot coming
- Links:
  - [Frontend](https://github.com/how2fps/esc-booking-frontend)
  - [Backend](https://github.com/how2fps/esc-booking-backend)

### TROC #33

> GAP: no images. The site shows a "screenshot coming" placeholder. Send screenshots (or tell me where they are) and captions.

- One-liner: Problems, tests, and editorials for an open programming contest with 300+ entrants
- Tags: C++, TCFrame, Algorithms, Problemsetting
- Status: Held
- Year: 2023
- Description: I was lead author of TOKI Regular Open Contest #33. I wrote the problems, their solutions and test suites, and the editorials people read after the contest ended.
- Highlights:
  - 300+ participants from around the world
  - Test data generated and checked with TCFrame
  - Editorials written alongside the problems
- Image captions:
  - screenshot coming
- Links:
  - [Contest page](https://tlx.toki.id/contests/troc-33)

---

## 4. Competitions

- Tape label: Competitions
- Section title: Where I've placed.
- Desktop hint: click a polaroid to flip it
- Mobile hints: tap to flip / swipe

> GAP: the notes on the polaroid backs are marked as placeholder in the code. Keep the ones that are yours, rewrite the rest.

### ICPC Asia Regional

- Polaroid label: ICPC Regionals
- Caption: Dec 2025 · Manila
- Result: First to Solve Award
- Back note: Got the first balloon before anyone else did, but the folding problem keeps me up at night sometimes.

### National Olympiad in Informatics (OSN/NOI)

- Polaroid label: OSN / NOI
- Caption: Oct 2022 · Indonesia
- Result: Gold Medalist (4th/20,877)
- Back note: The 2am Codeforces era ended here, yet it turned out to be good for more than medals.

### Meta Hacker Cup

- Polaroid label: Meta Hacker Cup
- Caption: 2023, 2024, 2025
- Result: Round 2 ×3 · best 1,087th
- Back note: Stayed up until 5 AM for 3 consecutive years just to get a T-shirt. Worth it.

### International Olympiad in Informatics (IOI) Team Selection

- Polaroid label: IOI Selection
- Caption: June 2023 · Indonesia
- Result: Final 14
- Back note: Top 4 go on to be the national IOI team for Indonesia that year.

### TCS CodeVita

- Polaroid label: TCS CodeVita
- Caption: 2025 · Global
- Result: Ranked 201/537,000+
- Back note: Officially recognized by Guinness World Records as the largest online programming competition.

---

## 5. Skills

- Section title: What I build with.

Top of the pyramid to bottom. Add, remove or reorder names.

- AI / ML: PyTorch, LangChain, Vertex AI ADK, RAG, Embeddings, OpenCV
- Languages: C / C++, Python, TS / JS, Java, SQL, Verilog / Lucid, Assembly
- Web & Databases: React, Next.js, Three.js, FastAPI, Node / Express, PostgreSQL, MySQL, Firestore, Meilisearch
- Practices & Tools: Git / GitHub, GitHub Actions, Docker, GCP, AWS, Linux, Vitest, Claude Code, Cursor

---

## 6. Contact

> GAP: the four definition lines are AI-drafted placeholders. Rewrite in your own voice.

- Section title: What's next.
- Headword: kith
- Pronunciation: /kɪθ/
- Definitions (text — small label):
  1. one’s friends and acquaintances. — noun · archaic
  2. from “Keith” — the ‘e’ never quite made it. — etymology
  3. @kith14, on just about every platform. — the internet
  4. no relation to the streetwear label. for the most part. — disambiguation
- Links:
  - Email: nathankeithp@gmail.com
  - LinkedIn: https://www.linkedin.com/in/kith14
  - GitHub: https://github.com/kith420
  - Codeforces: https://codeforces.com/profile/kith14
- Footer name: Nathan Keith Poernama
- Screen-reader line: kith: a nickname, from the middle name Keith. Nathan Keith Poernama.
