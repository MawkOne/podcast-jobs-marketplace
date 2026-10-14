import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import SectionHeading from "@/components/SectionHeading";
import { getCompany, getJob, listJobs } from "@/lib/data";
import { formatRateRange, locationTypeLabel } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return noindexMetadata(`Preview: ${job.title} | ${SITE_NAME}`, "Preview your job before publishing.");
}

/** Pre-publish preview — mirrors the public job detail layout, with a Publish CTA. */
export default async function PrePublishPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const company = getCompany(job.company.company_account_id);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Preview before publishing</h1>
            <p className="mt-1 text-sm text-gray-500">
              This is exactly how the job will appear publicly. Nothing is live until you publish.
            </p>
          </div>
          <Badge tone="amber">Draft</Badge>
        </div>

        {/* Job card — same layout as the public detail page */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Avatar src={null} fallback={job.company.logo_fallback_initials} alt={job.company.company_name} />
            <div>
              <p className="text-lg font-semibold text-gray-900">{job.company.company_name}</p>
              {company ? <p className="text-sm text-gray-500">{company.industry}</p> : null}
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{job.title}</h2>
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

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section>
              <SectionHeading title="About this role" />
              <p className="mt-3 leading-7 text-gray-600">{job.description}</p>
            </section>
            <section>
              <SectionHeading title="Requirements" />
              <p className="mt-3 leading-7 text-gray-600">{job.requirements}</p>
            </section>
          </div>

          <aside>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-sm font-semibold text-gray-900">Compensation</h2>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatRateRange(job.compensation_min, job.compensation_max)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Applications open once published.</p>
              <Link
                href={`/jobs/${job.job_id}/after-publish`}
                className="mt-4 block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Publish
              </Link>
              <Link
                href={`/channel/edit/job/${job.job_id}`}
                className="mt-2 block rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Edit draft
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
