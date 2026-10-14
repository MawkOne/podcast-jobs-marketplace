import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { DEMO_COMPANY_JOB_ID } from "@/lib/data";
import { ROLES } from "@/lib/roles";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Post a Job | ${SITE_NAME}`,
  "Create a job posting for podcast talent.",
);

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none";

/** Job posting form (auth-gated, noindex) — draft → checkout → publish. */
export default function JobCreatePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Post a job</h1>
          <p className="mt-1 text-sm text-gray-500">
            Describe the role, set compensation, and preview before paying. Drafts are saved to your account.
          </p>
        </div>

        <form className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
              Job title
            </label>
            <input id="title" type="text" placeholder="Senior Podcast Editor" className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select id="role" className={inputClass} defaultValue="">
                <option value="" disabled>
                  Select a role
                </option>
                {ROLES.map((role) => (
                  <option key={role.slug} value={role.slug}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location-type" className="mb-1 block text-sm font-medium text-gray-700">
                Location type
              </label>
              <select id="location-type" className={inputClass} defaultValue="remote">
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
            <textarea
              id="description"
              rows={4}
              placeholder="What the person will do, who they'll work with, and the cadence…"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="requirements" className="mb-1 block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <textarea
              id="requirements"
              rows={3}
              placeholder="Experience, portfolio expectations, tooling…"
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="comp-min" className="mb-1 block text-sm font-medium text-gray-700">
                Compensation min ($/hr)
              </label>
              <input id="comp-min" type="number" min={0} placeholder="25" className={inputClass} />
            </div>
            <div>
              <label htmlFor="comp-max" className="mb-1 block text-sm font-medium text-gray-700">
                Compensation max ($/hr)
              </label>
              <input id="comp-max" type="number" min={0} placeholder="45" className={inputClass} />
            </div>
            <div>
              <label htmlFor="priority" className="mb-1 block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select id="priority" className={inputClass} defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Save draft
            </button>
            <Link
              href={`/jobs/${DEMO_COMPANY_JOB_ID}/checkout`}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Continue to checkout
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
