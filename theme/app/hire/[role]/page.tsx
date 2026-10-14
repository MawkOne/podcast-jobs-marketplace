import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import StatBlock from "@/components/StatBlock";
import TalentCard from "@/components/TalentCard";
import { DATA_AS_OF, getRoleLanding, listTalentsByRole } from "@/lib/data";
import { formatNumber, formatRate, monthYear } from "@/lib/format";
import { MEDIUM, ROLES, roleBySlug } from "@/lib/roles";
import { breadcrumbJsonLd, faqJsonLd, hireDescription, hireTitle, itemListPeopleJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return ROLES.map((role) => ({ role: role.slug }));
}

type PageProps = { params: Promise<{ role: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const r = roleBySlug(role);
  if (!r) return {};
  const landing = getRoleLanding(r.slug);
  if (!landing) return {};
  return pageMetadata(hireTitle(r.name), hireDescription(r.name, landing.stats_snapshot), `/hire/${r.slug}`);
}

export default async function HireRolePage({ params }: PageProps) {
  const { role } = await params;
  const r = roleBySlug(role);
  if (!r) notFound();
  const landing = getRoleLanding(r.slug);
  if (!landing) notFound();

  const talents = listTalentsByRole(r.name);
  const snap = landing.stats_snapshot;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `Hire ${r.name}s`, path: `/hire/${r.slug}` },
        ])}
      />
      <JsonLd data={itemListPeopleJsonLd(talents)} />
      <JsonLd data={faqJsonLd(landing.faq)} />

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900">Hire {r.name}s</li>
        </ol>
      </nav>

      <div className="mt-6">
        <Badge tone="indigo">Updated {monthYear()}</Badge>
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-5xl">
          Hire {r.name}s for {MEDIUM}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{landing.intro_copy}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatBlock value={formatRate(snap.avg_rate)} label={`Average ${r.name.toLowerCase()} hourly rate`} />
        <StatBlock value={formatNumber(snap.open_to_work)} label="Open to work right now" />
        <StatBlock value={formatNumber(snap.talent_count)} label={`${r.name}s in the catalog`} />
      </div>

      <div className="mt-6">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      <section className="mt-10">
        <SectionHeading
          title={`${r.name}s on ${SITE_NAME}`}
          description="A sample of profiles from the current catalog snapshot."
          action={{ label: `Browse ${r.name} talent`, href: `/talent/search/${r.categorySlug}` }}
        />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {talents.map((talent) => (
            <TalentCard key={talent.user_id} talent={talent} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeading title={`${r.name} FAQs`} description="People also ask — answered from the current snapshot." />
        <div className="mt-6">
          <FaqAccordion items={landing.faq} />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Keep exploring</h2>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href={`/${r.singularSlug}-jobs`} className="font-medium text-indigo-600 hover:underline">
            {r.name} jobs — current openings
          </Link>
          <Link href={`/hire/${r.slug}/rates`} className="font-medium text-indigo-600 hover:underline">
            {r.name} hourly rates
          </Link>
          <Link
            href={`/talent/search/${r.categorySlug}`}
            className="font-medium text-indigo-600 hover:underline"
          >
            Browse {r.name} talent
          </Link>
          <Link href="/faq" className="font-medium text-indigo-600 hover:underline">
            Marketplace FAQs
          </Link>
        </div>
      </section>
    </div>
  );
}
