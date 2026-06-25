import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Sitemap for search-engine indexing (Google Search Console).
 *
 * Canonical URLs are the English locale (`/en/…`). The PT locale renders the
 * English copy as a placeholder (toggle hidden until translation lands), so it
 * is intentionally omitted here to avoid advertising duplicate content. Add the
 * `pt` paths + hreflang `alternates` once real Portuguese copy exists.
 */

const base = site.url.replace(/\/$/, "");

// Every static page under src/app/[lang]/. Path "" is the home route.
const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "about", priority: 0.8, changeFrequency: "monthly" },
  { path: "leadership", priority: 0.7, changeFrequency: "monthly" },
  { path: "our-story", priority: 0.6, changeFrequency: "yearly" },
  { path: "ecosystem", priority: 0.8, changeFrequency: "monthly" },
  { path: "products", priority: 0.8, changeFrequency: "monthly" },
  { path: "services", priority: 0.8, changeFrequency: "monthly" },
  { path: "global", priority: 0.7, changeFrequency: "monthly" },
  { path: "partners", priority: 0.6, changeFrequency: "monthly" },
  { path: "contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${base}/${path}` : base,
    lastModified,
    changeFrequency,
    priority,
  }));
}
