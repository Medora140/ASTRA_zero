import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { EventSchema } from "@/components/event-schema";
import { NetworkVisual } from "@/components/network-visual";
import { MissionMotion } from "@/components/mission-motion";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { ScrollExpansionHero } from "@/components/ui/scroll-expansion-hero";
import { ScrollMorphHero } from "@/components/ui/scroll-morph-hero";
import { event, rounds, timeline } from "@/lib/event";

const sectionImages = {
  droneSky: "/images/backdrop-drone-sky.webp",
  signalNodes: "/images/backdrop-signal-nodes.webp",
  networkTraffic: "/images/backdrop-network-traffic.webp",
  droneForest: "/images/backdrop-drone-forest.webp",
  terrainMap: "/images/backdrop-terrain-map.webp",
} as const;

function SectionBackdrop({
  src,
  position = "center",
  tone = "soft",
  priority = false,
}: {
  src: string;
  position?: string;
  tone?: "soft" | "medium" | "bright";
  priority?: boolean;
}) {
  return (
    <Image
      className={`section-backdrop backdrop-${tone}`}
      src={src}
      alt=""
      aria-hidden="true"
      fill
      sizes="100vw"
      priority={priority}
      style={{ objectPosition: position }}
    />
  );
}

function SectionEyebrow({ code, children }: { code: string; children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span>{code}</span>
      <span className="eyebrow-line" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function HomePage() {
  return (
    <>
      <EventSchema />
      <MissionMotion />
      <SiteNav />
      <main id="main-content">
        {/* 01: HERO SECTION */}
        <section className="hero image-section" id="home" aria-labelledby="hero-title">
          <SectionBackdrop src={sectionImages.droneSky} position="68% center" tone="bright" priority />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit" aria-hidden="true">
            <div className="orbit-ring orbit-one" />
            <div className="orbit-ring orbit-two" />
            <div className="orbit-ring orbit-three" />
            <Image
              className="hero-route-art"
              src="/images/flight-route.webp"
              alt=""
              aria-hidden="true"
              width={697}
              height={413}
            />
            <Image
              className="hero-drone-art"
              src="/images/ghatak-drone.webp"
              alt=""
              aria-hidden="true"
              width={857}
              height={393}
            />
            <div className="orbit-crosshair">+</div>
            <div className="orbit-target"><span /></div>
            <span className="orbit-label label-top">SIGNAL SEARCH / 001</span>
            <span className="orbit-label label-bottom">ASTRA / ZERO HOUR</span>
          </div>
          <div className="hero-content wrap">
            <p className="hero-kicker">
              <span className="status-dot pulse-indicator" /> ASTRA CLUB PRESENTS{" "}
              <span className="kicker-divider">/</span> {event.tagline.toUpperCase()}
            </p>
            <h1 id="hero-title">
              ASTRA:<br />
              <span>ZERO</span> HOUR<span className="title-period">.</span>
            </h1>
            <p className="hero-subtitle">{event.subtitle}</p>
            <p className="hero-description">
              Two investigations. One day. A lost drone signal and a communications network with a story of its own.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/register">
                REGISTER YOUR TEAM <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="#corridor">
                READ THE BRIEF <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-readout">
              <div>
                <small>MISSION DATE</small>
                <strong>{event.dateLabel}</strong>
              </div>
              <div>
                <small>VENUE</small>
                <strong>{event.venue.shortLabel}</strong>
              </div>
              <div className="prize-readout">
                <small>PRIZE POOL</small>
                <strong>{event.prizePool}</strong>
              </div>
            </div>
          </div>
          <div className="countdown-dock">
            <div className="countdown-heading">
              <span className="amber-dot pulse-indicator" /> ZERO HOUR COUNTDOWN{" "}
              <span className="dock-date">03.12.2026 · IST</span>
            </div>
            <Countdown />
          </div>
          <div className="hero-coordinate">ASTRA CLUB / BMSIT&amp;M</div>
        </section>

        {/* 02: CINEMATIC EXPANSION HERO TRANSITION (Interactive Corridor) */}
        <div id="corridor">
          <ScrollExpansionHero
            title="ZERO HOUR"
            subtitle="INCIDENT CORRIDOR // GHATAK TELEMETRY"
            date={`${event.dateLabel} · IST`}
            scrollToExpandText="SCROLL TO INITIATE BRIEFING ↓"
            mediaSrc="/images/ghatak-drone.webp"
            bgImageSrc="/images/backdrop-drone-sky.webp"
          >
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
              <span className="classified-badge">TRANSMISSION DECRYPTED // MISSION OVERVIEW</span>
              <h3 className="font-display font-extrabold text-3xl md:text-5xl text-[var(--titanium)] uppercase">
                A Tactical Defence <span className="text-[var(--phosphor)]">Investigation</span>
              </h3>
              <p className="font-sans text-xs md:text-sm text-[var(--steel)] leading-relaxed">
                Two synchronized operations. One locked day. Reconstruct the lost telemetry of the GHATAK rescue drone, then untangle a distributed 8-node network to locate the compromised source before time runs out.
              </p>
              <a href="#about" className="button button-primary mt-2">
                PROCEED TO BRIEFING ROOM <span aria-hidden="true">↓</span>
              </a>
            </div>
          </ScrollExpansionHero>
        </div>

        {/* 03: MISSION BRIEF */}
        <section className="intro-section section-pad image-section" id="about" aria-labelledby="about-title">
          <SectionBackdrop src={sectionImages.terrainMap} position="center 42%" tone="medium" />
          <div className="wrap intro-grid">
            <div data-reveal>
              <SectionEyebrow code="01">MISSION BRIEF</SectionEyebrow>
              <h2 id="about-title">Think clearly.<br /><span>Prove what you find.</span></h2>
            </div>
            <div className="intro-copy" data-reveal>
              <p className="lead-copy">
                ASTRA — {event.clubName} at BMSIT&amp;M — presents a one-day, defence-technology-themed investigation and problem-solving challenge.
              </p>
              <p>
                Teams examine simulated technical situations, analyse evidence, identify failures, and defend their conclusions under time pressure. This is not a conventional quiz, coding competition, or treasure hunt. Careful observation, teamwork, and evidence-based decisions matter at every step.
              </p>
              <div className="about-facts">
                <div><span>01</span><strong>ANALYSE</strong><small>Separate signal from noise.</small></div>
                <div><span>02</span><strong>INVESTIGATE</strong><small>Compare clues with context.</small></div>
                <div><span>03</span><strong>SOLVE</strong><small>Support your call with proof.</small></div>
              </div>
              <div className="mission-metrics" aria-label="Event snapshot">
                <div><strong>02</strong><small>INVESTIGATIONS</small></div>
                <div><strong>05</strong><small>MAX TEAM SIZE</small></div>
                <div><strong>{String(event.networkNodes).padStart(2, "0")}</strong><small>NETWORK STATIONS</small></div>
              </div>
            </div>
          </div>
        </section>

        {/* 04: TACTICAL NETWORK STATIONS MATRIX (ScrollMorphHero) */}
        <ScrollMorphHero />

        {/* 05: TWO INVESTIGATIONS */}
        <section className="rounds-section section-pad image-section" id="rounds" aria-labelledby="rounds-title">
          <SectionBackdrop src={sectionImages.networkTraffic} position="center 48%" tone="soft" />
          <div className="wrap">
            <div className="section-heading-row" data-reveal>
              <div>
                <SectionEyebrow code="02">TWO INVESTIGATIONS</SectionEyebrow>
                <h2 id="rounds-title">Two rounds.<br /><span>Two different signals.</span></h2>
              </div>
              <p className="section-aside">
                Start with a drone incident preserved in its records. Then follow contextual clues through an eight-station communications network.
              </p>
            </div>
            <div className="round-grid">
              {rounds.map((round) => (
                <article className={`round-card accent-${round.accent}`} key={round.number} data-reveal>
                  <div className="round-card-top">
                    <span className="round-number">{round.number}</span>
                    <span className="round-status">
                      FIELD DOSSIER / {round.number === "01" ? "DIGITAL" : "NETWORK"}
                    </span>
                  </div>
                  {round.number === "01" ? (
                    <figure className="round-visual flight-visual image-section">
                      <SectionBackdrop src={sectionImages.droneForest} position="center 44%" tone="medium" />
                      <div className="flight-grid" aria-hidden="true" />
                      <Image
                        className="round-route-image"
                        src="/images/flight-route.webp"
                        alt=""
                        aria-hidden="true"
                        width={697}
                        height={413}
                      />
                      <Image
                        className="round-drone-image"
                        src="/images/ghatak-drone.webp"
                        alt="Illustration of the GHATAK autonomous rescue drone from the mission brief"
                        width={857}
                        height={393}
                      />
                      <figcaption className="visual-caption">
                        <span>GHATAK / FLIGHT RECORD</span>
                        <strong>LINK LOST</strong>
                      </figcaption>
                      <span className="visual-coordinate" aria-hidden="true">ROUTE / UNDER INVESTIGATION</span>
                    </figure>
                  ) : (
                    <NetworkVisual />
                  )}
                  <p className="round-code">ROUND {round.number} <span>/</span> {round.code}</p>
                  <h3>{round.title}</h3>
                  <p className="round-teaser">{round.teaser}</p>
                  <p className="round-detail">{round.detail}</p>
                  <p className="round-output"><strong>MISSION OBJECTIVE</strong>{round.objective}</p>
                  <div className="tag-list">
                    {round.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="card-coordinate">ASTRA / ZERO HOUR <span>—</span> {round.number}</div>
                </article>
              ))}
            </div>
            <p className="fiction-note">
              <span>!</span> GHATAK, the incidents, messages, and network materials are fictional event scenarios.
            </p>
          </div>
        </section>

        {/* 06: TWIST / SPOILER SECTION */}
        <section className="twist-section section-pad image-section" aria-labelledby="twist-title">
          <SectionBackdrop src={sectionImages.signalNodes} position="center 52%" tone="medium" />
          <div className="wrap twist-layout">
            <div className="twist-copy" data-reveal>
              <SectionEyebrow code="03">SPOILER / WITHHELD</SectionEyebrow>
              <h2 id="twist-title">The network<br /><span>has another story.</span></h2>
              <p>
                The investigation will not stay as simple as it first appears. A shift in the system changes how the team reads what comes next. Can you recognise the turn before the network goes dark?
              </p>
              <div className="twist-stamp">
                <span className="amber-dot pulse-indicator" /> TWIST DETECTED <span>DETAILS CLASSIFIED</span>
              </div>
            </div>
            <div className="twist-art" data-reveal aria-hidden="true">
              <NetworkVisual variant="twist" />
              <div className="twist-scanline" />
              <div className="twist-status">SIGNAL STATE <strong>UNSTABLE</strong></div>
            </div>
          </div>
        </section>

        {/* 07: SCHEDULE SECTION */}
        <section className="schedule-section section-pad image-section" id="schedule" aria-labelledby="schedule-title">
          <SectionBackdrop src={sectionImages.terrainMap} position="center 62%" tone="medium" />
          <div className="wrap schedule-layout">
            <div className="schedule-intro" data-reveal>
              <SectionEyebrow code="04">SINGLE-DAY DEPLOYMENT</SectionEyebrow>
              <h2 id="schedule-title">One day.<br /><span>Two operations.</span></h2>
              <p>
                The event takes place on 03 December 2026 at {event.venue.name}. Exact start times and operational schedule will be confirmed in the final briefing.
              </p>
              <div className="schedule-date-box">
                <small>LOCKED DATE</small>
                <strong>03 <span>DEC</span> 2026</strong>
                <small>VENUE · {event.venue.shortLabel}</small>
              </div>
            </div>
            <ol className="timeline">
              {timeline.map((item, index) => (
                <li className="timeline-item" key={item.code} data-reveal>
                  <span className="timeline-node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div className="timeline-content">
                    <small>{item.code}</small>
                    <h3>{item.label}</h3>
                  </div>
                  <span className="timeline-time">{item.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 08: GUEST SPEAKERS */}
        <section className="people-section section-pad image-section" id="guests" aria-labelledby="guests-title">
          <SectionBackdrop src={sectionImages.droneSky} position="right 42%" tone="medium" />
          <div className="wrap people-grid">
            <div className="people-copy" data-reveal>
              <SectionEyebrow code="05">MISSION CONTROL</SectionEyebrow>
              <h2 id="guests-title">Guest speakers</h2>
              <p>Guest identities and briefing sessions will be announced once confirmed by Mission Control.</p>
            </div>
            <article className="placeholder-card guest-placeholder" data-reveal>
              <span className="placeholder-index">GUEST DOSSIER / PENDING</span>
              <div className="placeholder-silhouette" aria-hidden="true">?</div>
              <div>
                <small>FEATURED GUEST</small>
                <h3>To be announced</h3>
                <p>Speaker details and operational credentials coming soon.</p>
              </div>
              <span className="placeholder-stamp">AWAITING<br />TRANSMISSION</span>
            </article>
          </div>
        </section>

        {/* 09: SPONSORS & PARTNERS */}
        <section className="sponsor-section section-pad image-section" id="sponsors" aria-labelledby="sponsors-title">
          <SectionBackdrop src={sectionImages.networkTraffic} position="center 55%" tone="medium" />
          <div className="wrap sponsor-inner">
            <div className="sponsor-heading" data-reveal>
              <SectionEyebrow code="06">PARTNERSHIP CHANNEL</SectionEyebrow>
              <h2 id="sponsors-title">Sponsors &amp; partners</h2>
              <p>Partner channels and technical co-sponsors will appear here after confirmation.</p>
            </div>
            <div className="sponsor-placeholders" aria-label="Sponsor placeholders">
              {["01", "02", "03"].map((slot) => (
                <div key={slot} data-reveal>
                  <span>PARTNER / {slot}</span>
                  <strong>To be announced</strong>
                  <small>ASTRA: ZERO HOUR 2026</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10: PRIZE CTA SECTION */}
        <section className="prize-cta-section image-section" aria-label="Prize pool and registration" data-reveal>
          <SectionBackdrop src={sectionImages.droneForest} position="center 60%" tone="medium" />
          <div className="wrap prize-cta-inner">
            <div>
              <SectionEyebrow code="07">REWARDS FOR REASONING</SectionEyebrow>
              <p className="prize-pool">{event.prizePool}<span> PRIZE POOL</span></p>
              <p className="prize-small">Award distribution details will be announced during debrief.</p>
            </div>
            <div className="prize-cta-action">
              <p>THE NAME IS LOCKED.<br /><span>THE DATE IS SET.</span></p>
              <Link className="button button-primary" href="/register">
                ASSEMBLE YOUR TEAM <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
