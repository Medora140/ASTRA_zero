import type { Metadata } from "next";
import Link from "next/link";
import { MissionMotion } from "@/components/mission-motion";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { event, unstopFormFields } from "@/lib/event";

export const metadata: Metadata = {
  title: "Team Registration",
  description:
    "Prepare your intercollege team for ASTRA: ZERO HOUR, a two-round defence problem-solving contest on 03 December 2026. College name is required.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Register for ASTRA: ZERO HOUR 2026",
    description: "Two investigations. One day. Team size up to five · 03 December 2026.",
    url: "/register",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "ASTRA: ZERO HOUR team registration" }],
  },
};

export default function RegisterPage() {
  const isPublishedRegistration = Boolean(event.registrationUrl);

  return (
    <>
      <MissionMotion />
      <SiteNav />
      <main className="register-page">
        <div className="register-grid" aria-hidden="true" />
        <div className="wrap register-wrap">
          <Link href="/" className="back-link">← RETURN TO MISSION BRIEF</Link>
          <div className="register-header" data-reveal>
            <p className="hero-kicker"><span className="status-dot" /> TEAM DEPLOYMENT / REGISTRATION</p>
            <h1>ASSEMBLE<br /><span>YOUR TEAM.</span></h1>
            <p className="register-lede">Bring together up to five students from your college for two evidence-led investigations. Keep your team and institution details ready for the official event form.</p>
            <div className="register-stats">
              <div><small>EVENT DATE</small><strong>{event.dateLabel}</strong></div>
              <div><small>ROUNDS</small><strong>02 OPERATIONS</strong></div>
              <div><small>MAXIMUM TEAM SIZE</small><strong>{String(event.teamLimit).padStart(2, "0")} PEOPLE</strong></div>
              <div><small>PRIZE POOL</small><strong>{event.prizePool}</strong></div>
            </div>
          </div>

          <div className="register-columns">
            <section className="registration-checklist" aria-labelledby="checklist-title" data-reveal>
              <div className="register-panel-label"><span>FORM 01</span><span>DETAILS TO PREPARE</span></div>
              <h2 id="checklist-title">Before you register</h2>
              <p>The official event form will collect your team details, including your college name.</p>
              <ul className="form-fields">
                {unstopFormFields.map((field, index) => <li key={field}><span>{String(index + 1).padStart(2, "0")}</span>{field}<b aria-hidden="true">✓</b></li>)}
              </ul>
              <div className="college-required"><span className="required-star">*</span><div><strong>College name is required</strong><small>ASTRA: ZERO HOUR is an intercollege event. Enter your institution’s full name in the official form.</small></div></div>
            </section>

            <aside className="team-brief" aria-labelledby="team-brief-title" data-reveal>
              <div className="register-panel-label"><span>ROSTER LIMIT</span><span>01–{String(event.teamLimit).padStart(2, "0")}</span></div>
              <div className="roster-visual" aria-hidden="true"><div className="roster-ring"><span>{String(event.teamLimit).padStart(2, "0")}</span><small>MAX</small></div><span className="roster-axis axis-a" /><span className="roster-axis axis-b" /><span className="roster-coordinate coord-a">TEAM / 001</span><span className="roster-coordinate coord-b">ROSTER / 05</span></div>
              <h2 id="team-brief-title">One team.<br />Two operations.</h2>
              <p>Register one team with a named leader and up to four additional members. Eligibility and final participation rules will be listed on the official event page.</p>
              <div className="registration-status"><span className="amber-dot" /><div><strong>{isPublishedRegistration ? "OFFICIAL REGISTRATION LINK" : "EVENT PAGE PENDING"}</strong><small>{isPublishedRegistration ? "Continue to the published ASTRA event form on Unstop." : "The event-specific registration link will appear here once published."}</small></div></div>
              {isPublishedRegistration ? (
                <a className="button button-primary register-submit" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                  OPEN OFFICIAL FORM <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <button className="button button-primary register-submit button-disabled" type="button" disabled>
                  REGISTRATION LINK COMING SOON
                </button>
              )}
              <p className="register-return"><Link href="/#rounds">Review the two operations <span aria-hidden="true">↗</span></Link></p>
            </aside>
          </div>
          <p className="registration-fineprint"><span>NOTE</span> The event-specific Unstop page is pending. Schedule times, venue, guest, and sponsor details will be updated when confirmed.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
