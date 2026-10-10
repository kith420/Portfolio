"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, DragEvent } from "react";
import type { HeroMedia } from "@/content/types";
import styles from "./HeroCanvas.module.css";

const HERO_DIR = "/images/hero/";

interface Item {
  id: number;
  type: HeroMedia["type"];
  /** What the browser loads: the public path, or a blob URL for a dropped file. */
  url: string;
  /** What gets written into hero.ts. */
  path: string;
  /** Dropped in this session, so the file still has to be copied into public/. */
  fresh: boolean;
  /** Crop: which part of the picture shows (x%, y%) and zoom past the cover fit. */
  x: number;
  y: number;
  zoom: number;
}

const MAX_ZOOM = 4;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const cropped = (it: Item) => it.x !== 50 || it.y !== 50 || it.zoom !== 1;

let nextId = 0;

function fromContent(media: HeroMedia[]): Item[] {
  return media.map((m) => ({
    id: nextId++,
    type: m.type,
    url: m.src,
    path: m.src,
    fresh: false,
    x: m.position?.[0] ?? 50,
    y: m.position?.[1] ?? 50,
    zoom: m.zoom ?? 1,
  }));
}

function fromFiles(files: FileList | File[]): Item[] {
  return Array.from(files)
    .filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"))
    .map((f) => ({
      id: nextId++,
      type: f.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      url: URL.createObjectURL(f),
      path: HERO_DIR + f.name,
      fresh: true,
      x: 50,
      y: 50,
      zoom: 1,
    }));
}

const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/** The `carousel` block in the same shape hero.ts uses: one blank line per column. */
function toCode(items: Item[]): string {
  const lines: string[] = [];
  items.forEach((item, i) => {
    if (i > 0 && i % 2 === 0) lines.push("");
    const x = Math.round(item.x);
    const y = Math.round(item.y);
    const zoom = Math.round(item.zoom * 100) / 100;
    const crop =
      (x !== 50 || y !== 50 ? `, position: [${x}, ${y}]` : "") +
      (zoom !== 1 ? `, zoom: ${zoom}` : "");
    lines.push(
      item.type === "video"
        ? `    { type: "video", src: ${JSON.stringify(item.path)}${crop} },`
        : `    { type: "image", src: ${JSON.stringify(item.path)}, alt: ""${crop} },`,
    );
  });
  return `  carousel: [\n${lines.join("\n")}\n  ],`;
}

