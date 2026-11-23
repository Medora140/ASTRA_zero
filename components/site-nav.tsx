import Link from "next/link";
import { event } from "@/lib/event";

export { SiteNav } from "./responsive-site-nav";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-brand">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><span>A</span></span>
          <span className="brand-type"><strong>ASTRA: ZERO HOUR</strong><small>{event.tagline.toUpperCase()}</small></span>
        </Link>
        <p>A one-day intercollege defence problem-solving contest by ASTRA at BMSIT&amp;M.</p>
      </div>
      <div className="footer-meta">
        <span>{event.dateLabel}</span>
        <Link href="/register">Registration briefing <span aria-hidden="true" className="btn-arrow">↗</span></Link>
        <small>Venue, guest, sponsor, and contact details will be announced.</small>
      </div>
      <div className="footer-bottom"><span>ASTRA CLUB · BMSIT&amp;M</span><span>02 OPERATIONS // 03.12.26</span></div>
    </footer>
  );
}
