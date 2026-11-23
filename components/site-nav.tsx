import Image from "next/image";
import Link from "next/link";
import { event } from "@/lib/event";

export { SiteNav } from "./responsive-site-nav";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-brand">
        <Link className="brand" href="/">
          <Image className="brand-logo" src="/images/astra-logo.webp" alt="" width={720} height={374} />
          <span className="brand-type"><strong>ASTRA: ZERO HOUR</strong><small>{event.tagline.toUpperCase()}</small></span>
        </Link>
        <p>A one-day defence problem-solving contest by ASTRA at BMSIT&amp;M.</p>
      </div>
      <div className="footer-meta">
        <span>{event.dateLabel}</span>
        <Link href="/register">Registration briefing <span aria-hidden="true" className="btn-arrow">↗</span></Link>
        <small>Venue, sponsor, and contact details will be announced.</small>
      </div>
      <div className="footer-bottom"><span>ASTRA CLUB · BMSIT&amp;M</span><span>02 OPERATIONS // 03.12.26</span></div>
    </footer>
  );
}
