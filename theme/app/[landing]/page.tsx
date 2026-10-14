import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import DataAsOfBanner from "@/components/DataAsOfBanner";
import EmptyState from "@/components/EmptyState";
import JobCard from "@/components/JobCard";
import JsonLd from "@/components/JsonLd";
import { DATA_AS_OF, getJobsByRole, jobsLandingIntro } from "@/lib/data";
import { locationTypeLabel } from "@/lib/format";
import { ROLES, roleByJobsSlug } from "@/lib/roles";
import { breadcrumbJsonLd, jobPostingJsonLd, jobsDescription, jobsTitle, pageMetadata } from "@/lib/seo";

/**
 * Catch-all for /{role}-jobs landing pages (e.g. /podcast-editor-jobs).
 * The slug must end with "-jobs" and map to a real role, else notFound().
 */
export function generateStaticParams() {
  return ROLES.map((role) => ({ landing: `${role.singularSlug}-jobs` }));
}

type PageProps = { params: Promise<{ landing: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landing } = await params;
  const r = roleByJobsSlug(landing);
  if (!r) return {};
  const jobs = getJobsByRole(r.name);
  return pageMetadata(jobsTitle(r.name, jobs.length), jobsDescription(r.name, jobs.length), `/${landing}`);
}

export default async function RoleJobsPage({ params }: PageProps) {
  const { landing } = await params;
  const r = roleByJobsSlug(landing);
  if (!r) notFound();
  const jobs = getJobsByRole(r.name);

  const locationCounts: Record<string, number> = {};
  for (const job of jobs) {
    locationCounts[job.location_type] = (locationCounts[job.location_type] ?? 0) + 1;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* JobPosting JSON-LD per listed job — Google Jobs eligibility */}
      {jobs.map((job) => (
        <JsonLd key={job.job_id} data={jobPostingJsonLd(job)} />
      ))}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: `${r.name} Jobs`, path: `/${landing}` },
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
            <Link href="/job/search" className="hover:text-gray-900">
              Jobs
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900">{r.name} jobs</li>
        </ol>
      </nav>

      <div className="mt-6">
        <Badge tone="green">Now hiring</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {r.name} Jobs — {jobs.length} Open {jobs.length === 1 ? "Role" : "Roles"}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{jobsLandingIntro(r, jobs.length)}</p>
      </div>

      <div className="mt-6">
        <DataAsOfBanner date={DATA_AS_OF} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500">Filter by location:</span>
        {["remote", "hybrid", "onsite"].map((loc) => (
          <Link
            key={loc}
            href={`/job/search?loc=${loc}`}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
          >
            {locationTypeLabel(loc)} ({locationCounts[loc] ?? 0})
          </Link>
        ))}
      </div>

      <div className="mt-6">
        {jobs.length === 0 ? (
          <EmptyState
            title={`No open ${r.name} jobs right now`}
            description="New roles land weekly as companies publish them. Browse talent in the meantime, or check the full job board."
            action={{ label: "Browse all jobs", href: "/job/search" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        )}
      </div>

      <section className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Keep exploring</h2>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href={`/hire/${r.slug}`} className="font-medium text-indigo-600 hover:underline">
            Hire {r.name}s — talent grid &amp; rates
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
        </div>
      </section>
    </div>
  );
}
