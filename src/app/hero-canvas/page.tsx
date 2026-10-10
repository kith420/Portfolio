import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hero } from "@/content/hero";
import HeroCanvas from "./HeroCanvas";

export const metadata: Metadata = {
  title: "Hero carousel canvas",
  robots: { index: false, follow: false },
};

/**
 * Dev-only layout board for the hero filmstrip: shows `hero.carousel` laid out
 * the way Hero.tsx stacks it, and lets you reorder / drop in new images before
 * pasting the result back into src/content/hero.ts. Never served in production.
 */
export default function HeroCanvasPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <HeroCanvas initial={hero.carousel} />;
}
