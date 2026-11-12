const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astra-zero-hour.vercel.app";

export const event = {
  name: "ASTRA: ZERO HOUR",
  subtitle: "A Defence Problem-Solving Contest",
  dateLabel: "03 DECEMBER 2026",
  startDate: "2026-12-03",
  dateTime: "2026-12-03T00:00:00+05:30",
  prizePool: "₹15,000",
  teamLimit: 8,
  venue: "BMSIT&M, Bengaluru",
  venueStatus: "PROVISIONAL — VENUE TO BE CONFIRMED",
  siteUrl,
  // Replace with the published ASTRA event page on Unstop before registration opens.
  registrationUrl: process.env.NEXT_PUBLIC_UNSTOP_REGISTRATION_URL || "https://unstop.com/",
} as const;

export const sections = [
  { label: "About", href: "/#about" },
  { label: "Rounds", href: "/#rounds" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Guests", href: "/#guests" },
  { label: "Sponsors", href: "/#sponsors" },
] as const;

export const rounds = [
  {
    number: "01",
    code: "OPERATION: BLACK BOX",
    title: "Read the evidence.",
    accent: "green",
    detail:
      "Reconstruct a fictional rescue-drone incident from flight data, sensor logs, and conflicting reports. Find the initiating fault and show where an AI-generated diagnosis goes wrong.",
    tags: ["Telemetry", "AI verification", "Root-cause analysis"],
  },
  {
    number: "02",
    code: "OPERATION: RECOVERY TRACE",
    title: "Follow the trail.",
    accent: "amber",
    detail:
      "Use a chain of staged clues to locate a simulated crash site and recover a mission document. The objective is careful observation and evidence-led reasoning; all props are fictional and safe.",
    tags: ["Clue trail", "Field reasoning", "Evidence recovery"],
  },
  {
    number: "03",
    code: "OPERATION: COMPROMISED NODE",
    title: "Isolate the fault.",
    accent: "red",
    detail:
      "Map an eight-node fictional communications network, trace staged messages, and identify the node creating misleading traffic before the simulated system fails.",
    tags: ["Network mapping", "Message tracing", "Fault detection"],
  },
] as const;

export const timeline = [
  { time: "TIME TBA", label: "Check-in & mission briefing", code: "ARRIVAL" },
  { time: "TIME TBA", label: "Opening address & guest session", code: "BRIEFING" },
  { time: "TIME TBA", label: "Round 01 · Black Box", code: "DIGITAL INVESTIGATION" },
  { time: "TIME TBA", label: "Round 02 · Recovery Trace", code: "FIELD MISSION" },
  { time: "TIME TBA", label: "Break & round transition", code: "RESET" },
  { time: "TIME TBA", label: "Round 03 · Compromised Node", code: "NETWORK CHALLENGE" },
  { time: "TIME TBA", label: "Evaluation, awards & close", code: "DEBRIEF" },
] as const;

export const unstopFormFields = [
  "Team name",
  "College name (required)",
  "Team leader name, email, and phone",
  "Names of up to seven additional members",
] as const;
