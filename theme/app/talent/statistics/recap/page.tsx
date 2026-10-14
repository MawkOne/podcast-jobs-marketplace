import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import StatBlock from "@/components/StatBlock";
import { DEMO_TALENT_ID, getTalent } from "@/lib/data";
import { formatCount } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Statistics Recap | ${SITE_NAME}`,
  "Profile views, applications, and response rates.",
);

/** Applications per week — div-based bar chart, no chart library. */
const WEEKLY_APPLICATIONS = [
  { week: "Sep 14", count: 1 },
  { week: "Sep 21", count: 2 },
  { week: "Sep 28", count: 1 },
  { week: "Oct 5", count: 3 },
  { week: "Oct 12", count: 2 },
];

/** Stats recap: StatBlocks + a simple bar visualization. */
export default function StatisticsRecapPage() {
  const talent = getTalent(DEMO_TALENT_ID);
  const maxCount = Math.max(...WEEKLY_APPLICATIONS.map((week) => week.count));

  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Statistics recap</h1>
          <p className="mt-1 text-sm text-gray-500">
            How your profile performed in the current snapshot — synced data, not live.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatBlock value={formatCount(talent?.stats.total_listens ?? 0)} label="Total listens" />
          <StatBlock value={String(talent?.stats.applications_count ?? 0)} label="Applications" />
          <StatBlock value="64%" label="Response rate" />
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Applications per week</h2>
          <div className="mt-6 flex h-40 items-end gap-4">
            {WEEKLY_APPLICATIONS.map((week) => (
              <div key={week.week} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{week.count}</span>
                <div
                  className="w-full rounded-t-lg bg-indigo-600"
                  style={{ height: `${Math.max(8, (week.count / maxCount) * 100)}%` }}
                />
                <span className="text-[11px] text-gray-400">{week.week}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Catalog stats</h2>
          <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-gray-500">Portfolio items</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{talent?.stats.portfolio_count ?? 0}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Episodes</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">{talent?.stats.episode_count ?? 0}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total listens</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">
                {formatCount(talent?.stats.total_listens ?? 0)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Total reviews</dt>
              <dd className="mt-0.5 font-semibold text-gray-900">
                {formatCount(talent?.stats.total_reviews ?? 0)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </AppShell>
  );
}
