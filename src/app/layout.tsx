import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  IBM_Plex_Sans,
  Oswald,
  DM_Sans,
  Caveat,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "./fonts/commit-mono-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/commit-mono-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/commit-mono-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/commit-mono-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/commit-mono-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/commit-mono-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-label",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-prose",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nathan Poernama — Kith",
  description:
    "CS × Design portfolio. Engineer with a competitive-programming habit and a soft spot for computer graphics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${sans.variable} ${oswald.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
