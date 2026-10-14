# Podcast Vertical — background & competitive intel

This marketplace **is** the podcast product: the role taxonomy, sample data, and copy are all podcast production, derived from the live [Podwires](https://podwires.com) marketplace. This page covers the taxonomy (`seed/podcast-vertical.json`), the competitive read, and the scraper.

---

## 1. Why podcast

`OPPORTUNITY_RESEARCH.md` ranked **podcast production** as the #1 non-red-ocean opportunity. Verification since then:

- **Podwires is the live incumbent** — a podcast production marketplace with 164 producers, 1,293 job listings, 131 portfolio projects, 273 events. So the space is not empty; it's an early incumbent.
- **Its liquidity is thin and partly seeded** — a sample showed every job posted on the same date with generic scenarios and all clients "identity not verified," i.e. largely templated listings rather than organic client demand.
- **It has concrete SEO gaps we already close** — no `JobPosting` JSON-LD on its 1,293 job pages (ineligible for Google Jobs rich results) and no `Person`/`ProfilePage` schema on its producer profiles. The template emits both.
- **Search demand is real and LOW-competition** (Google Ads, US/US, from `SEO_RESEARCH.md`): `podcast jobs` 1,900/mo (LOW), `podcast editor` 1,300/mo, `podcast producer jobs` 880/mo (LOW), `podcast editing services` 390/mo.

Net: a real market with a weak, early incumbent and unclaimed SEO ground.

## 2. The taxonomy (scraped)

`seed/podcast-vertical.json` holds the full scraped taxonomy:

| Group | Terms | Source |
|---|---|---|
| Roles | 8 | mapped from Podwires member types (see §3) |
| Job categories | 17 | `job_category` taxonomy |
| Member types | 10 | `member_type` taxonomy |
| Job types | 10 | `job_type` taxonomy |
| Skills | **114** | `member_skill` taxonomy |
| Blog categories | 17 | `category` taxonomy |

Sample categories: Podcast Editing · Podcast Management · Podcast Production · Podcast Marketing Strategy · Podcast Video Editing · Shownote Writing · Social Media Management · Audio Production · Sound Engineering · Voice Narration. Sample skills: Podcast Editing · Sound Design · Audio Mixing · Script Writing · Remote Recording · Audio Repair · Music Composition · Foley · Mastering · Consulting.

## 3. The role map (landing families)

Eight roles, chosen from Podwires' member types and its live demand signals (provider counts at scrape time in parentheses):

| Role | Hire landing | Jobs landing | Category browse | Demand |
|---|---|---|---|---|
| Podcast Producer | `/hire/podcast-producers` | `/podcast-producer-jobs` | `/talent/search/podcast_producer` | 20 freelancers (largest) |
| Audio Engineer | `/hire/audio-engineers` | `/audio-engineer-jobs` | `/talent/search/audio_engineer` | 14 |
| Podcast Editor | `/hire/podcast-editors` | `/podcast-editor-jobs` | `/talent/search/podcast_editor` | 9 |
| Sound Designer | `/hire/sound-designers` | `/sound-designer-jobs` | `/talent/search/sound_designer` | niche |
| Podcast Consultant | `/hire/podcast-consultants` | `/podcast-consultant-jobs` | `/talent/search/podcast_consultant` | 8 |
| Podcast Strategist | `/hire/podcast-strategists` | `/podcast-strategist-jobs` | `/talent/search/podcast_strategist` | 3 |
| Podcast Manager | `/hire/podcast-managers` | `/podcast-manager-jobs` | `/talent/search/podcast_manager` | 3 |
| Show Notes Writer | `/hire/show-notes-writers` | `/show-notes-writer-jobs` | `/talent/search/show_notes_writer` | Shownote Writing is a top job category |

Each role automatically gets a **hire landing**, a **rates sub-page** (`/hire/{role}/rates`), a **jobs landing**, and a **category browse** — all generated from the taxonomy, with the SEO title patterns from `SEO_RESEARCH.md`, now medium-aware ("Hire Podcast Producers for Podcasts (Month Year)").

Verification: the podcast vertical builds **203 static pages** (8 roles × their landing families).

## 4. How the taxonomy is wired

The theme is podcast-native:

| Layer | File | Behaviour |
|---|---|---|
| Taxonomy | `theme/lib/verticals.ts` | `PODCAST_ROLES` + `VERTICAL_COPY` (medium name, publisher phrase) |
| Selector | `theme/lib/roles.ts` | exports `ROLES`, `MEDIUM`, `PUBLISHER_PHRASE` + lookups |
| SEO copy | `theme/lib/seo.ts` | hire/jobs titles + descriptions use `MEDIUM` / `PUBLISHER_PHRASE` |
| Landing copy | `theme/lib/data.ts` | intro copy + FAQ use `MEDIUM`; per-role `STATS_SNAPSHOTS` + `RATE_DISTRIBUTIONS` are curated for all eight roles |

**Already wired for the podcast vertical:**
1. **Schema** — `platform.jobs.role` CHECK values in `DATABASE_SCHEMA.md` §5 use the podcast role names.
2. **Catalog data** — `catalog.talent_profiles.functional_area` sample data uses the podcast taxonomy.
3. **Job data** — sample postings use podcast roles, so the jobs landings show real counts.
4. **Landing snapshots** — per-role `STATS_SNAPSHOTS` + `RATE_DISTRIBUTIONS` entries exist for all eight roles.

**Still to do when you ship live:** replace the sample data in `lib/data.ts` with real synced catalog rows and real postings.

## 5. The scraper

`scripts/scrape-podwires.mjs` — Node 18+, no dependencies, polite and resumable.

```bash
node scripts/scrape-podwires.mjs --taxonomies                 # taxonomy terms only (fast)
node scripts/scrape-podwires.mjs --types jobs,members --limit 50
node scripts/scrape-podwires.mjs --types all --out data/podwires
```

- **Enumerates via the WordPress sitemaps** (`wp-sitemap-*.xml`) — no crawling-into-nowhere.
- **Rate-limited** (1.2s default) with retry/backoff; **resumable** (already-fetched URLs are skipped).
- **Respects robots.txt** — it touches only sitemaps and public detail pages; never dashboards, auth, or `/wp-json`.
- Extracts per type: jobs (title, description, category, posted, deadline, budget, client-verified), members (name, headline, ID-verified, available), projects/events/posts (generic).
- Output: JSONL per type + `taxonomy.json` + `summary.json`.

Scrapeable inventory at the time of writing: **1,293 jobs · 164 members · 131 projects · 273 events · 310 posts · 82 authors · 168 taxonomy terms**.

**Before any bulk run, read their Terms & Conditions** — `robots.txt` permits AI crawlers, but a ToS can govern bulk collection separately.
