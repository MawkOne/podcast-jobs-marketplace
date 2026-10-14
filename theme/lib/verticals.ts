/**
 * Vertical taxonomy — this marketplace is podcast-native, so the taxonomy is
 * the podcast production taxonomy, derived from the live Podwires marketplace
 * (see PODCAST_VERTICAL.md). The landing families, category browse, and the
 * SEO sitemap all follow from these roles.
 *
 * When updating the taxonomy, also update:
 *   - DATABASE_SCHEMA.md §5 `platform.jobs.role` CHECK constraint values
 *   - the sample catalog data in lib/data.ts (areas + names)
 *   - the landing copy in lib/data.ts (it references the vertical's medium)
 */

export type Role = {
  name: string;
  slug: string;              // plural — /hire/{slug}
  singularSlug: string;      // singular — /{singularSlug}-jobs
  categorySlug: string;      // underscore — /talent/search/{categorySlug}
  description: string;
};

/* ─────────────────────────────── Podcast ───────────────────────────────── */

/**
 * Podcast production taxonomy — roles mapped from the live Podwires
 * marketplace's member types + demand signals (provider counts at scrape time
 * in comments). Slugs follow the three landing families.
 */
export const PODCAST_ROLES: Role[] = [
  {
    name: "Podcast Producer",
    slug: "podcast-producers",
    singularSlug: "podcast-producer",
    categorySlug: "podcast_producer",
    description: "Run end-to-end production: booking, recording, editing oversight, and delivery.",
  },
  {
    name: "Audio Engineer",
    slug: "audio-engineers",
    singularSlug: "audio-engineer",
    categorySlug: "audio_engineer",
    description: "Record, mix, and master episodes to broadcast loudness standards.",
  },
  {
    name: "Podcast Editor",
    slug: "podcast-editors",
    singularSlug: "podcast-editor",
    categorySlug: "podcast_editor",
    description: "Cut filler, tighten pacing, and deliver publish-ready episodes on schedule.",
  },
  {
    name: "Sound Designer",
    slug: "sound-designers",
    singularSlug: "sound-designer",
    categorySlug: "sound_designer",
    description: "Build sonic identity: intro/outro, beds, stings, and immersive audio.",
  },
  {
    name: "Podcast Consultant",
    slug: "podcast-consultants",
    singularSlug: "podcast-consultant",
    categorySlug: "podcast_consultant",
    description: "Advise on format, positioning, and monetization for new or relaunching shows.",
  },
  {
    name: "Podcast Strategist",
    slug: "podcast-strategists",
    singularSlug: "podcast-strategist",
    categorySlug: "podcast_strategist",
    description: "Plan growth: distribution, promotion, guest strategy, and audience targets.",
  },
  {
    name: "Podcast Manager",
    slug: "podcast-managers",
    singularSlug: "podcast-manager",
    categorySlug: "podcast_manager",
    description: "Own the production calendar, guest coordination, and publishing operations.",
  },
  {
    name: "Show Notes Writer",
    slug: "show-notes-writers",
    singularSlug: "show-notes-writer",
    categorySlug: "show_notes_writer",
    description: "Write SEO-ready show notes, timestamps, and episode summaries.",
  },
];

export const VERTICALS = {
  podcast: PODCAST_ROLES,
} as const;

export type VerticalId = keyof typeof VERTICALS;

/**
 * Per-vertical copy — the medium name and the phrase for who posts jobs.
 * Landing copy and SEO titles read from these so the words match the vertical.
 */
export const VERTICAL_COPY: Record<
  VerticalId,
  { medium: string; publisherPhrase: string; hireTitlePhrase: string }
> = {
  podcast: {
    medium: "Podcasts",
    publisherPhrase: "podcast networks and production studios",
    // "Hire Podcast Producers for Shows" reads better than "...for Podcasts".
    hireTitlePhrase: "for Shows",
  },
};
