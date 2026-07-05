import { HeroContent } from "./types";

/**
 * PLACEHOLDER COPY — tagline and bio were flagged as AI-sounding in design
 * review; rewrite in Nathan's own voice before launch.
 */
export const hero: HeroContent = {
  eyebrow: "Computer Science & Design — SUTD Singapore Class of  2027",
  name: ["Nathan", "Keith P."],
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
  scrollHint: "Scroll down for more",
  /**
   * Background filmstrip. Drop files in `public/images/hero/` and list them
   * here — they auto-duplicate for the seamless loop, so order = drift order.
   * Leave empty to keep the procedural dark-gradient fallback.
   *
   *   { type: "image", src: "/images/hero/atc.jpg", alt: "" },
   *   { type: "video", src: "/images/hero/reel.mp4", poster: "/images/hero/reel.jpg" },
   */
  carousel: [],
};
