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
  return noindexMetadata(`Share: ${job.title} | ${SITE_NAME}`, "Share your job posting.");
}

const SOCIALS = [
  { label: "Share on X", href: "#" },
  { label: "Share on LinkedIn", href: "#" },
  { label: "Share on Reddit", href: "#" },
  { label: "Share via email", href: "#" },
];

/** Share options for a published job: copy link, branded apply URL, socials. */
export default async function ShareJobPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const publicUrl = `${SITE_URL}/job/${job.job_id}`;
  const brandedSlug = `apply-${job.role.toLowerCase().replace(/\s+/g, "-")}`;
  const brandedUrl = `${SITE_URL}/job/${job.company.company_account_id}/${brandedSlug}`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Link
            href={`/channel/job/${job.job_id}/applicants`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Back to applicants
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Share this job</h1>
          <p className="mt-1 text-sm text-gray-500">
            {job.title} · <Badge tone="green">Published</Badge>
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
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
              Branded apply URL — your direct &quot;apply here&quot; link
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
            <p className="mt-1 text-xs text-gray-400">
              The branded page shows your company block and the role — applicants land straight in your pipeline.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Social sharing</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {social.label}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400">Social links are placeholders in this theme.</p>
        </div>
      </div>
    </AppShell>
  );
}
