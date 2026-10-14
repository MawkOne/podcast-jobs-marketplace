import type { Metadata } from "next";
import CompanyCard from "@/components/CompanyCard";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import EmptyState from "@/components/EmptyState";
import { DATA_AS_OF, listCompanies } from "@/lib/data";
import { canonicalPath } from "@/lib/format";
import { SITE_NAME } from "@/lib/seo";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** noindex, follow (URL_STRUCTURE.md §5). */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  return {
    title: `Companies | ${SITE_NAME}`,
    description: "Company directory — podcast networks and studios hiring podcast talent.",
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalPath("/companies", sp) },
  };
}

export default async function CompaniesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q);
  const status = first(sp.status);

  const all = listCompanies();
  const filtered = all.filter((company) => {
    if (status && company.status !== status) return false;
    if (q && !company.company_name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const activeCount = all.filter((company) => company.status === "active").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Companies</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Podcast networks, studios, and brands on the marketplace. Name search is trigram-indexed in production.
      </p>
      <div className="mt-4">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      <form action="/companies" method="get" className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search company names"
          aria-label="Search companies"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          aria-label="Status"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="prospect">Prospect</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        {filtered.length} of {all.length} companies · {activeCount} active
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No companies match"
            description="Try a different name or clear the status filter."
            action={{ label: "Clear filters", href: "/companies" }}
          />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => (
            <CompanyCard key={company.company_id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
