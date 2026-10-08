"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import styles from "./resume.module.css";

/** Password input with a show/hide toggle. */
export default function PasswordField({ invalid }: { invalid: boolean }) {
  const [shown, setShown] = useState(false);

  return (
    <div className={styles.field}>
      <FiLock className={styles.fieldIcon} aria-hidden />
      <input
        name="password"
        type={shown ? "text" : "password"}
        className={styles.input}
        placeholder="Enter password"
        aria-label="Password"
        autoComplete="off"
        autoFocus
        required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "resume-error" : undefined}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide password" : "Show password"}
        aria-pressed={shown}
      >
        {shown ? <FiEyeOff aria-hidden /> : <FiEye aria-hidden />}
      </button>
    </div>
  );
}
