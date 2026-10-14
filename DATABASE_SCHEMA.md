# Jobs Marketplace — Database Schema (Complete Template)

**The complete schema for a jobs marketplace deployment** — two schemas with a clear ownership boundary:

- **`catalog`** — synced talent/company data. The sync pipeline writes; the application only reads.
- **`platform`** — application-owned tables: accounts, jobs, applications, messaging, reviews, SEO landing content.

Column notes describe expected data characteristics so builders can design around them (sparse fields, fallbacks, normalization rules). See `SAMPLE_DATA.md` for example records of the catalog tables.

---

## 1. `catalog.talent_profiles`

Talent profiles. One row per person. Synced from the source platform.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `user_id` | bigint | NO (PK) | Source-platform ID. Sparse ID space expected. |
| `first_name` | text | yes | Often NULL |
| `last_name` | text | yes | Often NULL |
| `name` | text | yes | Primary display name **when present** — frequently NULL; UI needs a fallback chain |
| `email` | text | yes | Effectively complete. **PII — never expose publicly.** |
| `functional_area` | text | yes | Primary area (see §1.2 taxonomy) |
| `about` | text | yes | Usually NULL — collapse when absent |
| `verified` | boolean | yes | Rarely TRUE — not a headline filter |
| `is_active` | boolean | yes | Rarely TRUE |
| `profile_url` | text | yes | Usually NULL |
| `image` | text | yes | Avatar URL; often NULL — initials fallback required |
| `country_id`/`state_id`/`city_id` | bigint | yes | Source geography IDs; NULL in lockstep with text columns |
| `country`/`state`/`city` | text | yes | Frequently NULL — location filters need a "Not specified" option |
| `skills` | jsonb | yes | Never NULL, frequently `[]`. Array of skill names. |
| `functional_areas` | jsonb | yes | Never NULL. Single-element mirror of `functional_area`. |
| `styles` | jsonb | yes | Never NULL. Content-style tags; frequently empty. |
| `skills_count` | integer | yes | Denormalized |
| `portfolio_count` | integer | yes | |
| `episode_count` | integer | yes | |
| `total_listens`/`_reviews`/`_comments` | bigint | yes | Can be large — format with separators |
| `applications_count` | integer | yes | |
| `hire_me` | boolean | yes | Open-to-work — key recruiter filter |
| `hire_me_availability_full_time`/`_part_time`/`_project_based` | boolean | yes | |
| `hire_me_location_hybrid`/`_remote` | boolean | yes | |
| `salary_per_hour` | numeric | yes | Sparsely populated — rate sorts must state coverage |
| `salary_annual` | numeric | yes | Sparsely populated |
| `display_salary` | text | yes | ⚠ Holds `'true'`/`'false'` strings — normalize to boolean on read |
| `website_link`/`behance_link`/`dribbble_link` | text | yes | Usually NULL |
| `verified_twitter_username` | text | yes | Usually NULL |
| `show_url` | text | yes | Usually NULL |
| `show_verified_at` | timestamptz | yes | Usually NULL |
| `story` | text | yes | Dead column — never render |
| `created_at` | timestamptz | yes | Profile creation on source platform |
| `last_activity_at` | timestamptz | yes | Freshness/engagement sorting |
| `synced_at` | timestamptz | yes | Sync watermark — uniform values mean a static snapshot (show a "data as of" banner) |

**Indexes:** PK on `user_id`; btree on `functional_area`, `country`, `hire_me`, `verified`; GIN on `skills`, `functional_areas`. **Add for search:** trigram GIN on `name`, btree on `last_activity_at`, partial index on `salary_per_hour`.

### 1.2 Role taxonomy (`functional_area` values)

Podcast Producer · Audio Engineer · Podcast Editor · Sound Designer · Podcast Consultant · Podcast Strategist · Podcast Manager · Show Notes Writer

*(Normalize the source casing inconsistency on read.)*

---

## 2. `catalog.prospect_companies`

Podcast companies — the demand-side prospect catalog.

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `company_id` | text | NO (PK) | Source-platform ID |
| `company_name` | text | yes | Never NULL |
| `industry` | text | yes | Near-uniform — weak filter |
| `website` | text | yes | Effectively complete |
| `logo_url` | text | yes | Usually NULL — fallback tile required |
| `description` | text | yes | Usually NULL |
| `status` | text | yes | `active` / `prospect` |
| `company_size` | text | yes | ⚠ Subscriber counts as digit strings; sparsely populated — cast to numeric on read, never a standard card field |
| `location`/`source`/`contact_email`/`contact_phone` | text | yes | Dead columns — never render |
| `notes`/`contact_name` | text | yes | Rarely populated |
| `created_at`/`updated_at` | timestamptz | yes | |
| `created_by_user_id` | text | yes | Single sync actor expected |

