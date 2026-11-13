"use client";

import Link from "next/link";
import { sections } from "@/lib/event";

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ASTRA Zero Hour home">
        <span className="brand-mark" aria-hidden="true"><span>A</span></span>
        <span className="brand-type"><strong>ASTRA</strong><small>ZERO HOUR / 03 DEC 2026</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.map((section) => <Link key={section.href} href={section.href}>{section.label}</Link>)}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Toggle navigation menu">
          <span className="sr-only">Navigation menu</span>
          <span className="hamburger" aria-hidden="true"><i /><i /><i /></span>
        </summary>
        <nav aria-label="Compact navigation">
          {sections.map((section) => <Link key={section.href} href={section.href} onClick={(click) => click.currentTarget.closest("details")?.removeAttribute("open")}>{section.label}</Link>)}
        </nav>
      </details>
      <Link className="nav-cta" href="/register">Register <span aria-hidden="true">↗</span></Link>
    </header>
  );
}
