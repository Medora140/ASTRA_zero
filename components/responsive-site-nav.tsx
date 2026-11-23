"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sections } from "@/lib/event";

export function SiteNav() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observedSections = sections
      .flatMap((section) => {
        const element = document.getElementById(section.href.replace("/#", ""));
        return element ? [{ href: section.href, element }] : [];
      });
    const sectionByElement = new Map(
      observedSections.map(({ href, element }) => [element, href]),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );
        const target = visible[0]?.target;
        const href = target instanceof HTMLElement ? sectionByElement.get(target) : undefined;
        if (href) setActiveSection(href);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    observedSections.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ASTRA Zero Hour home">
        <Image className="brand-logo" src="/images/astra-logo.webp" alt="" width={720} height={374} priority />
        <span className="brand-type"><strong>ASTRA</strong><small>ZERO HOUR / 03 DEC 2026</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className={activeSection === section.href ? "nav-active" : undefined}
            aria-current={activeSection === section.href ? "location" : undefined}
          >
            {section.label}
          </Link>
        ))}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Navigation menu">
          <span className="sr-only">Navigation menu</span>
          <span className="hamburger" aria-hidden="true"><i /><i /><i /></span>
        </summary>
        <nav aria-label="Compact navigation">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              onClick={(click) => click.currentTarget.closest("details")?.removeAttribute("open")}
            >
              {section.label}
            </Link>
          ))}
        </nav>
      </details>
      <Link className="nav-cta" href="/register">Register <span aria-hidden="true" className="btn-arrow">↗</span></Link>
    </header>
  );
}
