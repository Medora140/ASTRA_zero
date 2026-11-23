"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Fixed site background: the terrain photo plus a drone-camera reticle overlay.
 *
 * Layers (inside .site-bg): zoom layer (photo) -> reticle SVG -> dark shade (CSS ::after).
 * The photo is never edited; "optical zoom" is a CSS scale of the photo layer about the
 * target point, so the target stays under the reticle while the lens closes in.
 *
 * Cycle: SEARCHING (sweeps) -> approach POI -> TARGET ACQUIRED -> AUTOFOCUS (rectangle
 * contracts, photo zooms, defocus -> focus) -> TRACKING (hold) -> REACQUIRING (zoom out,
 * release) -> SEARCHING elsewhere. State lives in refs; the SVG is updated imperatively.
 */

const IMG_W = 1672;
const IMG_H = 941;

// Points of interest in normalised image coordinates (river bends, clearings, cloud banks,
// contour clusters). Only those currently inside the viewport are used.
const POIS: ReadonlyArray<readonly [number, number]> = [
  [0.39, 0.58], [0.51, 0.47], [0.63, 0.32], [0.8, 0.28], [0.31, 0.84], [0.54, 0.55],
  [0.56, 0.18], [0.9, 0.5], [0.81, 0.68], [0.11, 0.17], [0.32, 0.32], [0.66, 0.48],
];

const ZOOM_MAX = 2.3;
const HEADER_SAFE = 110; // keep targets out from under the nav

