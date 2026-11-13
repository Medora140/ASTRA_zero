const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astra-zero-hour.vercel.app";

export const event = {
  name: "ASTRA: ZERO HOUR",
  subtitle: "A Defence Problem-Solving Contest",
  clubName: "Armed Squad for Tactical Readiness & Awareness",
  tagline: "Analyse. Investigate. Solve.",
  dateLabel: "03 DECEMBER 2026",
  startDate: "2026-12-03",
  // The exact programme start time is still pending; the countdown marks the event date.
  dateTime: "2026-12-03T00:00:00+05:30",
  prizePool: "₹15,000",
  teamLimit: 5,
  networkNodes: 8,
  siteUrl,
  // Keep empty until ASTRA publishes its event-specific Unstop registration page.
  registrationUrl: process.env.NEXT_PUBLIC_UNSTOP_REGISTRATION_URL || "",
} as const;

export const sections = [
  { label: "About", href: "/#about" },
  { label: "Operations", href: "/#rounds" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Guests", href: "/#guests" },
  { label: "Sponsors", href: "/#sponsors" },
] as const;

export const rounds = [
  {
    number: "01",
    code: "OPERATION: BLACK BOX",
    title: "The Ghatak incident",
    accent: "green",
    teaser: "The drone came back. The explanation didn’t.",
    detail:
      "GHATAK, an autonomous rescue drone, was deployed on a fictional disaster-response mission. It deviated from its assigned route, recorded unusual operational readings, and lost communication with the ground station. The drone was recovered, but its records contain anomalies.",
    objective:
      "Reconstruct the incident, identify the primary technical fault, and justify your conclusion with evidence from the mission records.",
    tags: ["Flight telemetry", "System records", "Evidence analysis"],
  },
  {
    number: "02",
    code: "OPERATION: COMPROMISED NODE",
    title: "Identify the origin",
    accent: "amber",
    teaser: "Eight stations. A set of messages. Can you tell where the signal began?",
    detail:
      "An eight-station distributed communication network carries information between connected nodes. Teams receive printed messages and a network map, then compare context with nearby landmarks and the surrounding environment to determine where each message most likely originated.",
    objective:
      "Use multiple contextual clues to match each message to its likely originating node. One station is behaving abnormally, but the full picture is yours to uncover.",
    tags: ["8 connected stations", "Printed messages", "Contextual clues"],
  },
] as const;

export const timeline = [
  { time: "TIME TBA", label: "Check-in & opening briefing", code: "ARRIVAL" },
  { time: "TIME TBA", label: "Round 01 · Operation: Black Box", code: "DIGITAL INVESTIGATION" },
  { time: "TIME TBA", label: "Qualification & round transition", code: "MISSION RESET" },
  { time: "TIME TBA", label: "Round 02 · Operation: Compromised Node", code: "NETWORK INVESTIGATION" },
  { time: "TIME TBA", label: "Final evaluation & closing", code: "DEBRIEF" },
] as const;

export const unstopFormFields = [
  "Team name",
  "College name (required)",
  "Team leader name, email, and phone",
  "Names of up to four additional members",
] as const;
