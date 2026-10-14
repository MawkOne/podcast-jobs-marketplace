> ⚠️ **SUPERSEDED — see `URL_STRUCTURE.md`.** This was the first-pass page spec. The canonical page map is now `URL_STRUCTURE.md`, and the theme uses its URL scheme (`/`, `/talent/search/...`, `/companies/...`) — **not** the `/marketplace/*` routes named below. Keep this file for the requirement rationale (G1–G9, R1–R6, D1–D5, which carried into `URL_STRUCTURE.md` + the theme); treat every route path in it as historical.

# Marketplace — Page List, Features & Requirements (Template)

**Template spec for the marketplace pages**, grounded in `DATABASE_SCHEMA.md`. Every feature cites the columns that power it, and every data-quality characteristic from the schema doc is turned into an explicit requirement. Features that need persistence beyond the catalog tables are marked **⚠ requires new table**.

---

## Global requirements (apply to every page)

| # | Requirement | Driven by |
|---|---|---|
| G1 | **"Data as of" freshness banner** on all catalog pages, with a sync-status indicator. Never imply profiles are live. | A uniform `synced_at` means the catalog is a static snapshot, not a live feed |
| G2 | **Name fallback:** display `name` → else `first_name + last_name` → else a generated handle (e.g. "Video Editor · #164714"). Never render an empty name block. | `name` is frequently NULL; `first_name`/`last_name` often NULL |
| G3 | **Avatar fallback:** initials tile derived from the fallback name when `image` is NULL. | `image` is often NULL |
| G4 | **Normalize on read:** `display_salary` (`'true'`/`'false'` text) parsed as boolean; `functional_area` casing normalized (`Youtube Producer` → `YouTube Producer`) for display, raw values preserved for filtering. | Type mismatches and casing inconsistency in source values |
| G5 | **Never expose `talents.email` on public pages.** Contact info is gated behind an authenticated contact-request flow (⚠ requires new table). | `email` is near-complete — a scrape-ready PII list if exposed |
| G6 | **Facet counts before filtering:** every filter shows the live count of results it would produce. Filters that exclude most of the catalog must say so. | `country` and `skills` are frequently empty — naive filtering silently hides most talent |
| G7 | **Keyset pagination** for all catalog lists; offset pagination only for small result sets. | Catalog tables are large; deep offset pages degrade badly |
| G8 | **Dead columns are not rendered:** `story`, `companies.location`, `companies.source`, `companies.contact_email`, `companies.contact_phone` never appear in UI. | These columns are never populated |
| G9 | **Sparse-field rules:** any section whose backing column is NULL collapses silently (no empty "About" boxes). | `about`, `profile_url`, and social links are usually NULL |

---

## Page 1 — Marketplace Home

**Route:** `/marketplace`

**Purpose:** Entry point. Communicate the scale of the catalog, route users to browse/search, and surface the strongest talent immediately.

### Features

| Feature | Data source (columns) |
|---|---|
| Hero stats: total talents · open to work · average hourly rate | `count(*)`, `count(*) FILTER (hire_me)`, `avg(salary_per_hour)` over populated rows |
| **Browse by category** cards — the functional areas with live counts | `functional_area` (indexed) |
| **Open-to-work spotlight** — carousel of `hire_me = true` talents with the strongest engagement | `hire_me` (indexed) + `total_video_views`, `portfolio_count` |
| Quick search bar (name / skill / area) → routes to Page 2 | `name`, `skills` (GIN), `functional_area` |
| "Browse companies" teaser → Page 4 | `companies` grouped by `status` |

### Requirements

- R1.1 Category cards link to pre-filtered browse (`?functional_area=Video Editor`).
- R1.2 Spotlight selection is deterministic (top-N by engagement, seeded rotation) — no random sampling against the full catalog per request.
- R1.3 Stats are cached (they change only on re-sync).

---

## Page 2 — Talent Browse & Search *(the core list page)*

**Route:** `/marketplace/talents`

**Purpose:** Faceted search over the talent catalog. This is where the database's index coverage and its gaps matter most.

### Features — result list

