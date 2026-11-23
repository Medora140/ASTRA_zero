import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MissionMotion } from "@/components/mission-motion";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { event, registrationFormFields } from "@/lib/event";

export const metadata: Metadata = {
  title: "Team Registration",
  description:
    "Prepare your team for ASTRA: ZERO HOUR, a two-round defence problem-solving contest on 03 December 2026 at BMSIT&M.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Register for ASTRA: ZERO HOUR 2026",
    description: "Two investigations. One day. Teams of three to four · 03 December 2026 · BMSIT&M Bengaluru.",
    url: "/register",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ASTRA: ZERO HOUR team registration" }],
  },
};

export default function RegisterPage() {
  const isPublishedRegistration = Boolean(event.googleFormUrl);

  return (
    <>
      <MissionMotion />
      <SiteNav />
      <main id="main-content" className="register-page image-section">
        {event.showBackdrops && (
          <Image
            className="section-backdrop backdrop-medium"
            src="/images/backdrop-drone-sky.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
          />
        )}
        <div className="register-grid" aria-hidden="true" />
        <div className="wrap register-wrap">
          <Link href="/" className="back-link">← RETURN TO MISSION BRIEF</Link>
          <div className="register-header" data-reveal>
            <p className="hero-kicker"><span className="status-dot" /> TEAM DEPLOYMENT / REGISTRATION</p>
            <h1>ASSEMBLE<br /><span>YOUR TEAM.</span></h1>
            <p className="register-lede">Bring together three to four students for two evidence-led investigations. Keep your team details ready for the official event form.</p>
            <div className="register-stats">
              <div><small>EVENT DATE</small><strong>{event.dateLabel}</strong></div>
              <div><small>ROUNDS</small><strong>02 OPERATIONS</strong></div>
              <div><small>TEAM SIZE</small><strong>{event.teamLabel} MEMBERS</strong></div>
              <div><small>PRIZE POOL</small><strong>{event.prizePool}</strong></div>
            </div>
          </div>

          <div className="register-columns">
            <section className="registration-checklist image-section" aria-labelledby="checklist-title" data-reveal>
              {event.showBackdrops && (
                <Image
                  className="section-backdrop backdrop-soft"
                  src="/images/backdrop-network-traffic.webp"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 700px) 92vw, 52vw"
                />
              )}
              <div className="register-panel-label"><span>FORM 01</span><span>DETAILS TO PREPARE</span></div>
              <h2 id="checklist-title">Before you register</h2>
              <p>The participant Google Form will collect your team details.</p>
              <ul className="form-fields">
                {registrationFormFields.map((field, index) => (
                  <li key={field}><span>{String(index + 1).padStart(2, "0")}</span>{field}<b aria-hidden="true">✓</b></li>
                ))}
              </ul>
            </section>

            <aside className="team-brief image-section" aria-labelledby="team-brief-title" data-reveal>
              {event.showBackdrops && (
                <Image
                  className="section-backdrop backdrop-soft"
                  src="/images/backdrop-terrain-map.webp"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 700px) 92vw, 42vw"
                />
              )}
              <div className="register-panel-label"><span>TEAM SIZE</span><span>{String(event.teamMin).padStart(2, "0")}–{String(event.teamMax).padStart(2, "0")}</span></div>
              <div className="roster-visual" aria-hidden="true">
                <div className="roster-ring"><span>{event.teamLabel}</span><small>MEMBERS</small></div>
                <span className="roster-axis axis-a" />
                <span className="roster-axis axis-b" />
                <span className="roster-coordinate coord-a">TEAM / 001</span>
                <span className="roster-coordinate coord-b">ROSTER / {String(event.teamMin).padStart(2, "0")}–{String(event.teamMax).padStart(2, "0")}</span>
              </div>
              <h2 id="team-brief-title">One team.<br />Two operations.</h2>
              <p>Register one team of three to four members: a named leader plus two to three additional members. Eligibility and final participation rules will be listed on the official event page.</p>
              <div className="registration-status">
                <span className={isPublishedRegistration ? "status-dot pulse-indicator" : "amber-dot pulse-indicator"} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <strong>{isPublishedRegistration ? "OFFICIAL GOOGLE FORM" : "TRANSMISSION LINK PENDING"}</strong>
                    <span className="classified-badge">
                      {isPublishedRegistration ? "ACTIVE" : "STANDBY"}
                    </span>
                  </div>
                  <small>
                    {isPublishedRegistration
                      ? "Continue to the published ASTRA participant form."
                      : "The Google Form link will activate here once released by Mission Control."}
                  </small>
                </div>
              </div>
              {isPublishedRegistration ? (
                <a className="button button-primary register-submit" href={event.googleFormUrl} target="_blank" rel="noopener noreferrer">
                  OPEN GOOGLE FORM <span aria-hidden="true" className="btn-arrow">↗</span>
                </a>
              ) : (
                <button
                  className="button button-primary register-submit button-disabled"
                  type="button"
                  disabled
                  aria-disabled="true"
                >
                  <span className="amber-dot pulse-indicator" style={{ width: "6px", height: "6px" }} aria-hidden="true" />
                  GOOGLE FORM LINK COMING SOON
                </button>
              )}
              <p className="register-return"><Link href="/#rounds">Review the two operations <span aria-hidden="true" className="btn-arrow">↗</span></Link></p>
            </aside>
          </div>
          <p className="registration-fineprint">
            <span>NOTE</span> Registration is submitted through the official Google Form. Schedule times, venue ({event.venue.shortLabel}), guest, and sponsor details will be updated when confirmed.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