type Phase = "scan" | "approach" | "lock" | "zoomIn" | "track" | "zoomOut";
type StatusText = "SEARCHING" | "TARGET ACQUIRED" | "AUTOFOCUS" | "TRACKING" | "REACQUIRING";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export default function ReconBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const zoom = zoomRef.current;
    const svg = svgRef.current;
    if (!wrap || !zoom || !svg) return;

    const q = <T extends Element>(role: string) => svg.querySelector<T>(`[data-r="${role}"]`)!;
    const rectEl = q<SVGPathElement>("rect");
    const marksEl = q<SVGPathElement>("marks");
    const ringG = q<SVGGElement>("ring");
    const ringOuter = q<SVGCircleElement>("ring-outer");
    const ringInner = q<SVGCircleElement>("ring-inner");
    const ringTicks = q<SVGPathElement>("ring-ticks");
    const crossEl = q<SVGPathElement>("cross");
    const beamEl = q<SVGLineElement>("beam");
    const pulseEl = q<SVGCircleElement>("pulse");
    const statusEl = q<SVGTextElement>("status");
    const zoomTxt = q<SVGTextElement>("zoomtxt");
    const img = wrap.querySelector("img");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let vw = wrap.clientWidth || window.innerWidth;
    let vh = wrap.clientHeight || window.innerHeight;
    let posX = 0.5;
    let posY = 0.5;

    const readLayout = () => {
      vw = wrap.clientWidth || window.innerWidth;
      vh = wrap.clientHeight || window.innerHeight;
      if (img) {
        const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
        posX = Number.isFinite(px) ? px : 0.5;
        posY = Number.isFinite(py) ? py : 0.5;
      }
    };

    // Normalised image coords -> viewport px, honouring object-fit: cover + object-position.
    const poiToView = (nx: number, ny: number): [number, number] => {
      const s = Math.max(vw / IMG_W, vh / IMG_H);
      const w = IMG_W * s;
      const h = IMG_H * s;
      return [(vw - w) * posX + nx * w, (vh - h) * posY + ny * h];
    };

    const margin = () => Math.max(70, Math.min(vw, vh) * 0.16);
    const inView = (x: number, y: number) => {
      const m = margin();
      return x > m && x < vw - m && y > Math.max(m, HEADER_SAFE) && y < vh - m;
    };
    const randomPoint = (): [number, number] => {
      const m = margin();
      const y0 = Math.max(m, HEADER_SAFE);
      return [m + Math.random() * (vw - 2 * m), y0 + Math.random() * Math.max(10, vh - m - y0)];
    };

    const S = {
      x: vw * 0.5,
      y: vh * 0.55,
      fx: 0,
      fy: 0,
      tx: 0,
      ty: 0,
      move: 1,
      phase: "scan" as Phase,
      t0: 0,
      dur: 1,
      scansLeft: 1,
      Z: 1,
      k: 1,
      blur: 0,
      pulse: -1,
      ringA: 0,
      lastPoi: -1,
      status: "" as StatusText | "",
      acquired: false,
    };
    let clock = 0;
    let lastTick = 0;
    let raf = 0;
    let running = false;
    let stoppedAt = 0;

    const setStatus = (text: StatusText, acquired: boolean) => {
      if (S.status !== text) {
        S.status = text;
        statusEl.textContent = text;
        statusEl.style.animation = "none";
        void statusEl.getBoundingClientRect();
        statusEl.style.animation = "";
      }
      if (S.acquired !== acquired) {
        S.acquired = acquired;
        svg.dataset.state = acquired ? "acquired" : "search";
      }
    };

    const startPhase = (phase: Phase, dur: number, now: number) => {
      S.phase = phase;
      S.t0 = now;
      S.dur = dur;
      S.fx = S.x;
      S.fy = S.y;
    };

    const beginScan = (now: number) => {
      const [tx, ty] = randomPoint();
      S.tx = tx;
      S.ty = ty;
      S.move = clamp(Math.hypot(tx - S.x, ty - S.y) / 95, 2.6, 6.5);
      startPhase("scan", S.move + 0.9, now); // sweep, then dwell briefly
      setStatus("SEARCHING", false);
    };

    const beginApproach = (now: number) => {
      const candidates = POIS.map((p, i) => ({ i, v: poiToView(p[0], p[1]) })).filter(
        (c) => c.i !== S.lastPoi && inView(c.v[0], c.v[1]),
      );
      const pick = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
      const [tx, ty] = pick ? pick.v : randomPoint();
      if (pick) S.lastPoi = pick.i;
      S.tx = tx;
      S.ty = ty;
      S.move = clamp(Math.hypot(tx - S.x, ty - S.y) / 110, 2.4, 5.5);
      startPhase("approach", S.move + 0.2, now);
      setStatus("SEARCHING", false);
    };

    const next = (now: number) => {
      switch (S.phase) {
        case "scan":
          if (S.scansLeft-- > 0) beginScan(now);
          else beginApproach(now);
          break;
        case "approach":
          zoom.style.transformOrigin = `${S.x}px ${S.y}px`; // fixed for the whole lock; scale is 1 so no jump
          startPhase("lock", 1.8, now);
          setStatus("TARGET ACQUIRED", true);
          break;
        case "lock":
          startPhase("zoomIn", 3.8, now);
          setStatus("AUTOFOCUS", true);
          break;
        case "zoomIn":
          startPhase("track", 3.6, now);
          setStatus("TRACKING", true);
          break;
        case "track":
          startPhase("zoomOut", 3.4, now);
          setStatus("REACQUIRING", true);
          break;
        case "zoomOut":
          S.scansLeft = Math.random() < 0.5 ? 1 : 0;
          beginScan(now);
          break;
      }
    };

    const update = (now: number) => {
      const el = (now - S.t0) / 1000;
      const p = clamp(el / S.dur, 0, 1);
      let jit = 1;
      S.pulse = -1;
      S.blur = 0;

      switch (S.phase) {
        case "scan":
        case "approach": {
          const m = ease(clamp(el / S.move, 0, 1));
          S.x = lerp(S.fx, S.tx, m);
          S.y = lerp(S.fy, S.ty, m);
          S.k = S.phase === "approach" ? lerp(1, 0.9, ease(clamp((el / S.move - 0.6) / 0.4, 0, 1))) : 1;
          S.Z = 1;
          break;
        }
        case "lock":
          S.k = lerp(0.9, 0.78, ease(p));
          S.Z = 1;
          jit = 0.6;
          break;
        case "zoomIn": {
          S.Z = lerp(1, ZOOM_MAX, ease(p));
          S.k = lerp(0.78, 0.55, ease(p));
          // lens defocus while travelling, then rack back to sharp (autofocus)
          if (p < 0.55) S.blur = 1.3 * ease(p / 0.55);
          else {
            const f = ease((p - 0.55) / 0.45);
            S.blur = 1.3 * (1 - f);
            S.pulse = (p - 0.55) / 0.45;
          }
          jit = 0.6;
          break;
        }
        case "track":
          S.Z = ZOOM_MAX;
          S.k = 0.55 + 0.012 * Math.sin(clock * 1.7);
          jit = 0.8;
          break;
        case "zoomOut":
          S.Z = lerp(ZOOM_MAX, 1, ease(p));
          S.k = lerp(0.55, 1, ease(p));
          if (p > 0.45 && S.acquired) setStatus("REACQUIRING", false); // release the target
          jit = 0.8;
          break;
      }
      if (p >= 1) next(now);

      // organic micro-adjustments of the frame (never of the photo layer)
      const jx = jit * 1.8 * (Math.sin(clock * 0.9 + 1) + 0.5 * Math.sin(clock * 2.3));
      const jy = jit * 1.6 * (Math.sin(clock * 1.1 + 2) + 0.5 * Math.sin(clock * 2.9 + 0.5));
      draw(S.x + jx, S.y + jy);
    };

    const draw = (cx: number, cy: number) => {
      // photo layer: lens zoom about the target
      zoom.style.transform = S.Z > 1.0005 ? `scale(${S.Z.toFixed(4)})` : "";
      zoom.style.filter = S.blur > 0.05 ? `blur(${S.blur.toFixed(2)}px)` : "";

      const base = clamp(Math.min(vw, vh) * 0.3, 120, 260);
      const w = base * 1.35 * S.k;
      const h = base * S.k;
      const x0 = cx - w / 2;
      const x1 = cx + w / 2;
      const y0 = cy - h / 2;
      const y1 = cy + h / 2;
      const L = Math.min(w, h) * 0.24;

      rectEl.setAttribute(
        "d",
        `M${x0} ${y0 + L}V${y0}H${x0 + L}M${x1 - L} ${y0}H${x1}V${y0 + L}M${x1} ${y1 - L}V${y1}H${x1 - L}M${x0 + L} ${y1}H${x0}V${y1 - L}`,
      );
      marksEl.setAttribute("d", [
        [x0 - 7, cy], [x1 + 7, cy], [cx, y0 - 7], [cx, y1 + 7],
      ].map(([mx, my]) => `M${mx - 3} ${my}L${mx} ${my - 3}L${mx + 3} ${my}L${mx} ${my + 3}Z`).join(""));

      const r = 0.5 * Math.hypot(base * 1.35, base) * (0.62 + 0.38 * S.k) + 6;
      S.ringA = (S.ringA + 0.12) % 360;
      ringG.setAttribute("transform", `translate(${cx} ${cy}) rotate(${S.ringA.toFixed(2)})`);
      ringOuter.setAttribute("r", String(r));
      ringInner.setAttribute("r", String(r * 0.72));
      ringTicks.setAttribute(
        "d",
        [0, 90, 180, 270].map((a) => {
          const rad = (a * Math.PI) / 180;
          const c = Math.cos(rad);
          const s = Math.sin(rad);
          return `M${(r - 5) * c} ${(r - 5) * s}L${(r + 4) * c} ${(r + 4) * s}`;
        }).join(""),
      );

      crossEl.setAttribute("d", `M${cx - 7} ${cy}H${cx - 2.5}M${cx + 2.5} ${cy}H${cx + 7}M${cx} ${cy - 7}V${cy - 2.5}M${cx} ${cy + 2.5}V${cy + 7}`);

      // slow sweep line inside the frame
      const by = cy + Math.sin(clock * 0.8) * (h / 2 - 3);
      beamEl.setAttribute("x1", String(x0 + 4));
      beamEl.setAttribute("x2", String(x1 - 4));
      beamEl.setAttribute("y1", String(by));
      beamEl.setAttribute("y2", String(by));

      if (S.pulse >= 0) {
        pulseEl.setAttribute("cx", String(cx));
        pulseEl.setAttribute("cy", String(cy));
        pulseEl.setAttribute("r", String(Math.max(w, h) * (0.5 + 0.45 * S.pulse)));
        pulseEl.style.opacity = String(0.55 * (1 - S.pulse));
      } else {
        pulseEl.style.opacity = "0";
      }

      const ty = y1 + 17;
      statusEl.setAttribute("x", String(x0));
      statusEl.setAttribute("y", String(ty));
      // narrow frames (phones, or contracted during zoom): stack the zoom readout under the status
      const narrow = w < 235;
      zoomTxt.setAttribute("text-anchor", narrow ? "start" : "end");
      zoomTxt.setAttribute("x", String(narrow ? x0 : x1));
      zoomTxt.setAttribute("y", String(narrow ? ty + 12 : ty));
      zoomTxt.textContent = `ZOOM ×${S.Z.toFixed(1)}`;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - lastTick, 100);
      lastTick = now;
      clock += dt / 1000;
      update(now);
    };

    const start = () => {
      if (running || reduced.matches || document.hidden) return;
      running = true;
      lastTick = performance.now();
      if (stoppedAt) S.t0 += lastTick - stoppedAt; // resume where we paused (hidden tab), no jump
      stoppedAt = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (running) stoppedAt = performance.now();
      running = false;
      cancelAnimationFrame(raf);
    };

    const drawStatic = () => {
      const poi = POIS.map((p) => poiToView(p[0], p[1])).find((v) => inView(v[0], v[1]));
      const [x, y] = poi ?? [vw * 0.55, vh * 0.5];
      Object.assign(S, { x, y, Z: 1, k: 0.9, blur: 0, pulse: -1 });
      setStatus("SEARCHING", false);
      draw(x, y);
    };

    const onSync = () => {
      if (reduced.matches) {
        stop();
        zoom.style.transform = "";
        zoom.style.filter = "";
        drawStatic();
      } else if (document.hidden) stop();
      else start();
    };
    const onResize = () => {
      readLayout();
      if (reduced.matches) drawStatic();
    };

    readLayout();
    const now0 = performance.now();
    S.x = vw * 0.5;
    S.y = vh * 0.55;
    beginScan(now0);
    if (reduced.matches) drawStatic();
    else draw(S.x, S.y);
    svg.classList.add("is-live");
    start();

    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    document.addEventListener("visibilitychange", onSync);
    reduced.addEventListener("change", onSync);

    return () => {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onSync);
      reduced.removeEventListener("change", onSync);
    };
  }, []);

  return (
    <div ref={wrapRef} className="site-bg" aria-hidden="true">
      <div ref={zoomRef} className="site-bg-zoom">
        <Image src="/images/backdrop-terrain-clean.webp" alt="" fill priority sizes="100vw" />
      </div>
      <svg ref={svgRef} className="recon-reticle" data-state="search" focusable="false">
        <circle data-r="pulse" className="rr-line" style={{ opacity: 0 }} />
        <g data-r="ring">
          <circle data-r="ring-outer" className="rr-line rr-dash" />
          <circle data-r="ring-inner" className="rr-line rr-faint" />
          <path data-r="ring-ticks" className="rr-line" />
        </g>
        <line data-r="beam" className="rr-line rr-faint" />
        <path data-r="rect" className="rr-line rr-strong" />
        <path data-r="marks" className="rr-line rr-marks" />
        <path data-r="cross" className="rr-line" />
        <text data-r="status" className="rr-text" />
        <text data-r="zoomtxt" className="rr-text rr-zoom" textAnchor="end" />
      </svg>
    </div>
  );
}
