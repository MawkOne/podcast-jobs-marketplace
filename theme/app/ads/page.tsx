import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Ad Board | ${SITE_NAME}`,
  "Sponsored placements across the marketplace.",
);

const ADS = [
  {
    id: "ad_001",
    title: "Home page takeover — October",
    budget: 1200,
    status: "live" as const,
    placement: "Home hero banner",
  },
  {
    id: "ad_002",
    title: "Podcast Editor landing sidebar",
    budget: 450,
    status: "scheduled" as const,
    placement: "/hire/podcast-editors",
  },
  {
    id: "ad_003",
    title: "Job search footer strip",
    budget: 300,
    status: "ended" as const,
    placement: "/job/search",
  },
];

const STATUS_TONE = { live: "green", scheduled: "amber", ended: "gray" } as const;

/** Ad board — sponsored listing cards. */
export default function AdsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Ad board</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sponsored placements across the marketplace — landings, search, and the home page.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ADS.map((ad) => (
            <div key={ad.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900">{ad.title}</h2>
                <Badge tone={STATUS_TONE[ad.status]}>{ad.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500">Placement: {ad.placement}</p>
              <p className="mt-3 text-lg font-bold text-gray-900">
                ${ad.budget.toLocaleString("en-US")}
                <span className="ml-1 text-xs font-normal text-gray-400">budget</span>
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400">Ad listings are placeholders — no real inventory in this theme.</p>
      </div>
    </AppShell>
  );
}
