import { CSSProperties, Ref } from "react";
import { Competition, PinColor } from "@/content/types";
import styles from "./Competitions.module.css";

const PIN_GRADIENT: Record<PinColor, { grad: string; border: string }> = {
  red: { grad: "#b85a5a,#8b3a3a", border: "#6a2a2a" },
  blue: { grad: "#4a6aab,#2a4a8b", border: "#1a3060" },
  green: { grad: "#4a8a3a,#3a6a2a", border: "#2a4a1a" },
  brown: { grad: "#8a6a3a,#6a4a2a", border: "#4a3020" },
};

interface PolaroidProps {
  comp: Competition;
  flipped?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  outerRef?: Ref<HTMLDivElement>;
  /** Hide the pin/tape (used by seam travellers). */
  showPin?: boolean;
}

export default function Polaroid({
  comp,
  flipped = false,
  onClick,
  className = "",
  style,
  outerRef,
  showPin = true,
}: PolaroidProps) {
  const pin = PIN_GRADIENT[comp.pin];
  return (
    <div
      ref={outerRef}
      className={`${styles.polaroid} ${flipped ? styles.flipped : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      {showPin &&
        (comp.tape ? (
          <span className={styles.tape} aria-hidden />
        ) : (
          <span
            className={styles.pin}
            aria-hidden
            style={{
              background: `radial-gradient(circle at 35% 30%, ${pin.grad})`,
              border: `1px solid ${pin.border}`,
            }}
          />
        ))}
      <div className={styles.polInner}>
        <div className={`${styles.polFace} ${styles.polFront}`}>
          <div className={styles.polPhoto} />
          <div className={styles.polCap}>
            <div className={styles.nm}>{comp.name}</div>
            <div className={styles.dt}>{comp.caption}</div>
          </div>
        </div>
        <div className={`${styles.polFace} ${styles.polBack}`}>
          <div className={styles.bar} />
          <div className={styles.lbl}>{comp.fullName}</div>
          <div className={styles.res}>{comp.result}</div>
          <div className={styles.note}>{comp.note}</div>
          <div className={styles.stamp}>Kith</div>
        </div>
      </div>
    </div>
  );
}
