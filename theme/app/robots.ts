import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Allow landing/detail pages; disallow search results, auth, account, and
 * checkout paths (URL_STRUCTURE.md §8). `/talent/search` itself is disallowed
 * while `/talent/search/` (the indexable category browse pages) stays allowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/talent/search/"],
        disallow: [
          "/job/search",
          "/talent/search",
          "/login",
          "/signup",
          "/mailbox",
          "/account",
          "/job/create",
          "/jobs/",
          "/payment",
          "/set-password",
          "/redirect/",
          "/channel/",
          "/company/",
          "/outreach-list",
          "/review",
          "/user/",
          "/talent/signup",
          "/talent/walkthrough",
          "/talent/lead-pipeline",
          "/talent/jobs",
          "/talent/settings",
          "/talent/notifications",
          "/talent/my-payment",
          "/talent/share-space",
          "/talent/statistics",
          "/talent/edit/",
          "/talent/category-list",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
