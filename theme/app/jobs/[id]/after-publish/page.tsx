import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { getJob, listJobs } from "@/lib/data";
import { SITE_URL, noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return noindexMetadata(`Published: ${job.title} | ${SITE_NAME}`, "Your job is live.");
}

/** Post-publish confirmation: success state, share links, applicants CTA. */
export default async function AfterPublishPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const publicUrl = `${SITE_URL}/job/${job.job_id}`;
  const brandedSlug = `apply-${job.role.toLowerCase().replace(/\s+/g, "-")}`;
  const brandedUrl = `${SITE_URL}/job/${job.company.company_account_id}/${brandedSlug}`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-6 w-6 text-emerald-600"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your job is live</h1>
              <p className="mt-1 text-sm text-gray-500">
                {job.title} at {job.company.company_name} is now accepting applications.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="green">Published</Badge>
                <Badge tone="indigo">{job.role}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Share links */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Share your job</h2>

          <div>
            <label htmlFor="public-link" className="mb-1 block text-xs font-medium text-gray-500">
              Public job link
            </label>
            <div className="flex gap-2">
              <input
                id="public-link"
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
              />
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="branded-link" className="mb-1 block text-xs font-medium text-gray-500">
              Branded apply URL — hand this out as a direct &quot;apply here&quot; link
            </label>
            <div className="flex gap-2">
              <input
                id="branded-link"
                type="text"
                readOnly
                value={brandedUrl}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600"
              />
              <button
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">Copy buttons are placeholders in this theme.</p>
        </div>

        {/* Next steps */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href={`/channel/job/${job.job_id}/applicants`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200"
          >
            <p className="text-sm font-semibold text-gray-900">View applicants</p>
            <p className="mt-1 text-xs text-gray-500">Track everyone who applies, in one pipeline.</p>
          </Link>
          <Link
            href={`/channel/share-job/${job.job_id}`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200"
          >
            <p className="text-sm font-semibold text-gray-900">More share options</p>
            <p className="mt-1 text-xs text-gray-500">Social links and the branded apply page.</p>
          </Link>
          <Link
            href={`/job/${job.job_id}`}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-indigo-200"
          >
            <p className="text-sm font-semibold text-gray-900">See it live</p>
            <p className="mt-1 text-xs text-gray-500">The public job page, as applicants see it.</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
