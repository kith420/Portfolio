import { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  /** Optional small label above the title. */
  eyebrow?: ReactNode;
  /** Title content. */
  children: ReactNode;
  /** Optional right-aligned note beside the title. */
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
        {eyebrow != null && (
          <div className={classes?.eyebrow ?? styles.eyebrow}>{eyebrow}</div>
        )}
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
