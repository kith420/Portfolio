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
    name: "ICPC Asia",
    fullName: "ICPC Asia Regional",
    caption: "Nov 2024 · Singapore",
    result: "Top 5%",
    note: "Long night, good team. Still think about that flow problem.",
    pin: "red",
    tilt: -6,
    pos: { left: 16, top: 60, z: 2 },
  },
  {
    name: "NOI",
    fullName: "NOI Singapore",
    caption: "Mar 2023 · Singapore",
    result: "Silver",
    note: "The one that started the habit.",
    pin: "blue",
    tilt: 4,
    pos: { left: 200, top: 30, z: 3 },
  },
  {
    name: "Meta HC",
    fullName: "Meta Hacker Cup",
    caption: "Oct 2024 · Global",
    result: "Top 15%",
    note: "Round 2 hurt. Worth it.",
    pin: "green",
    tape: true,
    tilt: -2,
    pos: { left: 388, top: 56, z: 4 },
  },
  {
    name: "IOI Selection",
    fullName: "IOI Team Selection",
    caption: "2023 · Singapore",
    result: "Selected",
    note: "Camp was the best week of that year.",
    pin: "brown",
    tilt: 7,
    pos: { left: 560, top: 28, z: 3 },
  },
  {
    name: "CodeVita",
    fullName: "TCS CodeVita",
    caption: "2022 · Global",
    result: "Top 20%",
    note: "First big global one.",
    pin: "red",
    tilt: -4,
    pos: { left: 730, top: 62, z: 2 },
  },
];
