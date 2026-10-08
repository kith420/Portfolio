import { createDecipheriv, createHash, createHmac, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Password gate for /resume. Server-only: never import this from a client
 * component.
 *
 * Two environment variables drive it (see .env.example):
 *   RESUME_PASSWORD  what a visitor types.
 *   RESUME_SECRET    signs the access cookie and decrypts the PDF.
 *
 * The PDF is committed encrypted (private/resume.pdf.enc, written by
 * `npm run resume:encrypt`), so neither the repo nor a direct URL exposes it.
 */

export const COOKIE = "resume_access";
const MAX_AGE = 60 * 60 * 24; // seconds

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: MAX_AGE,
  path: "/resume",
};

function derive(purpose: string) {
  const secret = process.env.RESUME_SECRET;
  if (!secret) throw new Error("RESUME_SECRET is not set");
  return createHmac("sha256", secret).update(purpose).digest();
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();

export function passwordMatches(input: string) {
  const expected = process.env.RESUME_PASSWORD;
  if (!expected || !input) return false;
  // Hash both sides so the comparison is constant-time at any length.
  return timingSafeEqual(sha256(input), sha256(expected));
}

const sign = (exp: string) =>
  createHmac("sha256", derive("resume-cookie")).update(exp).digest("hex");

/** A signed "valid until" stamp; nothing about the visitor is stored. */
export function issueToken() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  return `${exp}.${sign(exp)}`;
}

export function tokenValid(token: string | undefined) {
  if (!token || !process.env.RESUME_SECRET) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !(Number(exp) > Date.now())) return false;
  const expected = Buffer.from(sign(exp));
  const given = Buffer.from(mac);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function readResume() {
  const file = await readFile(join(process.cwd(), "private", "resume.pdf.enc"));
  const decipher = createDecipheriv("aes-256-gcm", derive("resume-file"), file.subarray(0, 12));
  decipher.setAuthTag(file.subarray(12, 28));
  return Buffer.concat([decipher.update(file.subarray(28)), decipher.final()]);
}
