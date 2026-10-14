import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import JobCard from "@/components/JobCard";
import { DEMO_TALENT_ID, getApplicationsByTalent, getJob } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Applied Jobs | ${SITE_NAME}`,
  "Jobs you've applied to.",
);

/** Applied jobs — a simple JobCard list of the talent's applications. */
export default function TalentJobsPage() {
  const jobs = getApplicationsByTalent(DEMO_TALENT_ID)
    .map((application) => getJob(application.job_id))
    .filter((job): job is NonNullable<typeof job> => job !== undefined);

  return (
    <AppShell variant="talent">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Jobs you&apos;ve applied to</h1>
          <p className="mt-1 text-sm text-gray-500">
            {jobs.length} application{jobs.length === 1 ? "" : "s"} — live statuses are on your{" "}
            pipeline.
          </p>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Browse open roles and apply — they'll show up here."
            action={{ label: "Browse jobs", href: "/job/search" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
