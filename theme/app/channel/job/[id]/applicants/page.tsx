import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import {
  getApplicationsByJob,
  getJob,
  getTalentListItem,
  listJobs,
  PIPELINE_STATUSES,
  type Application,
  type PipelineStatus,
} from "@/lib/data";
import { formatRate, timeAgo } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listJobs().map((job) => ({ id: job.job_id }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return {};
  return noindexMetadata(`Applicants: ${job.title} | ${SITE_NAME}`, "Manage your applicant pipeline.");
}

const STATUS_TONE: Record<PipelineStatus, "gray" | "indigo" | "green" | "amber"> = {
  identified: "gray",
  contacted: "indigo",
  responded: "indigo",
  screening: "amber",
  interviewing: "amber",
  offer: "green",
  hired: "green",
  rejected: "gray",
  withdrawn: "gray",
};

function ApplicantCard({ application }: { application: Application }) {
  const talent = getTalentListItem(application.talent_account_id);
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <Avatar
          src={talent?.avatar_url ?? null}
          fallback={talent?.avatar_fallback ?? "?"}
          alt={talent?.display_name ?? "Applicant"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {talent ? (
              <Link
                href={`/talent/profile/${talent.user_id}`}
                className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
              >
                {talent.display_name}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-gray-900">Unknown applicant</span>
            )}
            <Badge tone={STATUS_TONE[application.status]}>{application.status}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            {talent?.functional_area ?? "Role not specified"}
            {talent?.shows_rate && talent.rate_per_hour !== null ? ` · ${formatRate(talent.rate_per_hour)}` : ""}
          </p>
          <p className="mt-2 text-sm text-gray-600">{application.notes}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
            <span>
              {application.rating !== null
                ? `Rating: ${"★".repeat(application.rating)}${application.rating}/5`
                : "Not rated yet"}
            </span>
            <span>
              {application.last_contacted_at
                ? `Contacted ${timeAgo(application.last_contacted_at)}`
                : "Never contacted"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-700"
            >
              Advance status
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Message
            </button>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Applicant pipeline per job — grouped by status, with placeholder status actions. */
export default async function ApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const applications = getApplicationsByJob(id);

  const grouped = PIPELINE_STATUSES.map((status) => ({
    status,
    items: applications.filter((application) => application.status === status),
  })).filter((group) => group.items.length > 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link href="/job/create" className="text-sm font-medium text-indigo-600 hover:underline">
              ← Your jobs
            </Link>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">Applicants</h1>
            <p className="mt-1 text-sm text-gray-500">
              {job.title} at {job.company.company_name} — {applications.length} applicant
              {applications.length === 1 ? "" : "s"} in the pipeline.
            </p>
          </div>
          <Link
            href={`/channel/share-job/${job.job_id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Share this job →
          </Link>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            title="No applicants yet"
            description="Share the job link or your branded apply URL to start receiving applications."
            action={{ label: "Share this job", href: `/channel/share-job/${job.job_id}` }}
          />
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <section key={group.status}>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    {group.status}
                  </h2>
                  <Badge>{group.items.length}</Badge>
                </div>
                <div className="mt-3 grid gap-4 xl:grid-cols-2">
                  {group.items.map((application) => (
                    <ApplicantCard key={application.application_id} application={application} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Status-change buttons are placeholders — the real flow PATCHes the application status.
        </p>
      </div>
    </AppShell>
  );
}
