import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import Badge from "@/components/Badge";
import JsonLd from "@/components/JsonLd";
import SectionHeading from "@/components/SectionHeading";
import StatBlock from "@/components/StatBlock";
import { getReviews, getTalent, listTalents } from "@/lib/data";
import { availabilityLabel, formatCount, formatDate, formatRate, timeAgo } from "@/lib/format";
import { pageMetadata, profilePageJsonLd, talentTitle, SITE_NAME } from "@/lib/seo";

export function generateStaticParams() {
  return listTalents().map((talent) => ({ id: String(talent.user_id) }));
}

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const talent = getTalent(Number(id));
  if (!talent) return {};
  const description = talent.about
    ? `${talent.display_name} — ${talent.functional_area} on ${SITE_NAME}. ${talent.about.slice(0, 140)}`
    : `${talent.display_name} — ${talent.functional_area} on ${SITE_NAME}. Rates, availability, and engagement stats from the latest catalog sync.`;
  return pageMetadata(
    talentTitle(talent.display_name, talent.functional_area),
    description,
    `/talent/profile/${talent.user_id}`,
  );
}

export default async function TalentProfilePage({ params }: PageProps) {
  const { id } = await params;
  const talent = getTalent(Number(id));
  if (!talent) notFound();
  const reviews = getReviews(`talent:${talent.user_id}`);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* ProfilePage + Person JSON-LD */}
      <JsonLd data={profilePageJsonLd(talent)} />

      {/* Header: avatar w/ initials fallback, name fallback chain, area badge, location, open-to-work chips */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar src={talent.avatar_url} fallback={talent.avatar_fallback} alt={talent.display_name} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-[-0.03em] text-gray-900 sm:text-4xl">{talent.display_name}</h1>
              {talent.verified ? <Badge tone="indigo">Verified</Badge> : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge>{talent.functional_area}</Badge>
              {talent.hire_me ? <Badge tone="green">Open to work</Badge> : null}
              {talent.availability.map((value) => (
                <Badge key={value}>{availabilityLabel(value)}</Badge>
              ))}
            </div>
            {talent.country ? (
              <p className="mt-3 text-sm text-gray-500">
                {[talent.city, talent.state, talent.country].filter(Boolean).join(", ")}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-gray-400">
              Joined {formatDate(talent.created_at)} · Last active {timeAgo(talent.last_active_at)}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/login"
              className="block rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Sign in to contact
            </Link>
            <p className="mt-1.5 text-xs text-gray-400">Contact is auth-gated; emails are never exposed.</p>
          </div>
        </div>
      </div>

      {/* About — collapses when NULL (G9) */}
      {talent.about ? (
        <section className="mt-8">
          <SectionHeading title="About" />
          <p className="mt-3 max-w-3xl leading-7 text-gray-600">{talent.about}</p>
        </section>
      ) : null}

      {/* Skills + styles chips — collapse when empty (G9) */}
      {talent.skills.length > 0 || talent.styles.length > 0 ? (
        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          {talent.skills.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Skills</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {talent.skills.map((skill) => (
                  <Badge key={skill} tone="indigo">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
          {talent.styles.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Styles</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {talent.styles.map((style) => (
                  <Badge key={style}>{style}</Badge>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Rate card — collapses when rate is NULL (G9) */}
      {talent.rate_per_hour !== null ? (
        <section className="mt-8 max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Rate</h2>
          <p className="mt-2 text-3xl font-bold tracking-[-0.03em] text-gray-900">
            {talent.shows_rate ? formatRate(talent.rate_per_hour) : "Not shown"}
          </p>
          <p className="mt-1 text-xs text-gray-500">Per hour, from the latest catalog sync.</p>
        </section>
      ) : null}

      {/* Engagement stats */}
      <section className="mt-8">
        <SectionHeading title="Engagement" description="Synced from connected shows." />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBlock value={formatCount(talent.stats.episode_count)} label="Episodes" />
          <StatBlock value={formatCount(talent.stats.total_listens)} label="Total listens" />
          <StatBlock value={formatCount(talent.stats.total_reviews)} label="Total reviews" />
          <StatBlock value={String(talent.stats.portfolio_count)} label="Portfolio pieces" />
        </div>
      </section>

      {/* Links — per-row collapse (G9) */}
      {talent.links.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Links</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {talent.links.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="text-indigo-600 hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Reviews — collapse when absent (G9) */}
      {reviews.results.length > 0 ? (
        <section className="mt-10">
          <SectionHeading
            title={`Reviews · ${reviews.average_rating.toFixed(1)} average`}
            description="Left by companies after completed collaborations."
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {reviews.results.map((review) => (
              <div key={review.review_id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{review.title}</p>
                  <Badge tone="amber">{"★".repeat(review.rating)}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{review.body}</p>
                <p className="mt-3 text-xs text-gray-400">
                  {review.reviewer.display_name} · {formatDate(review.created_at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
