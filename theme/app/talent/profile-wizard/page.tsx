import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Profile Wizard | ${SITE_NAME}`,
  "Complete your talent profile section by section.",
);

const SECTIONS = [
  {
    title: "Basics",
    done: true,
    description: "Display name, area, location, and a short about-you blurb.",
  },
  {
    title: "Skills",
    done: true,
    description: "Tools and techniques — up to 12 chips, matched against job requirements.",
  },
  {
    title: "Portfolio",
    done: false,
    description: "Link your best work. Profiles with 3+ portfolio items get contacted most.",
    cta: { label: "Add portfolio items", href: "/talent/edit/vitrine" },
  },
  {
    title: "Rates",
    done: false,
    description: "Your hourly rate and whether to show it publicly.",
  },
  {
    title: "Availability",
    done: false,
    description: "Open to work, availability windows, and remote/hybrid preference.",
  },
];

/** Profile completion checklist with a progress indicator. */
export default function TalentProfileWizardPage() {
  const doneCount = SECTIONS.filter((section) => section.done).length;
  const progress = Math.round((doneCount / SECTIONS.length) * 100);

  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Complete your profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            {doneCount} of {SECTIONS.length} sections done — complete profiles appear higher in discovery.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Profile completion</span>
            <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ul className="space-y-3">
          {SECTIONS.map((section) => (
            <li key={section.title} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5">
              <span
                className={
                  section.done
                    ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
                    : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-xs text-gray-400"
                }
                aria-hidden="true"
              >
                {section.done ? "✓" : ""}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
                  {section.done ? <Badge tone="green">Done</Badge> : <Badge tone="amber">To do</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{section.description}</p>
                {section.cta ? (
                  <Link
                    href={section.cta.href}
                    className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline"
                  >
                    {section.cta.label} →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
