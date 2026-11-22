"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export interface ScrollExpansionHeroProps {
  mediaSrc?: string;
  bgImageSrc?: string;
  title?: string;
  subtitle?: string;
  date?: string;
  scrollToExpandText?: string;
  className?: string;
  children?: ReactNode;
}

export function ScrollExpansionHero({
  mediaSrc = "/images/ghatak-drone.webp",
  bgImageSrc = "/images/backdrop-drone-sky.webp",
  title = "ZERO HOUR",
  subtitle = "INCIDENT CORRIDOR // GHATAK TELEMETRY",
  date = "03 DEC 2026 · IST",
  scrollToExpandText = "SCROLL TO COMMENCE BRIEFING ↓",
  className,
  children,
}: ScrollExpansionHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Responsive transforms based on native scroll
  const mediaWidth = useTransform(scrollYProgress, [0, 0.82], ["min(92vw, 360px)", "100vw"]);
  const mediaHeight = useTransform(scrollYProgress, [0, 0.82], ["min(46vh, 380px)", "100dvh"]);
  const mediaRadius = useTransform(scrollYProgress, [0, 0.82], ["10px", "0px"]);
  const textTranslate = useTransform(scrollYProgress, [0, 0.72], ["0%", "45%"]);
  const textTranslateReverse = useTransform(scrollYProgress, [0, 0.72], ["0%", "-45%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45, 0.72], [1, 0.85, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.7, 0.94], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.7, 0.94], [24, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [0.82, 0.35]);

  const words = title.split(" ");
  const firstWord = words[0] ?? "ZERO";
  const secondWord = words.slice(1).join(" ") || "HOUR";

  if (mounted && shouldReduceMotion) {
    return (
      <section
        className={cn("relative w-full bg-[var(--obsidian)] border-y border-[var(--grid)] py-12 sm:py-16", className)}
        aria-label="Tactical expansion section"
      >
        <div className="wrap flex flex-col items-center gap-6 sm:gap-8">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-[var(--slate)] border border-[var(--grid)] text-[var(--phosphor)] font-mono text-[9px] sm:text-[10px] tracking-widest uppercase mb-3">
              {subtitle}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-wide uppercase text-[var(--titanium)]">
              {firstWord} <span className="text-[var(--phosphor)]">{secondWord}</span>
            </h2>
            <p className="text-[var(--amber)] font-mono text-xs tracking-widest mt-2">{date}</p>
          </div>

          <div className="relative w-full max-w-4xl h-[300px] sm:h-[420px] rounded-lg overflow-hidden border border-[var(--grid)] bg-[var(--slate)]">
            <Image
              src={mediaSrc}
              alt="GHATAK Autonomous Drone Telemetry"
              fill
              sizes="(max-width: 1024px) 95vw, 896px"
              className="object-contain sm:object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[var(--steel)] font-mono text-[9px] sm:text-[10px]">
              <span>MISSION: INCIDENT RECONSTRUCTION</span>
              <span className="text-[var(--amber)]">TELEMETRY LOCKED</span>
            </div>
          </div>

          {children && <div className="w-full mt-4">{children}</div>}
        </div>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative z-0 w-full min-h-[150vh] sm:min-h-[180vh] md:min-h-[220vh] overflow-x-clip bg-[var(--obsidian)]", className)}
      role="region"
      aria-label="Interactive tactical mission corridor"
    >
      <div className="sticky top-0 h-[100dvh] min-h-[560px] w-full overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient tactical background */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ opacity: bgOpacity }}
          aria-hidden="true"
        >
          <Image
            src={bgImageSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--obsidian)]/60 via-transparent to-[var(--obsidian)]/80" />
        </motion.div>

        {/* Central Expanding Tactical Visual Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center overflow-hidden border border-[var(--grid)] bg-[var(--slate)] shadow-2xl"
          style={{
            width: mediaWidth,
            height: mediaHeight,
            borderRadius: mediaRadius,
          }}
        >
          {/* Drone Image with Tactical Grid Overlay */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={mediaSrc}
              alt="GHATAK Autonomous Rescue Drone"
              fill
              sizes="100vw"
              className="object-contain sm:object-cover object-center p-2 sm:p-0"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/90 via-[var(--obsidian)]/35 to-transparent" />
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(0, 230, 118, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 230, 118, 0.25) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Central Splitting Headline */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-3 sm:px-6 pointer-events-none select-none w-full max-w-full">
            <motion.p
              style={{ opacity: textOpacity }}
              className="font-mono text-[8px] sm:text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--amber)] mb-2 flex items-center gap-1.5"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--amber)] pulse-indicator" />
              {subtitle}
            </motion.p>

            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8 font-display font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight text-[var(--titanium)]">
              <motion.span
                style={{ x: textTranslateReverse, opacity: textOpacity }}
                className="inline-block text-[var(--titanium)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              >
                {firstWord}
              </motion.span>
              <motion.span
                style={{ x: textTranslate, opacity: textOpacity }}
                className="inline-block text-[var(--phosphor)] drop-shadow-[0_2px_16px_rgba(0,230,118,0.35)]"
              >
                {secondWord}
              </motion.span>
            </div>

            <motion.div
              style={{ opacity: textOpacity }}
              className="mt-3 flex flex-col items-center gap-0.5"
            >
              <span className="font-mono text-[11px] sm:text-xs md:text-sm tracking-widest text-[var(--titanium)]">
                {date}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-[var(--steel)] tracking-widest mt-1">
                {scrollToExpandText}
              </span>
            </motion.div>
          </div>

          {/* Revealed Children / Strategic Briefing Content */}
          {children && (
            <motion.div
              style={{ opacity: contentOpacity, y: contentY }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-[var(--obsidian)]/90 backdrop-blur-md overflow-y-auto"
            >
              <div className="w-full max-w-3xl mx-auto">{children}</div>
            </motion.div>
          )}

          {/* Tactical Corner Crosshairs */}
          <div className="absolute top-2.5 left-2.5 font-mono text-[8px] sm:text-[10px] text-[var(--phosphor)] tracking-widest opacity-80 select-none">
            ┌ SYS.TRACK // 001
          </div>
          <div className="absolute top-2.5 right-2.5 font-mono text-[8px] sm:text-[10px] text-[var(--phosphor)] tracking-widest opacity-80 select-none">
            RECON.GRID ┐
          </div>
          <div className="absolute bottom-2.5 left-2.5 font-mono text-[8px] sm:text-[10px] text-[var(--steel)] tracking-widest opacity-80 select-none">
            └ LAT.2026 // BMSIT&amp;M
          </div>
          <div className="absolute bottom-2.5 right-2.5 font-mono text-[8px] sm:text-[10px] text-[var(--amber)] tracking-widest opacity-80 select-none">
            SIGNAL: ACTIVE ┘
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollExpansionHero;
