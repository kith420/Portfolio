import { Competition } from "./types";

/** Section heading + mobile hint copy. */
export const competitionsHeading = {
  tape: "Competitions",
  title: "Where I've placed.",
  desktopHint: "click a polaroid to flip it",
  hintFlip: "tap to flip",
  hintSwipe: "swipe",
};

/**
 * Desktop scatter positions + tilts + back notes ported from the flow
 * prototype (source of truth for placement/motion). Back body copy is
 * placeholder (competitions-section-spec.md §11, §14).
 * Array order = source order.
 */
export const competitions: Competition[] = [
  {
    name: "ICPC Asia Regional",
    fullName: "ICPC Asia Regional",
    label: "ICPC Regionals",
    caption: "Dec 2025 · Manila",
    result: "First to Solve Award",
    note: "Got the first balloon before anyone else did, but the folding problem keeps me up at night sometimes.",
    pin: "red",
    tilt: -6,
    pos: { left: 16, top: 60, z: 2 },
    photo: {
      src: "/images/competitions/icpc-manila.jpg",
      alt: "Nathan and a teammate on stage at ICPC Asia-Manila 2025, holding their First to Solve certificates",
    },
  },
  {
    name: "NOI",
    fullName: "National Olympiad in Informatics (OSN/NOI)",
    label: "OSN / NOI",
    caption: "Oct 2022 · Indonesia",
    result: "Gold Medalist (4th/20,877)",
    note: "The 2am Codeforces era ended here, yet it turned out to be good for more than medals.",
    pin: "blue",
    tilt: 4,
    pos: { left: 200, top: 30, z: 3 },
    photo: {
      src: "/images/competitions/noi-gold.jpg",
      alt: "Nathan holding the OSN informatics gold medal and certificate",
    },
  },
  {
    name: "Meta Hacker Cup",
    fullName: "Meta Hacker Cup",
    label: "Meta Hacker Cup",
    caption: "2023, 2024, 2025",
    result: "Round 2 ×3 · best 1,087th",
    note: "Stayed up until 5 AM for 3 consecutive years just to get a T\u2011shirt. Worth it.",
    pin: "green",
    tape: true,
    tilt: -2,
    pos: { left: 388, top: 56, z: 4 },
    photo: {
      src: "/images/competitions/meta-hacker-cup.jpg",
      alt: "2025 Meta Hacker Cup certificate: progressed to Round 2, ranked 1,087th",
      position: "0% 50%",
    },
  },
  {
    name: "IOI Selection",
    fullName: "International Olympiad in Informatics (IOI) Team Selection",
    label: "IOI Selection",
    caption: "June 2023 · Indonesia",
    result: "Final 14",
    note: "Top 4 go on to be the national IOI team for Indonesia that year.",
    pin: "brown",
    tilt: 7,
    pos: { left: 560, top: 28, z: 3 },
    photo: {
      src: "/images/competitions/ioi-selection.jpg",
      alt: "The IOI national training camp group under the Pelatihan Nasional Tahap III banner",
    },
  },
  {
    name: "TCS CodeVita",
    fullName: "TCS CodeVita",
    label: "TCS CodeVita",
    caption: "2025 · Global",
    result: "Ranked 201/537,000+",
    note: "Officially recognized by Guinness World Records as the largest online programming competition.",
    pin: "red",
    tilt: -4,
    pos: { left: 730, top: 62, z: 2 },
    photo: {
      src: "/images/competitions/tcs-codevita.jpg",
      alt: "TCS CodeVita Season 12 rank certificate: global rank 201",
      position: "20% 50%",
    },
  },
];
