import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `How It Works | ${SITE_NAME}`,
  "How the marketplace works for companies and freelance talent — post, browse, contact in-app, and hire.",
  "/how-it-works",
);

const COMPANY_STEPS = [
  {
    title: "Post a job or browse talent",
    body: "Publish a role with budget and location type, or browse the synced catalog by role with live facet counts.",
  },
  {
    title: "Review real numbers",
    body: "Every profile carries portfolio sizes, listen counts, and rates from the latest catalog sync — no résumé guessing.",
  },
  {
    title: "Contact in-app",
    body: "Send auth-gated contact requests. Freelancer emails are never exposed; conversations live in-app.",
  },
  {
    title: "Hire and manage",
    body: "Track applicants in a pipeline, message hires, and handle checkout in one place.",
  },
];

const TALENT_STEPS = [
  {
    title: "Create a profile",
    body: "Pick your role from the eight-role taxonomy and add your account details.",
  },
  {
    title: "Get your stats synced",
    body: "Connect a show and the marketplace syncs episode counts, listens, and reviews into your profile.",
  },
  {
    title: "Apply or get discovered",
    body: "Apply to open jobs or get found by companies browsing the catalog.",
  },
  {
    title: "Get hired",
    body: "Accept contact requests, message in-app, and get paid for the work.",
  },
];

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mt-5 space-y-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{step.title}</p>
            <p className="mt-0.5 text-sm leading-6 text-gray-500">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">How {SITE_NAME} works</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        One marketplace, two sides. Companies hire from a synced talent catalog; freelancers get matched to real
        roles.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeading title="For companies" description="Hire podcast talent in four steps." />
          <Steps steps={COMPANY_STEPS} />
          <Link
            href="/signup?as=company"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Start hiring
          </Link>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <SectionHeading title="For talent" description="Get matched to real roles in four steps." />
          <Steps steps={TALENT_STEPS} />
          <Link
            href="/signup?as=talent"
            className="mt-6 inline-block rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            Create a talent profile
          </Link>
        </section>
      </div>
    </div>
  );
}
