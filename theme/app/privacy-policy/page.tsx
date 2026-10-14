import type { Metadata } from "next";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `Privacy Policy | ${SITE_NAME}`,
  "How the marketplace collects, uses, and protects data.",
  "/privacy-policy",
);

const SECTIONS = [
  {
    title: "Overview",
    body: "This policy explains what data the marketplace collects, why, and how you can control it. It is template copy for the theme — replace it with your real policy before launching.",
  },
  {
    title: "Data we collect",
    body: "Account data (email, display name, role), job and application content you create, and in-app messages. Passwords are stored as hashes only.",
  },
  {
    title: "Catalog data",
    body: "Talent profiles are synced from source platforms. Synced fields include public portfolio stats, rates, and availability. Source emails are never exposed by any endpoint or page — contact flows go through in-app contact requests.",
  },
  {
    title: "Cookies",
    body: "We use a session cookie for authentication and nothing else. No third-party advertising cookies.",
  },
  {
    title: "Data sharing",
    body: "We do not sell personal data. Aggregate catalog statistics (counts, average rates) are published on SEO landing pages and contain no personal information.",
  },
  {
    title: "Your controls",
    body: "You can export or delete your account data from account settings. Deleting an account removes applications, messages, and reviews you created.",
  },
  {
    title: "Changes",
    body: "If this policy changes materially, we will notify account holders in-app before the change takes effect.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated October 2026</p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            <p className="mt-2 leading-7 text-gray-600">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
