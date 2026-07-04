import { HeroContent } from "./types";

/**
 * PLACEHOLDER COPY — tagline and bio were flagged as AI-sounding in design
 * review; rewrite in Nathan's own voice before launch. Stats selection is also
 * placeholder (01-hero-section-spec.md §3.6, §8).
 */
export const hero: HeroContent = {
  eyebrow: "CS × Design — SUTD Singapore",
  name: ["Nathan", "Poernama."],
  tagline: "Ships code. Sweats pixels.",
  bio: [
    { text: "Four internships deep, a competitive-programming habit, and a soft spot for " },
    { text: "computer graphics", hi: true },
    { text: ", sneakers, and the occasional " },
    { text: "Gunpla build", hi: true },
    { text: "." },
  ],
  cta: {
    primary: { label: "View work", href: "#work" },
    ghost: { label: "LinkedIn →", href: "https://www.linkedin.com/in/kith14" },
  },
  stats: [
    { value: "4×", label: "Internships" },
    { value: "ICPC", label: "Regional" },
    { value: "CG", label: "Graphics focus" },
  ],
  scrollHint: "Scroll",
};
