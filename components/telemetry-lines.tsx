import type { CSSProperties } from "react";

type Tone = "cyan" | "blue" | "orange";

interface Line {
  y: number; // % from top of viewport
  len: number; // px
  dur: number; // s for one pass
  delay: number; // s (negative = already in flight on load)
  rot: number; // deg, tilts the whole track
  o: number; // base opacity (brightens to ~1.7x mid-flight)
  tone: Tone;
  rev?: boolean; // travels right-to-left
  mobile?: boolean; // kept on small screens
}

// Hand-placed and deliberately sparse: >=10% vertical spacing so trails never
// stack, near-flat angles so they never cross, very low opacity. Cyan leads,
// blue is secondary, a single faint orange line is the only accent.
const lines: Line[] = [
  { y: 10, len: 260, dur: 150, delay: -40, rot: 0, o: 0.14, tone: "cyan", mobile: true },
  { y: 23, len: 160, dur: 118, delay: -90, rot: -2, o: 0.11, tone: "blue", rev: true },
  { y: 36, len: 220, dur: 165, delay: -20, rot: 2, o: 0.13, tone: "cyan" },
  { y: 49, len: 130, dur: 104, delay: -60, rot: 0, o: 0.1, tone: "orange" },
  { y: 61, len: 280, dur: 176, delay: -120, rot: -3, o: 0.13, tone: "cyan", rev: true, mobile: true },
  { y: 73, len: 170, dur: 128, delay: -35, rot: 3, o: 0.1, tone: "blue" },
  { y: 84, len: 240, dur: 158, delay: -75, rot: 0, o: 0.14, tone: "cyan", mobile: true },
  { y: 93, len: 120, dur: 112, delay: -5, rot: 0, o: 0.1, tone: "blue", rev: true },
];

const curves = [
  { d: "M-60 640 C 320 560, 520 760, 900 600 S 1400 470, 1520 520", tone: "cyan", dur: 90, delay: -14, mobile: true },
  { d: "M-60 210 C 280 260, 600 120, 960 190 S 1380 300, 1520 250", tone: "blue", dur: 110, delay: -52 },
] as const;

export function TelemetryLines() {
  return (
    <div className="telemetry-lines" aria-hidden="true">
      <svg className="tl-curves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        {curves.map((c, i) => (
          <g
            key={i}
            className={`tl-curve tl-${c.tone}${"mobile" in c ? " tl-m" : ""}`}
            style={{ "--dur": `${c.dur}s`, "--delay": `${c.delay}s` } as CSSProperties}
          >
            <path className="tl-base" d={c.d} pathLength={100} />
            <path className="tl-dash tl-dash-glow" d={c.d} pathLength={100} />
            <path className="tl-dash" d={c.d} pathLength={100} />
          </g>
        ))}
      </svg>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`tl-track tl-${l.tone}${l.mobile ? " tl-m" : ""}`}
          style={
            {
              "--y": `${l.y}%`,
              "--rot": `${l.rot}deg`,
              "--len": `${l.len}px`,
              "--dur": `${l.dur}s`,
              "--delay": `${l.delay}s`,
              "--o": l.o,
            } as CSSProperties
          }
        >
          <span className={`tl-line${l.rev ? " tl-rev" : ""}`} />
        </div>
      ))}
    </div>
  );
}
