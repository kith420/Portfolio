import styles from "./Wordmark.module.css";

/** The site mark: the full name set in the display face, with an accent dot. */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`}>
      Nathan Poernama<span className={styles.dot}>.</span>
    </span>
  );
}
