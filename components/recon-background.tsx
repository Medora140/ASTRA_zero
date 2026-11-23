"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Fixed site background (terrain photo) plus a drone-camera reticle.
 *
 * Rendering is deliberately compositor-only so it stays smooth:
 *  - the reticle is ~15 small elements positioned with `transform` (no per-frame SVG
 *    repaint or text re-layout); the ring spins via a CSS animation off the main thread
 *  - the reticle layer sits above the shader, so moving it never forces blend recomposites
 *  - optical zoom = `scale()` on the photo layer about the target point
 *  - autofocus defocus = crossfade to a soft (lower-res) copy of the photo instead of a
 *    full-screen `blur()` filter
 *
 * Cycle: SEARCHING (sweeps) -> approach POI -> TARGET ACQUIRED -> AUTOFOCUS (frame
 * contracts, photo zooms, defocus -> focus) -> TRACKING (hold) -> REACQUIRING (zoom out,
 * release) -> SEARCHING elsewhere. State lives in refs; the DOM is updated imperatively.
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
const FRAME_MS = 1000 / 62; // cap updates at ~60fps (no wasted work on 120/144Hz screens)

type Phase = "scan" | "approach" | "lock" | "zoomIn" | "track" | "zoomOut";
type StatusText = "SEARCHING" | "TARGET ACQUIRED" | "AUTOFOCUS" | "TRACKING" | "REACQUIRING";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const half = (v: number) => Math.round(v * 2) / 2; // keeps thin lines crisp

