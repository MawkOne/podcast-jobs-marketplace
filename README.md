# Podcast Jobs Marketplace — Template

**A complete, reusable template for standing up a podcast jobs marketplace** — schema, API, URL structure, SEO strategy, and a coded page theme. Grounded in a live production marketplace's proven URL structure and DataForSEO SERP/keyword research.

## What's in the package

| File | What it is |
|---|---|
| **`DATABASE_SCHEMA.md`** | Complete database schema — `catalog` (synced talent/company data) + `platform` (users, jobs, applications, messaging, reviews, SEO landing content), with full DDL, constraints, and indexes. Validated against a live Postgres. |
| **`API_SPEC.md`** | REST API spec aligned 1:1 with the schema — auth, catalog search + facets, jobs, applications, saved searches, contact requests (the PII gate), messaging, reviews, SEO endpoints. Keyset pagination, error envelope, normalization rules. |
| **`URL_STRUCTURE.md`** | The canonical page map — every URL, its page type, functional requirements, and SEO requirements. Includes the research-driven landing families (`/hire/{role}`, `/{role}-jobs`, rates and geo sub-pages). |
| **`SEO_RESEARCH.md`** | The evidence base — DataForSEO SERP analysis (ranking URL patterns, title patterns) and Google Ads keyword volumes that drive the URL structure and on-page requirements. |
| **`SAMPLE_DATA.md`** | Example records showing the data shape (fixture/reference data). |
| **`PODCAST_VERTICAL.md`** | Background and competitive intel for the podcast vertical — the taxonomy, the market read, and the scraper. |
| **`seed/podcast-vertical.json`** | Scraped podcast taxonomy (8 roles · 17 job categories · 10 member types · 10 job types · 114 skills) ready to seed a podcast deployment. |
| **`scripts/scrape-podwires.mjs`** | Polite, resumable scraper for the live Podwires marketplace (sitemap-driven, robots-respecting, zero dependencies). |
| **`theme/`** | The coded theme — a runnable Next.js (App Router, TypeScript, Tailwind) app implementing **every page type**: the public marketplace (home, hire/jobs SEO landings, job search + detail, talent browse + profile, companies, static pages) **plus the full authenticated surface** (§9 of `URL_STRUCTURE.md`): the company buying flow (create → checkout → payment → publish → applicants), the talent journey (onboarding wizards, lead pipeline, share tools, payments), messaging (two-pane mailbox), account/profiles, referrals, notifications. SEO metadata + JSON-LD per page type, name/avatar fallback chains, sparse-field collapse, data-as-of banner, demo admin login. **Podcast-native** — the role taxonomy, sample data, and copy are all podcast production. |

## Intended order of use

1. **Read `SEO_RESEARCH.md`** → understand why the URL families exist
2. **Deploy the schema** → `DATABASE_SCHEMA.md` DDL into a fresh Postgres (`catalog` + `platform` schemas; requires `pg_trgm`)
3. **Stand up the API** → implement `API_SPEC.md` against the schema
4. **Instantiate the theme** → copy `theme/` into your Next.js app (or run it standalone: `npm install && npm run dev`), wire the placeholder data in `lib/data.ts` to the API
5. **Publish the landing pages** → seed `platform.seo_landing_pages` per role; the sitemap and monthly title regeneration follow automatically

## Key design rules baked in

- **PII gate:** talent emails never leave the API — contact flows through `contact_requests` and in-app messaging
- **Fallback chains:** name (`name` → first+last → generated handle) and avatar (image → initials tile) everywhere
- **Honest sparse UI:** NULL-backed sections collapse; filters show live facet counts; "data as of" banner on catalog pages
- **SEO:** exact-keyword titles with monthly freshness, JSON-LD per page type (`JobPosting` on jobs for Google Jobs eligibility), sitemap prioritizing landing families
- **Keyset pagination** on all catalog lists — never offset

## Theme quick start

```bash
cd theme
npm install
npm run dev
```

203 routes prerender at build: the public marketplace (hire/jobs/rates SEO landings, category pages, talent profiles, job details, companies, static pages) plus 30+ authenticated pages across both journeys. All metadata and JSON-LD render server-side. Demo login: `admin@marketplace.example` / `Password123`.
