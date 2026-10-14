# Jobs Marketplace — API Specification

**REST API aligned with `DATABASE_SCHEMA.md`.** Every endpoint maps to schema tables; every response shape uses schema column names.

---

## 1. Conventions

| Concern | Rule |
|---|---|
| **Base path** | `/api` |
| **Auth** | `Authorization: Bearer <jwt>` — public catalog/SEO endpoints are unauthenticated; account, application, messaging endpoints require it |
| **`talent_account_id`** | Schema: UUID FK to `platform.talent_accounts`. The theme's placeholder data uses the **numeric catalog talent id** instead, so `getTalentListItem()` resolves directly. A real backend maps account ↔ catalog ids. |
| **Pagination** | Keyset: `?cursor=<opaque>&limit=<1-50>` (default 20). Responses return `nextCursor` (null = end). Never offset-paginate catalog lists. |
| **Errors** | `{ "error": { "code": "<machine_code>", "message": "<human>" } }` — `401` unauthenticated, `403` wrong role, `404` absent, `409` conflict (duplicate application/handle), `422` validation |
| **Timestamps** | ISO 8601 UTC |
| **PII** | `talent_profiles.email` is **never** returned by any endpoint. Contact flows go through `contact_requests`. |
| **Normalization** | The API normalizes on read: `display_salary` → boolean, role casing → canonical taxonomy. Clients never see raw quirks. |

---

## 2. Auth

### `POST /api/auth/register`
```json
// request
{ "email": "...", "password": "...", "display_name": "...", "role": "talent" | "company" }
// response 201
{ "access_token": "...", "user": { "user_id", "email", "display_name", "role", "avatar_url" } }
```

### `POST /api/auth/login`
```json
{ "email": "...", "password": "..." }  →  { "access_token": "...", "user": { ... } }
```

### `GET /api/auth/me` 🔒
→ `{ "user": { ... }, "talent_account"?: { "handle", "headline", "is_profile_complete" }, "company_account"?: { ... } }`

---

## 3. Catalog — talents

### `GET /api/talents` — search/browse
Query params (all optional, combinable — the saved-search criteria contract):

| Param | Type | Notes |
|---|---|---|
| `role` | csv | taxonomy values, OR within list |
| `q` | string | matches `name` (fallback-aware) + `skills` |
| `country` | csv | includes implicit `none` option when `include_unspecified=1` |
| `hire_me` | bool | open-to-work only |
| `availability` | csv | `full_time,part_time,project_based` |
| `work_location` | csv | `remote,hybrid` |
| `skills` | csv | OR within list |
| `rate_min`/`rate_max` | number | hourly |
| `min_portfolio`/`min_episodes` | int | |
| `active_within_days` | int | relative to sync date |
| `sort` | enum | `relevance` (default), `rate_asc`, `listens`, `episodes`, `recent_activity` |
| `cursor`/`limit` | — | keyset |

```json
// response
{ "results": [ {
    "user_id": 164714, "display_name": "Mya Walsh",        // fallback chain applied server-side
    "avatar_url": null, "avatar_fallback": "MW",            // initials tile pre-computed
    "functional_area": "Podcast Producer",
    "country": "United Kingdom", "hire_me": true,
    "availability": ["part_time", "project_based"],
    "rate_per_hour": 45.00, "shows_rate": true,
    "portfolio_count": 5, "episode_count": 544, "total_listens": 1234567,
    "last_active_at": "2026-02-05T01:23:01Z"
} ],
  "nextCursor": "...", "total_estimate": 8412,
  "data_as_of": "2026-02-05T01:24:57Z" }                     // sync watermark (G1)
```

### `GET /api/talents/facets` — live filter counts (G6)
`?` same filter params → `{ "facets": { "role": {"Podcast Editor": 280531, ...}, "country": {..., "unspecified": 403840}, "hire_me": 78622, "availability": {...} } }`

### `GET /api/talents/:user_id` — profile
→ full profile shape (schema §1 fields, PII excluded) + `stats` block + `links` block (only present links).

---

## 4. Catalog — companies

### `GET /api/companies`
`?q=` (name search) · `status=active|prospect` · `cursor`/`limit`
→ `{ "results": [ { "company_id", "company_name", "website", "status", "logo_url", "logo_fallback_initials" } ], "nextCursor": ... }`

### `GET /api/companies/:company_id`
→ company fields + `subscriber_count` (numeric-cast, only when present) + `open_roles: [...]` (from `platform.jobs`) + `talent_matches: [...]` (industry ↔ role join).

---

## 5. Jobs

