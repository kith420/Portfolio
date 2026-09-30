import type { Metadata } from "next";
import { Archivo, Archivo_Narrow, Caveat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
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

const label = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-label",
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
      className={`${display.variable} ${mono.variable} ${label.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
