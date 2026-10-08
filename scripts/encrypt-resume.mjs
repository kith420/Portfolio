// Encrypts a resume PDF into private/resume.pdf.enc so it can live in a public
// repo. The site decrypts it on the server, only for visitors who have entered
// the password (see src/lib/resumeAuth.ts).
//
//   npm run resume:encrypt -- ~/Downloads/Resume.pdf
//
// Needs RESUME_SECRET (the npm script loads it from .env.local). Re-run it
// whenever the PDF or the secret changes, then commit the .enc file.
import { createCipheriv, createHmac, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const secret = process.env.RESUME_SECRET;
const input = process.argv[2];

if (!secret) {
  console.error("RESUME_SECRET is not set. Add it to .env.local first.");
  process.exit(1);
}
if (!input) {
  console.error("Usage: npm run resume:encrypt -- <path-to-resume.pdf>");
  process.exit(1);
}

const pdf = readFileSync(resolve(input.replace(/^~(?=\/)/, homedir())));
if (pdf.subarray(0, 5).toString() !== "%PDF-") {
  console.error(`${input} is not a PDF.`);
  process.exit(1);
}

const key = createHmac("sha256", secret).update("resume-file").digest();
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const body = Buffer.concat([cipher.update(pdf), cipher.final()]);

// Layout: 12-byte IV | 16-byte auth tag | ciphertext.
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "private", "resume.pdf.enc");
writeFileSync(out, Buffer.concat([iv, cipher.getAuthTag(), body]));
console.log(`Encrypted ${pdf.length} bytes -> private/resume.pdf.enc`);
