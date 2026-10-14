# SEO Research — Jobs Marketplace URL Structure & On-Page Best Practices

**Evidence base:** DataForSEO SERP analysis (Google, US, live advanced) + Google Ads keyword volumes, pulled 2026-10-14. This research drives the URL structure and per-page SEO requirements in `URL_STRUCTURE.md`.

---

## 1. Ranking URL patterns (what actually ranks)

From live SERPs for the marketplace's core queries:

| Query | Ranking URLs (pattern) |
|---|---|
| hire video editor | `upwork.com/hire/video-editors/cost/` · `freeup.net/hire/video-editor/` · `awesomic.com/hire/hire-a-social-media-video-editor` · `upwork.com/hire/video-editors/california-us/` · `behance.net/hire/video-editors` |
| freelance video editor | `upwork.com/freelance-jobs/video-editing/` · `pro.fiverr.com/cat/creative/video-editor` · `linkedin.com/jobs/freelance-video-editor-jobs` · `behance.net/hire/video-editors` · `upwork.com/hire/video-editors/` |
| video editor jobs | `glassdoor.com/Job/brooklyn-video-editor-jobs` · `ziprecruiter.com/Jobs/Video-Editor/--in-Missouri` · `ziprecruiter.com/Jobs/Online-Video-Editor/--in-Georgia` · `ihirebroadcasting.com/t-video-editor-s-california-jobs.html` |
| hire youtube thumbnail designer | `freelancer.com/job-search/best-youtube-thumbnail-maker/` · **`ytjobs.co/job/search` (the live marketplace already ranks here)** · `taskfavour.com/jobs/category/youtube-thumbnail-design` |

### The patterns to adopt

1. **Hire-side landing pages: `/hire/{role-plural-slug}/`** — the dominant pattern (Upwork, Behance, FreeUp, Awesomic all use `/hire/...`). Targets "hire {role}" and "{role} for hire" intent.
2. **Jobs-side landing pages: `/{role}-jobs`** — the job-board pattern (ZipRecruiter, Glassdoor, LinkedIn). Targets "{role} jobs" intent — the highest-volume keyword family.
3. **Cost/rates sub-pages: `/hire/{role}/rates/`** — Upwork ranks a dedicated cost page for rate queries ("video editor hourly rates").
4. **Location variants: `/hire/{role}/{location-slug}/`** — Upwork's geo pages rank for state-level queries. Generate for top talent locations.
5. **Category browse: `/talent/search/{category-slug}`** — the marketplace's own proven pattern; also matches Taskfavour's `/jobs/category/{category}`.

## 2. Title tag patterns (from ranking pages)

| Pattern | Example | Use on |
|---|---|---|
| `Hire {Role}s — {Brand}` | "Hire A Video Editor - FreeUp" | hire landing pages |
| `Best Freelance {Role}s for Hire ({Month Year})` | "Best Freelance Video Editors for Hire (Oct 2026)" | hire landing pages — **temporal freshness in the title is a proven CTR/rank pattern** |
| `{Role} Jobs in {Location} ({Month Year})` | "202 video editor Jobs in Brooklyn, NY, October 2026" | jobs landing pages |
| `{Role} Jobs ({NOW HIRING})` | "Video Editor Jobs in Missouri (NOW HIRING)" | jobs landing pages — urgency marker |
| `${min}-${max}/hr {Role} Jobs` | "$25-$56/hr No Experience Video Editor Jobs in San Jose, CA" | jobs landing variants — rate range in title |
| `{Role} Hourly Rates \| Cost to Hire {Role}` | "Video Editor Hourly Rates \| Cost to Hire Video Editor" | rates sub-pages |

**Rules derived:** include the current month/year in hire/jobs landing titles (regenerate monthly); lead with the exact keyword; put the brand last; use counts and rate ranges when available.

## 3. Keyword volumes (Google Ads, US, monthly)

Prioritization for the landing-page families:

