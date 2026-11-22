"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export interface StationData {
  id: string;
  name: string;
  freq: string;
  sector: string;
  status: string;
  imageSrc: string;
  clue: string;
  bandwidth: string;
}

export const NETWORK_STATIONS: StationData[] = [
  {
    id: "N01",
    name: "OUTPOST ALPHA",
    freq: "142.85 MHz",
    sector: "SEC-NORTH-1",
    status: "RELAY ACTIVE",
    imageSrc: "/images/stations/n01.webp",
    clue: "Perimeter landmark matched with thermal telemetry.",
    bandwidth: "32 kbps telemetry",
  },
  {
    id: "N02",
    name: "OUTPOST BRAVO",
    freq: "228.40 MHz",
    sector: "SEC-NORTH-2",
    status: "SIGNAL NOMINAL",
    imageSrc: "/images/stations/n02.webp",
    clue: "Carrier signal reflects secondary harmonic distortion.",
    bandwidth: "64 kbps digital",
  },
  {
    id: "N03",
    name: "RELAY CHARLIE",
    freq: "315.10 MHz",
    sector: "SEC-EAST-1",
    status: "TRAFFIC DENSE",
    imageSrc: "/images/stations/n03.webp",
    clue: "Heavy relay packet load during incident timestamp.",
    bandwidth: "128 kbps mesh",
  },
  {
    id: "N04",
    name: "GATEWAY DELTA",
    freq: "440.05 MHz",
    sector: "SEC-CENTRAL",
    status: "MESH HUB",
    imageSrc: "/images/stations/n04.webp",
    clue: "Central topological junction connecting four sub-nodes.",
    bandwidth: "256 kbps backbone",
  },
  {
    id: "N05",
    name: "BEACON ECHO",
    freq: "512.90 MHz",
    sector: "SEC-WEST-1",
    status: "TELEMETRY SYNC",
    imageSrc: "/images/stations/n05.webp",
    clue: "Autonomous rescue ping acknowledged at 02:14:08.",
    bandwidth: "48 kbps pulsed",
  },
  {
    id: "N06",
    name: "TERMINAL FOXTROT",
    freq: "618.30 MHz",
    sector: "SEC-SOUTH-1",
    status: "PACKET BURST",
    imageSrc: "/images/stations/n06.webp",
    clue: "Burst communication captured before routing timeout.",
    bandwidth: "96 kbps burst",
  },
  {
    id: "N07",
    name: "STATION GOLF",
    freq: "725.60 MHz",
    sector: "SEC-SOUTH-2",
    status: "CARRIER DETECT",
    imageSrc: "/images/stations/n07.webp",
    clue: "Signal parity mismatch reported in local event logs.",
    bandwidth: "64 kbps carrier",
  },
  {
    id: "N08",
    name: "OUTPOST HOTEL",
    freq: "840.15 MHz",
    sector: "SEC-PERIMETER",
    status: "MONITORING",
    imageSrc: "/images/stations/n08.webp",
    clue: "Peripheral beacon observing outer boundary relays.",
    bandwidth: "32 kbps beacon",
  },
];

interface FlipCardProps {
  station: StationData;
  index: number;
  isFlipped: boolean;
  onToggleFlip: () => void;
  isStatic?: boolean;
}

const CARD_WIDTH = 135;
const CARD_HEIGHT = 185;

