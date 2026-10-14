import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import { DEMO_TALENT_ID, getTalent } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Your Profiles | ${SITE_NAME}`,
  "Talent and company profiles on your account.",
);

/** Profiles list — the account's talent + company profiles. */
export default function AccountProfilesPage() {
  const talent = getTalent(DEMO_TALENT_ID);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your profiles</h1>
            <p className="mt-1 text-sm text-gray-500">
              One account, many profiles — hire with the company side, work with the talent side.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/account/profiles/create"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Create profile
            </Link>
            <Link
              href="/account/profiles/merge"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Merge profiles
            </Link>
          </div>
        </div>

        <ul className="space-y-4">
          {/* Talent profile */}
          <li className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <Avatar src={talent?.avatar_url ?? null} fallback={talent?.avatar_fallback ?? "?"} alt={talent?.display_name ?? "Talent"} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">{talent?.display_name ?? "Talent profile"}</h2>
                <Badge tone="indigo">Talent</Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                {talent?.functional_area ?? "Role not specified"} · open to work
              </p>
            </div>
            <Link
              href={`/talent/profile/${DEMO_TALENT_ID}`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View profile
            </Link>
          </li>

          {/* Company profile */}
          <li className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-6">
            <Avatar src={null} fallback="BS" alt="Bright Signal Media" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Bright Signal Media</h2>
                <Badge tone="green">Company</Badge>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Tech &amp; SaaS · 1 open job</p>
            </div>
            <Link
              href="/companies/bright-signal"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              View profile
            </Link>
          </li>
        </ul>
      </div>
    </AppShell>
  );
}
