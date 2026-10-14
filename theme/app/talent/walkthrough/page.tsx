import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Welcome Walkthrough | ${SITE_NAME}`,
  "Three steps to a complete talent profile.",
);

const STEPS = [
  {
    title: "Complete your profile",
    description:
      "Add your basics, skills, portfolio, rates, and availability. Complete profiles get contacted far more often.",
    cta: { label: "Open the profile wizard", href: "/talent/profile-wizard" },
  },
  {
    title: "Connect your show",
    description:
      "Verify your show so your episode counts and listens sync into your profile automatically.",
    cta: { label: "Connect a show", href: "/account/management" },
  },
  {
    title: "Browse and apply to jobs",
    description:
      "Matched roles land in your pipeline. Apply in one click and track every stage from Applied to Offer.",
    cta: { label: "Browse jobs", href: "/job/search" },
  },
];

/** Onboarding walkthrough — three step cards. */
export default function TalentWalkthroughPage() {
  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome — three steps to your first gig</h1>
          <p className="mt-1 text-sm text-gray-500">
            Most freelancers complete all three in under an hour. You can always come back to this walkthrough.
          </p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, index) => (
            <section key={step.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-gray-900">{step.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                  <Link
                    href={step.cta.href}
                    className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    {step.cta.label}
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Skipped steps stay available from your{" "}
          <Link href="/account" className="text-indigo-600 hover:underline">
            account home
          </Link>
          .
        </p>
      </div>
    </AppShell>
  );
}
