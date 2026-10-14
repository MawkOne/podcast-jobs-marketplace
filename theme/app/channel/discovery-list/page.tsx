import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import TalentCard from "@/components/TalentCard";
import { getTalentListItem } from "@/lib/data";
import { noindexMetadata, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata(
  `Saved Discovery List | ${SITE_NAME}`,
  "Talent you saved from discovery.",
);

/** Saved discovery list — the talents the company bookmarked from /channel/discovery. */
const SAVED_TALENT_IDS = [164714, 100241, 132554, 119486];

export default function DiscoveryListPage() {
  const saved = SAVED_TALENT_IDS.map((id) => getTalentListItem(id)).filter(
    (talent): talent is NonNullable<typeof talent> => talent !== undefined,
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Saved discovery list</h1>
            <p className="mt-1 text-sm text-gray-500">
              Profiles you bookmarked while browsing. Saved lists are snapshots — profiles may have changed since.
            </p>
          </div>
          <Link
            href="/channel/discovery"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Back to discovery →
          </Link>
        </div>

        {saved.length === 0 ? (
          <EmptyState
            title="Nothing saved yet"
            description="Bookmark talent from discovery to build a shortlist here."
            action={{ label: "Browse talent", href: "/channel/discovery" }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {saved.map((talent) => (
              <TalentCard key={talent.user_id} talent={talent} />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400">
          Note: saved profiles are point-in-time snapshots from the catalog sync — they are not live feeds.
        </p>
      </div>
    </AppShell>
  );
}
