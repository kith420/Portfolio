import type { Metadata } from "next";
import {
  Barlow_Condensed,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Oswald,
  DM_Sans,
  Caveat,
} from "next/font/google";
import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
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
