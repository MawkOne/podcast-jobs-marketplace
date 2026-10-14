import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import JobCard from "@/components/JobCard";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import { getCompany, getJob, listJobs } from "@/lib/data";
import { formatDate, formatRateRange, locationTypeLabel, timeAgo } from "@/lib/format";
import { jobDetailTitle, jobPostingJsonLd, pageMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return pageMetadata(
    jobDetailTitle(job.title, job.company.company_name),
    `${job.title} at ${job.company.company_name} — ${formatRateRange(job.compensation_min, job.compensation_max)}, ${locationTypeLabel(job.location_type)}. Apply on ${SITE_NAME}.`,
    `/job/${job.job_id}`,
  );
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const company = getCompany(job.company.company_account_id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* JobPosting JSON-LD: datePosted, validThrough, hiringOrganization, employmentType, baseSalary */}
      <JsonLd data={jobPostingJsonLd(job)} />

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
          <li className="truncate text-gray-900">{job.title}</li>
        </ol>
      </nav>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Avatar src={null} fallback={job.company.logo_fallback_initials} alt={job.company.company_name} />
          <div>
            <Link
              href={`/companies/${job.company.company_account_id}`}
              className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
            >
              {job.company.company_name}
            </Link>
            {company ? <p className="text-sm text-gray-500">{company.industry}</p> : null}
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{job.title}</h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="indigo">{job.role}</Badge>
          <Badge>
            {locationTypeLabel(job.location_type)}
            {job.location ? ` · ${job.location}` : ""}
          </Badge>
          <Badge tone="green">{formatRateRange(job.compensation_min, job.compensation_max)}</Badge>
          <Badge tone="amber">{job.priority} priority</Badge>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <SectionHeading title="About this role" />
            <p className="mt-3 leading-7 text-gray-600">{job.description}</p>
          </section>
          <section>
            <SectionHeading title="Requirements" />
            <p className="mt-3 leading-7 text-gray-600">{job.requirements}</p>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-sm font-semibold text-gray-900">Compensation</h2>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatRateRange(job.compensation_min, job.compensation_max)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Posted {formatDate(job.posted_at)} · {job.application_count} applicants
            </p>
            <Link
              href="/login"
              className="mt-4 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Sign in to apply
            </Link>
            <p className="mt-2 text-center text-xs text-gray-400">Applications are auth-gated.</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-900">Apply by</h2>
            <p className="mt-1 text-sm text-gray-600">{formatDate(job.expires_at)}</p>
            <p className="mt-2 text-xs text-gray-400">Posted {timeAgo(job.posted_at)}</p>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <SectionHeading
          title="Related jobs"
          description={`Other open ${job.role.toLowerCase()} roles.`}
          action={{ label: "All jobs", href: "/job/search" }}
        />
        {job.related_jobs.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">No other {job.role.toLowerCase()} roles are open right now.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {job.related_jobs.map((related) => (
              <JobCard key={related.job_id} job={related} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