| Keyword | Volume | Competition | Landing page |
|---|---|---|---|
| video editor | 90,500 | MEDIUM | `/hire/video-editors` |
| scriptwriter | 18,100 | LOW | `/hire/scriptwriters` |
| video editor jobs | 12,100 | LOW | `/video-editor-jobs` |
| creative director | 12,100 | LOW | `/hire/creative-directors` |
| youtube video editor | 12,100 | MEDIUM | `/hire/youtube-video-editors` |
| youtube jobs | 6,600 | LOW | `/` + `/video-editor-jobs` family |
| youtube editor | 2,900 | MEDIUM | `/hire/youtube-editors` |
| video editing services | 2,400 | LOW | `/hire/video-editors` (secondary) |
| hire video editor · freelance video editor · video editor for hire · youtube strategist | 1,300 each | MEDIUM/LOW | `/hire/video-editors` · `/hire/youtube-strategists` |
| channel manager | 1,000 | LOW | `/hire/channel-managers` |
| youtube thumbnail designer | 880 | MEDIUM | `/hire/thumbnail-designers` |
| thumbnail designer | 390 | MEDIUM | `/hire/thumbnail-designers` |
| thumbnail designer jobs | 210 | LOW | `/thumbnail-designer-jobs` |
| hire video editor for youtube | 140 | MEDIUM | `/hire/youtube-video-editors` |
| hire youtube editor | 90 | HIGH | `/hire/youtube-editors` |
| youtube scriptwriter | 30 | LOW | `/hire/youtube-scriptwriters` |
| hire thumbnail designer | 10 | HIGH | `/hire/thumbnail-designers` |

**Takeaways:** the role taxonomy maps cleanly to landing pages; "video editor" head terms dwarf the rest; jobs-intent ("video editor jobs") is the single biggest jobs-side keyword; several long-tails ("youtube thumbnail designer" 880/mo) are winnable — **the live marketplace already ranks #4 for "hire youtube thumbnail designer"**, proving the domain has authority for these queries.

## 4. On-page SEO requirements (per page type)

Derived from the ranking pages' common structure:

**All landing pages**
- Exact keyword in title (front-loaded), H1, URL slug, and meta description
- Current month/year in title for hire/jobs pages — regenerate via `generateMetadata`
- Descriptive intro block (100+ words) above the listing — ranking pages pair copy with results
- Internal links between the role family (hire page ↔ jobs page ↔ category browse ↔ rates page)
- `BreadcrumbList` JSON-LD

**Hire-side (`/hire/{role}`)**
- `JobPosting`-style listing markup is wrong here — use `ItemList` + `Person`/`ProfilePage` for listed talent
- Aggregate stats in the intro ("average hourly rate", "open to work now") — matches Upwork's cost-page pattern
- FAQ block targeting "how much does it cost to hire a {role}" (people-also-ask pattern)

**Jobs-side (`/{role}-jobs`)**
- `JobPosting` JSON-LD per listed job (required for Google Jobs rich results)
- Count + freshness in H1/title ("{Role} Jobs — {N} open roles")
- Location filter links in copy (state/city variants)

**Job detail (`/job/{id}`)**
- `JobPosting` JSON-LD with `datePosted`, `validThrough`, `hiringOrganization`, `employmentType`, `baseSalary` when present
- Title: `{Job Title} — {Company} | {Brand}`

**Talent profile (`/talent/profile/{id}`, `/@handle`)**
- `ProfilePage` + `Person` JSON-LD; title: `{Name} — {Role} | {Brand}`

**Company profile (`/companies/{id}`)**
- `Organization` JSON-LD; title: `{Company} | {Brand}`

**Sitemap**
- `sitemap.ts` enumerating: static pages, all role landing pages (hire + jobs + rates), category browse pages. Landing pages are `high` priority; refresh monthly with the title regeneration. (Location variants join the sitemap only when `/hire/{role}/{location}` pages exist — not built today.)
