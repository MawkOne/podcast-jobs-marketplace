import type { Metadata } from "next";
import Link from "next/link";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import EmptyState from "@/components/EmptyState";
import FilterRail, { type FilterGroup } from "@/components/FilterRail";
import Pagination from "@/components/Pagination";
import TalentCard from "@/components/TalentCard";
import { DATA_AS_OF, listTalents, talentFacets } from "@/lib/data";
import { availabilityLabel, canonicalPath, withParams } from "@/lib/format";
import { ROLES, roleBySlug } from "@/lib/roles";
import { SITE_NAME } from "@/lib/seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** noindex, follow — canonical to self. */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: `Talent Search | ${SITE_NAME}`,
    description: "Browse the synced catalog of podcast freelancers.",
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalPath("/talent/search", sp) },
  };
}

export default async function TalentSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q);
  const roleSlug = first(sp.role);
  const hireMe = first(sp.hire_me);
  const country = first(sp.country);
  const availability = first(sp.availability);
  const rateMin = first(sp.rate_min);
  const rateMax = first(sp.rate_max);
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);

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
    if (availability && !talent.availability.includes(availability)) return false;
    if (rateMin || rateMax) {
      const rate = talent.shows_rate ? talent.rate_per_hour : null;
      if (rate === null) return false;
      if (rateMin && rate < Number(rateMin)) return false;
      if (rateMax && rate > Number(rateMax)) return false;
    }
    if (q) {
      const haystack = `${talent.display_name} ${talent.functional_area} ${talent.country ?? ""}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const perPage = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const current: Record<string, string | undefined> = {
    q,
    role: roleSlug,
    hire_me: hireMe,
    country,
    availability,
    rate_min: rateMin,
    rate_max: rateMax,
  };

  const rateBandCounts = {
    under25: all.filter((t) => t.shows_rate && t.rate_per_hour !== null && t.rate_per_hour < 25).length,
    mid: all.filter((t) => t.shows_rate && t.rate_per_hour !== null && t.rate_per_hour >= 25 && t.rate_per_hour <= 50)
      .length,
    over50: all.filter((t) => t.shows_rate && t.rate_per_hour !== null && t.rate_per_hour > 50).length,
  };

  const groups: FilterGroup[] = [
    {
      label: "Role",
      options: [
        { label: "All roles", count: all.length, href: withParams("/talent/search", current, { role: undefined }), active: !roleSlug },
        ...ROLES.map((role) => ({
          label: role.name,
          count: facets.role[role.name] ?? 0,
          href: withParams("/talent/search", current, { role: role.slug }),
          active: roleSlug === role.slug,
        })),
      ],
    },
    {
      label: "Availability",
      options: [
        { label: "Any", count: all.length, href: withParams("/talent/search", current, { availability: undefined }), active: !availability },
        ...(["full_time", "part_time", "project_based"] as const).map((value) => ({
          label: availabilityLabel(value),
          count: facets.availability[value] ?? 0,
          href: withParams("/talent/search", current, { availability: value }),
          active: availability === value,
        })),
      ],
    },
    {
      label: "Open to work",
      options: [
        {
          label: "Open to work only",
          count: facets.hire_me,
          href: withParams("/talent/search", current, { hire_me: "1" }),
          active: hireMe === "1",
        },
      ],
    },
    {
      label: "Location",
      options: [
        { label: "Anywhere", count: all.length, href: withParams("/talent/search", current, { country: undefined }), active: !country },
        ...Object.entries(facets.country).map(([name, count]) => ({
          label: name,
          count,
          href: withParams("/talent/search", current, { country: name }),
          active: country === name,
        })),
        {
          label: "Not specified",
          count: facets.unspecified_country,
          href: withParams("/talent/search", current, { country: "none" }),
          active: country === "none",
        },
      ],
    },
    {
      label: "Hourly rate",
      options: [
        {
          label: "Any rate",
          count: all.length,
          href: withParams("/talent/search", current, { rate_min: undefined, rate_max: undefined }),
          active: !rateMin && !rateMax,
        },
        {
          label: "Under $25/hr",
          count: rateBandCounts.under25,
          href: withParams("/talent/search", current, { rate_min: undefined, rate_max: "25" }),
          active: !rateMin && rateMax === "25",
        },
        {
          label: "$25–50/hr",
          count: rateBandCounts.mid,
          href: withParams("/talent/search", current, { rate_min: "25", rate_max: "50" }),
          active: rateMin === "25" && rateMax === "50",
        },
        {
          label: "$50+/hr",
          count: rateBandCounts.over50,
          href: withParams("/talent/search", current, { rate_min: "50", rate_max: undefined }),
          active: rateMin === "50" && !rateMax,
        },
      ],
    },
  ];

  const paginationParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(current)) {
    if (value) paginationParams[key] = value;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find podcast talent</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Browse the synced talent catalog. Facet counts reflect the catalog before filtering, and &quot;Not
        specified&quot; is selectable for location.
      </p>
      <div className="mt-4">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      {/* Category cards */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {ROLES.map((role) => (
          <Link
            key={role.slug}
            href={`/talent/search/${role.categorySlug}`}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            {role.name}
          </Link>
        ))}
      </div>

      {/* Search form */}
      <form action="/talent/search" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search names, roles, or locations"
          aria-label="Search talent"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
        />
        <select
          name="role"
          defaultValue={roleSlug ?? ""}
          aria-label="Role"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All roles</option>
          {ROLES.map((role) => (
            <option key={role.slug} value={role.slug}>
              {role.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterRail groups={groups} />
        <div className="min-w-0 flex-1">
          {visible.length === 0 ? (
            <EmptyState
              title="No talent matches those filters"
              description="Loosen a filter or browse a role category — the catalog is bigger than the snapshot shown here."
              action={{ label: "Reset filters", href: "/talent/search" }}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {filtered.length} of {all.length} profiles in this snapshot
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visible.map((talent) => (
                  <TalentCard key={talent.user_id} talent={talent} />
                ))}
              </div>
              <Pagination basePath="/talent/search" page={currentPage} totalPages={totalPages} params={paginationParams} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