**Indexes:** PK; btree on `industry`, `status`. **Add:** trigram GIN on `company_name`.

---

## 3. `platform.users`

Accounts for both sides of the marketplace.

```sql
CREATE TABLE platform.users (
    user_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          TEXT NOT NULL,
    password_hash  TEXT NOT NULL,
    display_name   TEXT NOT NULL,
    role           TEXT NOT NULL DEFAULT 'talent'
                  CHECK (role IN ('talent', 'company', 'admin')),
    avatar_url     TEXT,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ux_users_email ON platform.users (lower(email));
```

## 4. `platform.talent_accounts` / `platform.company_accounts`

Profile accounts linking users to catalog records.

```sql
CREATE TABLE platform.talent_accounts (
    talent_account_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL UNIQUE REFERENCES platform.users(user_id) ON DELETE CASCADE,
    talent_user_id     BIGINT NOT NULL UNIQUE REFERENCES catalog.talent_profiles(user_id),
    handle             TEXT UNIQUE,                    -- vanity URL slug (@handle)
    headline           TEXT,
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_talent_accounts_handle ON platform.talent_accounts (handle);

CREATE TABLE platform.company_accounts (
    company_account_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES platform.users(user_id) ON DELETE CASCADE,
    prospect_company_id TEXT REFERENCES catalog.prospect_companies(company_id),  -- nullable: standalone companies
    company_name        TEXT NOT NULL,
    industry            TEXT,
    website             TEXT,
    logo_url            TEXT,
    description         TEXT,
    show_verified_at  TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_company_accounts_name ON platform.company_accounts USING gin (company_name gin_trgm_ops);
```

## 5. `platform.jobs`

Job postings by companies.

```sql
CREATE TABLE platform.jobs (
    job_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_account_id UUID NOT NULL REFERENCES platform.company_accounts(company_account_id) ON DELETE CASCADE,
    title              TEXT NOT NULL,
    role               TEXT NOT NULL CHECK (role IN (          -- from the §1.2 taxonomy
                        'Podcast Producer','Audio Engineer','Podcast Editor','Sound Designer',
                        'Podcast Consultant','Podcast Strategist','Podcast Manager','Show Notes Writer')),
    description        TEXT,
    requirements       TEXT,
    compensation_min   NUMERIC(12,2),
    compensation_max   NUMERIC(12,2),
    location_type      TEXT NOT NULL DEFAULT 'remote'
                       CHECK (location_type IN ('onsite','hybrid','remote')),
    location           TEXT,
    status             TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','open','paused','filled','cancelled')),
    priority           TEXT NOT NULL DEFAULT 'medium'
                       CHECK (priority IN ('low','medium','high','urgent')),
    fee_amount         NUMERIC(12,2),
    posted_at          TIMESTAMPTZ,
    expires_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_jobs_role_status   ON platform.jobs (role, status) WHERE status = 'open';
CREATE INDEX ix_jobs_company       ON platform.jobs (company_account_id);
CREATE INDEX ix_jobs_posted        ON platform.jobs (posted_at DESC);
```

## 6. `platform.job_applications`

The pipeline card per candidate per job.

```sql
CREATE TABLE platform.job_applications (
    application_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id           UUID NOT NULL REFERENCES platform.jobs(job_id) ON DELETE CASCADE,
    talent_account_id UUID NOT NULL REFERENCES platform.talent_accounts(talent_account_id) ON DELETE CASCADE,
    status           TEXT NOT NULL DEFAULT 'identified'
                     CHECK (status IN ('identified','contacted','responded','screening',
                                      'interviewing','offer','hired','rejected','withdrawn')),
    rating           SMALLINT CHECK (rating BETWEEN 1 AND 5),
    notes            TEXT,
    next_follow_up_at TIMESTAMPTZ,
    last_contacted_at TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, talent_account_id)
);
CREATE INDEX ix_applications_job   ON platform.job_applications (job_id, status);
CREATE INDEX ix_applications_talent ON platform.job_applications (talent_account_id);
```

## 7. `platform.saved_searches` / `platform.contact_requests`

