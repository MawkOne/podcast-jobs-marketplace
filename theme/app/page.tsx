import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import TalentCard from "@/components/TalentCard";
import Avatar from "@/components/Avatar";
import { STATS, listTalents } from "@/lib/data";
import { formatNumber, formatRate } from "@/lib/format";
import { ROLES } from "@/lib/roles";
import { SITE_NAME, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  `Hire Podcast Talent | ${SITE_NAME}`,
  "Connect with experienced podcast editors, producers, hosts, writers, and audio specialists who can bring your ideas to life.",
  "/",
);

const TRUSTED_BY = ["Spotify", "Apple Podcasts", "YouTube", "Audible", "SiriusXM", "Wondery", "NPR"];

const ROLE_ICONS: Record<string, string> = {
  podcast_producer: "M4 12h2l2-6 3 14 3-18 3 12 2-4h3",
  audio_engineer: "M4 12h2l3-6v12l3-16 3 20 3-10 2 4h2",
  podcast_editor: "M7 7 5 9l2 2M17 7l2 2-2 2M14 5l-4 14",
  sound_designer: "M12 3v18M8 7v10M16 6v12M4 10v4M20 9v6",
  podcast_consultant: "M4 6h16v9H8l-4 4V6Z",
  podcast_strategist: "M4 20V9M10 20V5M16 20v-7M22 20v-4",
  podcast_manager: "M5 5h14v15H5zM9 3v4M15 3v4M8 12h8M8 16h5",
  show_notes_writer: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7",
};

function RoleIcon({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden className="h-5 w-5">
      <path d={ROLE_ICONS[slug] ?? ROLE_ICONS.podcast_producer} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const featured = listTalents().slice(0, 4);
  const heroTalent = featured.find((talent) => talent.hire_me) ?? featured[0];

  return (
    <div>
      {/* Hero — two columns over a soft teal backdrop */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-mist to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              Podcast talent, cleanly connected
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.06] text-ink sm:text-5xl lg:text-[3.5rem]">
              Find the talent behind your{" "}
              <span className="text-teal">next great episode.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-500">
              Hire podcast editors, producers, hosts, writers, and audio specialists to bring your show to life. From
              launch to growth, find the right talent on {SITE_NAME}.
            </p>

            <form action="/talent/search" method="get" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  name="q"
                  aria-label="Search talent or services"
                  placeholder="What podcast talent or service are you looking for?"
                  className="pw-input h-12 w-full pl-11 pr-4 text-sm placeholder:text-gray-400"
                />
              </div>
              <button type="submit" className="pw-btn pw-btn-primary h-12 px-6 text-sm">
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {ROLES.slice(0, 5).map((role) => (
                <Link key={role.slug} href={`/talent/search/${role.categorySlug}`} className="pw-chip">
                  {role.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Hero visual — studio photo */}
          <div className="relative hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/hero-mic.png"
                alt="Vintage studio microphone and headphones on a wooden desk"
                className="h-full w-full object-cover"
              />
            </div>

            {heroTalent ? (
              <div className="pw-card absolute -bottom-6 -left-6 w-64 p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={heroTalent.avatar_url}
                    fallback={heroTalent.avatar_fallback}
                    alt={heroTalent.display_name}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{heroTalent.display_name}</p>
                    <p className="truncate text-xs text-gray-500">{heroTalent.functional_area}</p>
                  </div>
                </div>
                <div className="mt-3 flex h-6 items-end gap-1" aria-hidden>
                  {[6, 12, 18, 10, 22, 14, 20, 8, 16, 11].map((h, i) => (
                    <span key={i} className="w-1 rounded-full bg-seafoam" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
          {[
            { value: formatNumber(STATS.talent_count), label: "Podcast professionals" },
            { value: "10M+", label: "Minutes of audio produced" },
            { value: formatNumber(STATS.open_jobs), label: "Podcast shows & brands" },
            { value: "4.9/5", label: "Average client rating" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="pw-icon-tile h-10 w-10 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
                  <path d="M12 3v18M8 8v8M16 6v12M4 11v2M20 10v4" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <dt className="text-lg font-bold text-ink">{stat.value}</dt>
                <dd className="text-xs text-gray-500">{stat.label}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Trusted by */}
      <section className="border-b border-gray-200 bg-cloud">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Trusted by podcasters and audio brands worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {TRUSTED_BY.map((brand) => (
              <span key={brand} className="text-lg font-semibold tracking-tight text-gray-400">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeading
          title="Browse podcast talent by specialty"
          action={{ label: "View all", href: "/talent/category-list" }}
        />
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role) => (
            <Link key={role.slug} href={`/talent/search/${role.categorySlug}`} className="pw-card group flex items-start gap-4 p-5">
              <span className="pw-icon-tile h-11 w-11 shrink-0">
                <RoleIcon slug={role.categorySlug} />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-ink">{role.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{role.description}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal opacity-0 transition group-hover:opacity-100">
                  Browse →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured talent */}
      <section className="border-y border-gray-200 bg-cloud">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <SectionHeading
            title="Featured podcast talent"
            action={{ label: "View all", href: "/talent/search" }}
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((talent) => (
              <TalentCard key={talent.user_id} talent={talent} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-seafoam to-mist px-8 py-12 sm:px-12">
          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Your next great podcast starts with the right talent.
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Join thousands of podcasters and brands working with top audio professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/talent/search" className="pw-btn pw-btn-primary px-5 py-2.5 text-sm">
                Find Talent
              </Link>
              <Link href="/hire" className="pw-btn pw-btn-secondary px-5 py-2.5 text-sm">
                Post a Project
              </Link>
            </div>
          </div>
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className="pointer-events-none absolute -bottom-8 right-4 hidden h-56 w-56 text-teal/20 sm:block"
          >
            <g fill="currentColor">
              <rect x="24" y="86" width="10" height="28" rx="5" />
              <rect x="46" y="66" width="10" height="68" rx="5" />
              <rect x="68" y="42" width="10" height="116" rx="5" />
              <rect x="90" y="26" width="10" height="148" rx="5" />
              <rect x="112" y="56" width="10" height="88" rx="5" />
              <rect x="134" y="78" width="10" height="44" rx="5" />
              <rect x="156" y="92" width="10" height="16" rx="5" />
            </g>
          </svg>
        </div>
      </section>

      {/* Experience principles */}
      <section className="border-t border-gray-200 bg-cloud">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Work with real experts", body: "Verified audio professionals with real experience." },
            { title: "Simple collaboration", body: "Manage projects, share files, and communicate in one place." },
            { title: "Secure & worry-free", body: "Safe payments and milestone protection." },
            { title: "Built for creators", body: "Tools and support to help you grow your show." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="pw-icon-tile h-10 w-10 shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" aria-hidden>
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