export default function ReconBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const zoom = zoomRef.current;
    const layer = layerRef.current;
    if (!wrap || !zoom || !layer) return;

    const q = <T extends Element>(sel: string) => layer.querySelector<T>(sel)!;
    const qa = <T extends Element>(sel: string) => Array.from(layer.querySelectorAll<T>(sel));
    const root = q<HTMLDivElement>(".rr");
    const ringWrap = q<HTMLDivElement>(".rr-ring-wrap");
    const [cTL, cTR, cBL, cBR] = qa<HTMLElement>(".rr-corner");
    const [mL, mR, mT, mB] = qa<HTMLElement>(".rr-mark");
    const beam = q<HTMLElement>(".rr-beam");
    const pulse = q<HTMLElement>(".rr-pulse");
    const statusEl = q<HTMLElement>(".rr-status");
    const zoomTxt = q<HTMLElement>(".rr-zoomtxt");
    const img = wrap.querySelector("img");
    const soft = zoom.querySelector<HTMLImageElement>(".site-bg-soft");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let vw = wrap.clientWidth || window.innerWidth;
    let vh = wrap.clientHeight || window.innerHeight;
    let posX = 0.5;
    let posY = 0.5;
    let base = 200;
    let ringR = 200;
    let lastL = -1;
    let lastZoomText = "";
    let lastSoft = -1;
    let lastZoomT = "";

    const readLayout = () => {
      vw = wrap.clientWidth || window.innerWidth;
      vh = wrap.clientHeight || window.innerHeight;
      if (img) {
        const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
        posX = Number.isFinite(px) ? px : 0.5;
        posY = Number.isFinite(py) ? py : 0.5;
      }
      base = clamp(Math.min(vw, vh) * 0.3, 120, 260);
      ringR = 0.5 * Math.hypot(base * 1.35, base) + 6; // ring radius at full size
      ringWrap.style.width = ringWrap.style.height = `${ringR * 2}px`;
      ringWrap.style.margin = `${-ringR}px 0 0 ${-ringR}px`;
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
      defocus: 0, // 0 (sharp) .. 1 (fully soft)
      pulse: -1,
      lastPoi: -1,
      status: "" as StatusText | "",
      acquired: false,
    };
    let clock = 0;
    let lastTick = 0;
    let lastDraw = 0;
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
        root.dataset.state = acquired ? "acquired" : "search";
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
      S.defocus = 0;

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
          if (p < 0.55) S.defocus = ease(p / 0.55);
          else {
            S.defocus = 1 - ease((p - 0.55) / 0.45);
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

    // All writes below are transform/opacity only; nothing triggers layout or paint of the page.
    const draw = (cx: number, cy: number) => {
      // photo layer: lens zoom about the target; defocus = crossfade to the soft copy
      const zt = S.Z > 1.0005 ? `scale(${S.Z.toFixed(4)})` : "";
      if (zt !== lastZoomT) {
        zoom.style.transform = zt;
        lastZoomT = zt;
      }
      if (soft) {
        const d = Math.round(S.defocus * 100) / 100;
        if (d !== lastSoft) {
          soft.style.opacity = String(d);
          lastSoft = d;
        }
      }

      root.style.transform = `translate3d(${half(cx)}px,${half(cy)}px,0)`;

      const w = base * 1.35 * S.k;
      const h = base * S.k;
      const hw = w / 2;
      const hh = h / 2;
      const L = Math.round(clamp(Math.min(w, h) * 0.24, 22, 62));
      if (L !== lastL) {
        for (const c of [cTL, cTR, cBL, cBR]) c.style.width = c.style.height = `${L}px`;
        lastL = L;
      }
      cTL.style.transform = `translate3d(${-hw}px,${-hh}px,0)`;
      cTR.style.transform = `translate3d(${hw - L}px,${-hh}px,0)`;
      cBL.style.transform = `translate3d(${-hw}px,${hh - L}px,0)`;
      cBR.style.transform = `translate3d(${hw - L}px,${hh - L}px,0)`;

      mL.style.transform = `translate3d(${-hw - 7}px,0,0) rotate(45deg)`;
      mR.style.transform = `translate3d(${hw + 7}px,0,0) rotate(45deg)`;
      mT.style.transform = `translate3d(0,${-hh - 7}px,0) rotate(45deg)`;
      mB.style.transform = `translate3d(0,${hh + 7}px,0) rotate(45deg)`;

      const r = 0.5 * Math.hypot(base * 1.35, base) * (0.62 + 0.38 * S.k) + 6;
      ringWrap.style.transform = `scale(${(r / ringR).toFixed(4)})`;

      const by = Math.sin(clock * 0.8) * (hh - 3);
      beam.style.transform = `translate3d(${-hw + 4}px,${by.toFixed(2)}px,0) scaleX(${((w - 8) / 100).toFixed(3)})`;

      if (S.pulse >= 0) {
        pulse.style.transform = `scale(${((Math.max(w, h) * (0.5 + 0.45 * S.pulse)) / 50).toFixed(3)})`;
        pulse.style.opacity = String((0.55 * (1 - S.pulse)).toFixed(2));
      } else if (pulse.style.opacity !== "0") {
        pulse.style.opacity = "0";
      }

      // labels under the frame; stack the zoom readout on narrow frames
      const ly = Math.round(hh + 10);
      statusEl.style.transform = `translate3d(${Math.round(-hw)}px,${ly}px,0)`;
      const narrow = w < 235;
      zoomTxt.style.transform = narrow
        ? `translate3d(${Math.round(-hw)}px,${ly + 14}px,0)`
        : `translate3d(${Math.round(hw)}px,${ly}px,0) translateX(-100%)`;
      const zt2 = `ZOOM ×${S.Z.toFixed(1)}`;
      if (zt2 !== lastZoomText) {
        zoomTxt.textContent = zt2;
        lastZoomText = zt2;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - lastDraw < FRAME_MS) return;
      const dt = Math.min(now - (lastTick || now), 100);
      lastTick = now;
      lastDraw = now;
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
      Object.assign(S, { x, y, Z: 1, k: 0.9, defocus: 0, pulse: -1 });
      setStatus("SEARCHING", false);
      draw(x, y);
    };

    const onSync = () => {
      if (reduced.matches) {
        stop();
        zoom.style.transform = "";
        drawStatic();
      } else if (document.hidden) stop();
      else start();
    };
    const onResize = () => {
      readLayout();
      if (reduced.matches) drawStatic();
    };

    readLayout();
    S.x = vw * 0.5;
    S.y = vh * 0.55;
    beginScan(performance.now());
    if (reduced.matches) drawStatic();
    else draw(S.x, S.y);
    layer.classList.add("is-live");
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
    <>
      <div ref={wrapRef} className="site-bg" aria-hidden="true">
        <div ref={zoomRef} className="site-bg-zoom">
          <Image src="/images/backdrop-terrain-clean.webp" alt="" fill priority sizes="100vw" />
          <Image
            className="site-bg-soft"
            src="/images/backdrop-terrain-soft.webp"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            style={{ opacity: 0 }}
          />
        </div>
      </div>
      <div ref={layerRef} className="recon-layer" aria-hidden="true">
        <div className="rr" data-state="search">
          <div className="rr-ring-wrap">
            <svg className="rr-ring" viewBox="-100 -100 200 200" focusable="false">
              <circle r="98" className="rr-dash" />
              <circle r="70" className="rr-faint" />
              <path d="M91 0H103M-91 0H-103M0 91V103M0 -91V-103" className="rr-tick" />
            </svg>
          </div>
          <i className="rr-beam" />
          <i className="rr-corner tl" />
          <i className="rr-corner tr" />
          <i className="rr-corner bl" />
          <i className="rr-corner br" />
          <i className="rr-mark" />
          <i className="rr-mark" />
          <i className="rr-mark" />
          <i className="rr-mark" />
          <svg className="rr-cross" viewBox="-8 -8 16 16" width="16" height="16" focusable="false">
            <path d="M-7 0H-2.5M2.5 0H7M0 -7V-2.5M0 2.5V7" />
          </svg>
          <i className="rr-pulse" />
          <span className="rr-text rr-status" />
          <span className="rr-text rr-zoomtxt" />
        </div>
      </div>
    </>
  );
}
