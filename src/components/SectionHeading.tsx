import { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  /** e.g. "// 02 — experience" */
  eyebrow: ReactNode;
  /** Title inner content — sections wrap their accent word in their own span. */
  children: ReactNode;
  /** Optional right-aligned count, e.g. "04 roles". */
  count?: ReactNode;
  titleId?: string;
  /**
   * Per-part class overrides. When a part's class is supplied the base class is
   * replaced entirely (not merged) so each section fully owns its palette /
   * typography without specificity battles.
   */
  classes?: {
    root?: string;
    eyebrow?: string;
    title?: string;
    count?: string;
  };
}

export default function SectionHeading({
  eyebrow,
  children,
  count,
  titleId,
  classes,
}: SectionHeadingProps) {
  return (
    <div className={classes?.root ?? styles.head}>
      <div>
        <div className={classes?.eyebrow ?? styles.eyebrow}>{eyebrow}</div>
        <h2 id={titleId} className={classes?.title ?? styles.title}>
          {children}
        </h2>
      </div>
      {count != null && (
        <div className={classes?.count ?? styles.count}>{count}</div>
      )}
    </div>
  );
}
