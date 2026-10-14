/**
 * Title/description builders (patterns from SEO_RESEARCH.md §2) and schema.org
 * JSON-LD builders. Titles include the current month/year and regenerate on
 * every render, satisfying the "regenerated monthly" requirement.
 */
import type { Metadata } from "next";
import { monthYear } from "@/lib/format";
import { HIRE_TITLE_PHRASE, MEDIUM, PUBLISHER_PHRASE } from "@/lib/roles";
import type { Company, JobDetail, LandingFaq, TalentListItem, TalentProfile } from "@/lib/data";

export const SITE_NAME = "Podwave";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://marketplace.example";

/* ------------------------------------------------------------------ */
/* Metadata builders                                                   */
/* ------------------------------------------------------------------ */

export function pageMetadata(title: string, description: string, path?: string): Metadata {
  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
  };
}

/** Search/auth/mailbox pages: noindex, follow. */
export function noindexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: { index: false, follow: true },
  };
}

/** "Hire Podcast Editors for Shows (October 2026) | {Brand}" */
export function hireTitle(roleName: string): string {
  return `Hire ${roleName}s ${HIRE_TITLE_PHRASE} (${monthYear()}) | ${SITE_NAME}`;
}

export function hireDescription(
  roleName: string,
  snap: { avg_rate: number; open_to_work: number; talent_count: number },
): string {
  return `Hire freelance ${roleName.toLowerCase()}s ${HIRE_TITLE_PHRASE.toLowerCase()}. ${snap.talent_count} in the ${SITE_NAME} catalog, ${snap.open_to_work} open to work now, averaging $${snap.avg_rate}/hr.`;
}

/** "Podcast Editor Jobs — 3 Open Roles (October 2026) | {Brand}" */
export function jobsTitle(roleName: string, count: number): string {
  return `${roleName} Jobs — ${count} Open ${count === 1 ? "Role" : "Roles"} (${monthYear()}) | ${SITE_NAME}`;
}

export function jobsDescription(roleName: string, count: number): string {
  return `${count} open ${roleName.toLowerCase()} job${count === 1 ? "" : "s"} on ${SITE_NAME} — remote, hybrid, and onsite roles at ${PUBLISHER_PHRASE}. Updated ${monthYear()}.`;
}

/** "Podcast Editor Hourly Rates | Cost to Hire a Podcast Editor | {Brand}" */
export function ratesTitle(roleName: string): string {
  return `${roleName} Hourly Rates | Cost to Hire a ${roleName} | ${SITE_NAME}`;
}

export function ratesDescription(roleName: string): string {
  return `How much does a ${roleName.toLowerCase()} cost? See the hourly-rate distribution for freelance ${roleName.toLowerCase()}s and what moves rates on ${SITE_NAME}.`;
}

/** "Senior Podcast Editor — Bright Signal Media | {Brand}" */
export function jobDetailTitle(title: string, companyName: string): string {
  return `${title} — ${companyName} | ${SITE_NAME}`;
}

/** "Mya Walsh — Podcast Producer | {Brand}" */
export function talentTitle(name: string, roleName: string): string {
  return `${name} — ${roleName} | ${SITE_NAME}`;
}

export function companyTitle(companyName: string): string {
  return `${companyName} | ${SITE_NAME}`;
}

/** "Podcast Editor Talent — Browse {Brand}" */
export function categoryTitle(roleName: string): string {
  return `${roleName} Talent — Browse ${SITE_NAME}`;
}

export function categoryDescription(roleName: string): string {
  return `Browse ${roleName.toLowerCase()} talent on ${SITE_NAME} — profiles with real portfolio sizes, listen counts, rates, and availability.`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders                                                    */
/* ------------------------------------------------------------------ */

/** WebSite + SearchAction — rendered in the root layout (covers the home page). */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/talent/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** JobPosting with datePosted, validThrough, hiringOrganization, employmentType, baseSalary. */
export function jobPostingJsonLd(job: JobDetail): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.posted_at,
    validThrough: job.expires_at,
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.company_name,
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.compensation_min,
        maxValue: job.compensation_max,
        unitText: "HOUR",
      },
    },
    ...(job.location_type === "remote"
      ? { jobLocationType: "TELECOMMUTE" }
      : {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: job.location ?? "" },
          },
        }),
  };
}

export function personJsonLd(talent: TalentProfile): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: talent.display_name,
    jobTitle: talent.functional_area,
    url: `${SITE_URL}/talent/profile/${talent.user_id}`,
  };
}

export function profilePageJsonLd(talent: TalentProfile): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: personJsonLd(talent),
  };
}

/** ItemList of Person entries — used on hire landings and category browse pages. */
export function itemListPeopleJsonLd(talents: TalentListItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: talents.map((talent, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: talent.display_name,
        jobTitle: talent.functional_area,
        url: `${SITE_URL}/talent/profile/${talent.user_id}`,
      },
    })),
  };
}

export function organizationJsonLd(company: Company): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.company_name,
    url: company.website,
    ...(company.logo_url ? { logo: company.logo_url } : {}),
  };
}

export function faqJsonLd(items: LandingFaq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
