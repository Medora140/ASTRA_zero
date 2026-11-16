"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
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
  target?: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
  isFlipped: boolean;
  onToggleFlip: () => void;
  isStatic?: boolean;
}

const CARD_WIDTH = 135;
const CARD_HEIGHT = 185;

function FlipCard({ station, index, target, isFlipped, onToggleFlip, isStatic = false }: FlipCardProps) {
  const cardId = useId();

  const cardContent = (
    <button
      type="button"
      id={cardId}
      onClick={onToggleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleFlip();
        }
      }}
      aria-label={`Station ${station.id} - ${station.name}. ${isFlipped ? "Showing details. Click to flip to front." : "Click to view dossier."}`}
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
              {station.name.replace("OUTPOST ", "").replace("RELAY ", "").replace("GATEWAY ", "").replace("TERMINAL ", "").replace("STATION ", "")}
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
      <div className="h-[210px] w-full group focus:outline-none" style={{ perspective: "1000px" }}>
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      animate={{
        x: target?.x ?? 0,
        y: target?.y ?? 0,
        rotate: target?.rotation ?? 0,
        scale: target?.scale ?? 1,
        opacity: target?.opacity ?? 1,
      }}
      transition={{
        type: "spring",
        stiffness: 45,
        damping: 18,
      }}
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group focus:outline-none"
    >
      {cardContent}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 1200, height: 700 });

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsNarrowScreen(width < 1024);
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth || width,
          height: containerRef.current.clientHeight || height,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateSize);
      };
    }

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const morphProgress = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 45, damping: 20 });

  const rotationProgress = useTransform(scrollYProgress, [0.45, 1], [0, 180]);
  const smoothRotation = useSpring(rotationProgress, { stiffness: 45, damping: 20 });

  const [morphValue, setMorphValue] = useState(0);
  const [rotValue, setRotValue] = useState(0);

  useEffect(() => {
    const unsubMorph = smoothMorph.on("change", setMorphValue);
    const unsubRot = smoothRotation.on("change", setRotValue);
    return () => {
      unsubMorph();
      unsubRot();
    };
  }, [smoothMorph, smoothRotation]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = stations.length;

  // Responsive Grid for Mobile/Tablet or Reduced Motion
  if (mounted && (shouldReduceMotion || isNarrowScreen)) {
    return (
      <section
        className={cn("w-full bg-[var(--obsidian)] border-y border-[var(--grid)] py-14 sm:py-20 image-section", className)}
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

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
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

  // Desktop interactive scroll-driven morph (>= 1024px)
  const circleRadius = Math.min(containerDimensions.width * 0.32, 280);
  const arcRadius = Math.min(containerDimensions.width * 0.42, 380);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-[220vh] bg-[var(--obsidian)] image-section", className)}
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
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center">
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
            Eight interconnected nodes carry messages through the network. Scroll to rotate the topology ring; click any card to inspect its dossier.
          </p>
        </div>

        {/* Orbit Crosshair & Compass */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div
            className="w-[520px] h-[520px] rounded-full border border-[var(--grid)]/70"
            style={{ transform: `rotate(${rotValue * 0.4}deg)` }}
          />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[var(--phosphor)]/30" />
          <div className="absolute font-mono text-[10px] text-[var(--steel)] tracking-widest uppercase">
            [ MESH TOPOLOGY // 8 CHANNELS ]
          </div>
        </div>

        {/* Interactive Station Flip Cards Matrix */}
        <div className="relative w-full h-full flex items-center justify-center">
          {stations.map((station, i) => {
            const initialAngle = (i / total) * Math.PI * 2;
            const circleX = Math.cos(initialAngle) * circleRadius;
            const circleY = Math.sin(initialAngle) * circleRadius + 20;

            const arcAngle = ((i - (total - 1) / 2) / total) * (Math.PI * 0.85);
            const arcX = Math.sin(arcAngle) * arcRadius;
            const arcY = Math.cos(arcAngle) * (arcRadius * 0.45) + 160;

            const currentX = circleX + (arcX - circleX) * morphValue;
            const currentY = circleY + (arcY - circleY) * morphValue;
            const currentRotation =
              ((arcAngle * 180) / Math.PI) * morphValue + (1 - morphValue) * ((initialAngle * 180) / Math.PI - 90);

            return (
              <FlipCard
                key={station.id}
                station={station}
                index={i}
                target={{
                  x: currentX,
                  y: currentY,
                  rotation: currentRotation * 0.45,
                  scale: 1,
                  opacity: 1,
                }}
                isFlipped={Boolean(flippedCards[station.id])}
                onToggleFlip={() => toggleFlip(station.id)}
              />
            );
          })}
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
