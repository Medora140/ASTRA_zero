import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { event } from "@/lib/event";
import { TelemetryLines } from "@/components/telemetry-lines";
import AtcShader from "@/components/ui/atc-shader";
import ReconBackground from "@/components/recon-background";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(event.siteUrl),
  title: {
    default: "ASTRA: ZERO HOUR 2026 — Defence Problem-Solving Contest",
    template: "%s | ASTRA: ZERO HOUR",
  },
  description:
    "ASTRA: ZERO HOUR is a one-day defence problem-solving contest on 03 December 2026 at BMSIT&M, Bengaluru. Investigate the GHATAK drone incident and an eight-station communication network.",
  keywords: [
    "ASTRA Zero Hour",
    "Defence problem-solving contest",
    "GHATAK drone investigation",
    "Compromised Node challenge",
    "BMSIT&M Bengaluru",
  ],
  applicationName: "ASTRA: ZERO HOUR",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ASTRA: ZERO HOUR",
    title: "ASTRA: ZERO HOUR — A Defence Problem-Solving Contest",
    description: `Two investigations. One day. ${event.prizePool} prize pool · 03 December 2026 · BMSIT&M Bengaluru.`,
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ASTRA: ZERO HOUR — 03 December 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASTRA: ZERO HOUR — A Defence Problem-Solving Contest",
    description: "A Defence Problem-Solving Contest · 03 December 2026 · BMSIT&M Bengaluru",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${ibmPlexMono.variable} ${inter.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          SKIP TO CONTENT [ESC/TAB]
        </a>
        <ReconBackground />
        <AtcShader className="atc-shader-fixed" />
        <TelemetryLines />
        {children}
      </body>
    </html>
  );
}
