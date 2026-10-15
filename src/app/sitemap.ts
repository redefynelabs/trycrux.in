import type { MetadataRoute } from "next";
import { sortedEntries, ENTRIES } from "@/content/changelog";
import { SITE } from "@/lib/site";

const PATHS = ["", "/pricing", "/demo", "/contact", "/changelog", "/legal/terms", "/legal/privacy", "/legal/data-ownership"];

export default function sitemap(): MetadataRoute.Sitemap {
  // The newest changelog entry is when the product, and so the product pages, last changed.
  const shipped = new Date(sortedEntries(ENTRIES)[0]?.date ?? Date.now());
  const legal = new Date("2026-10-15");
  return PATHS.map((p) => ({
    url: SITE.url + p,
    lastModified: p.startsWith("/legal") ? legal : shipped,
    changeFrequency: p === "" || p === "/changelog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/pricing" || p === "/demo" ? 0.9 : p.startsWith("/legal") ? 0.3 : 0.7,
  }));
}