### `GET /api/jobs` — search
`?role=` · `?loc=` (`{slug}-l{id}` or `remote`) · `?company_account_id=` · `?status=open` (default for public) · `cursor`/`limit`
```json
{ "results": [ {
    "job_id": "...", "title": "Senior Podcast Editor",
    "company": { "company_account_id": "...", "company_name": "...", "logo_fallback_initials": "EX" },
    "role": "Podcast Editor", "location_type": "remote", "location": null,
    "compensation_min": 25, "compensation_max": 45,
    "posted_at": "...", "status": "open"
} ], "nextCursor": ... }
```

### `GET /api/jobs/:job_id`
→ full job + company block + `application_count` + `related_jobs: [...]`.

### `POST /api/jobs` 🔒 (role: company)
```json
{ "title": "...", "role": "Podcast Editor", "description": "...", "requirements": "...",
  "compensation_min": 25, "compensation_max": 45,
  "location_type": "remote", "location": null, "priority": "medium" }
```
→ `201 { "job_id": "...", "status": "draft" }` — publish via `PATCH /api/jobs/:id { "status": "open" }` (sets `posted_at`).

### `GET /api/jobs/:job_id/applications` 🔒 (owner)
→ application cards: `{ "application_id", "talent": { "talent_account_id", "display_name", "avatar_fallback", "functional_area", "rate_per_hour" }, "status", "rating", "last_contacted_at" }`

### `POST /api/jobs/:job_id/applications` 🔒 (role: talent)
`{ "notes": "..." }` → `201 { "application_id", "status": "identified" }` — `409` if already applied.

### `PATCH /api/applications/:application_id` 🔒 (job owner)
`{ "status": "contacted" | "screening" | ... , "rating": 1-5, "notes": "..." }`

---

## 6. Saved searches

### `GET /api/searches` 🔒 → user's saved searches
### `POST /api/searches` 🔒 — `{ "name": "...", "criteria": { ...filter contract... }, "job_id": null }`
### `DELETE /api/searches/:search_id` 🔒
### `GET /api/searches/:search_id/results` — execute → same shape as `GET /api/talents` with the stored criteria applied.

---

## 7. Contact requests (the PII gate)

### `POST /api/contact-requests` 🔒 (role: company)
`{ "talent_account_id": "...", "job_id": null, "message": "..." }` → `201 { "request_id", "status": "sent" }`
The talent sees the request in `/mailbox`; **no email is ever exposed** — messaging happens in-app.

### `GET /api/contact-requests` 🔒 → requests for the authenticated user (either side)
### `PATCH /api/contact-requests/:request_id` 🔒 — `{ "status": "accepted" | "declined" }` (accepting opens a conversation).

---

## 8. Messaging

### `GET /api/conversations` 🔒 → `{ "conversations": [ { "conversation_id", "job": null, "participants": [...], "last_message": {...}, "unread_count": 0 } ] }`
### `GET /api/conversations/:id/messages` 🔒 → keyset-paginated messages
### `POST /api/conversations/:id/messages` 🔒 — `{ "body": "..." }` → `201` message; updates `conversations.updated_at` and participant `last_read_at`.

---

## 9. Reviews

### `GET /api/reviews?subject=talent:{talent_account_id}` / `subject=company:{company_account_id}`
→ `{ "results": [ { "review_id", "rating", "title", "body", "created_at", "reviewer": { "display_name" } } ], "average_rating": 4.7 }`
### `POST /api/reviews` 🔒 — `{ "subject_type": "talent", "talent_account_id": "...", "rating": 5, "title": "...", "body": "..." }`

---

## 10. SEO & stats (public)

### `GET /api/seo/landing/:slug`
→ `platform.seo_landing_pages` row: `{ "slug", "page_type", "role", "intro_copy", "faq": [...], "stats_snapshot": { "avg_rate": ..., "open_to_work": ..., "talent_count": ... }, "updated_at" }`

### `GET /api/stats`
→ `{ "talent_count", "open_to_work", "avg_rate", "company_count", "open_jobs", "data_as_of" }` — cached; recompute on sync.

### `GET /api/roles`
→ the taxonomy with slugs + landing-page existence: `{ "roles": [ { "name": "Podcast Editor", "slug": "podcast-editors", "category_slug": "podcast_editor", "landing": "/hire/podcast-editors" } ] }`

---

## 11. Endpoint → table map

| Endpoint group | Tables |
|---|---|
| auth | `platform.users` |
| talents search/facets/detail | `catalog.talent_profiles` |
| companies | `catalog.prospect_companies` |
| jobs CRUD + search | `platform.jobs` + `platform.company_accounts` |
| applications | `platform.job_applications` + `platform.talent_accounts` |
| saved searches | `platform.saved_searches` |
| contact requests | `platform.contact_requests` |
| messaging | `platform.conversations` + `messages` + `conversation_participants` |
| reviews | `platform.reviews` |
| SEO landing / stats / roles | `platform.seo_landing_pages` + catalog aggregates |
