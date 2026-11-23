"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  type MotionValue,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { event } from "@/lib/event";

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
    imageSrc: "/images/stations/n01_pic.webp",
    clue: "Perimeter landmark matched with thermal telemetry.",
    bandwidth: "32 kbps telemetry",
  },
  {
    id: "N02",
    name: "OUTPOST BRAVO",
    freq: "228.40 MHz",
    sector: "SEC-NORTH-2",
    status: "SIGNAL NOMINAL",
    imageSrc: "/images/stations/n02_pic.webp",
    clue: "Carrier signal reflects secondary harmonic distortion.",
    bandwidth: "64 kbps digital",
  },
  {
    id: "N03",
    name: "RELAY CHARLIE",
    freq: "315.10 MHz",
    sector: "SEC-EAST-1",
    status: "TRAFFIC DENSE",
    imageSrc: "/images/stations/n03_pic.webp",
    clue: "Heavy relay packet load during incident timestamp.",
    bandwidth: "128 kbps mesh",
  },
  {
    id: "N04",
    name: "GATEWAY DELTA",
    freq: "440.05 MHz",
    sector: "SEC-CENTRAL",
    status: "MESH HUB",
    imageSrc: "/images/stations/n04_pic.webp",
    clue: "Central topological junction connecting four sub-nodes.",
    bandwidth: "256 kbps backbone",
  },
  {
    id: "N05",
    name: "BEACON ECHO",
    freq: "512.90 MHz",
    sector: "SEC-WEST-1",
    status: "TELEMETRY SYNC",
    imageSrc: "/images/stations/n05_pic.webp",
    clue: "Autonomous rescue ping acknowledged at 02:14:08.",
    bandwidth: "48 kbps pulsed",
  },
  {
    id: "N06",
    name: "TERMINAL FOXTROT",
    freq: "618.30 MHz",
    sector: "SEC-SOUTH-1",
    status: "PACKET BURST",
    imageSrc: "/images/stations/n06_pic.webp",
    clue: "Burst communication captured before routing timeout.",
    bandwidth: "96 kbps burst",
  },
  {
    id: "N07",
    name: "STATION GOLF",
    freq: "725.60 MHz",
    sector: "SEC-SOUTH-2",
    status: "CARRIER DETECT",
    imageSrc: "/images/stations/n07_pic.webp",
    clue: "Signal parity mismatch reported in local event logs.",
    bandwidth: "64 kbps carrier",
  },
  {
    id: "N08",
    name: "OUTPOST HOTEL",
    freq: "840.15 MHz",
    sector: "SEC-PERIMETER",
    status: "MONITORING",
    imageSrc: "/images/stations/n08_pic.webp",
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
    <div
      role="button"
      tabIndex={0}
      id={cardId}
      onClick={onToggleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleFlip();
        }
      }}
      aria-label={`${station.id} ${shortName}. ${isFlipped ? "Dossier open; activate to show station image." : "Activate to view dossier."}`}
      aria-pressed={isFlipped}
      className="station-card-button relative h-full w-full cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
      >
        {/* Front Face: Visual radar & station ID */}
        <div
          className="station-card-face border border-[var(--grid)]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
        >
          <Image
            src={station.imageSrc}
            alt=""
            fill
            sizes="(max-width: 380px) 86vw, (max-width: 700px) 46vw, (max-width: 940px) 23vw, 160px"
            className="station-card-image"
          />
          <div className="station-card-vignette" aria-hidden="true" />
          <div className="station-card-header">
            <span className="station-card-id">{station.id}</span>
            <span className="station-card-sector" title={station.sector}>{station.sector}</span>
          </div>
          <div className="station-card-footer">
            <strong className="station-card-name" title={shortName}>{shortName}</strong>
            <span className="station-card-frequency">{station.freq}</span>
            <span className="station-card-status" title={station.status}>{station.status}</span>
          </div>
        </div>

        {/* Back Face: Tactical telemetry context */}
        <div
          className="station-card-back absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-[var(--slate-raised)] p-3 border border-[var(--grid)] flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <div className="flex items-center justify-between border-b border-[var(--grid)] pb-1">
              <span className="font-mono text-[10px] font-bold text-[var(--amber)]">
                DOSSIER // {station.id}
              </span>
              <span className="font-mono text-[10px] text-[var(--steel)]">0{index + 1}/08</span>
            </div>
            <p className="station-card-clue mt-2 font-mono text-[10px] text-[var(--titanium)] leading-snug">
              {station.clue}
            </p>
          </div>

          <div className="space-y-1 border-t border-[var(--grid)] pt-1.5 text-[10px] font-mono">
            <div className="flex justify-between text-[var(--steel)]">
              <span>BAND:</span>
              <span className="station-card-value text-[var(--titanium)]">{station.bandwidth}</span>
            </div>
            <div className="flex justify-between text-[var(--steel)]">
              <span>STATE:</span>
              <span className="station-card-value text-[var(--phosphor)] font-semibold">{station.status}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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
  const revealVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, delay: index * 0.06, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={revealVariants}
      className="station-card-reveal"
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        left: "50%",
        top: "50%",
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -CARD_HEIGHT / 2,
      }}
    >
      <motion.div
        style={{
          x,
          y,
          rotate,
          position: "absolute",
          inset: 0,
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
        {event.showBackdrops && (
          <Image
            className="section-backdrop backdrop-medium"
            src="/images/backdrop-signal-nodes.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
          />
        )}
        <div className="wrap">
          <div className="station-intro mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-[var(--slate)] border border-[var(--grid)] text-[var(--phosphor)] font-mono text-[10px] sm:text-[10px] tracking-widest uppercase mb-3">
              OPERATION: COMPROMISED NODE // TOPOLOGY BRIEF
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[var(--titanium)] uppercase tracking-wide">
              The Eight <span className="text-[var(--accent)]">Stations</span>
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

          <div className="station-legend mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-[10px] text-[var(--steel)] tracking-widest uppercase">
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
  const isInView = useInView(containerRef, { once: true, amount: 0.08 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const morphProgress = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 180, damping: 26, mass: 0.5 });
  const rotationProgress = useTransform(scrollYProgress, [0.45, 1], [0, 180]);
  const smoothRotation = useSpring(rotationProgress, { stiffness: 180, damping: 26, mass: 0.5 });
  const compassRotation = useTransform(smoothRotation, (rotation) => rotation * 0.4);
  const total = stations.length;
  const columns = Math.min(total, 4) || 1;

  return (
    <div
      ref={containerRef}
      className={cn("scroll-morph-section relative z-0 w-full min-h-[145vh] bg-[var(--obsidian)]", className)}
      role="region"
      aria-label="Interactive 8-node tactical communications matrix"
    >
      <motion.div
        className="sticky top-0 h-[100dvh] min-h-[620px] w-full overflow-hidden flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {event.showBackdrops && (
          <Image
            className="section-backdrop backdrop-medium"
            src="/images/backdrop-signal-nodes.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
          />
        )}
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(48, 59, 49, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(48, 59, 49, 0.45) 1px, transparent 1px)",
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
            The Eight <span className="text-[var(--accent)]">Stations</span>
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
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: {} }}
        >
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
        </motion.div>

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
      </motion.div>
    </div>
  );
}

export default ScrollMorphHero;