function FlipCard({ station, index, isFlipped, onToggleFlip, isStatic = false }: FlipCardProps) {
  const cardId = useId();
  const shortName = station.name
    .replace("OUTPOST ", "")
    .replace("RELAY ", "")
    .replace("GATEWAY ", "")
    .replace("TERMINAL ", "")
    .replace("STATION ", "");

  const cardContent = (
    <button
      type="button"
      id={cardId}
      onClick={onToggleFlip}
      aria-label={`${station.id} ${shortName}. ${isFlipped ? "Dossier open; activate to show station image." : "Activate to view dossier."}`}
      aria-expanded={isFlipped}
      className="relative h-full w-full cursor-pointer rounded-lg border border-[var(--grid)] bg-[var(--slate)] text-left focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2 transition-all duration-200 hover:border-[var(--phosphor)]/60 hover:shadow-[0_0_20px_rgba(0,230,118,0.18)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 220, damping: 20 }}
      >
        {/* Front Face: Visual radar & station ID */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-[var(--slate)] p-3 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex items-center justify-between border-b border-[var(--grid)] pb-1.5">
            <span className="font-mono text-[10px] font-bold text-[var(--phosphor)] tracking-wider">
              {station.id}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] pulse-indicator" />
          </div>

          <div className="relative w-full h-[95px] my-1.5 rounded overflow-hidden bg-[var(--obsidian)] border border-[var(--grid)]">
            <Image
              src={station.imageSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--slate)] via-transparent to-transparent opacity-60" />
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold text-xs uppercase text-[var(--titanium)] truncate">
              {shortName}
            </span>
            <span className="font-mono text-[8px] text-[var(--steel)] tracking-tight">
              {station.freq}
            </span>
          </div>
        </div>

        {/* Back Face: Tactical telemetry context */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-[var(--slate-raised)] p-3 border border-[var(--grid)] flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[var(--grid)] pb-1">
              <span className="font-mono text-[9px] font-bold text-[var(--amber)]">
                DOSSIER // {station.id}
              </span>
              <span className="font-mono text-[8px] text-[var(--steel)]">0{index + 1}/08</span>
            </div>
            <p className="mt-2 font-mono text-[9px] text-[var(--titanium)] leading-snug">
              {station.clue}
            </p>
          </div>

          <div className="space-y-1 border-t border-[var(--grid)] pt-1.5 text-[8px] font-mono">
            <div className="flex justify-between text-[var(--steel)]">
              <span>BAND:</span>
              <span className="text-[var(--titanium)]">{station.bandwidth}</span>
            </div>
            <div className="flex justify-between text-[var(--steel)]">
              <span>STATE:</span>
              <span className="text-[var(--phosphor)] font-semibold">{station.status}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </button>
  );

  if (isStatic) {
    return (
      <div className="station-card group focus:outline-none" style={{ perspective: "1000px" }}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

function OrbitStationCard({
  station,
  index,
  total,
  columns,
  progress,
  isFlipped,
  onToggleFlip,
}: {
  station: StationData;
  index: number;
  total: number;
  columns: number;
  progress: MotionValue<number>;
  isFlipped: boolean;
  onToggleFlip: () => void;
}) {
  const initialAngle = (index / total) * Math.PI * 2;
  const column = index % columns;
  const row = Math.floor(index / columns);
  const rows = Math.ceil(total / columns);
  const gridX = (column - (columns - 1) / 2) * (CARD_WIDTH + 24);
  const gridY = (row - (rows - 1) / 2) * (CARD_HEIGHT + 20) + 35;
  const x = useTransform(progress, [0, 1], [gridX + Math.sin(initialAngle) * 4, gridX]);
  const y = useTransform(progress, [0, 1], [gridY + Math.cos(initialAngle) * 4, gridY]);
  const rotationStart = ((index % columns) - (columns - 1) / 2) * 1.5;
  const rotate = useTransform(progress, [0, 1], [rotationStart, 0]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group focus:outline-none"
    >
      <FlipCard
        station={station}
        index={index}
        isFlipped={isFlipped}
        onToggleFlip={onToggleFlip}
      />
    </motion.div>
  );
}

export function ScrollMorphHero({
  stations = NETWORK_STATIONS,
  className,
}: {
  stations?: StationData[];
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isDesktopInteractive, setIsDesktopInteractive] = useState(false);

  useEffect(() => {
    const breakpoint = Number.parseFloat(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--desktop-layout-breakpoint"),
    );
    const desktopQuery = window.matchMedia(`(min-width: ${breakpoint + 1}px)`);
    const updateSize = () => setIsDesktopInteractive(desktopQuery.matches);
    updateSize();
    window.addEventListener("resize", updateSize);
    desktopQuery.addEventListener("change", updateSize);

    gsap.registerPlugin(ScrollTrigger);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateSize);
      desktopQuery.removeEventListener("change", updateSize);
    };
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Responsive Grid for Mobile/Tablet or Reduced Motion
  if (!isDesktopInteractive || shouldReduceMotion) {
    return (
      <section
        className={cn("scroll-morph-section w-full bg-[var(--obsidian)] border-y border-[var(--grid)] py-14 sm:py-20", className)}
        aria-label="Communication network stations overview"
      >
        <Image
          className="section-backdrop backdrop-medium"
          src="/images/backdrop-signal-nodes.webp"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
        />
        <div className="wrap">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-[var(--slate)] border border-[var(--grid)] text-[var(--phosphor)] font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-3">
              OPERATION: COMPROMISED NODE // TOPOLOGY BRIEF
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[var(--titanium)] uppercase tracking-wide">
              The Eight <span className="text-[var(--phosphor)]">Stations</span>
            </h2>
            <p className="text-[var(--steel)] max-w-xl mx-auto text-xs sm:text-sm font-sans mt-3">
              Eight interconnected nodes carry network transmissions. Tap any station dossier card to flip and inspect telemetry clues.
            </p>
          </div>

          <div className="station-grid grid grid-cols-1 min-[381px]:grid-cols-2 min-[701px]:grid-cols-4 gap-3 sm:gap-5">
            {stations.map((station, i) => (
              <FlipCard
                key={station.id}
                station={station}
                index={i}
                isFlipped={Boolean(flippedCards[station.id])}
                onToggleFlip={() => toggleFlip(station.id)}
                isStatic
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[9px] sm:text-[10px] text-[var(--steel)] tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[var(--phosphor)]" /> ACTIVE RELAY
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-[var(--amber)]" /> CLASSIFIED DOSSIER
            </span>
            <span className="text-[var(--titanium)]">TAP ANY CARD TO FLIP</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <InteractiveStationLayout
      stations={stations}
      flippedCards={flippedCards}
      onToggleFlip={toggleFlip}
      className={className}
    />
  );
}

function InteractiveStationLayout({
  stations,
  flippedCards,
  onToggleFlip,
  className,
}: {
  stations: StationData[];
  flippedCards: Record<string, boolean>;
  onToggleFlip: (id: string) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const morphProgress = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 45, damping: 20 });
  const rotationProgress = useTransform(scrollYProgress, [0.45, 1], [0, 180]);
  const smoothRotation = useSpring(rotationProgress, { stiffness: 45, damping: 20 });
  const compassRotation = useTransform(smoothRotation, (rotation) => rotation * 0.4);
  const total = stations.length;
  const columns = Math.min(total, 4) || 1;

  return (
    <div
      ref={containerRef}
      className={cn("scroll-morph-section relative z-0 w-full min-h-[220vh] bg-[var(--obsidian)]", className)}
      role="region"
      aria-label="Interactive 8-node tactical communications matrix"
    >
      <Image
        className="section-backdrop backdrop-medium"
        src="/images/backdrop-signal-nodes.webp"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
      />
      <div className="sticky top-0 h-[100dvh] min-h-[620px] w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(35, 45, 63, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 45, 63, 0.45) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* Tactical Header Overlay */}
        <div className="absolute top-12 z-20 flex flex-col items-center text-center px-4 pointer-events-none select-none max-w-2xl">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--phosphor)] flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] pulse-indicator" />
            OPERATION: COMPROMISED NODE // TOPOLOGY BRIEF
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-[var(--titanium)] tracking-tight">
            The Eight <span className="text-[var(--phosphor)]">Stations</span>
          </h2>
          <p className="text-[var(--steel)] text-xs md:text-sm font-sans mt-2 max-w-lg">
            Eight interconnected nodes carry messages through the network. Scroll to align the topology matrix; click any card to inspect its dossier.
          </p>
        </div>

        {/* Orbit Crosshair & Compass */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <motion.div
            className="w-[min(520px,70vw)] aspect-square rounded-full border border-[var(--grid)]/70"
            style={{ rotate: compassRotation }}
          />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[var(--phosphor)]/30" />
          <div className="absolute font-mono text-[10px] text-[var(--steel)] tracking-widest uppercase">
            [ MESH TOPOLOGY // 8 CHANNELS ]
          </div>
        </div>

        {/* Interactive Station Flip Cards Matrix */}
        <div className="relative w-full h-full flex items-center justify-center">
          {stations.map((station, index) => (
            <OrbitStationCard
              key={station.id}
              station={station}
              index={index}
              total={total}
              columns={columns}
              progress={smoothMorph}
              isFlipped={Boolean(flippedCards[station.id])}
              onToggleFlip={() => onToggleFlip(station.id)}
            />
          ))}
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-6 z-20 flex items-center justify-center gap-6 font-mono text-[10px] text-[var(--steel)] tracking-widest uppercase pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[var(--phosphor)]" /> ACTIVE RELAY
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[var(--amber)]" /> CLASSIFIED DOSSIER
          </span>
          <span className="text-[var(--titanium)]">CLICK CARD TO FLIP</span>
        </div>
      </div>
    </div>
  );
}

export default ScrollMorphHero;
