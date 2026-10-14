import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Company Profile Wizard | ${SITE_NAME}`,
  "Complete your company profile in three steps.",
);

const STEPS = [
  {
    title: "Company details",
    state: "complete" as const,
    description: "Name, industry, website, and a short description of the show.",
  },
  {
    title: "Show verification",
    state: "current" as const,
    description: "Confirm you own the show so we can sync subscriber and episode stats.",
  },
  {
    title: "Post your first job",
    state: "upcoming" as const,
    description: "Publish a role and start receiving applicants within days.",
  },
];

const STATE_BADGE = {
  complete: <Badge tone="green">Complete</Badge>,
  current: <Badge tone="indigo">Current step</Badge>,
  upcoming: <Badge>Upcoming</Badge>,
};

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** 3-step onboarding wizard — visual steps with an indicator, no state machine. */
export default function CompanyProfileWizardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Set up your company profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Three quick steps: company details, show verification, and your first job.
          </p>
        </div>

        {/* Step indicator */}
        <ol className="flex items-center gap-2" aria-label="Progress">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-1 items-center gap-2">
              <span
                className={
                  step.state === "upcoming"
                    ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-400"
                    : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white"
                }
              >
                {index + 1}
              </span>
              <span
                className={
                  step.state === "upcoming"
                    ? "hidden text-sm text-gray-400 sm:block"
                    : "hidden text-sm font-medium text-gray-900 sm:block"
                }
              >
                {step.title}
              </span>
              {index < STEPS.length - 1 ? <span className="h-px flex-1 bg-gray-200" /> : null}
            </li>
          ))}
        </ol>

        {/* Step cards */}
        <div className="space-y-4">
          {STEPS.map((step, index) => (
            <section key={step.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-gray-900">
                  Step {index + 1}: {step.title}
                </h2>
                {STATE_BADGE[step.state]}
              </div>
              <p className="mt-1 text-sm text-gray-500">{step.description}</p>

              {index === 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input type="text" defaultValue="Bright Signal Media" aria-label="Company name" className={inputClass} />
                  <input type="text" defaultValue="Tech & SaaS" aria-label="Industry" className={inputClass} />
                  <input
                    type="url"
                    defaultValue="https://brightsignal.example"
                    aria-label="Website"
                    className={inputClass}
                  />
                  <input
                    type="url"
                    defaultValue="https://shows.example/bright-signal"
                    aria-label="Show URL"
                    className={inputClass}
                  />
                </div>
              ) : null}

              {index === 1 ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">
                    Verification code: <span className="font-mono font-semibold text-gray-900">BSM-4821</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Paste this code into your show&apos;s description for 24 hours, then click verify.
                  </p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Verify show
                  </button>
                </div>
              ) : null}

              {index === 2 ? (
                <Link
                  href="/job/create"
                  className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Post your first job
                </Link>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
