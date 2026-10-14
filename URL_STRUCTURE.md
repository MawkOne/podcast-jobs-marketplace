# Jobs Marketplace — URL Structure & Page Requirements

**The canonical page map for the marketplace template.** Every URL, its page type, functional requirements, and SEO requirements. URL patterns are grounded in the live platform's proven structure plus the DataForSEO research in `SEO_RESEARCH.md`. The coded theme in `theme/` implements every page type listed here.

**Route conventions:** `{id}` = numeric/entity ID · `{handle}` = vanity slug · `{role}` = role slug (`podcast-editors`, `sound-designers`, …) · `{category}` = category slug (`podcast_editor`, `sound_designer`, …) · `{location}` = location slug (`california-us`, `remote`, …).

---

## 1. Home & marketing

| URL | Page type | Requirements | SEO |
|---|---|---|---|
| `/` | Home | Hero with search entry (role + location); category cards linking to browse; open-to-work spotlight; company teaser; social proof | Title: `Hire Podcast Talent | {Brand}` · `WebSite` + `SearchAction` JSON-LD · links to every role landing page |
| `/how-it-works` | Static | Two-column explainer: for companies / for talent; CTA to both signups | Title: `How It Works | {Brand}` |
| `/top-talent` | Curated list | Featured talent grid; deterministic selection | Title: `Top {Role} Talent | {Brand}` |
| `/recent-placements` | Static list | Recent placement cards | Title: `Recent Placements | {Brand}` |
| `/faq` | Static | Accordion FAQ; include the cost/FAQ blocks from landing pages | `FAQPage` JSON-LD |
| `/privacy-policy` · `/terms` | Static | Legal copy | — |

## 2. SEO landing families (research-driven)

| URL | Page type | Requirements | SEO |
|---|---|---|---|
| `/hire/{role}` | Hire-side landing | Role intro copy (100+ words) with live aggregate stats (avg rate, open-to-work count); talent grid for the role; FAQ block; links to jobs page, rates page, category browse | Title: `Hire {Role}s for Podcasts ( {Month Year}) | {Brand}` — regenerated monthly · `ItemList` + `Person` JSON-LD · `BreadcrumbList` |
| `/hire/{role}/rates` | Rates sub-page | Rate distribution for the role; cost guidance copy; CTA to hire page | Title: `{Role} Hourly Rates \| Cost to Hire a {Role}` |
| `/hire/{role}/{location}` | Geo variant | Same as hire landing, filtered to location; generate for top talent locations | Title: `Hire the Best {Role}s in {Location}` |
| `/{role}-jobs` | Jobs-side landing | Job listings for the role; count + freshness in H1; location filter links | Title: `{Role} Jobs — {N} Open Roles ({Month Year})` · **`JobPosting` JSON-LD per job** (Google Jobs eligibility) |

## 3. Job board

| URL | Page type | Requirements | SEO |
|---|---|---|---|
| `/job/search` | Search results | `?role=` (single/multi, comma-encoded) + `?loc=` (`{country-slug}-l{id}` or `remote`) + `?page=`; filter rail with live facet counts; job cards (title, company, rate, location type, posted date); keyset pagination; explanatory empty states | noindex, follow (search results) · canonical to self |
| `/job/{id}` | Job detail | Title, company block, description, requirements, compensation, location type, apply CTA (auth-gated); related jobs; 404 for absent IDs | Title: `{Job Title} — {Company} \| {Brand}` · **`JobPosting` JSON-LD** (`datePosted`, `validThrough`, `hiringOrganization`, `employmentType`, `baseSalary` when present) |
| `/job/create` | Create form | Auth-gated; role, title, description, requirements, compensation range, location type; draft → publish | noindex |
| `/job/jobs-for-you` | Recommendations | Auth-gated; matched jobs | noindex |
| `/job/{company-domain}/apply-{role}` | Branded apply page | Public, shareable per-company application landing (companies hand these out as direct "apply here" links). Renders the company block, the role, and an apply form (auth-gated submit). | indexable · Title: `Apply for {Role} at {Company} | {Brand}` |
| `/jobs/{id}/checkout` · `/jobs/{id}/pre-publish` · `/jobs/{id}/after-publish` | Checkout flow | Posting payment + preview + confirmation | noindex |

## 4. Talent side

