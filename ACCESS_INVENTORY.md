# Marketplace — Access Inventory (Template)

**Template inventory for a marketplace deployment** — the data stores behind a marketplace and which data backs which pages. **The canonical page map for the theme lives in `URL_STRUCTURE.md`**; the URL list in §2 below is the reference implementation's structure.

---

## 1. Systems

| Store | Role |
|---|---|
| **Catalog Postgres** (Coolify-managed, internal network only) | Synced talent + company data; the application reads, the sync pipeline writes |
| **Pipeline BigQuery dataset** | Recruiting-pipeline scaffolding (jobs, contracts, searches, shortlists) |
| **GA4 BigQuery export** | Behavioral analytics — daily `events_*` tables |
| ❌ **Production database (system of record)** | The live application's own database — jobs, accounts, messages, reviews, forum. Separate from all of the above. |

---

## 2. Marketplace URL structure

The canonical page map, organized by section. Dynamic segments are shown as `{id}`.

### 2.1 Home & marketing

| Path | Notes |
|---|---|
| `/` | home |
| `/how-it-works` | |
| `/top-talent` | |
| `/recent-placements` | |
| `/yt-video-editors` · `/yt-video-editors-v2` | SEO landing pages |
| `/hire-best-remote-video-editors-for-{niche}` | SEO landing family (blogs-vlogs, gaming, documentary, …) |
| `/faq` · `/privacy-policy` | |

### 2.2 Job board

| Path | Notes |
|---|---|
| `/job/search` | The core job search. Query params: `?role=` (single or multi-role, comma-encoded) and `?loc=` (format `{country-slug}-l{locationId}`, plus `remote`) |
| `/job/{id}` | Individual job pages |
| `/job/create` | |
| `/job/jobs-for-you` | |
| `/jobs/{id}/checkout` | job posting checkout |
| `/jobs/{id}/pre-publish` · `/jobs/{id}/after-publish` | |
| `/outreach-list` | |

**`?role=` filter values:** `video-editor` · `thumbnail-designer` · `scriptwriter` · `youtube-strategist` · `channel-manager` · `youtube-producer` · `creative-director` · `creative-assistant` · `other` — plus multi-role combinations.

### 2.3 Talent side

| Path | Notes |
|---|---|
| `/talent/search/{category}` | Category browse — `all_categories`, `video_editor`, `thumbnail_designer`, `scriptwriter`, `youtube_strategist`, `channel_manager`, `creative_director`, `youtube_producer`, `other`. Paginated (`?page=N`). |
| `/talent/profile/{id}` | public talent profile |
| `/@{handle}` | vanity-URL talent profiles |
| `/talent/vitrine/{id}` | talent portfolio/vitrine pages |
| `/talent/signup` | |
| `/talent/walkthrough` | onboarding |
| `/talent/lead-pipeline` | |
| `/talent/timeline/{id}` | |
| `/talent/clients/{id}` | |
| `/talent/posts/{id}` | |
| `/talent/settings` · `/talent/notifications` | |
| `/talent/profile-wizard` | |
| `/talent/share-space` · `/talent/share-profile-new/{id}` · `/talent/share-badge/{id}` · `/talent/share-timeline/{id}` · `/talent/share-review/{id}/{id}` | sharing features |
| `/talent/business-card/{id}` | |
| `/talent/statistics/recap` | |
| `/talent/badges-description` | |
| `/talent/my-payment` | |
| `/talent/review/{id}` · `/talent/category-list` · `/talent/edit/vitrine` | |

### 2.4 Channel / company side

| Path | Notes |
|---|---|
| `/channel/signup` | |
| `/channel/{id}` | company/channel profile |
| `/youtube-channel/{id}` | YouTube channel pages |
| `/channel/job/{id}/applicants` ( + `/old`) | applicant management |
| `/channel/discovery` · `/channel/discovery-list` | |
| `/channel/verified-channels-description` ( + `/yt-error`) | |
| `/channel/edit/job/{id}` · `/channel/share-job/{id}` | |
| `/channel/notifications` | |
| `/company/profile-wizard` | |
| `/videos/{id}` | |

### 2.5 Auth & account

| Path |
|---|
| `/login` |
| `/signup` |
| `/set-password` |
| `/account` · `/account/management` |
| `/account/profiles` · `/account/profiles/create` · `/account/profiles/merge` |
| `/redirect/account/express` · `/redirect/user/express` · `/redirect/company/express` · `/redirect/verify/twitter` |

### 2.6 Messaging, reviews, community, commerce, stats

| Path | Notes |
|---|---|
| `/mailbox` · `/mailbox/{id}` | messaging |
| `/review` · `/review/{id}` · `/review/{id}/videos` | review system |
| `/forum` · `/forum/post/{id}` | community forum |
| `/payment/success` · `/payment/failed` | checkout results |
| `/ads` · `/ads/{id}` | ad board |
| `/stats/videos` · `/stats/channels` | |
| `/user/referrals` | |

---

## 3. Data tables & fields

### 3.1 Catalog Postgres

**`public.talents`** — talent profiles. See `DATABASE_SCHEMA.md` for the full column reference (identity, classification, location, flags, engagement, compensation, links, content, timestamps) and index requirements.

**`public.companies`** — channel companies (prospect catalog). See `DATABASE_SCHEMA.md`.

### 3.2 Pipeline BigQuery dataset

