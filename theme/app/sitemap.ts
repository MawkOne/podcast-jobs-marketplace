import type { MetadataRoute } from "next";
import { ROLES } from "@/lib/roles";
import { SITE_URL } from "@/lib/seo";

/**
 * Static pages + every role landing page (hire + jobs + rates) + category
 * browse pages, per SEO_RESEARCH.md §4. Landings get high priority; titles
 * regenerate monthly via generateMetadata.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/how-it-works`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
  for (const role of ROLES) {
    entries.push(
      { url: `${SITE_URL}/hire/${role.slug}`, lastModified, changeFrequency: "monthly", priority: 1 },
      { url: `${SITE_URL}/${role.singularSlug}-jobs`, lastModified, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/hire/${role.slug}/rates`, lastModified, changeFrequency: "monthly", priority: 0.8 },
      {
        url: `${SITE_URL}/talent/search/${role.categorySlug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
      },
    );
  }
  return entries;
}
