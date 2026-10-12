"use client";

import { useEffect, useRef } from "react";

// Sprite: public/vidar/vidar-head.png, 92×69, drawn at 1 CSS px per sprite pixel so it
// stays crisp (image-rendering: pixelated). Eye positions are the hot pixels of the sprite.
const HEAD = { src: "/vidar/vidar-head.png", w: 92, h: 69 };
const EYES = [
  { x: 38, y: 48 },
  { x: 54, y: 48 },
];
const STREAK_EYE = EYES[0];

// Feel. The head is the cursor: REST puts the notch between its two top prongs on the
// pointer once it catches up, so the click point is the top centre of the head.
const REST = { x: -46, y: -2 };
const FOLLOW = 28; // spring rate per second; higher follows tighter
const TRAIL_MS = 320; // how long a streak point lives, so the streak retracts when still
const FLASH_MS = 180;

const CORE = [255, 240, 252, 255];
const HOT = [255, 107, 230, 255];
const MID = [214, 58, 208, 255];
const GLOW = [150, 50, 210, 110];
const HOVER =
  'a, button, [role="button"], summary, label, input, select, textarea';

// Badges drawn beside the click point where the page would otherwise show a system
// cursor (globals.css blanks those out and keeps the keyword for cursorMode to read).
// 13×13 bitmaps; BADGE is the top-left of the outlined 15×15 badge within the sprite,
// in the empty pocket between the right prong and the right wing.
const BADGE = { x: 57, y: -1, size: 15 };
const BAR = "#############";
const STEM = ".....###.....";
const GAP = ".............";
const GLYPHS = {
  plus: [
    STEM,
    STEM,
    STEM,
    STEM,
    STEM,
    BAR,
    BAR,
    BAR,
    STEM,
    STEM,
    STEM,
    STEM,
    STEM,
  ],
  minus: [GAP, GAP, GAP, GAP, GAP, BAR, BAR, BAR, GAP, GAP, GAP, GAP, GAP],
  move: [
    "......#......",
    ".....###.....",
    "....#####....",
    "......#......",
    "..#...#...#..",
    ".##...#...##.",
    BAR,
    ".##...#...##.",
    "..#...#...#..",
    "......#......",
    "....#####....",
    ".....###.....",
    "......#......",
  ],
};
type Mode = keyof typeof GLYPHS | null;
const MODES: Record<string, Mode> = {
  "zoom-in": "plus",
  "zoom-out": "minus",
  grab: "move",
  grabbing: "move",
  move: "move",
};

// Text caret: an I-beam through the click point, standing in the notch between the
// prongs, shown over selectable text and while a selection is being dragged. CARET is
// the top-left of its outlined canvas within the sprite; the stem is sprite column 46.
const CARET = { x: 43, y: -8, w: 7, h: 20 };
const CARET_GLYPH = ["#####", ...Array<string>(16).fill("..#.."), "#####"];
const TEXT_FIELD =
  'textarea, input:not([type="checkbox"], [type="radio"], [type="submit"], [type="button"], [type="range"], [type="file"], [type="color"])';

type Pt = { x: number; y: number; t: number };

/** True when the point is on a line of selectable text (or in a text field), not just
 *  somewhere inside a block that happens to contain text. */
function overText(el: EventTarget | null, x: number, y: number): boolean {
  if (!(el instanceof Element)) return false;
  if (el.matches(TEXT_FIELD)) return true;
  if (clickable(el) || getComputedStyle(el).userSelect === "none") return false;
  const doc = document as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
    ) => { offsetNode: Node } | null;
  };
  const node =
    doc.caretPositionFromPoint?.(x, y)?.offsetNode ??
    document.caretRangeFromPoint?.(x, y)?.startContainer;
  if (!(node instanceof Text) || !el.contains(node)) return false;
  const range = document.createRange();
  range.selectNodeContents(node);
  return [...range.getClientRects()].some(
    (r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom,
  );
}

/** Which badge the element under the pointer asks for, from its cursor keyword. */
function cursorMode(el: EventTarget | null): Mode {
  return MODES[cursorKeyword(el)] ?? null;
}

function cursorKeyword(el: EventTarget | null): string {
  if (!(el instanceof Element)) return "";
  return getComputedStyle(el).cursor.split(",").pop()?.trim() ?? "";
}

/** Clickable: a link or control, or anything the stylesheets give the link cursor
 *  (experience cards, polaroids, skill tiles), which aren't all buttons. */
function clickable(el: EventTarget | null): boolean {
  if (!(el instanceof Element)) return false;
  return el.closest(HOVER) !== null || cursorKeyword(el) === "pointer";
}

