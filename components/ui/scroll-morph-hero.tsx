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
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
  isFlipped: boolean;
  onToggleFlip: () => void;
}

const CARD_WIDTH = 130;
const CARD_HEIGHT = 175;

function FlipCard({ station, index, target, isFlipped, onToggleFlip }: FlipCardProps) {
  const cardId = useId();

  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
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
        className="relative h-full w-full cursor-pointer rounded-lg border border-[var(--grid)] bg-[var(--slate)] text-left focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2 transition-shadow hover:border-[var(--phosphor)]/60 hover:shadow-[0_0_20px_rgba(0,230,118,0.15)]"
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
            className="absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-[var(--slate)] p-2.5 flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--grid)] pb-1.5">
              <span className="font-mono text-[9px] font-bold text-[var(--phosphor)] tracking-wider">
                {station.id}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--phosphor)]" />
            </div>

            <div className="relative w-full h-[85px] my-1 rounded overflow-hidden bg-[var(--obsidian)] border border-[var(--grid)]">
              <Image
                src={station.imageSrc}
                alt=""
                fill
                sizes="130px"
                className="object-cover opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--slate)] via-transparent to-transparent" />
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
            className="absolute inset-0 h-full w-full overflow-hidden rounded-lg bg-[var(--slate-raised)] p-2.5 border border-[var(--grid)] flex flex-col justify-between"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div>
              <div className="flex items-center justify-between border-b border-[var(--grid)] pb-1">
                <span className="font-mono text-[8px] font-bold text-[var(--amber)]">
                  DOSSIER // {station.id}
                </span>
                <span className="font-mono text-[7px] text-[var(--steel)]">0{index + 1}/08</span>
              </div>
              <p className="mt-1.5 font-mono text-[8px] text-[var(--titanium)] leading-tight line-clamp-3">
                {station.clue}
              </p>
            </div>

            <div className="space-y-0.5 border-t border-[var(--grid)] pt-1 text-[7px] font-mono">
              <div className="flex justify-between text-[var(--steel)]">
                <span>BAND:</span>
                <span className="text-[var(--titanium)]">{station.bandwidth}</span>
              </div>
              <div className="flex justify-between text-[var(--steel)]">
                <span>STATE:</span>
                <span className="text-[var(--phosphor)]">{station.status}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </button>
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
  const [containerDimensions, setContainerDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth || window.innerWidth,
          height: containerRef.current.clientHeight || 600,
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

  // Smooth springs for rotation and progression
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

  // Reduced motion: static, accessible grid
  if (mounted && shouldReduceMotion) {
    return (
      <section
        className={cn("w-full bg-[var(--obsidian)] border-y border-[var(--grid)] py-16", className)}
        aria-label="Communication network stations overview"
      >
        <div className="wrap">
          <div className="mb-10 text-center">
            <span className="inline-block px-3 py-1 bg-[var(--slate)] border border-[var(--grid)] text-[var(--phosphor)] font-mono text-[10px] tracking-widest uppercase mb-3">
              OPERATION: COMPROMISED NODE
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[var(--titanium)] uppercase tracking-wide">
              08-Station <span className="text-[var(--phosphor)]">Communication Mesh</span>
            </h2>
            <p className="text-[var(--steel)] max-w-xl mx-auto text-xs md:text-sm font-sans mt-3">
              Explore the eight stations carrying network messages. Flip any station dossier to inspect telemetry clues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stations.map((station, i) => (
              <div
                key={station.id}
                className="rounded-lg border border-[var(--grid)] bg-[var(--slate)] p-4 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--grid)] mb-3">
                    <span className="font-mono text-xs font-bold text-[var(--phosphor)]">
                      {station.id}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--amber)]">
                      {station.status}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--titanium)] mb-1">
                    {station.name}
                  </h3>
                  <p className="font-mono text-[10px] text-[var(--steel)] mb-2">{station.freq} · {station.sector}</p>
                  <p className="font-mono text-xs text-[var(--titanium)]">{station.clue}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-[var(--grid)] flex items-center justify-between font-mono text-[9px] text-[var(--steel)]">
                  <span>BANDWIDTH</span>
                  <span className="text-[var(--phosphor)]">{station.bandwidth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Interactive scroll-driven morph
  const centerX = 0;
  const centerY = 0;
  const isMobile = containerDimensions.width < 768;
  const circleRadius = isMobile ? Math.min(containerDimensions.width * 0.38, 140) : Math.min(containerDimensions.width * 0.32, 280);
  const arcRadius = isMobile ? Math.min(containerDimensions.width * 0.55, 220) : Math.min(containerDimensions.width * 0.42, 380);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-[200vh] md:h-[240vh] bg-[var(--obsidian)]", className)}
      aria-label="Interactive 8-node tactical communications matrix"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(35, 45, 63, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 45, 63, 0.45) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* Tactical Header Overlay */}
        <div className="absolute top-12 z-20 flex flex-col items-center text-center px-4 pointer-events-none select-none max-w-2xl">
          <p className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-[var(--phosphor)] flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--phosphor)] pulse-indicator" />
            OPERATION: COMPROMISED NODE // TOPOLOGY BRIEF
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase text-[var(--titanium)] tracking-tight">
            The Eight <span className="text-[var(--phosphor)]">Stations</span>
          </h2>
          <p className="text-[var(--steel)] text-xs md:text-sm font-sans mt-2 max-w-lg">
            Eight interconnected nodes carry messages through the network. Scroll to rotate the topology ring; click any card to inspect its dossier.
          </p>
        </div>

        {/* Orbit Crosshair & Compass */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div
            className="w-[280px] h-[280px] md:w-[540px] md:h-[540px] rounded-full border border-[var(--grid)]/60"
            style={{ transform: `rotate(${rotValue * 0.4}deg)` }}
          />
          <div className="absolute w-[180px] h-[180px] md:w-[360px] md:h-[360px] rounded-full border border-dashed border-[var(--phosphor)]/25" />
          <div className="absolute font-mono text-[10px] text-[var(--steel)] tracking-widest uppercase">
            [ MESH TOPOLOGY // 8 CHANNELS ]
          </div>
        </div>

        {/* Interactive Station Flip Cards Matrix */}
        <div className="relative w-full h-full flex items-center justify-center">
          {stations.map((station, i) => {
            // Deterministic positions calculated from angle
            const initialAngle = (i / total) * Math.PI * 2;
            const circleX = Math.cos(initialAngle) * circleRadius;
            const circleY = Math.sin(initialAngle) * circleRadius + 20;

            // Arc positioning
            const arcAngle = ((i - (total - 1) / 2) / total) * (Math.PI * 0.85);
            const arcX = Math.sin(arcAngle) * arcRadius;
            const arcY = Math.cos(arcAngle) * (arcRadius * 0.45) + (isMobile ? 120 : 160);

            // Interpolate between circle and arc based on morphValue
            const currentX = circleX + (arcX - circleX) * morphValue;
            const currentY = circleY + (arcY - circleY) * morphValue;
            const currentRotation = ((arcAngle * 180) / Math.PI) * morphValue + (1 - morphValue) * ((initialAngle * 180) / Math.PI - 90);

            return (
              <FlipCard
                key={station.id}
                station={station}
                index={i}
                target={{
                  x: currentX,
                  y: currentY,
                  rotation: currentRotation * 0.45,
                  scale: isMobile ? 0.82 : 1,
                  opacity: 1,
                }}
                isFlipped={Boolean(flippedCards[station.id])}
                onToggleFlip={() => toggleFlip(station.id)}
              />
            );
          })}
        </div>

        {/* Bottom Legend */}
        <div className="absolute bottom-6 z-20 flex items-center justify-center gap-6 font-mono text-[9px] text-[var(--steel)] tracking-widest uppercase pointer-events-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[var(--phosphor)]" /> ACTIVE RELAY
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-[var(--amber)]" /> CLASSIFIED DOSSIER
          </span>
          <span className="text-[var(--steel)]">CLICK CARD TO FLIP</span>
        </div>
      </div>
    </div>
  );
}

export default ScrollMorphHero;
