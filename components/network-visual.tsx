import Image from "next/image";

const nodes = [
  { id: "N01", x: 66, y: 68 },
  { id: "N02", x: 210, y: 48 },
  { id: "N03", x: 402, y: 78 },
  { id: "N04", x: 42, y: 183 },
  { id: "N05", x: 222, y: 166 },
  { id: "N06", x: 438, y: 180 },
  { id: "N07", x: 142, y: 274 },
  { id: "N08", x: 352, y: 274 },
] as const;

const links = [
  [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [1, 5], [2, 5],
  [3, 4], [3, 6], [4, 5], [4, 6], [4, 7], [5, 7], [6, 7],
] as const;

export function NetworkVisual({ variant = "brief" }: { variant?: "brief" | "twist" }) {
  const isTwist = variant === "twist";
  const titleId = `network-title-${variant}`;

  return (
    <figure className={`round-visual network-visual${isTwist ? " network-visual-twist" : ""}`}>
      <div className="network-surface">
        <Image
          className="network-background"
          src={isTwist ? "/images/Screenshot%202026-11-13%20185153.png" : "/images/Screenshot%202026-11-13%20185218.png"}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 700px) 92vw, 46vw"
        />
        <svg className="network-map" viewBox="0 0 480 320" role="img" aria-labelledby={titleId}>
          <title id={titleId}>Eight interconnected communication stations</title>
          <desc>All eight stations are shown in the same style. No station is identified as the compromised one.</desc>
          <defs>
            <radialGradient id={`node-glow-${variant}`}>
              <stop offset="0" stopColor="#00E676" stopOpacity=".18" />
              <stop offset="1" stopColor="#00E676" stopOpacity="0" />
            </radialGradient>
          </defs>
          {links.map(([from, to], index) => {
            const a = nodes[from];
            const b = nodes[to];
            return (
              <g key={`${from}-${to}`}>
                <path className="network-link" d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />
                <path className={`network-flow flow-${index % 4}`} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} />
              </g>
            );
          })}
          {nodes.map((node, index) => (
            <g className={`network-node network-node-${index + 1}`} key={node.id} transform={`translate(${node.x} ${node.y})`}>
              <circle className="network-node-glow" r="34" fill={`url(#node-glow-${variant})`} />
              <circle className="network-node-ring" r="18" />
              <circle className="network-node-core" r="3" />
              <text y="34" textAnchor="middle">{node.id}</text>
            </g>
          ))}
        </svg>
        <span className="network-caption-label">DISTRIBUTED COMMUNICATION NETWORK</span>
      </div>
      {!isTwist && (
        <figcaption className="network-context">
          <Image src="/images/context-landmark.png" alt="Illustration of a nearby landmark used as one type of contextual clue" width={220} height={217} />
          <span><strong>A LANDMARK IS ONE CLUE.</strong><small>COMPARE IT WITH THE MAP, ENVIRONMENT, AND OTHER CONTEXT.</small></span>
        </figcaption>
      )}
    </figure>
  );
}
