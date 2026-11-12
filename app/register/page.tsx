import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { event, unstopFormFields } from "@/lib/event";

export const metadata: Metadata = {
  title: "Team Registration",
  description:
    "Review team requirements for ASTRA: ZERO HOUR 2026 and register through the official Unstop event page. College name is required.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Register for ASTRA: ZERO HOUR 2026",
    description: "Intercollege defence problem-solving contest · 03 December 2026.",
    url: "/register",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "ASTRA: ZERO HOUR team registration" }],
  },
};

export default function RegisterPage() {
  const isPublishedRegistration = Boolean(process.env.NEXT_PUBLIC_UNSTOP_REGISTRATION_URL);

  return (
    <>
      <SiteNav />
      <main className="register-page">
        <div className="register-grid" aria-hidden="true" />
        <div className="wrap register-wrap">
          <Link href="/" className="back-link">← RETURN TO MISSION BRIEF</Link>
          <div className="register-header">
            <p className="hero-kicker"><span className="status-dot" /> TEAM DEPLOYMENT / REGISTRATION</p>
            <h1>ASSEMBLE<br /><span>YOUR TEAM.</span></h1>
            <p className="register-lede">One college team. Eight places on the roster. Add your institution and team details to the official Unstop registration form.</p>
            <div className="register-stats"><div><small>EVENT DATE</small><strong>{event.dateLabel}</strong></div><div><small>MAXIMUM TEAM SIZE</small><strong>08 PEOPLE</strong></div><div><small>PRIZE POOL</small><strong>{event.prizePool}</strong></div></div>
          </div>

          <div className="register-columns">
            <section className="registration-checklist" aria-labelledby="checklist-title">
              <div className="register-panel-label"><span>FORM 01</span><span>REQUIRED INFORMATION</span></div>
              <h2 id="checklist-title">Before you register</h2>
              <p>Keep these details ready. The official Unstop form should collect each item below, including the required college name.</p>
              <ul className="form-fields">
                {unstopFormFields.map((field, index) => <li key={field}><span>{String(index + 1).padStart(2, "0")}</span>{field}<b aria-hidden="true">✓</b></li>)}
              </ul>
              <div className="college-required"><span className="required-star">*</span><div><strong>College name is required</strong><small>ASTRA: ZERO HOUR is an intercollege event. Enter your institution’s full name in the Unstop form.</small></div></div>
            </section>

            <aside className="team-brief" aria-labelledby="team-brief-title">
              <div className="register-panel-label"><span>ROSTER LIMIT</span><span>01–08</span></div>
              <div className="roster-visual" aria-hidden="true"><div className="roster-ring"><span>08</span><small>MAX</small></div><span className="roster-axis axis-a" /><span className="roster-axis axis-b" /><span className="roster-coordinate coord-a">TEAM / 001</span><span className="roster-coordinate coord-b">STATUS / OPEN</span></div>
              <h2 id="team-brief-title">One team.<br />One mission.</h2>
              <p>Register one team with a named leader and up to seven additional members. All participants should be students; eligibility details will be confirmed in the official rules.</p>
              <div className="registration-status"><span className="amber-dot" /><div><strong>{isPublishedRegistration ? "OFFICIAL REGISTRATION LINK" : "UNSTOP EVENT PAGE PENDING"}</strong><small>{isPublishedRegistration ? "Continue to the published ASTRA event form." : "The event-specific Unstop URL will be added here when published."}</small></div></div>
              <a className="button button-primary register-submit" href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                {isPublishedRegistration ? "OPEN OFFICIAL FORM" : "OPEN UNSTOP"} <span aria-hidden="true">↗</span>
              </a>
              {!isPublishedRegistration && <small className="destination-note">This temporary link opens Unstop’s homepage. Replace NEXT_PUBLIC_UNSTOP_REGISTRATION_URL with the event URL before launch.</small>}
              <p className="register-return"><Link href="/#rounds">Review the three operations <span aria-hidden="true">↗</span></Link></p>
            </aside>
          </div>
          <p className="registration-fineprint"><span>NOTE</span> Registration is not complete until the official Unstop form is published and submitted. Schedule, venue, guest, and sponsor information remain subject to confirmation.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
