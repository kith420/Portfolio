/**
 * Types for ALL user-facing copy. Every string the visitor reads is defined in
 * the sibling data files and imported by components — components never hardcode
 * text. All current copy is placeholder, flagged for rewrite in Nathan's voice.
 */

/** A run of prose with optional highlighted (accent-coloured) spans. */
export type RichText = Array<{ text: string; hi?: boolean }>;

export interface Link {
  label: string;
  href: string;
  /** true = secondary/muted styling. */
  secondary?: boolean;
}

/* ------------------------------- Hero ---------------------------------- */

/**
 * One tile in the drifting background carousel. `src` is a path under
 * `public/` (e.g. "/hero/1.jpg"). Videos autoplay muted+looping; give them a
 * `poster` so there's something to show before the file loads.
 */
export type HeroMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export interface HeroContent {
  eyebrow: string;
  /** Headline lines, e.g. ["Nathan", "Poernama."]. */
  name: string[];
  /** Italic accent tagline (flagged placeholder). */
  tagline: string;
  bio: RichText;
  cta: { primary: Link; ghost: Link };
  scrollHint: string;
  /** Background filmstrip. Empty = fall back to procedural gradient tiles. */
  carousel: HeroMedia[];
}

/* ---------------------------- Experience ------------------------------- */

export type LogoVariant = "simular" | "aggie" | "tcs" | "ntt";

export interface ExperienceRole {
  num: string;
  /** Full company name — scrambles in on reveal. */
  company: string;
  /** Letter-mark badge text, e.g. "SI". */
  logo: string;
  logoVariant: LogoVariant;
  location: string;
  /** Italic role title — the dominant text in the card. */
  role: string;
  desc: RichText;
  tech: string[];
  year: string;
  /** Modal detail content. */
  modal: {
    meta: string;
    overview: RichText;
    thinkingNote: string;
    built: RichText;
  };
}

/* --------------------------- Competitions ------------------------------ */

export type PinColor = "red" | "blue" | "green" | "brown";

export interface Competition {
  /** Front caption name (short). */
  name: string;
  /** Back label (full competition name). */
  fullName: string;
  /** Front caption second line, "date · location". */
  caption: string;
  result: string;
  /** Handwritten back note. */
  note: string;
  pin: PinColor;
  /** Use washi tape instead of a pushpin. */
  tape?: boolean;
  tilt: number;
  /** Desktop scatter position (px within the 960px board). */
  pos: { left: number; top: number; z: number };
}

/* ------------------------------- Work ---------------------------------- */

export interface WorkFigure {
  /** FIG caption, e.g. "interface, dark mode". */
  caption: string;
}

export interface WorkProject {
  name: string;
  cat: string;
  /** SKU code, "WRK-0N · INITIALS/TAG1/TAG2" (see 03-work-section-spec.md §6). */
  sku: string;
  tag: string;
  tags: string[];
  status: string;
  year: string;
  desc: string;
  /** Exactly three metric-driven highlights. */
  hi: [string, string, string];
  figures: [WorkFigure, WorkFigure, WorkFigure];
  links: Link[];
}

/* ------------------------------ Contact -------------------------------- */

export interface ContactDefinition {
  d: string;
  s: string;
}

export interface ContactContent {
  eyebrow: string;
  /** Title inner, with the accent word split out. */
  title: { lead: string; accent: string };
  headword: string;
  ipa: string;
  definitions: ContactDefinition[];
  links: Array<{ label: string; href: string; ariaLabel: string; svgPath: string }>;
  footer: string;
  srLine: string;
}