| URL | Page type | Requirements | SEO |
|---|---|---|---|
| `/talent/search` | Browse all | Category cards + combined grid; filter rail (area, open-to-work, availability, location, skills, rate, portfolio/video minimums, activity); facet counts shown **before** filtering; "Not specified" selectable for location; keyset pagination | noindex, follow |
| `/talent/search/{category}` | Category browse | Pre-filtered grid for one category; same filter rail | **indexable** — Title: `{Category} Talent — Browse {Brand}` · `ItemList` JSON-LD |
| `/talent/profile/{id}` | Talent profile | Header (avatar w/ initials fallback, name fallback chain, area badge, location, open-to-work chips); about (collapses when NULL); skills + styles chips; rate card; engagement stats; links row (per-row collapse); joined/last-active relative to sync; contact CTA (auth-gated); 404 for ID gaps | Title: `{Name} — {Role} \| {Brand}` · `ProfilePage` + `Person` JSON-LD |
| `/@{handle}` | Vanity profile | Rewrite to the talent profile; reserved-handle list to avoid route collisions | canonical → `/talent/profile/{id}` |
| `/talent/signup` | Signup | Role selection, account fields, show verification entry | noindex · Title: `Create Your Talent Profile \| {Brand}` |
| `/talent/walkthrough` | Onboarding | Auth-gated; profile completion steps | noindex |
| `/talent/lead-pipeline` | Dashboard | Auth-gated; application/outreach pipeline | noindex |
| `/talent/settings` · `/talent/notifications` · `/talent/my-payment` | Account | Auth-gated | noindex |
| `/talent/vitrine/{id}` | Portfolio | Public portfolio view | indexable |
| `/talent/share-space` · `/talent/share-{kind}/{id}` | Sharing | Auth-gated share generators | noindex |

## 5. Company side

| URL | Page type | Requirements | SEO |
|---|---|---|---|
| `/companies` | Directory | Name search (trgm-indexed); status filter (active/prospect); cards with logo fallback tile, name, website, status badge; keyset pagination | noindex, follow |
| `/companies/{id}` | Company profile | Header (logo fallback, name, website, status, industry); description (collapses); subscriber count only when present; contact card only when present; **Open roles** section (empty-state CTA until jobs exist); talent matches (industry ↔ area join) | Title: `{Company} \| {Brand}` · `Organization` JSON-LD |
| `/channel/signup` | Company signup | Company details, show verification entry | noindex |
| `/channel/{id}` | Channel profile | Company profile variant for verified channels | indexable |
| `/channel/job/{id}/applicants` | Applicant mgmt | Auth-gated; applicant list per job | noindex |
| `/channel/discovery` · `/channel/discovery-list` | Discovery | Auth-gated talent discovery | noindex |

## 6. Auth & account

| URL | Page type | Requirements |
|---|---|---|
| `/login` | Login | Email/password; redirect by role (talent → pipeline, company → applicants) |
| `/signup` | Signup router | Talent ↔ company toggle; routes to `/talent/signup` or `/channel/signup` |
| `/set-password` | Password set | Token-gated |
| `/account` · `/account/management` | Account home | Auth-gated |
| `/account/profiles` · `/account/profiles/create` · `/account/profiles/merge` | Profile mgmt | Multi-profile support |
| `/redirect/{kind}/express` | Express login | Deep-link auth redirects |

## 7. Messaging, reviews, community, commerce

| URL | Page type | Requirements |
|---|---|---|
| `/mailbox` · `/mailbox/{id}` | Messaging | Auth-gated; thread list + conversation view |
| `/review` · `/review/{id}` · `/review/{id}/videos` | Reviews | Public review pages; submit auth-gated |
| `/forum` · `/forum/post/{id}` | Forum | Public read; post auth-gated |
| `/payment/success` · `/payment/failed` | Checkout results | Transaction status |
| `/ads` · `/ads/{id}` | Ad board | **Authenticated** (logged-in ad management — see §9.4) |
| `/stats/videos` · `/stats/channels` | Stats | Public aggregate stats |
| `/user/referrals` | Referrals | Auth-gated |

## 8. System routes

| URL | Purpose |
|---|---|
| `/sitemap.xml` | Enumerate: static pages, all role landings (hire + jobs + rates), category browse pages (`high` priority on landings, refreshed monthly with title regeneration). Geo-variant landings are added once/if `/hire/{role}/{location}` pages ship — they are **not** in the current theme. |
| `/robots.txt` | Allow landing/detail pages; disallow search results, auth, account, checkout paths |

---

---

## 9. Authenticated surface — the logged-in marketplace

**Every page a signed-in user sees, organized by the journey it powers.** Views are live-site GA4 totals (187 days) — the prioritization signal. Functional requirements for each page live in §4–7; this section is the complete inventory with implementation status. All authenticated pages are `noindex`.

### 9.1 Shared app shell

Logged-in pages share a sidebar shell: **Mailbox · Pipeline (talent) / Applicants (company) · Jobs · Discovery · Account**, with the logged-in user block and the data-as-of indicator. Sessions arrive mostly via **email deep-links** (`/redirect/{kind}/express` — 322k views live) — auth is not just `/login`.

### 9.2 The company journey (the buyer — where the money flows)

