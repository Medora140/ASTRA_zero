import { event } from "@/lib/event";

export function EventSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.name} — ${event.subtitle}`,
    startDate: event.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue.address,
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560119",
        addressCountry: "IN",
      },
    },
    description:
      "A one-day defence problem-solving contest with two evidence-led investigations: the GHATAK autonomous rescue drone incident and an eight-station communication network challenge.",
    organizer: {
      "@type": "Organization",
      name: `ASTRA — ${event.clubName} — BMSIT&M`,
    },
    url: event.siteUrl,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />;
}
