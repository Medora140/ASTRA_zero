import type { Metadata, Viewport } from "next";
import "./globals.css";
import { event } from "@/lib/event";

export const metadata: Metadata = {
  metadataBase: new URL(event.siteUrl),
  title: {
    default: "ASTRA: ZERO HOUR 2026 | Defence Problem-Solving Contest",
    template: "%s | ASTRA: ZERO HOUR",
  },
  description:
    "Join ASTRA: ZERO HOUR, a one-day intercollege defence problem-solving contest on 03 December 2026. Investigate, follow the clues, and solve the mission.",
  applicationName: "ASTRA: ZERO HOUR",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ASTRA: ZERO HOUR",
    title: "ASTRA: ZERO HOUR — A Defence Problem-Solving Contest",
    description: "Three rounds. One day. ₹15,000 prize pool. 03 December 2026.",
    url: "/",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "ASTRA: ZERO HOUR — 03 December 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRA: ZERO HOUR 2026",
    description: "A Defence Problem-Solving Contest · 03 December 2026",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