| Step | Page | Live views | Theme |
|---|---|---|---|
| Onboarding | `/channel/signup` | 155,983 | ✅ |
| Onboarding | `/company/profile-wizard` | 2,542 | ✅ |
| Find talent | `/channel/discovery` · `/channel/discovery-list` | 5,618 · 1,878 | ✅ |
| **Post a job** | `/job/create` | 13,620 | ✅ |
| **Pay** | `/jobs/{id}/checkout` | 10,186 | ✅ |
| **Pay** | `/payment/success` · `/payment/failed` | 2,121 · 766 | ✅ |
| **Publish** | `/jobs/{id}/pre-publish` (preview) | 2,237 | ✅ |
| **Publish** | `/jobs/{id}/after-publish` (confirmation) | 1,643 | ✅ |
| **Manage** | `/channel/job/{id}/applicants` | 33,870 | ✅ |
| **Manage** | `/channel/edit/job/{id}` | 1,913 | ✅ |
| **Manage** | `/channel/share-job/{id}` | 803 | ✅ |
| **Manage** | `/outreach-list` (proactive outreach) | 9,262 | ✅ |
| **Manage** | `/channel/notifications` | 634 | ✅ |

### 9.3 The talent journey (the seller)

| Step | Page | Live views | Theme |
|---|---|---|---|
| Onboarding | `/talent/signup` | 160,102 | ✅ |
| Onboarding | `/talent/walkthrough` | 128,576 | ✅ |
| Onboarding | `/talent/profile-wizard` | 67,035 | ✅ |
| Track applications | `/talent/lead-pipeline` — the talent dashboard | 85,737 | ✅ |
| Track applications | `/talent/jobs` (applied jobs) | 30 | ✅ |
| Profile tools | `/talent/settings` | 82,647 | ✅ |
| Profile tools | `/talent/share-space` (share generators) | 38,812 | ✅ |
| Profile tools | `/talent/statistics/recap` | 31,293 | ✅ |
| Profile tools | `/talent/notifications` | 6,709 | ✅ |
| Profile tools | `/talent/edit/vitrine` · `/talent/category-list` | 1,073 · 1,298 | ✅ |
| Get paid | `/talent/my-payment` | 736 | ✅ |
| Reputation | `/review` (submit) | 23,145 | ✅ |

### 9.4 Shared surfaces

| Page | Live views | Theme |
|---|---|---|
| `/mailbox` + `/mailbox/{id}` — **messaging is the #1 logged-in surface on the site** | 499,226 + 266,195 | ✅ |
| `/account` · `/account/management` | 14,571 · 31,267 | ✅ |
| `/account/profiles` + `/create` + `/merge` (multi-profile accounts) | 9,265 · 32,240 · 911 | ✅ |
| `/set-password` | 7,297 | ✅ |
| `/user/referrals` | 2,142 | ✅ |
| `/ads` (ad board) | 2,452 | ✅ |
| `/redirect/{kind}/express` (email deep-link auth) | 322,504 | ✅ (route stub) |

### 9.5 What the traffic teaches

1. **Messaging powers the marketplace** — mailbox is the #1 and #3 logged-in page; hire decisions happen in conversations.
2. **Onboarding wizards are major surfaces** — the marketplace lives or dies on profile completion.
3. **Most sessions arrive via email deep-links**, not the login form.
4. The buying flow (create → checkout → payment → publish) is smaller in traffic but is where revenue happens.

---

---

## 10. Implementation status — documented but not yet built

These URLs are part of the target map above but are **not implemented in the theme**:

| URL | Section | Note |
|---|---|---|
| `/top-talent` · `/recent-placements` | §1 | public marketing pages |
| `/hire/{role}/{location}` | §2 | geo-variant landings — only `/hire/{role}` and `/hire/{role}/rates` are built |
| `/job/jobs-for-you` | §3 | auth-gated recommendations |
| `/job/{company-domain}/apply-{role}` | §3 | branded per-company apply page |
| `/talent/vitrine/{id}` | §4 | public portfolio view (`/talent/edit/vitrine` exists; the public view does not) |
| `/@{handle}` | §4 | vanity-URL rewrite to the talent profile |
| `/channel/{id}` | §5 | channel profile variant (the theme serves company profiles at `/companies/{id}` only) |
| `/forum` · `/forum/post/{id}` | §7 | community forum |
| `/stats/videos` · `/stats/channels` | §7 | public aggregate stats |

**Known placeholder simplification:** `Application.talent_account_id` is the **numeric catalog talent id** in the theme; the schema/API define it as a UUID FK to `platform.talent_accounts` (see API_SPEC.md §1).

## Global page requirements (all pages)

| # | Requirement |
|---|---|
| G1 | **"Data as of" freshness banner** on catalog pages; never imply profiles are live |
| G2 | **Name fallback chain:** `name` → `first_name last_name` → generated handle ("Podcast Editor · #164714") |
| G3 | **Avatar fallback:** initials tile from the fallback name |
| G4 | **Normalize on read:** `display_salary` text→bool; area casing normalized for display |
| G5 | **Never expose talent emails publicly** — contact is auth-gated |
| G6 | **Facet counts before filtering** — filters that exclude most of the catalog say so |
| G7 | **Keyset pagination** for all catalog lists |
| G8 | **Dead columns never render** |
| G9 | **Sparse-field collapse** — NULL-backed sections disappear silently |
| G10 | **SEO metadata on every indexable page** — title/description from the patterns in `SEO_RESEARCH.md`, JSON-LD per page type |
