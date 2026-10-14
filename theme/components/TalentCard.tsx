import Link from "next/link";
import Badge from "@/components/Badge";
import type { TalentListItem } from "@/lib/data";
import { formatCount, formatRate } from "@/lib/format";

/** Talent card — authentic portrait, role, skills, and an outlined CTA. */
export default function TalentCard({ talent }: { talent: TalentListItem }) {
  return (
    <div className="pw-card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-mist to-seafoam">
        {talent.avatar_url ? (
          <img src={talent.avatar_url} alt={talent.display_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-bold text-teal">
              {talent.avatar_fallback}
            </span>
          </div>
        )}
        {talent.hire_me ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal backdrop-blur">
            Open to work
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="truncate text-sm font-semibold text-ink">{talent.display_name}</h3>
        <p className="mt-0.5 truncate text-xs text-gray-500">{talent.functional_area}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="indigo">{talent.country ?? "Remote"}</Badge>
          {talent.shows_rate && talent.rate_per_hour !== null ? <Badge>{formatRate(talent.rate_per_hour)}</Badge> : null}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{formatCount(talent.episode_count)} episodes</span>
          <span>{formatCount(talent.total_listens)} listens</span>
        </div>
        <Link
          href={`/talent/profile/${talent.user_id}`}
          className="pw-btn pw-btn-secondary mt-4 w-full px-4 py-2 text-sm"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
