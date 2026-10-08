/**
 * Types for ALL user-facing copy. Every string the visitor reads is defined in
 * the sibling data files and imported by components — components never hardcode
 * text. All current copy is placeholder, flagged for rewrite in Nathan's voice.
 */

/** A run of prose with optional highlighted (accent-coloured) spans. */
/** Inline text runs; `hi` emphasises a run, `href` makes it a link. */
export type RichText = Array<{ text: string; hi?: boolean; href?: string }>;

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
  /** Optional tagline under the name. */
  tagline?: string;
  bio: RichText;
  cta: { primary: Link; ghost: Link };
  /** Background filmstrip. Empty = fall back to procedural gradient tiles. */
  carousel: HeroMedia[];
}

/* ---------------------------- Experience ------------------------------- */

export type LogoVariant = "simular" | "aggie" | "tcs" | "ntt" | "koko";

/** A figure in the details dialog; shown full width at its natural ratio. */
export interface ModalImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface ExperienceRole {
  num: string;
  /** Full company name — scrambles in on reveal. */
  company: string;
  /** Letter-mark badge text, e.g. "SI" — fallback when no `logoSrc`. */
  logo: string;
  logoVariant: LogoVariant;
  /**
   * Optional path (under public/) to a real logo image, e.g.
   * "/images/experience/simular.svg". When set, it replaces the letter-mark in
   * both the card and modal. Prefer a square SVG (or transparent PNG ≥120px).
   */
  logoSrc?: string;
  location: string;
  role: string;
  /** Optional headline number under the role, e.g. { value: "45×", label: "…" }. */
  stat?: { value: string; label: string };
  /** One-line summary shown when the card is open. */
  desc: RichText;
  /**
   * Optional team / workplace photo under the summary, e.g.
   * { src: "/images/experience/simular-team.jpg", alt: "The Simular team" }.
   * Landscape works best (shown at 16:9, cropped to fill). `position` is an
   * optional CSS object-position, e.g. "50% 60%", to steer the crop.
   */
  photo?: { src: string; alt: string; position?: string };
  tech: string[];
  year: string;
  /** Details dialog content (opened from the card's Details button). */
  modal: {
    meta: string;
    overview: RichText;
    /** "What I built" as one paragraph. */
    built?: RichText;
    /** "What I built" as bullets, e.g. one per project; replaces `built`. */
    points?: RichText[];
    /**
     * Long-form write-up: titled sections of paragraphs. When set, it replaces
     * the "What I built" block entirely.
     */
    sections?: { title: string; body: RichText[]; image?: ModalImage }[];
    /** Closing figure under everything else, e.g. a team photo. */
    image?: ModalImage;
  };
}

/* --------------------------- Competitions ------------------------------ */

export type PinColor = "red" | "blue" | "green" | "brown";

export interface Competition {
  /** Front caption name (short). */
  name: string;
  /** Full competition name (used for the accessible label). */
  fullName: string;
  /** Short one-line label printed at the top of the back of the polaroid. */
  label: string;
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
  /**
   * Optional photo on the polaroid's front, e.g.
   * { src: "/images/competitions/icpc-manila.jpg", alt: "..." }. Shown
   * roughly square, cropped to fill; `position` (CSS object-position, e.g.
   * "50% 80%") steers the crop.
   */
  photo?: { src: string; alt: string; position?: string };
}

/* ------------------------------- Work ---------------------------------- */

export interface WorkFigure {
  /** Caption under the image in the opened panel, e.g. "interface, dark mode". */
  caption: string;
  /** Image path under public/. Omit to show the tinted placeholder. */
  src?: string;
  /** "cover" (default) crops to fill; "contain" shows the whole image. */
  fit?: "cover" | "contain";
  /** Background behind a "contain" image, to match its edges. */
  bg?: string;
  /** CSS object-position, to steer a "cover" crop. */
  position?: string;
}

export interface WorkProject {
  name: string;
  tag: string;
  tags: string[];
  status: string;
  year: string;
  desc: string;
  /** Exactly three metric-driven highlights. */
  hi: [string, string, string];
  /** First figure is the card image; thumbnails appear when there are several. */
  figures: WorkFigure[];
  links?: Link[];
}

/* ------------------------------- Skills -------------------------------- */

export interface Skill {
  /** Caption shown under the tile. */
  name: string;
  /** Key into the icon map in Skills.tsx. Omit to render a text monogram. */
  icon?: string;
  /** Short text shown in place of an icon (e.g. "RAG") when no clean logo exists. */
  mono?: string;
  /** Brand hex used ONLY for the hover colour-flash; the rest state stays accent. */
  color?: string;
  /** Official site for the skill; when set, the tile links out (new tab). */
  href?: string;
}

export interface SkillTier {
  /** Category label, e.g. "AI / ML". */
  label: string;
  skills: Skill[];
}

/* ------------------------------ Contact -------------------------------- */

export interface ContactDefinition {
  d: string;
  s: string;
}

export interface ContactContent {
  title: string;
  headword: string;
  ipa: string;
  definitions: ContactDefinition[];
  links: Array<{ label: string; href: string; ariaLabel: string; svgPath: string }>;
  /** Footer name; the "© <current year>" prefix is added at render. */
  footer: string;
  srLine: string;
}
