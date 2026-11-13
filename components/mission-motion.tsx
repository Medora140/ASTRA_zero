"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function MissionMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element, index) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: 26, filter: "blur(3px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.78,
            delay: index % 2 === 0 ? 0 : 0.06,
            ease: "power3.out",
            clearProps: "filter,transform,opacity,visibility",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      const drone = document.querySelector(".round-drone-image");
      if (drone) {
        gsap.to(drone, {
          y: -12,
          ease: "none",
          scrollTrigger: { trigger: drone, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
      }

      const network = document.querySelector(".twist-art");
      if (network) {
        gsap.fromTo(network, { y: 14 }, {
          y: -10,
          ease: "none",
          scrollTrigger: { trigger: network, start: "top bottom", end: "bottom top", scrub: 1.4 },
        });
      }
    });

    return () => context.revert();
  }, []);

  return null;
}