| Feature | Data source |
|---|---|
| Result card: avatar (G3), fallback name (G2), functional area badge, location line (only if present), rate line (only if present), mini-stats (portfolio · videos · views), "Open to work" chip | `image`, `name`/`first_name`/`last_name`, `functional_area`, `country`/`state`/`city`, `salary_per_hour`/`salary_annual` + `display_salary` (G4), `portfolio_count`, `video_count`, `total_video_views`, `hire_me` |
| Sort: Relevance (default) · Open to work · Most viewed · Most videos · Rate (low→high) · Recently active | `hire_me`, `total_video_views`, `video_count`, `salary_per_hour`, `last_activity_at` |
| Keyset pagination + result count | G7 |

### Features — filters (left rail), each with live facet counts (G6)

| Filter | Column / values | Coverage warning (must display) |
|---|---|---|
| Functional area (checkboxes) | `functional_area` — indexed | full coverage |
| Open to work | `hire_me` — indexed | show the live count |
| Availability: full-time / part-time / project-based | `hire_me_availability_*` | not indexed (see R2.4) |
| Work location: remote / hybrid | `hire_me_location_*` | not indexed |
| Country (top countries + "Not specified") | `country` — indexed | most profiles have no country — "Not specified" must be a selectable option, not an exclusion |
| Skills (multi-select from observed values) | `skills` GIN | only a minority of profiles have skills — filter shows this share up front |
| Styles (multi-select) | `styles` | frequently empty arrays |
| Hourly rate range slider | `salary_per_hour` | sparsely populated |
| Minimum portfolio count | `portfolio_count` | — |
| Minimum video count / views | `video_count`, `total_video_views` | — |
| Active recently (activity window) | `last_activity_at` | not indexed (R2.4); relative to the sync date (G1) |
| Verified only | `verified` — indexed | rarely TRUE — show the count; this filter is near-vacuous |

### Requirements

- **R2.1** Free-text search matches `name` (fallback-aware per G2) and `skills`. ⚠ **Pre-launch blocker:** no index exists on `name` — add a `pg_trgm` GIN index before this ships.
- **R2.2** Filter combinations compile to a single SQL query against indexed columns; un-indexed filters (availability, location preference, activity) are accepted only because they're low-cardinality booleans — verify with `EXPLAIN` on the full table before launch.
- **R2.3** Sort by rate applies only to rows with `salary_per_hour` populated; UI states what share of profiles list a rate.
- **R2.4** Add indexes before launch: `name` (trgm), `last_activity_at`, and a partial index on `salary_per_hour WHERE salary_per_hour IS NOT NULL`.
- **R2.5** Empty-filter result sets show an explanatory empty state ("No talents match — most profiles have no country. Try including 'Not specified'.")

---

## Page 3 — Talent Profile

**Route:** `/marketplace/talents/:user_id`

**Purpose:** The full profile a company evaluates before reaching out.

### Features

| Feature | Data source |
|---|---|
| Header: avatar, fallback name, functional area badge, location (if present), "Open to work" + availability chips | `image`, name fields (G2/G3), `functional_area`, geo fields, `hire_me` + `hire_me_availability_*` / `hire_me_location_*` |
| About section | `about` — **collapses when NULL (G9)** |
| Skills chips | `skills` jsonb array |
| Styles / content formats chips | `styles` jsonb array |
| Rate card: hourly and/or annual, with "listed" vs "not listed" state | `salary_per_hour`, `salary_annual`, `display_salary` (G4) |
| Engagement stats: portfolio count, video count, total views / likes / comments, applications | `portfolio_count`, `video_count`, `total_video_views`, `total_video_likes`, `total_video_comments`, `applications_count` |
| Links row (only rendered when present): website, Behance, Dribbble, Twitter, YouTube channel | `website_link`, `behance_link`, `dribbble_link`, `verified_twitter_username`, `youtube_channel_id` — per-row collapse (G9) |
| Profile metadata: joined date, last active | `created_at`, `last_activity_at` (with G1 freshness caveat) |
| **Contact / request intro** button | gated (G5) — ⚠ requires new table (`contact_requests`) |
| **Save to shortlist** button | ⚠ requires new tables (`users`, `shortlists`) |
| 404 handling for absent IDs | `user_id` has gaps (source-side deletions) |

### Requirements

- R3.1 Sections render only when their backing data exists — the typical profile is sparse; the page must look complete with just: name, area, stats, and skills.
- R3.2 "Last active" is always shown relative to the sync date (G1), never as if live.
- R3.3 The verified badge renders only for verified profiles and must not be a headline element (verification is rare).

---

## Page 4 — Companies Directory