```sql
CREATE TABLE platform.saved_searches (
    search_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id    UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
    job_id      UUID REFERENCES platform.jobs(job_id) ON DELETE SET NULL,
    name        TEXT NOT NULL,
    criteria    JSONB NOT NULL DEFAULT '{}',   -- filter contract; see API_SPEC.md
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_saved_searches_owner ON platform.saved_searches (owner_id);

CREATE TABLE platform.contact_requests (
    request_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id     UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
    talent_account_id UUID NOT NULL REFERENCES platform.talent_accounts(talent_account_id) ON DELETE CASCADE,
    job_id           UUID REFERENCES platform.jobs(job_id) ON DELETE SET NULL,
    status           TEXT NOT NULL DEFAULT 'sent'
                     CHECK (status IN ('sent','accepted','declined','expired')),
    message          TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_contact_requests_talent ON platform.contact_requests (talent_account_id);
```

## 8. `platform.conversations` / `platform.messages`

```sql
CREATE TABLE platform.conversations (
    conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID REFERENCES platform.jobs(job_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE platform.messages (
    message_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES platform.conversations(conversation_id) ON DELETE CASCADE,
    sender_id       UUID NOT NULL REFERENCES platform.users(user_id),
    body            TEXT NOT NULL,
    read_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_messages_conversation ON platform.messages (conversation_id, created_at DESC);

-- conversation participants
CREATE TABLE platform.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES platform.conversations(conversation_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
    last_read_at    TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);
```

## 9. `platform.reviews`

```sql
CREATE TABLE platform.reviews (
    review_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id  UUID NOT NULL REFERENCES platform.users(user_id) ON DELETE CASCADE,
    subject_type TEXT NOT NULL CHECK (subject_type IN ('talent','company')),
    talent_account_id  UUID REFERENCES platform.talent_accounts(talent_account_id) ON DELETE CASCADE,
    company_account_id UUID REFERENCES platform.company_accounts(company_account_id) ON DELETE CASCADE,
    rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title        TEXT,
    body         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (                                       -- exactly one subject per review
        (talent_account_id IS NOT NULL)::int +
        (company_account_id IS NOT NULL)::int = 1
    )
);
CREATE INDEX ix_reviews_talent  ON platform.reviews (talent_account_id) WHERE talent_account_id IS NOT NULL;
CREATE INDEX ix_reviews_company ON platform.reviews (company_account_id) WHERE company_account_id IS NOT NULL;
```

## 10. `platform.activity_log` / `platform.seo_landing_pages`

```sql
CREATE TABLE platform.activity_log (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES platform.users(user_id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,        -- 'job','application','contact_request','review', …
    entity_id   UUID NOT NULL,
    action      TEXT NOT NULL,        -- 'created','status_changed', …
    details     JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_activity_recent ON platform.activity_log (created_at DESC);

-- Editable content for the SEO landing families (see URL_STRUCTURE.md §2)
CREATE TABLE platform.seo_landing_pages (
    landing_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug         TEXT NOT NULL UNIQUE,          -- 'hire/podcast-editors', 'podcast-editor-jobs', 'hire/podcast-editors/rates'
    page_type    TEXT NOT NULL CHECK (page_type IN ('hire','jobs','rates','location')),
    role         TEXT,                          -- taxonomy value; NULL for generic pages
    location     TEXT,                          -- geo variant slug; NULL otherwise
    intro_copy  TEXT,
    faq          JSONB,                         -- [{question, answer}]
    stats_snapshot JSONB,                       -- cached aggregates for the intro block
    published_at TIMESTAMPTZ,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_seo_landings_type ON platform.seo_landing_pages (page_type, role);
```

---

## 11. Schema-wide rules

1. **Ownership boundary:** the app never writes `catalog`; the sync never writes `platform`.
2. **FKs enforce integrity** across schemas (platform → catalog links are real foreign keys).
3. **Soft deletes** on mutable platform entities where history matters (`jobs`, `company_accounts`) — add `deleted_at TIMESTAMPTZ` as needed.
4. **`pg_trgm`** is required (`CREATE EXTENSION IF NOT EXISTS pg_trgm`) for the name-search indexes.
5. **Search criteria JSONB contract** (saved searches + API filters): flat filter object — `role`, `countries[]`, `skills[]`, `hire_me`, `availability{}`, `rate{min,max}`, `min_portfolio`, `min_episodes`, `active_within_days` — filters are hard WHERE clauses; scoring fields rank only.
