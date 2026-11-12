import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { EventSchema } from "@/components/event-schema";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { event, rounds, timeline } from "@/lib/event";

function SectionEyebrow({ code, children }: { code: string; children: React.ReactNode }) {
  return <p className="eyebrow"><span>{code}</span><span className="eyebrow-line" aria-hidden="true" />{children}</p>;
}

export default function HomePage() {
  return (
    <>
      <EventSchema />
      <SiteNav />
      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring orbit-one" />
            <div className="orbit-ring orbit-two" />
            <div className="orbit-ring orbit-three" />
            <div className="orbit-crosshair">+</div>
            <div className="orbit-target"><span /></div>
            <span className="orbit-label label-top">MISSION / 001</span>
            <span className="orbit-label label-bottom">SIGNAL LOCKED · 03.12.26</span>
          </div>
          <div className="hero-content wrap">
            <p className="hero-kicker"><span className="status-dot" /> ASTRA CLUB PRESENTS <span className="kicker-divider">/</span> INTERCOLLEGIATE 2026</p>
            <h1 id="hero-title">ASTRA:<br /><span>ZERO</span> HOUR<span className="title-period">.</span></h1>
            <p className="hero-subtitle">A Defence Problem-Solving Contest</p>
            <p className="hero-description">Three rounds. One day. A trail of evidence between the first signal and the final call.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/register">ENTER THE MISSION <span aria-hidden="true">↗</span></Link>
              <a className="text-link" href="#about">READ THE BRIEF <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-readout">
              <div><small>MISSION DATE</small><strong>{event.dateLabel}</strong></div>
              <div><small>FORMAT</small><strong>ONE-DAY · INTERCOLLEGE</strong></div>
              <div className="prize-readout"><small>TOTAL PRIZE POOL</small><strong>{event.prizePool}</strong></div>
            </div>
          </div>
          <div className="countdown-dock">
            <div className="countdown-heading"><span className="amber-dot" /> ZERO HOUR COUNTDOWN <span className="dock-date">03.12.2026 · IST</span></div>
            <Countdown />
          </div>
          <div className="hero-coordinate">13°08&apos;N / 77°34&apos;E <span>·</span> COORDINATES PROVISIONAL</div>
        </section>

        <section className="intro-section section-pad" id="about" aria-labelledby="about-title">
          <div className="wrap intro-grid">
            <div>
              <SectionEyebrow code="01">MISSION BRIEF</SectionEyebrow>
              <h2 id="about-title">Think clearly.<br /><span>Move with purpose.</span></h2>
            </div>
            <div className="intro-copy">
              <p className="lead-copy">ASTRA: ZERO HOUR is a one-day, intercollege challenge built around investigation, engineering judgement, and decisions under pressure.</p>
              <p>Teams will examine a fictional incident, follow a physical evidence trail, and make sense of a disrupted network. Every answer must be supported by clues. Every round advances the same mission.</p>
              <div className="about-facts">
                <div><span>01</span><strong>ANALYSE</strong><small>Separate signal from noise.</small></div>
                <div><span>02</span><strong>INVESTIGATE</strong><small>Follow evidence to its source.</small></div>
                <div><span>03</span><strong>DECIDE</strong><small>Back your call with proof.</small></div>
              </div>
              <p className="venue-note"><span className="amber-dot" /> {event.venueStatus} <span>·</span> {event.venue}</p>
            </div>
          </div>
        </section>

        <section className="rounds-section section-pad" id="rounds" aria-labelledby="rounds-title">
          <div className="wrap">
            <div className="section-heading-row">
              <div><SectionEyebrow code="02">THREE OPERATIONS</SectionEyebrow><h2 id="rounds-title">The mission<br /><span>unfolds in stages.</span></h2></div>
              <p className="section-aside">Each round reveals a new layer. Observe, compare, verify — then commit to your conclusion.</p>
            </div>
            <div className="round-grid">
              {rounds.map((round) => (
                <article className={`round-card accent-${round.accent}`} key={round.number}>
                  <div className="round-card-top"><span className="round-number">{round.number}</span><span className="round-status">FIELD DOSSIER / OPEN</span></div>
                  <p className="round-code">{round.code}</p>
                  <h3>{round.title}</h3>
                  <p className="round-detail">{round.detail}</p>
                  <div className="tag-list">{round.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="card-coordinate">ASTRA / ZERO HOUR <span>—</span> {round.number}</div>
                </article>
              ))}
            </div>
            <p className="fiction-note"><span>!</span> All scenarios, locations, network failures, and evidence are fictional event materials.</p>
          </div>
        </section>

        <section className="schedule-section section-pad" id="schedule" aria-labelledby="schedule-title">
          <div className="wrap schedule-layout">
            <div className="schedule-intro">
              <SectionEyebrow code="03">SINGLE-DAY DEPLOYMENT</SectionEyebrow>
              <h2 id="schedule-title">One day.<br /><span>Full mission.</span></h2>
              <p>The running order is being finalised. Time slots will be published once the venue and event operations are confirmed.</p>
              <div className="schedule-date-box"><small>LOCKED DATE</small><strong>03 <span>DEC</span> 2026</strong><small>VENUE · TO BE CONFIRMED</small></div>
            </div>
            <ol className="timeline">
              {timeline.map((item, index) => (
                <li className="timeline-item" key={item.code}>
                  <span className="timeline-node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div className="timeline-content"><small>{item.code}</small><h3>{item.label}</h3></div>
                  <span className="timeline-time">{item.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="people-section section-pad" id="guests" aria-labelledby="guests-title">
          <div className="wrap people-grid">
            <div className="people-copy"><SectionEyebrow code="04">MISSION CONTROL</SectionEyebrow><h2 id="guests-title">Guest speakers</h2><p>We’re preparing a guest session on defence technology and engineering in practice. Speaker details will be announced after confirmation.</p></div>
            <article className="placeholder-card guest-placeholder"><span className="placeholder-index">GUEST DOSSIER / PENDING</span><div className="placeholder-silhouette" aria-hidden="true">?</div><div><small>FEATURED GUEST</small><h3>To be announced</h3><p>Speaker and session details coming soon.</p></div><span className="placeholder-stamp">AWAITING<br />CONFIRMATION</span></article>
          </div>
        </section>

        <section className="sponsor-section section-pad" id="sponsors" aria-labelledby="sponsors-title">
          <div className="wrap sponsor-inner">
            <div className="sponsor-heading"><SectionEyebrow code="05">PARTNERSHIP CHANNEL</SectionEyebrow><h2 id="sponsors-title">Sponsors &amp; partners</h2><p>Partner announcements will appear here after confirmation.</p></div>
            <div className="sponsor-placeholders" aria-label="Sponsor placeholders">
              <div><span>01</span><strong>PARTNER<br />TO BE ANNOUNCED</strong><small>PARTNERSHIP DOSSIER / PENDING</small></div>
              <div><span>02</span><strong>PARTNER<br />TO BE ANNOUNCED</strong><small>PARTNERSHIP DOSSIER / PENDING</small></div>
              <div><span>03</span><strong>PARTNER<br />TO BE ANNOUNCED</strong><small>PARTNERSHIP DOSSIER / PENDING</small></div>
            </div>
          </div>
        </section>

        <section className="prize-cta-section" aria-label="Prize pool and registration">
          <div className="wrap prize-cta-inner">
            <div><SectionEyebrow code="06">REWARDS FOR REASONING</SectionEyebrow><p className="prize-pool">{event.prizePool}<span> PRIZE POOL</span></p><p className="prize-small">Award distribution and eligibility details will be announced.</p></div>
            <div className="prize-cta-action"><p>THE NAME IS LOCKED.<br /><span>THE DATE IS SET.</span></p><Link className="button button-primary" href="/register">ASSEMBLE YOUR TEAM <span aria-hidden="true">↗</span></Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