export default function HeroCanvas({ initial }: { initial: HeroMedia[] }) {
  const [items, setItems] = useState<Item[]>(() => fromContent(initial));
  const [zoom, setZoom] = useState(0.5);
  const [siteLook, setSiteLook] = useState(false);
  const [over, setOver] = useState<number | "end" | null>(null);
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const dragId = useRef<number | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  // Trackpad crop for the selected tile: two-finger scroll pans, pinch zooms.
  // Native listeners, because React's wheel handler is passive and can't stop
  // the page from scrolling / zooming underneath.
  useEffect(() => {
    const el = strip.current;
    if (!el || selected === null) return;
    const tile = el.querySelector<HTMLElement>(`[data-id="${selected}"]`);
    if (!tile) return;

    const patch = (fn: (it: Item) => Partial<Item>) =>
      setItems((prev) => prev.map((it) => (it.id === selected ? { ...it, ...fn(it) } : it)));

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Chrome and Firefox report a trackpad pinch as ctrl + wheel.
      if (e.ctrlKey) {
        patch((it) => ({ zoom: clamp(it.zoom * Math.exp(-e.deltaY * 0.01), 1, MAX_ZOOM) }));
        return;
      }
      const media = tile.querySelector<HTMLImageElement | HTMLVideoElement>("img, video");
      if (!media) return;
      const nw = media instanceof HTMLVideoElement ? media.videoWidth : media.naturalWidth;
      const nh = media instanceof HTMLVideoElement ? media.videoHeight : media.naturalHeight;
      if (!nw || !nh) return;
      const { clientWidth: tw, clientHeight: th } = tile;
      const cover = Math.max(tw / nw, th / nh) * 1.06;
      patch((it) => {
        // How far the picture overhangs the tile on each axis, in px.
        const spareX = nw * cover * it.zoom - tw;
        const spareY = nh * cover * it.zoom - th;
        return {
          x: spareX > 1 ? clamp(it.x + (e.deltaX / spareX) * 100, 0, 100) : it.x,
          y: spareY > 1 ? clamp(it.y + (e.deltaY / spareY) * 100, 0, 100) : it.y,
        };
      });
    };

    // Safari reports a pinch as gesture events instead.
    let startZoom = 1;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      setItems((prev) => {
        startZoom = prev.find((it) => it.id === selected)?.zoom ?? 1;
        return prev;
      });
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const scale = (e as Event & { scale: number }).scale;
      patch(() => ({ zoom: clamp(startZoom * scale, 1, MAX_ZOOM) }));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };

    tile.addEventListener("wheel", onWheel, { passive: false });
    tile.addEventListener("gesturestart", onGestureStart);
    tile.addEventListener("gesturechange", onGestureChange);
    window.addEventListener("keydown", onKey);
    return () => {
      tile.removeEventListener("wheel", onWheel);
      tile.removeEventListener("gesturestart", onGestureStart);
      tile.removeEventListener("gesturechange", onGestureChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  // Same pairing as Hero.tsx: two tiles to a column, in list order.
  const columns: Item[][] = [];
  for (let i = 0; i < items.length; i += 2) columns.push(items.slice(i, i + 2));
  const repeats = columns.length ? Math.ceil(8 / columns.length) : 0;
  const fresh = items.filter((it) => it.fresh);
  const code = toCode(items);

  function allow(e: DragEvent, target: number | "end") {
    e.preventDefault();
    e.dataTransfer.dropEffect = dragId.current === null ? "copy" : "move";
    if (over !== target) setOver(target);
  }

  function dropOnTile(e: DragEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    setOver(null);
    // Files from Finder: the first replaces this tile, the rest slot in after it.
    if (e.dataTransfer.files.length) {
      const added = fromFiles(e.dataTransfer.files);
      if (added.length)
        setItems((prev) => [...prev.slice(0, index), ...added, ...prev.slice(index + 1)]);
      return;
    }
    const id = dragId.current;
    dragId.current = null;
    if (id === null) return;
    setItems((prev) => {
      const from = prev.findIndex((it) => it.id === id);
      if (from < 0 || from === index) return prev;
      const next = [...prev];
      [next[from], next[index]] = [next[index], next[from]];
      return next;
    });
  }

  function dropAtEnd(e: DragEvent) {
    e.preventDefault();
    setOver(null);
    if (e.dataTransfer.files.length) {
      const added = fromFiles(e.dataTransfer.files);
      setItems((prev) => [...prev, ...added]);
      return;
    }
    const id = dragId.current;
    dragId.current = null;
    if (id === null) return;
    setItems((prev) => {
      const moved = prev.find((it) => it.id === id);
      return moved ? [...prev.filter((it) => it.id !== id), moved] : prev;
    });
  }

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main
      className={styles.page}
      style={{ "--z": zoom } as CSSProperties}
      onClick={() => setSelected(null)}
    >
      <header className={styles.bar}>
        <div>
          <h1 className={styles.title}>Hero carousel canvas</h1>
          <p className={styles.meta}>
            {items.length} tiles · {columns.length} columns
            {repeats > 1 && ` · repeated ×${repeats} per lap on the site`}
            {items.length % 2 === 1 && " · last column has a single full-height tile"}
          </p>
        </div>
        <div className={styles.controls}>
          <label className={styles.control}>
            Zoom
            <input
              type="range"
              min={0.25}
              max={1}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </label>
          <label className={styles.control}>
            <input
              type="checkbox"
              checked={siteLook}
              onChange={(e) => setSiteLook(e.target.checked)}
            />
            Blur + dim as on site
          </label>
          <button className={styles.btn} onClick={() => picker.current?.click()}>
            Add images
          </button>
          <button className={styles.btn} onClick={() => setItems(fromContent(initial))}>
            Reset
          </button>
          <input
            ref={picker}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) {
                const added = fromFiles(e.target.files);
                setItems((prev) => [...prev, ...added]);
              }
              e.target.value = "";
            }}
          />
        </div>
      </header>

      <p className={styles.hint}>
        Drag a tile onto another to swap them. Drop image files from Finder onto a tile to
        replace it, or onto the dashed slot to add them. Click a tile to select it, then
        two-finger scroll to move the picture inside its frame and pinch to zoom; double-click
        resets the crop, Esc deselects. The outline marks one screen width.
      </p>

      <div
        className={styles.scroller}
        onDragOver={(e) => allow(e, "end")}
        onDragLeave={() => setOver(null)}
        onDrop={dropAtEnd}
      >
        <div ref={strip} className={`${styles.strip} ${siteLook ? styles.siteLook : ""}`}>
          <div className={styles.screen} aria-hidden>
            <span>one screen</span>
          </div>
          {columns.map((column, c) => (
            <div key={c} className={styles.column}>
              {column.map((item, j) => {
                const index = c * 2 + j;
                // Mirrors the alternating 1.3 split in Hero.module.css.
                const tall = column.length === 2 && (c % 2 === 0 ? j === 0 : j === 1);
                // Same crop Hero.tsx applies, including the 1.06 base overscan.
                const crop: CSSProperties = {
                  objectPosition: `${item.x}% ${item.y}%`,
                  transformOrigin: `${item.x}% ${item.y}%`,
                  scale: 1.06 * item.zoom,
                };
                return (
                  <div
                    key={item.id}
                    className={`${styles.tile} ${tall ? styles.tall : ""} ${
                      over === index ? styles.target : ""
                    } ${selected === item.id ? styles.selected : ""}`}
                    data-id={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(item.id);
                    }}
                    onDoubleClick={() =>
                      setItems((prev) =>
                        prev.map((it) =>
                          it.id === item.id ? { ...it, x: 50, y: 50, zoom: 1 } : it,
                        ),
                      )
                    }
                    draggable
                    onDragStart={(e) => {
                      dragId.current = item.id;
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", item.path);
                    }}
                    onDragEnd={() => {
                      dragId.current = null;
                      setOver(null);
                    }}
                    onDragOver={(e) => {
                      e.stopPropagation();
                      allow(e, index);
                    }}
                    onDrop={(e) => dropOnTile(e, index)}
                  >
                    {item.type === "video" ? (
                      <video
                        className={styles.media}
                        src={item.url}
                        style={crop}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      // Plain <img>: dropped files are blob URLs next/image can't optimise.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.media}
                        src={item.url}
                        style={crop}
                        alt=""
                        draggable={false}
                      />
                    )}
                    <span className={styles.label}>
                      <b>{String(index + 1).padStart(2, "0")}</b> {fileName(item.path)}
                      {cropped(item) && <em>{item.zoom.toFixed(2)}×</em>}
                      {item.fresh && <i>new</i>}
                    </span>
                    <button
                      className={styles.remove}
                      aria-label={`Remove ${fileName(item.path)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setItems((prev) => prev.filter((it) => it.id !== item.id));
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
          <button
            className={`${styles.slot} ${over === "end" ? styles.target : ""}`}
            onClick={() => picker.current?.click()}
          >
            Drop images here
            <br />
            or click to add
          </button>
        </div>
      </div>

      <section className={styles.output}>
        <div className={styles.outputHead}>
          <h2>Paste into src/content/hero.ts</h2>
          <button className={styles.btnPrimary} onClick={copy}>
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
        {fresh.length > 0 && (
          <p className={styles.todo}>
            Copy {fresh.length === 1 ? "this file" : "these files"} into{" "}
            <code>public/images/hero/</code> first:{" "}
            {fresh.map((it) => fileName(it.path)).join(", ")}
          </p>
        )}
        <pre className={styles.code}>{code}</pre>
      </section>
    </main>
  );
}
