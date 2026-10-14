import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import FilterRail, { type FilterGroup } from "@/components/FilterRail";
import JsonLd from "@/components/JsonLd";
import TalentCard from "@/components/TalentCard";
import { DATA_AS_OF, listTalents, listTalentsByRole, talentFacets } from "@/lib/data";
import { availabilityLabel } from "@/lib/format";
import { ROLES, roleByCategorySlug } from "@/lib/roles";
import {
  breadcrumbJsonLd,
  categoryDescription,
  categoryTitle,
  itemListPeopleJsonLd,
  pageMetadata,
} from "@/lib/seo";

export function generateStaticParams() {
  return ROLES.map((role) => ({ category: role.categorySlug }));
}

type PageProps = { params: Promise<{ category: string }> };

/** Category browse pages are indexable (URL_STRUCTURE.md §4). */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const r = roleByCategorySlug(category);
  if (!r) return {};
  return pageMetadata(categoryTitle(r.name), categoryDescription(r.name), `/talent/search/${r.categorySlug}`);
}

export default async function CategoryBrowsePage({ params }: PageProps) {
  const { category } = await params;
  const r = roleByCategorySlug(category);
  if (!r) notFound();

  const talents = listTalentsByRole(r.name);
  const facets = talentFacets();
  const total = listTalents().length;

  const groups: FilterGroup[] = [
    {
      label: "Role",
      options: [
        { label: "All roles", count: total, href: "/talent/search" },
        ...ROLES.map((role) => ({
          label: role.name,
          count: facets.role[role.name] ?? 0,
          href: `/talent/search/${role.categorySlug}`,
          active: role.slug === r.slug,
        })),
      ],
    },
    {
      label: "Availability",
      options: (["full_time", "part_time", "project_based"] as const).map((value) => ({
        label: availabilityLabel(value),
        count: facets.availability[value] ?? 0,
        href: `/talent/search?role=${r.slug}&availability=${value}`,
      })),
    },
    {
      label: "Open to work",
      options: [
        {
          label: "Open to work only",
          count: facets.hire_me,
          href: `/talent/search?role=${r.slug}&hire_me=1`,
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <JsonLd data={itemListPeopleJsonLd(talents)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Talent", path: "/talent/search" },
          { name: r.name, path: `/talent/search/${r.categorySlug}` },
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
            <Link href="/talent/search" className="hover:text-gray-900">
              Talent
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900">{r.name}</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">{r.name} talent</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600">
        {r.description} Browse {r.name.toLowerCase()}s from the current snapshot below, or head to the hire page
        for rate benchmarks and FAQs.
      </p>
      <div className="mt-4">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterRail groups={groups} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-500">{talents.length} profiles in this snapshot</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {talents.map((talent) => (
              <TalentCard key={talent.user_id} talent={talent} />
            ))}
          </div>
        </div>
      </div>

      <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Keep exploring</h2>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href={`/hire/${r.slug}`} className="font-medium text-indigo-600 hover:underline">
            Hire {r.name}s — rates &amp; FAQs
          </Link>
          <Link href={`/${r.singularSlug}-jobs`} className="font-medium text-indigo-600 hover:underline">
            {r.name} jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
