import styles from "./Wordmark.module.css";

/**
 * The KITH box-logo: "KITH" inside a thin accent border box, with the dot
 * sitting OUTSIDE the box (a deliberate Kith streetwear callback).
 */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`${styles.wordmark} ${className ?? ""}`}>
      <span className={styles.box}>Kith</span>
      <span className={styles.dot}>.</span>
    </span>
  );
}