/** Pixel glyph in the eye-light pink with a 1px magenta outline, so it reads on the
 *  dark sections and the cream ones alike. */
function drawBadge(ctx: CanvasRenderingContext2D, glyph: string[]) {
  const on = (x: number, y: number) => glyph[y]?.[x] === "#";
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let y = -1; y <= glyph.length; y++) {
    for (let x = -1; x <= glyph[0].length; x++) {
      const edge =
        on(x - 1, y) ||
        on(x + 1, y) ||
        on(x, y - 1) ||
        on(x, y + 1) ||
        on(x - 1, y - 1) ||
        on(x + 1, y - 1) ||
        on(x - 1, y + 1) ||
        on(x + 1, y + 1);
      if (!on(x, y) && !edge) continue;
      ctx.fillStyle = on(x, y) ? "#fff0fc" : "#d63ad0";
      ctx.fillRect(x + 1, y + 1, 1, 1);
    }
  }
}

export default function VidarCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLCanvasElement>(null);
  const caretRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const head = headRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !head || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const eyes = [...head.querySelectorAll<HTMLElement>("[data-eye]")];

    let px = 0;
    let py = 0;
    let hx = 0;
    let hy = 0;
    let seen = false;
    let inside = false;
    let hovering = false;
    let mode: Mode = null;
    const badge = badgeRef.current;
    const badgeCtx = badge?.getContext("2d");
    const setMode = (next: Mode) => {
      if (next === mode || !badge || !badgeCtx) return;
      mode = next;
      if (mode) drawBadge(badgeCtx, GLYPHS[mode]);
      badge.style.opacity = mode ? "1" : "0";
    };
    const caret = caretRef.current;
    const caretCtx = caret?.getContext("2d");
    if (caretCtx) drawBadge(caretCtx, CARET_GLYPH);
    let onText = false;
    let selecting = false;
    const showCaret = () => {
      if (caret)
        caret.style.opacity = !mode && (onText || selecting) ? "1" : "0";
    };
    let flashAt = -Infinity;
    let trail: Pt[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const tx = px + REST.x;
      const ty = py + REST.y;
      if (reduced) {
        hx = tx;
        hy = ty;
      } else {
        const k = 1 - Math.exp(-FOLLOW * dt);
        hx += (tx - hx) * k;
        hy += (ty - hy) * k;
      }
      const x = Math.round(hx);
      const y = Math.round(hy);
      const visible = seen && inside;
      const flash = reduced ? 0 : Math.max(0, 1 - (now - flashAt) / FLASH_MS);
      const lit = visible && (flash > 0 || hovering);

      head.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      head.style.opacity = visible ? "1" : "0";
      head.style.filter = lit
        ? `drop-shadow(0 0 ${3 + 5 * flash}px rgba(255, 107, 230, 0.75))`
        : "";
      for (const e of eyes) e.style.opacity = lit ? "1" : "0";

      const eye = {
        x: x + STREAK_EYE.x + 0.5,
        y: y + STREAK_EYE.y + 0.5,
        t: now,
      };
      if (!reduced) {
        const prev = trail[0];
        if (!prev || Math.hypot(prev.x - eye.x, prev.y - eye.y) >= 1)
          trail.unshift(eye);
        trail = trail.filter((p) => now - p.t < TRAIL_MS);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (visible && trail.length > 1) drawStreak(ctx, [eye, ...trail], flash);

      const settled = Math.abs(tx - hx) < 0.3 && Math.abs(ty - hy) < 0.3;
      if (settled && trail.length <= 1 && flash === 0) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!seen) {
        seen = true;
        // hides the arrow cursor (globals.css) only once the head is there to replace it
        document.documentElement.dataset.vidar = "on";
        hx = px + REST.x;
        hy = py + REST.y;
      }
      inside = true;
      hovering = clickable(e.target);
      setMode(cursorMode(e.target));
      onText = overText(e.target, px, py);
      showCaret();
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      flashAt = performance.now();
      selecting = onText;
      kick();
    };
    const onUp = () => {
      selecting = false;
      showCaret();
    };
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      inside = false;
      kick();
    };
    const onResize = () => {
      resize();
      kick();
    };

    // Modal <dialog>s (role and project details, the picture viewer) render in the
    // browser's top layer, above any z-index. The overlay is a manual popover so it
    // lives there too, and is re-shown whenever a dialog opens to stay on top of it.
    const root = rootRef.current;
    const raise = () => {
      if (!root || typeof root.showPopover !== "function") return;
      try {
        if (root.matches(":popover-open")) root.hidePopover();
        root.showPopover();
      } catch {}
    };
    const dialogs = new MutationObserver((records) => {
      if (
        records.some(
          (r) => r.target instanceof HTMLDialogElement && r.target.open,
        )
      )
        raise();
    });
    root?.setAttribute("popover", "manual");
    raise();
    dialogs.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["open"],
    });

    resize();
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onOut);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      dialogs.disconnect();
      delete document.documentElement.dataset.vidar;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        // the rest undo the browser's default popover box
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        border: "none",
        background: "transparent",
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          imageRendering: "pixelated",
        }}
      />
      <div
        ref={headRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: 0,
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pixel art must not be resampled */}
        <img
          src={HEAD.src}
          width={HEAD.w}
          height={HEAD.h}
          alt=""
          draggable={false}
          style={{ display: "block", imageRendering: "pixelated" }}
        />
        <canvas
          ref={caretRef}
          width={CARET.w}
          height={CARET.h}
          style={{
            position: "absolute",
            left: CARET.x,
            top: CARET.y,
            imageRendering: "pixelated",
            opacity: 0,
            transition: "opacity 120ms",
          }}
        />
        <canvas
          ref={badgeRef}
          width={BADGE.size}
          height={BADGE.size}
          style={{
            position: "absolute",
            left: BADGE.x,
            top: BADGE.y,
            imageRendering: "pixelated",
            opacity: 0,
            transition: "opacity 120ms",
          }}
        />
        {EYES.map((e, i) => (
          <span
            key={i}
            data-eye
            style={{
              position: "absolute",
              left: e.x - 1,
              top: e.y - 1,
              width: 3,
              height: 3,
              background: "#fff0fc",
              boxShadow:
                "0 0 0 1px #ff6be6, 0 0 6px 2px rgba(255, 107, 230, 0.8)",
              opacity: 0,
              transition: "opacity 120ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Displaces a few points just behind the eye sideways so the streak kinks like a bolt. */
function kink(pts: Pt[]): Pt[] {
  if (pts.length < 6) return pts;
  const a = pts[0];
  const b = pts[Math.min(pts.length - 1, 6)];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < 1) return pts;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  const amp = Math.min(5, len / 6);
  return pts.map((p, i) => {
    const side = i === 2 || i === 4 ? 1 : i === 3 ? -1 : 0;
    return side
      ? { ...p, x: p.x + nx * amp * side, y: p.y + ny * amp * side }
      : p;
  });
}

/** Pixel-rasterised tapered streak: white-pink core near the eye, hot pink, magenta tail,
 *  and a 1px translucent violet glow. Drawn at 1 canvas px per CSS px to match the sprite. */
function drawStreak(ctx: CanvasRenderingContext2D, raw: Pt[], flash: number) {
  const pts = kink(raw);
  const segs: {
    ax: number;
    ay: number;
    ux: number;
    uy: number;
    len: number;
    from: number;
  }[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len < 0.01) continue;
    segs.push({
      ax: a.x,
      ay: a.y,
      ux: (b.x - a.x) / len,
      uy: (b.y - a.y) / len,
      len,
      from: total,
    });
    total += len;
  }
  if (total < 4) return;
  const pad = 6;
  const x0 = Math.max(0, Math.floor(Math.min(...pts.map((p) => p.x))) - pad);
  const y0 = Math.max(0, Math.floor(Math.min(...pts.map((p) => p.y))) - pad);
  const x1 = Math.min(
    ctx.canvas.width,
    Math.ceil(Math.max(...pts.map((p) => p.x))) + pad,
  );
  const y1 = Math.min(
    ctx.canvas.height,
    Math.ceil(Math.max(...pts.map((p) => p.y))) + pad,
  );
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0 || h <= 0) return;
  const img = ctx.createImageData(w, h);
  const widen = 1 + 0.6 * flash;
  const coreUntil = 0.55 + 0.25 * flash;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const X = x0 + x + 0.5;
      const Y = y0 + y + 0.5;
      let best = Infinity;
      let bestS = 0;
      for (const s of segs) {
        const t = Math.max(
          0,
          Math.min(s.len, (X - s.ax) * s.ux + (Y - s.ay) * s.uy),
        );
        const d = Math.hypot(X - s.ax - s.ux * t, Y - s.ay - s.uy * t);
        const at = (s.from + t) / total;
        const e = d - (2.3 * Math.pow(1 - at, 1.3) + 0.45) * widen;
        if (e < best) {
          best = e;
          bestS = at;
        }
      }
      if (best > 1) continue;
      const c =
        best > 0
          ? GLOW
          : best < -1.1 && bestS < coreUntil
            ? CORE
            : bestS < 0.7
              ? HOT
              : MID;
      img.data.set(c, (y * w + x) * 4);
    }
  }
  ctx.putImageData(img, x0, y0);
}
