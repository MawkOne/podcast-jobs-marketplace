import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getJob, listJobs } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return noindexMetadata(`Edit: ${job.title} | ${SITE_NAME}`, "Edit your job posting.");
}

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** The create form, prefilled with the existing job. */
export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

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
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Edit job</h1>
          <p className="mt-1 text-sm text-gray-500">
            Changes are visible immediately on the public job page — no re-approval needed.
          </p>
        </div>

        <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Job title
            </label>
            <input id="title" type="text" defaultValue={job.title} className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <input id="role" type="text" defaultValue={job.role} readOnly className={`${inputClass} bg-gray-50`} />
            </div>
            <div>
              <label htmlFor="location-type" className="mb-1 block text-sm font-medium text-gray-700">
                Location type
              </label>
              <select id="location-type" className={inputClass} defaultValue={job.location_type}>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea id="description" rows={4} defaultValue={job.description} className={inputClass} />
          </div>

          <div>
            <label htmlFor="requirements" className="mb-1 block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea id="requirements" rows={3} defaultValue={job.requirements} className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="comp-min" className="mb-1 block text-sm font-medium text-gray-700">
                Compensation min ($/hr)
              </label>
              <input id="comp-min" type="number" min={0} defaultValue={job.compensation_min} className={inputClass} />
            </div>
            <div>
              <label htmlFor="comp-max" className="mb-1 block text-sm font-medium text-gray-700">
                Compensation max ($/hr)
              </label>
              <input id="comp-max" type="number" min={0} defaultValue={job.compensation_max} className={inputClass} />
            </div>
            <div>
              <label htmlFor="priority" className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select id="priority" className={inputClass} defaultValue={job.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <Link
              href={`/channel/job/${job.job_id}/applicants`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
