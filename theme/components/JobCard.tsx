import Link from "next/link";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import type { JobListItem } from "@/lib/data";
import { formatRateRange, locationTypeLabel, timeAgo } from "@/lib/format";

export default function JobCard({ job }: { job: JobListItem }) {
  return (
    <div className="pw-card flex flex-col p-5">
      <div className="flex items-center gap-2.5">
        <Avatar src={null} fallback={job.company.logo_fallback_initials} alt={job.company.company_name} size="sm" />
        <span className="truncate text-xs font-medium text-gray-500">{job.company.company_name}</span>
      </div>
      <Link href={`/job/${job.job_id}`} className="mt-3 text-base font-semibold text-ink transition hover:text-teal">
        {job.title}
      </Link>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{job.role}</Badge>
        <Badge tone="indigo">
          {locationTypeLabel(job.location_type)}
          {job.location ? ` · ${job.location}` : ""}
        </Badge>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-xs text-gray-500">
        <span className="font-semibold text-ink">
          {formatRateRange(job.compensation_min, job.compensation_max)}
        </span>
        <span>Posted {timeAgo(job.posted_at)}</span>
      </div>
    </div>
  );
}
