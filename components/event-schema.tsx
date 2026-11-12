import { event } from "@/lib/event";

export function EventSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.name} — ${event.subtitle}`,
    startDate: event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description:
      "A one-day intercollege defence problem-solving contest with three evidence-led technical rounds, hosted by ASTRA Club.",
    organizer: {
      "@type": "Organization",
      name: "ASTRA Club, BMSIT&M",
    },
    url: event.siteUrl,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />;
}
