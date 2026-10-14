import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import StatBlock from "@/components/StatBlock";
import {
  DEMO_TALENT_ID,
  getApplicationsByTalent,
  getJob,
  type PipelineStatus,
} from "@/lib/data";
import { timeAgo } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Lead Pipeline | ${SITE_NAME}`,
  "Track your applications from first touch to offer.",
);

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

/** Talent dashboard columns — which pipeline statuses land in which section. */
const COLUMNS: { label: string; statuses: PipelineStatus[] }[] = [
  { label: "Applied", statuses: ["identified", "responded"] },
  { label: "Contacted", statuses: ["contacted"] },
  { label: "Interviewing", statuses: ["screening", "interviewing"] },
  { label: "Offers", statuses: ["offer"] },
  { label: "Closed", statuses: ["hired", "rejected", "withdrawn"] },
];

/** THE talent dashboard: applications grouped by pipeline stage. */
export default function LeadPipelinePage() {
  const applications = getApplicationsByTalent(DEMO_TALENT_ID);

  const columns = COLUMNS.map((column) => ({
    ...column,
    items: applications.filter((application) => column.statuses.includes(application.status)),
  }));

  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every application, from first touch to offer. Companies contact you in-app — your email stays private.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatBlock value={String(applications.length)} label="Applications" />
          <StatBlock
            value={String(
              applications.filter((a) => a.status === "screening" || a.status === "interviewing").length,
            )}
            label="In interviews"
          />
          <StatBlock value={String(applications.filter((a) => a.status === "offer").length)} label="Offers" />
        </div>

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Browse open roles and apply — applications land here with their live status."
            action={{ label: "Browse jobs", href: "/job/search" }}
          />
        ) : (
          <div className="space-y-6">
            {columns.map((column) => (
              <section key={column.label}>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">{column.label}</h2>
                  <Badge>{column.items.length}</Badge>
                </div>
                {column.items.length === 0 ? (
                  <p className="mt-2 text-xs text-gray-400">Nothing here right now.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {column.items.map((application) => {
                      const job = getJob(application.job_id);
                      return (
                        <li key={application.application_id} className="rounded-xl border border-gray-200 bg-white p-5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {job ? (
                              <Link
                                href={`/job/${job.job_id}`}
                                className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
                              >
                                {job.title}
                              </Link>
                            ) : (
                              <span className="text-sm font-semibold text-gray-900">Job no longer listed</span>
                            )}
                            <Badge tone={STATUS_TONE[application.status]}>{application.status}</Badge>
                          </div>
                          {job ? (
                            <p className="mt-0.5 text-xs text-gray-500">{job.company.company_name}</p>
                          ) : null}
                          <p className="mt-2 text-sm text-gray-600">{application.notes}</p>
                          <p className="mt-2 text-xs text-gray-400">
                            {application.last_contacted_at
                              ? `Last activity ${timeAgo(application.last_contacted_at)}`
                              : "Awaiting first response"}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
