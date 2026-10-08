import { HeroContent } from "./types";

export const hero: HeroContent = {
  eyebrow: "Hello world, my name is",
  name: ["Nathan", "Keith Poernama"],
  // tagline: "Ships code. Sweats pixels.",
  bio: [
    { text: "I'm a final-year Computer Science student at SUTD in Singapore, graduating May 2027. I've spent " },
    { text: "three internships", hi: true, href: "#exp" },
    { text: " building full-stack products at an AI startup and two major consulting firms. I've been doing " },
    { text: "competitive programming in C++", hi: true, href: "#comp" },
    { text: " since high school, and my focus is " },
    { text: "low-level work", hi: true, href: "#work" },
    { text: ": anything involving optimization and algorithms!" },
  ],
  cta: {
    primary: { label: "View resume", href: "/resume" },
    ghost: { label: "LinkedIn →", href: "https://www.linkedin.com/in/kith14" },
  },
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
