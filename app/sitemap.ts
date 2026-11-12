import type { MetadataRoute } from "next";
import { event } from "@/lib/event";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: event.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${event.siteUrl}/register`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];
}
