"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MissionMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("animation-paused", !entry.isIntersecting);
        });
      },
      { rootMargin: "100px" },
    );
    document
      .querySelectorAll(".hero, .network-visual, .twist-art, .scroll-morph-section")
      .forEach((element) => animationObserver.observe(element));

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.innerWidth <= 768;

    const context = gsap.context(() => {
      // Element reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: isMobile ? 16 : 26, filter: isMobile ? "none" : "blur(3px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: isMobile ? 0.55 : 0.78,
            delay: isMobile ? 0 : index % 2 === 0 ? 0 : 0.06,
            ease: "power3.out",
            clearProps: "filter,transform,opacity,visibility",
            scrollTrigger: {
              trigger: element,
              start: isMobile ? "top 94%" : "top 86%",
              once: true,
            },
          },
        );
      });

      // Section backdrops: ensure they are ALWAYS visible
      gsap.utils.toArray<HTMLImageElement>(".section-backdrop").forEach((image) => {
        const section = image.parentElement;
        if (!section) return;
        const targetOpacity = image.classList.contains("backdrop-bright")
          ? 0.72
          : image.classList.contains("backdrop-medium")
            ? 0.55
            : 0.38;

        // Never hide backdrops; set them to visible target opacity immediately
        gsap.set(image, { autoAlpha: targetOpacity });

        if (!isMobile) {
          gsap.fromTo(
            image,
            { scale: 1.06 },
            {
              scale: 1,
              duration: 1.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                once: true,
              },
            },
          );
        }
      });

      // Subtle parallax drone float
      const drone = document.querySelector(".round-drone-image");
      if (drone && !isMobile) {
        gsap.to(drone, {
          y: -12,
          ease: "none",
          scrollTrigger: { trigger: drone, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      // Twist art parallax
      const network = document.querySelector(".twist-art");
      if (network && !isMobile) {
        gsap.fromTo(
          network,
          { y: 14 },
          {
            y: -10,
            ease: "none",
            scrollTrigger: { trigger: network, start: "top bottom", end: "bottom top", scrub: 1.4 },
          },
        );
      }
    });

    return () => {
      animationObserver.disconnect();
      context.revert();
    };
  }, []);

  return null;
}
