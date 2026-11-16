"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { sections } from "@/lib/event";

export function SiteNav() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((sec) => {
        const id = sec.href.replace("/#", "");
        return { id, href: sec.href, el: document.getElementById(id) };
      });

      const scrollPosition = window.scrollY + 140;
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item?.el && item.el.offsetTop <= scrollPosition) {
          setActiveSection(item.href);
          return;
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ASTRA Zero Hour home">
        <span className="brand-mark" aria-hidden="true"><span>A</span></span>
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
        <summary aria-label="Toggle navigation menu">
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
      <Link className="nav-cta" href="/register">Register <span aria-hidden="true">↗</span></Link>
    </header>
  );
}
