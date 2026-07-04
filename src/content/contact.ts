import { ContactContent } from "./types";

/**
 * The four DEFS lines are Claude-drafted placeholders — rewrite in Nathan's
 * voice (04-contact-section-spec.md §5, §9). Exact characters preserved via
 * unicode escapes: U+2019 ', U+201C/D " ", U+2014 —, U+00B7 ·.
 */
export const contact: ContactContent = {
  eyebrow: "// contact",
  title: { lead: "What's ", accent: "next." },
  headword: "kith",
  ipa: "/k\u026A\u03B8/",
  definitions: [
    { d: "one\u2019s friends and acquaintances.", s: "noun \u00B7 archaic" },
    { d: "from \u201CKeith\u201D \u2014 the \u2018e\u2019 never quite made it.", s: "etymology" },
    { d: "@kith14, on just about every platform.", s: "the internet" },
    { d: "no relation to the streetwear label. mostly.", s: "disambiguation" },
  ],
  links: [
    {
      label: "Email",
      href: "mailto:nathankeithp@gmail.com",
      ariaLabel: "Email nathankeithp@gmail.com",
      svgPath:
        "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/kith14",
      ariaLabel: "LinkedIn",
      svgPath:
        "M4.98 3.5a2.5 2.5 0 1 1-.02 5 2.5 2.5 0 0 1 .02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21h-4z",
    },
    {
      label: "GitHub",
      href: "https://github.com/kith420",
      ariaLabel: "GitHub",
      svgPath:
        "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z",
    },
  ],
  footer: "© 2026 Nathan Keith Poernama",
  srLine:
    "kith: a nickname, from the middle name Keith. Nathan Keith Poernama.",
};