**Route:** `/marketplace/companies`

**Purpose:** Browse the channel companies — the demand side of the marketplace.

### Features

| Feature | Data source |
|---|---|
| Search by company name | `company_name` — never NULL; ⚠ **no index on name** (R4.2) |
| Status filter: Active / Prospect | `status` — indexed |
| Industry filter | `industry` — indexed; near-uniform values make this filter weak — display but demote |
| Result card: logo (fallback tile), name, website link, status badge | `logo_url`, `company_name`, `website`, `status` |
| Keyset pagination (G7) | — |

### Requirements

- R4.1 **No subscriber counts in list cards** — `company_size` is sparsely populated. It may appear on a detail page when present, never as a standard card field.
- R4.2 Add a trgm index on `company_name` before name search ships.
- R4.3 `description` and `notes` are detail-page-only fields, rendered per G9.

---

## Page 5 — Company Profile

**Route:** `/marketplace/companies/:company_id`

**Purpose:** Company detail + future home of their job postings.

### Features

| Feature | Data source |
|---|---|
| Header: logo (fallback), name, website, status badge, industry | `logo_url`, `company_name`, `website`, `status`, `industry` |
| Description (collapses per G9) | `description` |
| Subscriber count (only when present) | `company_size` (numeric-cast on read) |
| Contact card (only when present) | `contact_name`, `contact_email`, `contact_phone` — render per G9, expect it to be absent |
| **Open roles** section | ⚠ requires new tables (`jobs`) — **placeholder section until built** |
| **Talent matches for this company** (cross-recommendation) | derivable: company industry ↔ talent `functional_area` — read-only join, no new tables needed |

### Requirements

- R5.1 The page must look complete even when the catalog record is name/website/status-only — design for the sparse case first.
- R5.2 "Open roles" renders an empty-state CTA ("This company hasn't posted yet") rather than being hidden.

---

## Page 6 — Catalog Insights

**Route:** `/marketplace/insights`

**Purpose:** Transparency page powered by the aggregate stats — doubles as the data-health dashboard.

### Features

| Feature | Data source |
|---|---|
| Catalog stats: totals, open-to-work, rates, top countries | aggregates over `talents` |
| Category distribution chart (functional areas with counts/shares) | `functional_area` |
| Field-coverage table: what share of profiles have skills, country, rates, portfolios, videos | null-rate profiles computed live |
| Last sync status + "what this means" explainer | `synced_at` (G1) |
| Top skills / styles leaderboards | `skills`, `styles` jsonb expansions |

### Requirements

- R6.1 All aggregates cached; recompute only on re-sync.
- R6.2 The coverage table is user-facing on purpose — it sets honest expectations for what filters can find (G6).

---

## Pre-launch database work (blocking)

| # | Work item | Why |
|---|---|---|
| D1 | `CREATE EXTENSION pg_trgm` + GIN trgm indexes on `talents.name` and `companies.company_name` | Name search (R2.1, R4.2) — no index exists by default |
| D2 | Index `talents.last_activity_at DESC` | Activity sort/filter (R2.4) |
| D3 | Partial index on `talents.salary_per_hour WHERE salary_per_hour IS NOT NULL` | Rate sort (R2.3) |
| D4 | Read-layer normalization for `display_salary` (text→bool) and area casing | G4 |
| D5 | Re-sync decision: ship with the current snapshot + banner (G1), or refresh first | Check `synced_at` freshness |

## API surface implied by the pages

| Endpoint | Page | Notes |
|---|---|---|
| `GET /api/marketplace/stats` | 1, 6 | cached aggregates |
| `GET /api/marketplace/talents` | 2 | all filters as query params; keyset cursor |
| `GET /api/marketplace/talents/:user_id` | 3 | |
| `GET /api/marketplace/facets` | 2 | per-filter counts (G6) |
| `GET /api/marketplace/companies` | 4 | search + status filter; keyset cursor |
| `GET /api/marketplace/companies/:company_id` | 5 | |
| `GET /api/marketplace/insights/coverage` | 6 | field-coverage table |

## Explicitly out of scope until new tables exist

Shortlists, saved searches, contact requests, company job posts, user accounts — the catalog database contains **only** `talents` and `companies`. Any feature above marked ⚠ requires schema extension first; the read-only marketplace (Pages 1–6) is fully servable from the catalog tables alone.
