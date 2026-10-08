import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { FiLock, FiMail } from "react-icons/fi";
import { COOKIE, tokenValid } from "@/lib/resumeAuth";
import { unlock } from "./actions";
import PasswordField from "./PasswordField";
import styles from "./resume.module.css";

export const metadata: Metadata = {
  title: "Resume — Nathan Poernama",
  robots: { index: false, follow: false },
};

const EMAIL = "nathankeithp@gmail.com";

export default async function ResumePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const unlocked = tokenValid((await cookies()).get(COOKIE)?.value);

  if (unlocked) {
    return (
      <main className={styles.viewer}>
        <header className={styles.bar}>
          <Link href="/" className={styles.back}>
            ← Back
          </Link>
          <div className={styles.actions}>
            <a href="/resume/file" target="_blank" rel="noopener">
              Open PDF
            </a>
            <a href="/resume/file?download" className={styles.download}>
              Download
            </a>
          </div>
        </header>
        <iframe className={styles.frame} src="/resume/file" title="Resume PDF" />
      </main>
    );
  }

  return (
    <main className={styles.gate}>
      <form action={unlock} className={styles.card}>
        <div className={styles.badge} aria-hidden>
          <FiLock />
        </div>
        <h1 className={styles.title}>Protected Resume</h1>
        <p className={styles.lead}>Please enter the password to view the resume</p>

        <PasswordField invalid={Boolean(error)} />
        {error && (
          <p id="resume-error" className={styles.error} role="alert">
            That password didn&rsquo;t match. Try again.
          </p>
        )}

        <button type="submit" className={styles.submit}>
          Access resume
        </button>

        <div className={styles.help}>
          <p>Need access? Contact me at:</p>
          <a href={`mailto:${EMAIL}`}>
            <FiMail aria-hidden />
            {EMAIL}
          </a>
        </div>
        <Link href="/" className={styles.home}>
          ← Back to portfolio
        </Link>
      </form>
    </main>
  );
}
