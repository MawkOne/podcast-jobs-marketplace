import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";
import {
  getJob,
  getTalentListItem,
  listApplications,
  type Application,
} from "@/lib/data";
import { formatRate, timeAgo } from "@/lib/format";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Outreach List | ${SITE_NAME}`,
  "Talent you've contacted and who to follow up with.",
);

/** Proactive outreach — talents the company contacted, with follow-up CTAs. */
export default function OutreachListPage() {
  const outreach = listApplications().filter(
    (application) => application.status === "contacted" || application.status === "responded",
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Outreach list</h1>
          <p className="mt-1 text-sm text-gray-500">
            Talent you&apos;ve proactively contacted. Follow up in-app — emails are never exchanged.
          </p>
        </div>

        {outreach.length === 0 ? (
          <EmptyState
            title="No outreach yet"
            description="Find talent in discovery and send a contact request to start a conversation."
            action={{ label: "Discover talent", href: "/channel/discovery" }}
          />
        ) : (
          <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
            {outreach.map((application: Application) => {
              const talent = getTalentListItem(application.talent_account_id);
              const job = getJob(application.job_id);
              return (
                <li key={application.application_id} className="flex flex-wrap items-center gap-4 p-5">
                  <Avatar
                    src={talent?.avatar_url ?? null}
                    fallback={talent?.avatar_fallback ?? "?"}
                    alt={talent?.display_name ?? "Talent"}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {talent ? (
                        <Link
                          href={`/talent/profile/${talent.user_id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-indigo-600"
                        >
                          {talent.display_name}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">Unknown talent</span>
                      )}
                      <Badge tone={application.status === "responded" ? "green" : "indigo"}>
                        {application.status === "responded" ? "Replied" : "Contacted"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {talent?.functional_area ?? "Role not specified"}
                      {talent?.shows_rate && talent.rate_per_hour !== null
                        ? ` · ${formatRate(talent.rate_per_hour)}`
                        : ""}
                      {job ? ` · outreach for ${job.title}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {application.last_contacted_at
                        ? `Last contacted ${timeAgo(application.last_contacted_at)}`
                        : "Not contacted yet"}
                    </p>
                  </div>
                  <Link
                    href="/mailbox"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Follow up
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
