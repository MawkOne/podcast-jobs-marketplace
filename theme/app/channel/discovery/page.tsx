import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import EmptyState from "@/components/EmptyState";
import FilterRail, { type FilterGroup } from "@/components/FilterRail";
import TalentCard from "@/components/TalentCard";
import { DATA_AS_OF, listTalents, talentFacets } from "@/lib/data";
import { withParams } from "@/lib/format";
import { ROLES, roleBySlug } from "@/lib/roles";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  await searchParams;
  return noindexMetadata(`Talent Discovery | ${SITE_NAME}`, "Find and save podcast talent.");
}

/** Company-side talent discovery — same filter-rail pattern as talent search. */
export default async function DiscoveryPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const roleSlug = first(sp.role);
  const hireMe = first(sp.hire_me);
  const country = first(sp.country);

  const all = listTalents();
  const facets = talentFacets(); // G6: counts computed before filtering

  const roleFilter = roleSlug ? roleBySlug(roleSlug) : undefined;
  const filtered = all.filter((talent) => {
    if (roleFilter && talent.functional_area !== roleFilter.name) return false;
    if (hireMe === "1" && !talent.hire_me) return false;
    if (country) {
      if (country === "none") {
        if (talent.country !== null) return false;
      } else if (talent.country !== country) return false;
    }
    return true;
  });

  const current: Record<string, string | undefined> = { role: roleSlug, hire_me: hireMe, country };

  const groups: FilterGroup[] = [
    {
      label: "Role",
      options: [
        {
          label: "All roles",
          count: all.length,
          href: withParams("/channel/discovery", current, { role: undefined }),
          active: !roleSlug,
        },
        ...ROLES.map((role) => ({
          label: role.name,
          count: facets.role[role.name] ?? 0,
          href: withParams("/channel/discovery", current, { role: role.slug }),
          active: roleSlug === role.slug,
        })),
      ],
    },
    {
      label: "Open to work",
      options: [
        {
          label: "Open to work only",
          count: facets.hire_me,
          href: withParams("/channel/discovery", current, { hire_me: "1" }),
          active: hireMe === "1",
        },
      ],
    },
    {
      label: "Location",
      options: [
        {
          label: "Anywhere",
          count: all.length,
          href: withParams("/channel/discovery", current, { country: undefined }),
          active: !country,
        },
        ...Object.entries(facets.country).map(([name, count]) => ({
          label: name,
          count,
          href: withParams("/channel/discovery", current, { country: name }),
          active: country === name,
        })),
        {
          label: "Not specified",
          count: facets.unspecified_country,
          href: withParams("/channel/discovery", current, { country: "none" }),
          active: country === "none",
        },
      ],
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Discover talent</h1>
            <p className="mt-1 text-sm text-gray-500">
              Search the synced catalog, save promising profiles to your discovery list, and reach out in-app.
            </p>
          </div>
          <Link
            href="/channel/discovery-list"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Saved discovery list →
          </Link>
        </div>

        <DataAsOfBanner date={DATA_AS_OF} />

        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterRail groups={groups} />
          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <EmptyState
                title="No talent matches those filters"
                description="Loosen a filter or browse the full catalog instead."
                action={{ label: "Reset filters", href: "/channel/discovery" }}
              />
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  {filtered.length} of {all.length} profiles in this snapshot
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((talent) => (
                    <TalentCard key={talent.user_id} talent={talent} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
