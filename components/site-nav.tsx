import Link from "next/link";
import { event, sections } from "@/lib/event";

export function SiteNav() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="ASTRA Zero Hour home">
        <span className="brand-mark" aria-hidden="true"><span>A</span></span>
        <span className="brand-type"><strong>ASTRA</strong><small>ZERO HOUR / 2026</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {sections.map((section) => <Link key={section.href} href={section.href}>{section.label}</Link>)}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="Open site navigation"><span>MENU</span><span className="menu-glyph" aria-hidden="true">+</span></summary>
        <nav aria-label="Compact navigation">
          {sections.map((section) => <Link key={section.href} href={section.href}>{section.label}</Link>)}
        </nav>
      </details>
      <Link className="nav-cta" href="/register">Register <span aria-hidden="true">↗</span></Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-brand">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><span>A</span></span>
          <span className="brand-type"><strong>ASTRA: ZERO HOUR</strong><small>UNDERSTAND THE MISSION. ENGINEER THE SOLUTION.</small></span>
        </Link>
        <p>A one-day, intercollege problem-solving contest by ASTRA Club.</p>
      </div>
      <div className="footer-meta">
        <span>{event.dateLabel}</span>
        <Link href="/register">Registration briefing <span aria-hidden="true">↗</span></Link>
        <small>Guest, sponsor, venue, and contact details will be announced.</small>
      </div>
      <div className="footer-bottom"><span>ASTRA CLUB · BMSIT&amp;M</span><span>ZERO HOUR // 03.12.26</span></div>
    </footer>
  );
}
