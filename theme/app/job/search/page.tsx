import type { Metadata } from "next";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import EmptyState from "@/components/EmptyState";
import FilterRail, { type FilterGroup } from "@/components/FilterRail";
import JobCard from "@/components/JobCard";
import Pagination from "@/components/Pagination";
import { DATA_AS_OF, listJobs } from "@/lib/data";
import { canonicalPath, locationTypeLabel, withParams } from "@/lib/format";
import { ROLES, roleBySlug } from "@/lib/roles";
import { SITE_NAME } from "@/lib/seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** noindex, follow — canonical to self (URL_STRUCTURE.md §3). */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: `Job Search | ${SITE_NAME}`,
    description: "Search open podcast jobs on the marketplace.",
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalPath("/job/search", sp) },
  };
}

export default async function JobSearchPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const roleSlug = first(sp.role);
  const loc = first(sp.loc);
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);

  const all = listJobs();
  const roleCounts: Record<string, number> = {};
  const locCounts: Record<string, number> = {};
  for (const job of all) {
    roleCounts[job.role] = (roleCounts[job.role] ?? 0) + 1;
    locCounts[job.location_type] = (locCounts[job.location_type] ?? 0) + 1;
  }

  const roleFilter = roleSlug ? roleBySlug(roleSlug) : undefined;
  const filtered = all.filter((job) => {
    if (roleFilter && job.role !== roleFilter.name) return false;
    if (loc && job.location_type !== loc) return false;
    return true;
  });

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const current: Record<string, string | undefined> = { role: roleSlug, loc };
  const groups: FilterGroup[] = [
    {
      label: "Role",
      options: [
        { label: "All roles", count: all.length, href: withParams("/job/search", current, { role: undefined }), active: !roleSlug },
        ...ROLES.map((role) => ({
          label: role.name,
          count: roleCounts[role.name] ?? 0,
          href: withParams("/job/search", current, { role: role.slug }),
          active: roleSlug === role.slug,
        })),
      ],
    },
    {
      label: "Location type",
      options: [
        { label: "Anywhere", count: all.length, href: withParams("/job/search", current, { loc: undefined }), active: !loc },
        ...(["remote", "hybrid", "onsite"] as const).map((value) => ({
          label: locationTypeLabel(value),
          count: locCounts[value] ?? 0,
          href: withParams("/job/search", current, { loc: value }),
          active: loc === value,
        })),
      ],
    },
  ];

  const paginationParams: Record<string, string> = {};
  if (roleSlug) paginationParams.role = roleSlug;
  if (loc) paginationParams.loc = loc;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Job search</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Open roles from companies on the marketplace. Facet counts reflect all open jobs before filtering.
      </p>
      <div className="mt-4">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterRail groups={groups} />
        <div className="min-w-0 flex-1">
          {visible.length === 0 ? (
            <EmptyState
              title="No jobs match those filters"
              description="Try removing a filter, or browse talent by role category instead."
              action={{ label: "Browse talent", href: "/talent/search" }}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500">
                {filtered.length} of {all.length} open jobs
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {visible.map((job) => (
                  <JobCard key={job.job_id} job={job} />
                ))}
              </div>
              <Pagination basePath="/job/search" page={currentPage} totalPages={totalPages} params={paginationParams} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
