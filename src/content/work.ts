import { WorkProject } from "./types";

/**
 * Section heading. Lead + accent are stored uppercase so the scramble noise
 * (A–Z0–9) blends seamlessly with the resolved characters (03-work-section-spec
 * §5, §10 Anim 1). "DROPPED." renders in --accent-ink.
 */
export const workHeading = {
  eyebrow: "// 03 — work",
  titleLead: "WHAT I'VE ",
  titleAccent: "DROPPED.",
};

/**
 * PLACEHOLDER PROJECTS — real projects go here in priority order (array order =
 * slot order; slot 1 = the one to lead with). Highlights must stay metric-driven
 * (03-work-section-spec.md §11). FIG captions and links are placeholder until
 * real screenshots/URLs exist.
 */
export const work: WorkProject[] = [
  {
    name: "Path Tracer",
    cat: "Graphics",
    sku: "WRK-01 · PT/CPP/BVH",
    tag: "A physically-based renderer, built from scratch",
    tags: ["C++", "BVH", "OpenGL"],
    status: "Shipped",
    year: "2024",
    desc: "An unbiased path tracer written from the ground up in C++. The hard part was making it fast enough to iterate on without a render farm.",
    hi: [
      "40× speedup over naive ray casting via a tuned BVH",
      "Importance-sampled BRDFs for cleaner convergence",
      "Multithreaded tile scheduler saturates all cores",
    ],
    figures: [
      { caption: "final render, cornell box" },
      { caption: "BVH traversal heatmap" },
      { caption: "convergence over samples" },
    ],
    links: [
      { label: "View repo", href: "#" },
      { label: "Write-up", href: "#", secondary: true },
    ],
  },
  {
    name: "CP Visualizer",
    cat: "Tools",
    sku: "WRK-02 · CV/RUS/WAS",
    tag: "Watch algorithms run, step by step",
    tags: ["Rust", "WASM", "Canvas"],
    status: "Shipped",
    year: "2024",
    desc: "An interactive visualizer for competitive-programming algorithms. Compiling the stepper to WASM was what made real-time scrubbing feel instant.",
    hi: [
      "Renders graph + DP state transitions in real time",
      "Compiles to WASM for near-native stepping speed",
      "Scrub any algorithm forward and backward frame-by-frame",
    ],
    figures: [
      { caption: "graph traversal view" },
      { caption: "DP table stepping" },
      { caption: "timeline scrubber" },
    ],
    links: [
      { label: "Live demo", href: "#" },
      { label: "Source", href: "#", secondary: true },
    ],
  },
  {
    name: "This Portfolio",
    cat: "Web",
    sku: "WRK-03 · TP/NEX/TS",
    tag: "The site you're scrolling through right now",
    tags: ["Next", "TS", "CSS"],
    status: "In prog.",
    year: "2025",
    desc: "A one-page portfolio where each section carries its own structural metaphor. The interesting work is in the scroll seams between them.",
    hi: [
      "Five sections, five distinct structural metaphors",
      "Scroll transitions designed seam by seam",
      "One shared rAF ticker drives every scrubbed transform",
    ],
    figures: [
      { caption: "section flow, dark mode" },
      { caption: "the unpin seam mid-fall" },
      { caption: "type + token system" },
    ],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Notes", href: "#", secondary: true },
    ],
  },
  {
    name: "KV Store",
    cat: "Systems",
    sku: "WRK-04 · KV/GO/RFT",
    tag: "A small distributed key–value store",
    tags: ["Go", "Raft", "gRPC"],
    status: "Shipped",
    year: "2023",
    desc: "A replicated key–value store built to actually understand consensus. Getting log compaction right under Raft was the part that taught the most.",
    hi: [
      "Linearizable reads across a 3-node Raft cluster",
      "Snapshotting + log compaction keep memory bounded",
      "Survives leader loss with sub-second failover",
    ],
    figures: [
      { caption: "cluster topology" },
      { caption: "raft log replication" },
      { caption: "failover latency trace" },
    ],
    links: [
      { label: "View repo", href: "#" },
      { label: "Design doc", href: "#", secondary: true },
    ],
  },
];