| Table | Role |
|---|---|
| `talents` · `companies` | catalog copies |
| **`jobs`** | job records: `job_id` · `contract_id` · `job_title` · `description` · `requirements` · `compensation_min`/`_max` · `location_type` · `location` · `target_start_date` · `priority` · `status` · `filled_date` · `placed_candidate_id` · `notes` · `created_at`/`updated_at` · `created_by_user_id` · `engagement_type` · `fee_amount` · `search_criteria` (JSON) |
| `contracts` | engagement deals: `contract_id` · `company_id` · `contract_name` · `engagement_type` · `total_fee` · `upfront_retainer` · `success_fee` · `payment_terms` · dates · `status` · `current_pipeline_stage` · `assigned_sales_user_id` |
| `talent_searches` | saved searches with `criteria` JSON |
| `job_searches` | legacy pre-refactor jobs table |
| `recruiter_users` | `user_id` · `email` · `password_hash` · `first_name`/`last_name` · timestamps |
| `contacts` · `attachments` · `job_search_assignments` | supporting records |
| `candidates` · `shortlist` · `talent_shortlists` · `messages` · `outreach_activities` · `pipeline` · `saved_searches` · `search_targets` · `searches` · `contract_assignments` · `job_assignments` | scaffolding — schema exists, verify before relying on contents |

### 3.3 GA4 BigQuery export

Daily `events_*` tables, web-only.

Per-event fields:

| Field group | Columns |
|---|---|
| Core | `event_date` · `event_timestamp` · `event_name` · `event_params` (RECORD array) |
| Identity | `user_pseudo_id` · `user_id` (logged-in; sparse) · `user_first_touch_timestamp` · `user_ltv` (revenue) |
| Geo | `geo.country`/`.region`/`.city` |
| Device | `device.category`/`.operating_system`/`.language`/`.web_info.*` |
| Traffic | `traffic_source.source`/`.medium`/`.campaign` · `collected_traffic_source.*` · Google Ads (`gclid`, `gad_campaignid`, `gad_source`) |
| Session | `ga_session_id` · `ga_session_number` · `session_engaged` (params) |
| E-commerce | `ecommerce.*` · `items[]` · `transaction_id` · `value` · `currency` · `tax` · `shipping` |
| Platform | `platform` · `stream_id` |

**Key event params:** `page_location` · `page_title` · `page_referrer` · `engagement_time_msec` · `percent_scrolled` · `search_term` · `link_url`/`link_domain` (outbound) · form fields (`form_destination`, `first_field_*`) · campaign fields.

**Event catalog — the significant event types:**

| Category | Events |
|---|---|
| Funnel | `page_view` · `first_visit` · `userLogin` · `talent-signup` · `company-signup` (+ naming variants) · `signup_companies` |
| Job board | `accessibility_shortcut_Job_Board_clicked` · `view_search_results` (has `search_term`) |
| Hiring | `hire_button_clicked_in_offered_tab` · `submit_hire_action_with_send_notification` |
| Verification | `channel-verified` · `video-verification-suggestion-modal-show` |
| Commerce | `purchase` · `add_to_cart` · `remove_from_cart` · `begin_checkout` |
| Paywalls | `paywall_on_talent_search` · `paywall_on_discovery_talent` · `paywall_on_after_messaging` · `paywall_on_discovery_list` |
| Ads | `ads_conversion_Sign_Up_1/2` (Google Ads conversions) |
| Product surface | Forum · Leaderboards · Stats · Ad Board · Referrals · P2P Payment (accessibility-shortcut events) · `agency_company_form_shown` · affiliate share modals |

---

## 4. Page → data mapping

| URL section | Backing data available in the stores above | Live data in the production database |
|---|---|---|
| `/job/search`, `/job/{id}`, `/jobs/{id}/checkout` | pipeline `jobs` table (verify contents) | job records, applicants, checkout state |
| `/talent/search/*`, `/talent/profile/{id}`, `/@{handle}`, `/talent/vitrine/{id}` | catalog `talents` table | account state, posts, business cards |
| `/channel/{id}`, `/youtube-channel/{id}`, `/channel/signup` | catalog `companies` table (name/website/status) | channel verification state, applicants |
| `/mailbox`, `/mailbox/{id}` | `messages` table (scaffolding) | all messaging |
| `/review/*` | — | reviews |
| `/forum/*` | — | forum posts |
| `/talent/signup`, `/channel/signup`, `/login` | GA4 signup/login events — behavioral only | actual accounts |
| `/payment/*`, checkout | GA4 purchase events | payment/subscription records |
| `/talent/lead-pipeline`, `/outreach-list` | `outreach_activities`/`shortlist` tables (scaffolding) | pipeline data |
| `/stats/*`, `/top-talent`, `/recent-placements` | — | underlying aggregates |
| `/ads/*` | — | ad board listings |
| `/user/referrals` | — | referral records |

---

## 5. Deployment checklist for a new marketplace

1. **Confirm the production database is the system of record** — jobs, accounts, messages, reviews, forum live there; the catalog stores are read models.
2. **Verify catalog sync freshness** — check `synced_at`; a static snapshot needs a "data as of" banner.
3. **Verify the GA4 export is flowing** — a broken export silently stops all analytics.
4. **Deduplicate event naming** — expect the same event under underscore and hyphen conventions; normalize before analysis.
5. **Verify pipeline tables before use** — the recruiting-pipeline scaffolding may be empty; confirm before building on it.
