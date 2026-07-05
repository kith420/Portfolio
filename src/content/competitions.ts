import { Competition } from "./types";

/** Section heading + mobile hint copy. */
export const competitionsHeading = {
  eyebrow: "// competitions",
  title: "Competed.",
  desktopHint: "click a polaroid to flip it",
  hintFlip: "tap to flip",
  hintSwipe: "swipe",
};

/**
 * Desktop scatter positions + tilts + back notes ported from the flow
 * prototype (source of truth for placement/motion). Back body copy is
 * placeholder (competitions-section-spec.md §11, §14).
 * Array order = source order (also drives the seam's unpin order).
 */
export const competitions: Competition[] = [
  {
    name: "ICPC Asia Regional",
    fullName: "ICPC Asia Regional",
    caption: "Dec 2025 · Manila",
    result: "First to Solve Award",
    note: "Got the first balloon before anyone else did but the folding problem keeps me up at night sometimes.",
    pin: "red",
    tilt: -6,
    pos: { left: 16, top: 60, z: 2 },
  },
  {
    name: "NOI",
    fullName: "National Olympiad in Informatics (OSN/NOI)",
    caption: "Oct 2022 · Indonesia",
    result: "Gold Medalist (4th/20,877)",
    note: "The 2am Codeforces era ended here, yet it turned out to be good for more than medals.",
    pin: "blue",
    tilt: 4,
    pos: { left: 200, top: 30, z: 3 },
  },
  {
    name: "Meta Hacker Cup",
    fullName: "Meta Hacker Cup",
    caption: "2023, 2024, 2025",
    result: "Top 2000 Round 2",
    note: "Stayed up until 5 AM for 3 consecutive years just to get a tshirt. Worth it.",
    pin: "green",
    tape: true,
    tilt: -2,
    pos: { left: 388, top: 56, z: 4 },
  },
  {
    name: "IOI Selection",
    fullName: "International Olympiad in Informatics (IOI) Team Selection",
    caption: "June 2023 · Indonesia",
    result: "Final 14",
    note: "Top 4 advance to the be the national IOI team for Indonesia that year.",
    pin: "brown",
    tilt: 7,
    pos: { left: 560, top: 28, z: 3 },
  },
  {
    name: "TCS CodeVita",
    fullName: "TCS CodeVita",
    caption: "2025 · Global",
    result: "Ranked 201/537,000+",
    note: "Officially recognized by the Guinness World Records as the largest online programming competition.",
    pin: "red",
    tilt: -4,
    pos: { left: 730, top: 62, z: 2 },
  },
];
