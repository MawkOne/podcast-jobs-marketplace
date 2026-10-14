import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import JsonLd from "@/components/JsonLd";
import StatBlock from "@/components/StatBlock";
import { getRoleLanding } from "@/lib/data";
import { formatNumber, formatRate, monthYear } from "@/lib/format";
import { ROLES, roleBySlug } from "@/lib/roles";
import { breadcrumbJsonLd, pageMetadata, ratesDescription, ratesTitle } from "@/lib/seo";

export function generateStaticParams() {
  return ROLES.map((role) => ({ role: role.slug }));
}

type PageProps = { params: Promise<{ role: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const r = roleBySlug(role);
  if (!r) return {};
  return pageMetadata(ratesTitle(r.name), ratesDescription(r.name), `/hire/${r.slug}/rates`);
}

export default async function RatesPage({ params }: PageProps) {
  const { role } = await params;
  const r = roleBySlug(role);
  if (!r) notFound();
  const landing = getRoleLanding(r.slug);
  if (!landing) notFound();

  const snap = landing.stats_snapshot;
  const topBucket = [...landing.rate_distribution].sort((a, b) => b.share - a.share)[0];
  const lower = r.name.toLowerCase();
  const plural = `${r.name}s`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `Hire ${r.name}s`, path: `/hire/${r.slug}` },
          { name: "Rates", path: `/hire/${r.slug}/rates` },
        ])}
      />

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/hire/${r.slug}`} className="hover:text-gray-900">
              Hire {plural}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900">Rates</li>
        </ol>
      </nav>

      <div className="mt-6">
        <Badge tone="indigo">Updated {monthYear()}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {r.name} hourly rates
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
          What does it cost to hire a {lower}? Rates below come from the current catalog snapshot — {formatNumber(snap.talent_count)}{" "}
          {plural} with {formatNumber(snap.open_to_work)} openly available for work.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBlock value={formatRate(snap.avg_rate)} label={`Average ${lower} rate`} />
        <StatBlock value={topBucket.label} label="Most common band" />
        <StatBlock value={formatNumber(snap.open_to_work)} label="Open to work now" />
      </div>

      <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Rate distribution</h2>
        <div className="mt-5 space-y-5">
          {landing.rate_distribution.map((bucket) => (
            <div key={bucket.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{bucket.label}</span>
                <span className="text-gray-500">{bucket.share}% of {plural.toLowerCase()}</span>
              </div>
              <div className="mt-1.5 h-2.5 rounded-full bg-gray-100">
                <div className="h-2.5 rounded-full bg-indigo-600" style={{ width: `${bucket.share}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 max-w-3xl space-y-4 text-base leading-7 text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900">What moves {lower} rates</h2>
        <p>
          Rates move with three things: experience, niche, and workload. {plural} who can show completion lift on
          past shows sit at the top of the distribution; generalists and newer freelancers compete on price.
          Niche matters too — business and true-crime shows typically pay above comedy and lifestyle, and
          clip-heavy shows often pay per-episode instead of hourly.
        </p>
        <p>
          Budgeting rule of thumb: at the average rate ({formatRate(snap.avg_rate)}), a weekly interview show
          paying a {lower} for roughly 10 hours per episode spends about {formatRate(snap.avg_rate * 10)} per episode.
          Project-based work usually prices 15–20% above the equivalent hourly rate to cover scoping and revisions.
        </p>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <Link
          href={`/hire/${r.slug}`}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Browse {plural}
        </Link>
        <Link
          href={`/${r.singularSlug}-jobs`}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
        >
          See {r.name} jobs
        </Link>
      </section>
    </div>
  );
}
