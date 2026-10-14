import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { ROLES } from "@/lib/roles";
import { SITE_NAME, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `Frequently Asked Questions | ${SITE_NAME}`,
  "How the marketplace works — hiring costs, contacting talent, data freshness, and posting jobs.",
  "/faq",
);

const FAQS = [
  {
    question: "What is this marketplace?",
    answer:
      "This is a jobs marketplace that connects podcast networks and production studios with freelance talent — podcast editors, audio engineers, sound designers, show notes writers, podcast managers, strategists, producers, and consultants. Catalog profiles are synced from source platforms, so every listing carries real portfolio and engagement numbers.",
  },
  {
    question: "How much does it cost to hire a podcast editor?",
    answer:
      "Freelance podcast editors currently average $38/hr. Most fall between $25 and $40/hr; specialists with proven results charge more. See the podcast editor rates page for the full distribution.",
  },
  {
    question: "How do I contact a freelancer?",
    answer:
      "Create a company account, then send a contact request from any profile. Requests route through the platform into the freelancer's mailbox — email addresses are never exposed publicly.",
  },
  {
    question: "Are talent profiles live?",
    answer:
      "No. Profiles are synced snapshots from source platforms. Every catalog page shows a \"data as of\" banner with the sync date, and profile pages show joined and last-active dates relative to the sync.",
  },
  {
    question: "How do I post a job?",
    answer:
      "Sign up as a company, fill in the role, title, description, requirements, compensation range, and location type, then publish. Jobs move through draft → open → filled, and applicants land in your pipeline.",
  },
  {
    question: "Where do talent stats come from?",
    answer:
      "Episode counts, listens, and reviews are synced from connected shows. Rates and availability come from the freelancer's own settings, normalized on read.",
  },
  {
    question: "Can freelancers work remotely?",
    answer:
      "Most roles are remote-first. Filters support remote, hybrid, and onsite, plus a \"Not specified\" option for talent without a listed location.",
  },
  {
    question: "What does it cost to join?",
    answer:
      "Browsing is public. Talent profiles are free. Companies pay only when hiring — posting and checkout flows are part of the platform.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* FAQPage JSON-LD */}
      <JsonLd data={faqJsonLd(FAQS)} />

      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Frequently asked questions</h1>
      <p className="mt-2 text-gray-600">
        The marketplace basics, including the cost questions from the role landing pages.
      </p>

      <div className="mt-8">
        <FaqAccordion items={FAQS} />
      </div>

      <section className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <SectionHeading title="Role-specific FAQs" description="Every hire page carries its own FAQ block." />
        <ul className="mt-3 space-y-1.5 text-sm">
          {ROLES.map((role) => (
            <li key={role.slug}>
              <Link href={`/hire/${role.slug}`} className="text-indigo-600 hover:underline">
                Hire {role.name}s — FAQs &amp; rates
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
