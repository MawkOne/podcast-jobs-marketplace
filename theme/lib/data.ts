/**
 * Placeholder catalog — no fetching. Raw rows mirror DATABASE_SCHEMA.md column
 * shapes (nullable `name`, `display_salary` as 'true'/'false' strings, hire_me
 * flags); the list/profile helpers normalize on read into the exact API_SPEC.md
 * response shapes. No email fields exist anywhere (PII is never exposed).
 */
import { monthYear } from "@/lib/format";
import { MEDIUM, PUBLISHER_PHRASE, ROLES, type Role } from "@/lib/roles";
import { SITE_NAME } from "@/lib/seo";

/* ------------------------------------------------------------------ */
/* Response shapes (API_SPEC.md)                                      */
/* ------------------------------------------------------------------ */

export type TalentListItem = {
  user_id: number;
  display_name: string; // fallback chain applied on read (G2)
  avatar_url: string | null;
  avatar_fallback: string; // initials tile, pre-computed (G3)
  functional_area: string;
  country: string | null;
  hire_me: boolean;
  availability: string[]; // normalized from hire_me_* flags (G4)
  rate_per_hour: number | null;
  shows_rate: boolean; // display_salary 'true'/'false' → boolean (G4)
  portfolio_count: number;
  episode_count: number;
  total_listens: number;
  last_active_at: string;
};

export type TalentProfile = TalentListItem & {
  about: string | null;
  skills: string[];
  styles: string[];
  verified: boolean;
  state: string | null;
  city: string | null;
  links: { label: string; url: string }[]; // only present links
  stats: {
    portfolio_count: number;
    episode_count: number;
    total_listens: number;
    total_reviews: number;
    applications_count: number;
  };
  created_at: string;
};

export type JobCompany = {
  company_account_id: string;
  company_name: string;
  logo_fallback_initials: string;
};

export type JobListItem = {
  job_id: string;
  title: string;
  company: JobCompany;
  role: string;
  location_type: "remote" | "hybrid" | "onsite";
  location: string | null;
  compensation_min: number;
  compensation_max: number;
  posted_at: string;
  status: "draft" | "open" | "paused" | "filled" | "cancelled";
};

export type JobDetail = JobListItem & {
  description: string;
  requirements: string;
  priority: "low" | "medium" | "high" | "urgent";
  expires_at: string;
  application_count: number;
  related_jobs: JobListItem[];
};

export type Company = {
  company_id: string;
  company_name: string;
  industry: string;
  website: string;
  logo_url: string | null;
  logo_fallback_initials: string;
  status: "active" | "prospect";
};

export type CompanyDetail = Company & {
  description: string | null;
  subscriber_count: number | null; // only present when the source has it
  contact_name: string | null; // contact card only renders when present
  open_roles: JobListItem[];
  talent_matches: TalentListItem[]; // industry ↔ functional area join
};

export type Review = {
  review_id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
  reviewer: { display_name: string };
};

export type LandingFaq = { question: string; answer: string };

export type RateBucket = { label: string; range: [number, number]; share: number };

export type RoleLanding = {
  slug: string; // e.g. "hire/podcast-editors"
  page_type: "hire";
  role: string;
  intro_copy: string;
  faq: LandingFaq[];
  stats_snapshot: { avg_rate: number; open_to_work: number; talent_count: number };
  rate_distribution: RateBucket[];
  updated_at: string;
};

/** Sync watermark (G1) — every catalog page shows this. */
export const DATA_AS_OF = "2026-10-01T06:00:00Z";

/** GET /api/stats */
export const STATS = {
  talent_count: 8412,
  open_to_work: 2314,
  avg_rate: 42,
  company_count: 1287,
  open_jobs: 96,
  data_as_of: DATA_AS_OF,
};

/* ------------------------------------------------------------------ */
/* Talents — raw catalog rows                                          */
/* ------------------------------------------------------------------ */

type TalentRow = {
  user_id: number;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
  functional_area: string;
  country: string | null;
  state: string | null;
  city: string | null;
  about: string | null;
  skills: string[];
  styles: string[];
  hire_me: boolean;
  hire_me_availability_full_time: boolean;
  hire_me_availability_part_time: boolean;
  hire_me_availability_project_based: boolean;
  hire_me_location_hybrid: boolean;
  hire_me_location_remote: boolean;
  salary_per_hour: number | null;
  display_salary: "true" | "false";
  portfolio_count: number;
  episode_count: number;
  total_listens: number;
  total_reviews: number;
  applications_count: number;
  verified: boolean;
  website_link: string | null;
  show_url: string | null;
  created_at: string;
  last_activity_at: string;
};

type TalentSeed = Partial<TalentRow> & Pick<TalentRow, "user_id" | "functional_area">;

function talent(seed: TalentSeed): TalentRow {
  return {
    name: null,
    first_name: null,
    last_name: null,
    image: null,
    country: null,
    state: null,
    city: null,
    about: null,
    skills: [],
    styles: [],
    hire_me: false,
    hire_me_availability_full_time: false,
    hire_me_availability_part_time: false,
    hire_me_availability_project_based: false,
    hire_me_location_hybrid: false,
    hire_me_location_remote: false,
    salary_per_hour: null,
    display_salary: "false",
    portfolio_count: 0,
    episode_count: 0,
    total_listens: 0,
    total_reviews: 0,
    applications_count: 0,
    verified: false,
    website_link: null,
    show_url: null,
    created_at: "2025-06-01T00:00:00Z",
    last_activity_at: "2026-09-28T12:00:00Z",
    ...seed,
  };
}

const TALENT_ROWS: TalentRow[] = [
  // Podcast Editors
  talent({
    user_id: 100241,
    name: "Maya Chen",
    functional_area: "Podcast Editor",
    country: "United States",
    state: "California",
    city: "Los Angeles",
    about:
      "Interview and narrative editor for daily news and tech shows. I cut for pace: tighten the cold open, trim filler, and keep the conversation moving so listeners stay to the end.",
    skills: ["Pro Tools", "Adobe Audition", "Descript", "iZotope RX"],
    styles: ["Interview", "News"],
    hire_me: true,
    hire_me_availability_part_time: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 45,
    display_salary: "true",
    portfolio_count: 14,
    episode_count: 320,
    total_listens: 4_200_000,
    total_reviews: 210_000,
    applications_count: 12,
    verified: true,
    website_link: "https://mayachen.example",
    show_url: "https://shows.example/maya-chen",
    created_at: "2023-11-02T00:00:00Z",
    last_activity_at: "2026-10-05T09:12:00Z",
  }),
  talent({
    user_id: 118802,
    first_name: "Daniel",
    last_name: "Okafor",
    functional_area: "Podcast Editor",
    country: "United Kingdom",
    city: "London",
    about: "Fast-turnaround editor for daily and weekly shows. 200+ episodes shipped for networks and independent hosts, mostly interview and panel formats.",
    skills: ["Reaper", "Hindenburg", "Auphonic"],
    salary_per_hour: 38,
    display_salary: "true",
    portfolio_count: 9,
    episode_count: 180,
    total_listens: 950_000,
    total_reviews: 41_000,
    applications_count: 5,
    created_at: "2024-03-18T00:00:00Z",
    last_activity_at: "2026-09-22T18:40:00Z",
  }),
  talent({
    // No name, no first/last → generated handle "Podcast Editor · #208843" (G2)
    user_id: 208843,
    functional_area: "Podcast Editor",
    hire_me: true,
    hire_me_availability_full_time: true,
    hire_me_location_remote: true,
    portfolio_count: 3,
    episode_count: 64,
    total_listens: 120_000,
    total_reviews: 6_200,
    applications_count: 2,
    created_at: "2025-01-30T00:00:00Z",
    last_activity_at: "2026-10-01T11:05:00Z",
  }),
  // Sound Designers
  talent({
    user_id: 132554,
    name: "Priya Sharma",
    functional_area: "Sound Designer",
    country: "India",
    city: "Mumbai",
    about:
      "I build sonic identity for shows: intro and outro themes, music beds, and stings that make an episode instantly recognisable. Every package ships with stems so the team can reuse it.",
    skills: ["Pro Tools", "Logic Pro", "iZotope RX"],
    styles: ["Narrative", "Documentary"],
    hire_me: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 25,
    display_salary: "true",
    portfolio_count: 22,
    episode_count: 40,
    total_listens: 2_100_000,
    total_reviews: 88_000,
    applications_count: 9,
    verified: true,
    show_url: "https://shows.example/priya-sound",
    created_at: "2023-08-11T00:00:00Z",
    last_activity_at: "2026-10-03T08:20:00Z",
  }),
  talent({
    user_id: 145908,
    first_name: "Lucas",
    functional_area: "Sound Designer",
    country: "Brazil",
    city: "São Paulo",
    skills: ["Adobe Audition", "Reaper"],
    hire_me: true,
    hire_me_availability_part_time: true,
    hire_me_location_remote: true,
    salary_per_hour: 18,
    display_salary: "true",
    portfolio_count: 11,
    episode_count: 25,
    total_listens: 640_000,
    total_reviews: 21_000,
    applications_count: 4,
    created_at: "2024-07-02T00:00:00Z",
    last_activity_at: "2026-09-19T14:00:00Z",
  }),
  talent({
    user_id: 91204,
    functional_area: "Sound Designer",
    portfolio_count: 6,
    episode_count: 12,
    total_listens: 95_000,
    total_reviews: 3_100,
    applications_count: 1,
    created_at: "2025-05-14T00:00:00Z",
    last_activity_at: "2026-08-30T09:45:00Z",
  }),
  // Show Notes Writers
  talent({
    user_id: 155310,
    name: "Jordan Blake",
    functional_area: "Show Notes Writer",
    country: "United States",
    state: "New York",
    city: "New York",
    about:
      "Show notes and episode summaries with hooks that survive the first line. Former late-night writers' room, now writing for interview and narrative podcasts.",
    skills: ["SEO show notes", "Transcripts", "Research"],
    styles: ["Narrative"],
    hire_me: true,
    hire_me_availability_full_time: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 50,
    display_salary: "true",
    portfolio_count: 8,
    episode_count: 210,
    total_listens: 3_400_000,
    total_reviews: 155_000,
    applications_count: 15,
    verified: true,
    website_link: "https://jordanblake.example",
    created_at: "2022-12-01T00:00:00Z",
    last_activity_at: "2026-10-06T16:30:00Z",
  }),
  talent({
    user_id: 122019,
    first_name: "Sofia",
    last_name: "Marín",
    functional_area: "Show Notes Writer",
    country: "Spain",
    city: "Madrid",
    skills: ["SEO show notes", "Educational"],
    salary_per_hour: 42,
    display_salary: "true",
    portfolio_count: 5,
    episode_count: 96,
    total_listens: 1_100_000,
    total_reviews: 44_000,
    applications_count: 6,
    created_at: "2024-02-20T00:00:00Z",
    last_activity_at: "2026-09-25T10:10:00Z",
  }),
  talent({
    user_id: 78011,
    functional_area: "Show Notes Writer",
    hire_me: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    portfolio_count: 2,
    episode_count: 18,
    total_listens: 60_000,
    total_reviews: 2_000,
    applications_count: 1,
    created_at: "2025-03-09T00:00:00Z",
    last_activity_at: "2026-09-14T19:00:00Z",
  }),
  // Podcast Managers
  talent({
    user_id: 140772,
    name: "Ravi Patel",
    functional_area: "Podcast Manager",
    country: "India",
    city: "Bengaluru",
    about:
      "I run day-to-day operations for three shows: the production calendar, guest coordination, publishing and scheduling, and the weekly analytics review.",
    skills: ["Publishing & scheduling", "RSS & hosting", "Guest coordination"],
    hire_me: true,
    hire_me_availability_full_time: true,
    hire_me_location_remote: true,
    salary_per_hour: 30,
    display_salary: "true",
    portfolio_count: 4,
    episode_count: 150,
    total_listens: 1_800_000,
    total_reviews: 74_000,
    applications_count: 8,
    created_at: "2024-05-06T00:00:00Z",
    last_activity_at: "2026-10-02T07:55:00Z",
  }),
  talent({
    user_id: 133208,
    first_name: "Emma",
    functional_area: "Podcast Manager",
    country: "Canada",
    city: "Toronto",
    skills: ["Transistor", "Analytics"],
    hire_me: true,
    hire_me_availability_part_time: true,
    hire_me_location_remote: true,
    salary_per_hour: 27,
    display_salary: "true",
    portfolio_count: 3,
    episode_count: 55,
    total_listens: 480_000,
    total_reviews: 19_000,
    applications_count: 3,
    created_at: "2025-02-17T00:00:00Z",
    last_activity_at: "2026-09-27T13:25:00Z",
  }),
  talent({
    user_id: 55302,
    functional_area: "Podcast Manager",
    portfolio_count: 1,
    episode_count: 8,
    total_listens: 22_000,
    total_reviews: 900,
    created_at: "2025-07-21T00:00:00Z",
    last_activity_at: "2026-08-12T22:10:00Z",
  }),
  // Podcast Strategists
  talent({
    user_id: 119486,
    name: "Nadia Rahman",
    functional_area: "Podcast Strategist",
    country: "United Kingdom",
    city: "Manchester",
    about:
      "Strategy backed by data: distribution plans, promotion tests, and quarterly growth roadmaps. I've taken two shows past 500K monthly listeners.",
    skills: ["Audience analytics", "Distribution", "Guest strategy"],
    styles: ["Business"],
    hire_me: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 65,
    display_salary: "true",
    portfolio_count: 6,
    episode_count: 75,
    total_listens: 2_600_000,
    total_reviews: 102_000,
    applications_count: 11,
    verified: true,
    website_link: "https://nadiarahman.example",
    created_at: "2023-06-14T00:00:00Z",
    last_activity_at: "2026-10-07T09:00:00Z",
  }),
  talent({
    user_id: 162335,
    first_name: "Tom",
    last_name: "Fielding",
    functional_area: "Podcast Strategist",
    country: "United States",
    state: "Texas",
    city: "Austin",
    skills: ["Growth strategy", "Promotion"],
    salary_per_hour: 55,
    display_salary: "false", // rate present but hidden → "Rate not shown"
    portfolio_count: 4,
    episode_count: 42,
    total_listens: 1_300_000,
    total_reviews: 58_000,
    applications_count: 7,
    created_at: "2024-09-30T00:00:00Z",
    last_activity_at: "2026-09-21T17:35:00Z",
  }),
  talent({
    user_id: 42118,
    functional_area: "Podcast Strategist",
    hire_me: true,
    hire_me_availability_full_time: true,
    hire_me_location_remote: true,
    portfolio_count: 2,
    episode_count: 10,
    total_listens: 130_000,
    total_reviews: 5_500,
    applications_count: 2,
    created_at: "2025-04-03T00:00:00Z",
    last_activity_at: "2026-09-30T12:00:00Z",
  }),
  // Podcast Producers
  talent({
    // Matches the GET /api/talents example in API_SPEC.md exactly.
    user_id: 164714,
    name: "Mya Walsh",
    functional_area: "Podcast Producer",
    country: "United Kingdom",
    about:
      "Producer for documentary and branded series. I own the calendar, the budget, and the delivery checklist so editors can just edit.",
    skills: ["Production planning", "Budgeting", "Guest booking"],
    styles: ["Documentary"],
    hire_me: true,
    hire_me_availability_part_time: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 45,
    display_salary: "true",
    portfolio_count: 5,
    episode_count: 544,
    total_listens: 1_234_567,
    total_reviews: 67_000,
    applications_count: 10,
    verified: true,
    show_url: "https://shows.example/mya-walsh",
    created_at: "2023-02-08T00:00:00Z",
    last_activity_at: "2026-02-05T01:23:01Z",
  }),
  talent({
    user_id: 150993,
    first_name: "Diego",
    last_name: "Santos",
    functional_area: "Podcast Producer",
    country: "Mexico",
    city: "Mexico City",
    skills: ["Field recording", "Coordination"],
    hire_me: true,
    hire_me_availability_full_time: true,
    hire_me_location_hybrid: true,
    salary_per_hour: 40,
    display_salary: "true",
    portfolio_count: 7,
    episode_count: 120,
    total_listens: 890_000,
    total_reviews: 35_000,
    applications_count: 6,
    created_at: "2024-01-25T00:00:00Z",
    last_activity_at: "2026-10-04T15:45:00Z",
  }),
  talent({
    user_id: 39007,
    functional_area: "Podcast Producer",
    portfolio_count: 2,
    episode_count: 15,
    total_listens: 44_000,
    total_reviews: 1_800,
    applications_count: 1,
    created_at: "2025-09-12T00:00:00Z",
    last_activity_at: "2026-09-08T08:30:00Z",
  }),
  // Podcast Consultants
  talent({
    user_id: 108462,
    name: "Alicia Moreau",
    functional_area: "Podcast Consultant",
    country: "France",
    city: "Paris",
    about:
      "Consulting on format, positioning, and monetization for new or relaunching shows: audience definition, episode architecture, and a launch plan the team can actually run.",
    skills: ["Show positioning", "Monetization", "Format development"],
    styles: ["Narrative"],
    salary_per_hour: 85,
    display_salary: "true",
    portfolio_count: 18,
    episode_count: 95,
    total_listens: 2_900_000,
    total_reviews: 120_000,
    applications_count: 14,
    verified: true,
    website_link: "https://aliciamoreau.example",
    created_at: "2022-09-19T00:00:00Z",
    last_activity_at: "2026-09-17T11:15:00Z",
  }),
  talent({
    user_id: 173020,
    first_name: "Marcus",
    last_name: "Webb",
    functional_area: "Podcast Consultant",
    country: "United States",
    state: "Georgia",
    city: "Atlanta",
    skills: ["Relaunches", "Branding"],
    hire_me: true,
    hire_me_availability_project_based: true,
    hire_me_location_remote: true,
    salary_per_hour: 75,
    display_salary: "true",
    portfolio_count: 12,
    episode_count: 60,
    total_listens: 1_700_000,
    total_reviews: 71_000,
    applications_count: 9,
    created_at: "2023-10-05T00:00:00Z",
    last_activity_at: "2026-10-08T10:50:00Z",
  }),
  talent({
    user_id: 28455,
    functional_area: "Podcast Consultant",
    portfolio_count: 1,
    episode_count: 4,
    total_listens: 12_000,
    total_reviews: 500,
    created_at: "2025-11-02T00:00:00Z",
    last_activity_at: "2026-07-19T16:00:00Z",
  }),
];

/* ------------------------------------------------------------------ */
/* Talents — normalization on read                                    */
/* ------------------------------------------------------------------ */

/** G2 name fallback chain: name → first+last → generated handle. */
export function talentDisplayName(row: TalentRow): string {
  if (row.name) return row.name;
  if (row.first_name || row.last_name) {
    return [row.first_name, row.last_name].filter(Boolean).join(" ");
  }
  return `${row.functional_area} · #${row.user_id}`;
}

/** G3 initials tile from the fallback name ("Mya Walsh" → "MW", "Lucas" → "LU"). */
export function initialsFor(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function toListItem(row: TalentRow): TalentListItem {
  const displayName = talentDisplayName(row);
  return {
    user_id: row.user_id,
    display_name: displayName,
    avatar_url: row.image,
    avatar_fallback: initialsFor(displayName),
    functional_area: row.functional_area,
    country: row.country,
    hire_me: row.hire_me,
    availability: [
      row.hire_me_availability_full_time ? "full_time" : null,
      row.hire_me_availability_part_time ? "part_time" : null,
      row.hire_me_availability_project_based ? "project_based" : null,
    ].filter((value): value is string => value !== null),
    rate_per_hour: row.salary_per_hour,
    shows_rate: row.display_salary === "true" && row.salary_per_hour !== null,
    portfolio_count: row.portfolio_count,
    episode_count: row.episode_count,
    total_listens: row.total_listens,
    last_active_at: row.last_activity_at,
  };
}

/** GET /api/talents — results shape. */
export function listTalents(): TalentListItem[] {
  return TALENT_ROWS.map(toListItem);
}

export function listTalentsByRole(roleName: string): TalentListItem[] {
  return listTalents().filter((talent) => talent.functional_area === roleName);
}

/** GET /api/talents/:user_id — full profile + stats + links (PII excluded). */
export function getTalent(user_id: number): TalentProfile | undefined {
  const row = TALENT_ROWS.find((t) => t.user_id === user_id);
  if (!row) return undefined;
  const links: TalentProfile["links"] = [];
  if (row.website_link) links.push({ label: "Website", url: row.website_link });
  if (row.show_url) {
    links.push({ label: "Show", url: row.show_url });
  }
  return {
    ...toListItem(row),
    about: row.about,
    skills: row.skills,
    styles: row.styles,
    verified: row.verified,
    state: row.state,
    city: row.city,
    links,
    stats: {
      portfolio_count: row.portfolio_count,
      episode_count: row.episode_count,
      total_listens: row.total_listens,
      total_reviews: row.total_reviews,
      applications_count: row.applications_count,
    },
    created_at: row.created_at,
  };
}

export type TalentFacets = {
  role: Record<string, number>;
  country: Record<string, number>;
  unspecified_country: number;
  hire_me: number;
  availability: Record<string, number>;
};

/** GET /api/talents/facets — live counts computed BEFORE any filtering (G6). */
export function talentFacets(): TalentFacets {
  const items = listTalents();
  const role: Record<string, number> = {};
  const country: Record<string, number> = {};
  const availability: Record<string, number> = {};
  let hireMe = 0;
  let unspecified = 0;
  for (const item of items) {
    role[item.functional_area] = (role[item.functional_area] ?? 0) + 1;
    if (item.country) country[item.country] = (country[item.country] ?? 0) + 1;
    else unspecified += 1;
    if (item.hire_me) hireMe += 1;
    for (const value of item.availability) {
      availability[value] = (availability[value] ?? 0) + 1;
    }
  }
  return { role, country, unspecified_country: unspecified, hire_me: hireMe, availability };
}

/* ------------------------------------------------------------------ */
/* Companies                                                           */
/* ------------------------------------------------------------------ */

type CompanyRow = {
  company_id: string;
  company_name: string;
  industry: string;
  website: string;
  logo_url: string | null;
  logo_fallback_initials: string;
  status: "active" | "prospect";
  description: string | null;
  subscriber_count: number | null;
  contact_name: string | null;
  talent_match_ids: number[];
};

const COMPANY_ROWS: CompanyRow[] = [
  {
    company_id: "bright-signal",
    company_name: "Bright Signal Media",
    industry: "Media Production",
    website: "https://brightsignal.example",
    logo_url: null,
    logo_fallback_initials: "BS",
    status: "active",
    description:
      "A podcast production studio building branded and B2B shows for tech companies, plus two in-house documentary series.",
    subscriber_count: 128_000,
    contact_name: "Kate Morrison",
    talent_match_ids: [100241, 164714, 155310],
  },
  {
    company_id: "halcyon-games",
    company_name: "Halcyon Games",
    industry: "Gaming",
    website: "https://halcyongames.example",
    logo_url: null,
    logo_fallback_initials: "HG",
    status: "active",
    description: "Gaming podcast network running three shows, a weekly live stream, and a growing short-form clips pipeline.",
    subscriber_count: 892_000,
    contact_name: "Owen Park",
    talent_match_ids: [118802, 132554, 119486],
  },
  {
    company_id: "sunrise-learning",
    company_name: "Sunrise Learning",
    industry: "Education",
    website: "https://sunriselearning.example",
    logo_url: null,
    logo_fallback_initials: "SL",
    status: "active",
    description: "K-12 and lifelong-learning podcasts with a 200-episode back catalog.",
    subscriber_count: 210_000,
    contact_name: null,
    talent_match_ids: [208843, 173020, 140772],
  },
  {
    company_id: "peak-fitness",
    company_name: "Peak Performance Fitness",
    industry: "Fitness",
    website: "https://peakperformance.example",
    logo_url: null,
    logo_fallback_initials: "PP",
    status: "active",
    description: null, // collapses on the profile page (G9)
    subscriber_count: null,
    contact_name: null,
    talent_match_ids: [133208, 145908, 108462],
  },
  {
    company_id: "northlight-finance",
    company_name: "Northlight Finance",
    industry: "Finance",
    website: "https://northlight.example",
    logo_url: null,
    logo_fallback_initials: "NL",
    status: "prospect",
    description: null,
    subscriber_count: null,
    contact_name: null,
    talent_match_ids: [122019, 162335, 78011],
  },
  {
    company_id: "evergreen-docs",
    company_name: "Evergreen Docs",
    industry: "Documentary",
    website: "https://evergreendocs.example",
    logo_url: null,
    logo_fallback_initials: "ED",
    status: "active",
    description: "True-crime and history podcast studio with a 12-person production team.",
    subscriber_count: 54_000,
    contact_name: "June Alvarez",
    talent_match_ids: [150993, 55302, 91204],
  },
];

/* ------------------------------------------------------------------ */
/* Jobs                                                                */
/* ------------------------------------------------------------------ */

type JobRow = {
  job_id: string;
  company_account_id: string;
  title: string;
  role: string;
  description: string;
  requirements: string;
  compensation_min: number;
  compensation_max: number;
  location_type: "remote" | "hybrid" | "onsite";
  location: string | null;
  status: "draft" | "open" | "paused" | "filled" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  posted_at: string;
  expires_at: string;
  application_count: number;
};

const JOB_ROWS: JobRow[] = [
  {
    job_id: "3f2a9c1e-8b4d-4c6a-9e2f-1d5b7a3c8e01",
    company_account_id: "bright-signal",
    title: "Senior Podcast Editor",
    role: "Podcast Editor",
    description:
      "Own the edit for a B2B tech show publishing two episodes a week. You'll cut from a rundown, clean up dialogue, and work directly with the show's producer on pacing and structure.",
    requirements:
      "5+ years editing interview and narrative podcasts, a portfolio with measurable retention, and comfort with a weekly delivery cadence. Pro Tools or Adobe Audition required; iZotope RX strongly preferred.",
    compensation_min: 35,
    compensation_max: 55,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "high",
    posted_at: "2026-09-22T10:00:00Z",
    expires_at: "2026-11-22T10:00:00Z",
    application_count: 14,
  },
  {
    job_id: "8c1d5b7a-3e9f-4c2a-b6d8-9f1a2b3c4d05",
    company_account_id: "halcyon-games",
    title: "Podcast Editor (Gaming)",
    role: "Podcast Editor",
    description:
      "Cut 8–12 short-form clips a week from existing episodes, plus the weekly panel show. Fast turnarounds, punchy cold opens, and platform-native pacing for a 900K-listener network.",
    requirements:
      "Deep familiarity with gaming podcasts and short-form audio, Descript or Adobe Audition, and the ability to ship same-day on trending clips.",
    compensation_min: 25,
    compensation_max: 40,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "urgent",
    posted_at: "2026-10-02T09:00:00Z",
    expires_at: "2026-12-02T09:00:00Z",
    application_count: 9,
  },
  {
    job_id: "a2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b607",
    company_account_id: "sunrise-learning",
    title: "Podcast Editor, Educational Series",
    role: "Podcast Editor",
    description:
      "Edit K-12 and lifelong-learning episodes: clean dialogue, on-brand music beds, and a calm pacing that keeps learners listening. Scripts and voiceovers are provided.",
    requirements: "2+ years editing educational or explainer audio and solid Pro Tools or Hindenburg skills.",
    compensation_min: 20,
    compensation_max: 35,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "medium",
    posted_at: "2026-09-30T14:00:00Z",
    expires_at: "2026-11-29T14:00:00Z",
    application_count: 7,
  },
  {
    job_id: "b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d02",
    company_account_id: "halcyon-games",
    title: "Sound Designer",
    role: "Sound Designer",
    description:
      "Design 10+ sonic assets a month for a gaming network — intro/outro themes, stings, and music beds. You'll get briefs with the show's tone and reference tracks, plus full creative latitude on concepts.",
    requirements: "Portfolio of podcast sound design with stems, Logic Pro or Pro Tools fluency, and 24-hour turnaround on revisions.",
    compensation_min: 18,
    compensation_max: 30,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "medium",
    posted_at: "2026-10-05T11:00:00Z",
    expires_at: "2026-12-05T11:00:00Z",
    application_count: 11,
  },
  {
    job_id: "c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e08",
    company_account_id: "peak-fitness",
    title: "Sound Designer (Part-time)",
    role: "Sound Designer",
    description:
      "Part-time sound design for a fitness show — bold, high-energy themes and beds built around the host's voice. Roughly 8 assets a month.",
    requirements: "Fitness or lifestyle audio portfolio and availability for Tuesday/Thursday delivery slots.",
    compensation_min: 20,
    compensation_max: 28,
    location_type: "hybrid",
    location: "Austin, TX",
    status: "open",
    priority: "low",
    posted_at: "2026-09-18T08:00:00Z",
    expires_at: "2026-11-17T08:00:00Z",
    application_count: 4,
  },
  {
    job_id: "d9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f03",
    company_account_id: "northlight-finance",
    title: "Finance Show Notes Writer",
    role: "Show Notes Writer",
    description:
      "Write show notes and episode summaries for a finance show covering markets, personal finance, and fintech. Research support provided; the hook is yours to own.",
    requirements:
      "Demonstrated finance literacy, a portfolio of show notes that drove search traffic, and comfort writing to a strict factual standard.",
    compensation_min: 30,
    compensation_max: 50,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "medium",
    posted_at: "2026-10-01T12:00:00Z",
    expires_at: "2026-11-30T12:00:00Z",
    application_count: 6,
  },
  {
    job_id: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a09",
    company_account_id: "bright-signal",
    title: "Comedy Show Notes Writer",
    role: "Show Notes Writer",
    description:
      "Write for a tech-comedy podcast that skewers startup culture. Punch-up passes on summaries, cold opens, and the occasional sketch. Writers' room energy over solo grind.",
    requirements: "Comedy portfolio (podcast, TV, or live), fast punch-up instincts, and tolerance for feedback loops.",
    compensation_min: 28,
    compensation_max: 45,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "medium",
    posted_at: "2026-09-12T15:00:00Z",
    expires_at: "2026-11-11T15:00:00Z",
    application_count: 8,
  },
  {
    job_id: "f1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b06",
    company_account_id: "evergreen-docs",
    title: "Podcast Manager (True Crime)",
    role: "Podcast Manager",
    description:
      "Run operations for a true-crime podcast: production calendar, publishing and metadata, community posts, and coordination with three freelance editors.",
    requirements: "2+ years running a show with a weekly cadence and a strong grip on podcast analytics.",
    compensation_min: 25,
    compensation_max: 40,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "high",
    posted_at: "2026-09-25T09:30:00Z",
    expires_at: "2026-11-24T09:30:00Z",
    application_count: 10,
  },
  {
    job_id: "0b1c2d3e-4f5a-4b6c-7d8e-9f0a1b2c3d10",
    company_account_id: "halcyon-games",
    title: "Podcast Growth Strategist",
    role: "Podcast Strategist",
    description:
      "Own the growth plan for a gaming network: distribution targets, promotion experiments, and a quarterly roadmap across three shows. You'll work with the head of content weekly.",
    requirements:
      "Track record growing shows past 250K monthly listeners, fluency in podcast analytics, and a testing mindset (hypotheses, not vibes).",
    compensation_min: 45,
    compensation_max: 70,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "high",
    posted_at: "2026-10-08T10:00:00Z",
    expires_at: "2026-12-08T10:00:00Z",
    application_count: 5,
  },
  {
    job_id: "1c2d3e4f-5a6b-4c7d-8e9f-0a1b2c3d4e11",
    company_account_id: "evergreen-docs",
    title: "Podcast Producer, Documentary",
    role: "Podcast Producer",
    description:
      "Produce documentary episodes in and around Los Angeles: locations, releases, crew booking, and on-site coordination for a true-crime series.",
    requirements: "3+ years field producing, a reliable LA crew network, and documentary credits.",
    compensation_min: 40,
    compensation_max: 60,
    location_type: "hybrid",
    location: "Los Angeles, CA",
    status: "open",
    priority: "medium",
    posted_at: "2026-09-15T13:00:00Z",
    expires_at: "2026-11-14T13:00:00Z",
    application_count: 7,
  },
  {
    job_id: "2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f12",
    company_account_id: "sunrise-learning",
    title: "Coordinating Podcast Producer",
    role: "Podcast Producer",
    description:
      "Coordinate a 200-episode back catalog refresh: scheduling editors and voice talent, tracking delivery status, and keeping the publishing calendar honest.",
    requirements: "Production coordination experience, ruthless organization, and comfort with async teams across time zones.",
    compensation_min: 35,
    compensation_max: 50,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "medium",
    posted_at: "2026-09-28T16:00:00Z",
    expires_at: "2026-11-27T16:00:00Z",
    application_count: 3,
  },
  {
    job_id: "3e4f5a6b-7c8d-4e9f-0a1b-2c3d4e5f6a13",
    company_account_id: "peak-fitness",
    title: "Podcast Consultant, Show Rebrand",
    role: "Podcast Consultant",
    description:
      "Lead a full rebrand for a fitness show: format refresh, sonic identity, cover art direction, and packaging guidelines the team can maintain.",
    requirements: "Rebrand portfolio with before/after metrics, format and positioning chops, and experience building systems (not one-offs).",
    compensation_min: 60,
    compensation_max: 90,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "low",
    posted_at: "2026-10-10T09:00:00Z",
    expires_at: "2026-12-09T09:00:00Z",
    application_count: 2,
  },
  {
    job_id: "4f5a6b7c-8d9e-4f0a-1b2c-3d4e5f6a7b14",
    company_account_id: "evergreen-docs",
    title: "Audio Engineer, Interview Series",
    role: "Audio Engineer",
    description:
      "Mix and master a twice-weekly interview series on health and longevity: noise reduction, leveling to broadcast loudness, and a consistent sonic signature across two hosts and remote guests.",
    requirements:
      "Pro Tools or Logic fluency, iZotope RX experience with difficult remote recordings, and a fast 24-hour turnaround cadence.",
    compensation_min: 40,
    compensation_max: 65,
    location_type: "remote",
    location: null,
    status: "open",
    priority: "high",
    posted_at: "2026-10-09T11:00:00Z",
    expires_at: "2026-12-08T11:00:00Z",
    application_count: 6,
  },
];

function jobToListItem(row: JobRow): JobListItem {
  const company = COMPANY_ROWS.find((c) => c.company_id === row.company_account_id);
  return {
    job_id: row.job_id,
    title: row.title,
    company: {
      company_account_id: row.company_account_id,
      company_name: company?.company_name ?? "Unknown company",
      logo_fallback_initials: company?.logo_fallback_initials ?? "??",
    },
    role: row.role,
    location_type: row.location_type,
    location: row.location,
    compensation_min: row.compensation_min,
    compensation_max: row.compensation_max,
    posted_at: row.posted_at,
    status: row.status,
  };
}

/** GET /api/jobs — open jobs only. */
export function listJobs(): JobListItem[] {
  return JOB_ROWS.filter((row) => row.status === "open").map(jobToListItem);
}

/** GET /api/jobs/:job_id — full job + company block + application_count + related_jobs. */
export function getJob(job_id: string): JobDetail | undefined {
  const row = JOB_ROWS.find((job) => job.job_id === job_id && job.status === "open");
  if (!row) return undefined;
  const related = JOB_ROWS.filter((job) => job.role === row.role && job.job_id !== row.job_id && job.status === "open")
    .map(jobToListItem)
    .slice(0, 3);
  return {
    ...jobToListItem(row),
    description: row.description,
    requirements: row.requirements,
    priority: row.priority,
    expires_at: row.expires_at,
    application_count: row.application_count,
    related_jobs: related,
  };
}

/** Jobs for a role landing page, with the detail fields JSON-LD needs. */
export function getJobsByRole(roleName: string): JobDetail[] {
  return JOB_ROWS.filter((row) => row.role === roleName && row.status === "open")
    .map((row) => getJob(row.job_id))
    .filter((job): job is JobDetail => job !== undefined);
}

/** GET /api/companies — directory list shape. */
export function listCompanies(): Company[] {
  return COMPANY_ROWS.map((row) => ({
    company_id: row.company_id,
    company_name: row.company_name,
    industry: row.industry,
    website: row.website,
    logo_url: row.logo_url,
    logo_fallback_initials: row.logo_fallback_initials,
    status: row.status,
  }));
}

/** GET /api/companies/:company_id — detail with subscriber_count (when present) + open_roles + talent_matches. */
export function getCompany(company_id: string): CompanyDetail | undefined {
  const row = COMPANY_ROWS.find((company) => company.company_id === company_id);
  if (!row) return undefined;
  const openRoles = JOB_ROWS.filter((job) => job.company_account_id === company_id && job.status === "open").map(
    jobToListItem,
  );
  const matches = row.talent_match_ids.flatMap((user_id) => {
    const profile = getTalent(user_id);
    return profile ? [profile] : [];
  });
  return {
    company_id: row.company_id,
    company_name: row.company_name,
    industry: row.industry,
    website: row.website,
    logo_url: row.logo_url,
    logo_fallback_initials: row.logo_fallback_initials,
    status: row.status,
    description: row.description,
    subscriber_count: row.subscriber_count,
    contact_name: row.contact_name,
    open_roles: openRoles,
    talent_matches: matches,
  };
}

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

type ReviewRow = Review & { subject: string };

const REVIEW_ROWS: ReviewRow[] = [
  {
    review_id: "rev_101",
    subject: "talent:164714",
    rating: 5,
    title: "Lifted our completion rate",
    body: "Mya re-cut our first segment and completion jumped 9%. Fast, communicative, zero drama.",
    created_at: "2026-08-14T09:00:00Z",
    reviewer: { display_name: "Kate M." },
  },
  {
    review_id: "rev_102",
    subject: "talent:164714",
    rating: 5,
    title: "Rebuilt our publishing pipeline",
    body: "Coordinated 40 episodes across three shows without a single missed slot.",
    created_at: "2026-09-02T14:30:00Z",
    reviewer: { display_name: "Owen P." },
  },
  {
    review_id: "rev_103",
    subject: "talent:100241",
    rating: 5,
    title: "The mix is unreal",
    body: "Maya's dialogue cleanup made our interview audio sound like a studio. Worth every dollar.",
    created_at: "2026-07-20T18:00:00Z",
    reviewer: { display_name: "Diego S." },
  },
  {
    review_id: "rev_104",
    subject: "company:halcyon-games",
    rating: 4,
    title: "Clear briefs, fast payments",
    body: "Posted a role Monday, had a shortlist by Thursday. Briefs were unusually well-written.",
    created_at: "2026-08-30T11:00:00Z",
    reviewer: { display_name: "Diego Santos" },
  },
  {
    review_id: "rev_105",
    subject: "company:bright-signal",
    rating: 5,
    title: "Great communication",
    body: "They know what they want and respect your time. Payments always landed on schedule.",
    created_at: "2026-09-05T16:45:00Z",
    reviewer: { display_name: "Mya Walsh" },
  },
];

/** GET /api/reviews?subject=talent:{id} or company:{id} */
export function getReviews(subject: string): { results: Review[]; average_rating: number } {
  const results = REVIEW_ROWS.filter((row) => row.subject === subject).map((row) => ({
    review_id: row.review_id,
    rating: row.rating,
    title: row.title,
    body: row.body,
    created_at: row.created_at,
    reviewer: row.reviewer,
  }));
  const average = results.length ? results.reduce((sum, review) => sum + review.rating, 0) / results.length : 0;
  return { results, average_rating: Math.round(average * 10) / 10 };
}

/* ------------------------------------------------------------------ */
/* SEO landing content (platform.seo_landing_pages)                   */
/* ------------------------------------------------------------------ */

const STATS_SNAPSHOTS: Record<string, { avg_rate: number; open_to_work: number; talent_count: number }> = {
  "podcast-editors": { avg_rate: 38, open_to_work: 412, talent_count: 2805 },
  "sound-designers": { avg_rate: 24, open_to_work: 188, talent_count: 1204 },
  "show-notes-writers": { avg_rate: 46, open_to_work: 96, talent_count: 733 },
  "podcast-managers": { avg_rate: 32, open_to_work: 141, talent_count: 890 },
  "podcast-strategists": { avg_rate: 58, open_to_work: 64, talent_count: 412 },
  "podcast-producers": { avg_rate: 49, open_to_work: 77, talent_count: 528 },
  "podcast-consultants": { avg_rate: 78, open_to_work: 33, talent_count: 264 },
  "audio-engineers": { avg_rate: 44, open_to_work: 121, talent_count: 968 },
};

/** Generic fallbacks so a role without a curated snapshot still renders. */
const FALLBACK_SNAPSHOT = { avg_rate: 40, open_to_work: 120, talent_count: 640 };

const FALLBACK_RATE_DISTRIBUTION: RateBucket[] = [
  { label: "$15–25/hr", range: [15, 25], share: 30 },
  { label: "$25–40/hr", range: [25, 40], share: 40 },
  { label: "$40–60/hr", range: [40, 60], share: 21 },
  { label: "$60+/hr", range: [60, 250], share: 9 },
];

const RATE_DISTRIBUTIONS: Record<string, RateBucket[]> = {
  "podcast-editors": [
    { label: "$15–25/hr", range: [15, 25], share: 28 },
    { label: "$25–40/hr", range: [25, 40], share: 41 },
    { label: "$40–60/hr", range: [40, 60], share: 22 },
    { label: "$60+/hr", range: [60, 250], share: 9 },
  ],
  "sound-designers": [
    { label: "$10–20/hr", range: [10, 20], share: 34 },
    { label: "$20–35/hr", range: [20, 35], share: 44 },
    { label: "$35–50/hr", range: [35, 50], share: 17 },
    { label: "$50+/hr", range: [50, 250], share: 5 },
  ],
  "show-notes-writers": [
    { label: "$20–35/hr", range: [20, 35], share: 22 },
    { label: "$35–50/hr", range: [35, 50], share: 46 },
    { label: "$50–70/hr", range: [50, 70], share: 24 },
    { label: "$70+/hr", range: [70, 300], share: 8 },
  ],
  "podcast-managers": [
    { label: "$15–25/hr", range: [15, 25], share: 31 },
    { label: "$25–40/hr", range: [25, 40], share: 48 },
    { label: "$40–55/hr", range: [40, 55], share: 16 },
    { label: "$55+/hr", range: [55, 250], share: 5 },
  ],
  "podcast-strategists": [
    { label: "$25–40/hr", range: [25, 40], share: 18 },
    { label: "$40–60/hr", range: [40, 60], share: 39 },
    { label: "$60–80/hr", range: [60, 80], share: 30 },
    { label: "$80+/hr", range: [80, 300], share: 13 },
  ],
  "podcast-producers": [
    { label: "$25–40/hr", range: [25, 40], share: 26 },
    { label: "$40–55/hr", range: [40, 55], share: 45 },
    { label: "$55–75/hr", range: [55, 75], share: 21 },
    { label: "$75+/hr", range: [75, 300], share: 8 },
  ],
  "podcast-consultants": [
    { label: "$40–60/hr", range: [40, 60], share: 19 },
    { label: "$60–80/hr", range: [60, 80], share: 37 },
    { label: "$80–110/hr", range: [80, 110], share: 29 },
    { label: "$110+/hr", range: [110, 400], share: 15 },
  ],
  "audio-engineers": [
    { label: "$20–35/hr", range: [20, 35], share: 24 },
    { label: "$35–50/hr", range: [35, 50], share: 42 },
    { label: "$50–70/hr", range: [50, 70], share: 24 },
    { label: "$70+/hr", range: [70, 300], share: 10 },
  ],
};

/** 100+ word intro block for hire landings (SEO_RESEARCH.md §4). */
function introCopyFor(role: Role, snap: { avg_rate: number; open_to_work: number; talent_count: number }): string {
  const plural = `${role.name}s`;
  const lower = role.name.toLowerCase();
  return [
    `Hiring a freelance ${lower} for your ${MEDIUM} show shouldn't mean posting into the void and hoping the right person shows up.`,
    `${SITE_NAME} keeps a synced catalog of ${MEDIUM.toLowerCase()} ${plural} — specialists across interview, narrative, true crime, business, and every other format — complete with the numbers that actually matter: portfolio sizes, episode output, and real listen counts pulled from connected shows.`,
    `This page is a snapshot of the ${plural} currently in the catalog. Their average hourly rate is $${snap.avg_rate}/hr, and ${snap.open_to_work} of the ${snap.talent_count} listed are openly available for work right now, so you can staff a project quickly instead of starting from zero.`,
    `Browse the grid below, open any profile to see skills, rates, and engagement history, and use the links underneath the grid to compare current ${role.name} job openings or dig into rate benchmarks before you reach out.`,
  ].join(" ");
}

function faqFor(role: Role, snap: { avg_rate: number; open_to_work: number; talent_count: number }): LandingFaq[] {
  const plural = `${role.name}s`;
  const lower = role.name.toLowerCase();
  return [
    {
      question: `How much does it cost to hire a ${role.name}?`,
      answer: `Freelance ${plural} on ${SITE_NAME} currently average $${snap.avg_rate}/hr. Most fall between $15 and $60/hr depending on experience, niche, and workload — newer ${plural} charge less, while specialists with proven results charge a premium. See the ${role.name} rates page for the full distribution.`,
    },
    {
      question: `What does a ${role.name} do for a podcast?`,
      answer: `${role.description} A good ${lower} works from your show's data — what's holding listeners, what's losing them — and turns that into episodes the audience actually finishes.`,
    },
    {
      question: `How do I contact ${plural} on ${SITE_NAME}?`,
      answer: `Create a company account, then send a contact request from any profile. Requests route through the platform into the freelancer's mailbox, and email addresses are never exposed publicly.`,
    },
  ];
}

/** 100+ word intro block for /{role}-jobs landings. */
export function jobsLandingIntro(role: Role, count: number): string {
  const plural = `${role.name}s`;
  const lower = role.name.toLowerCase();
  return [
    `Hiring for a ${lower} role? This page collects every open ${lower} job on ${SITE_NAME} — ${count} as of ${monthYear()} — posted by ${PUBLISHER_PHRASE}.`,
    `Roles range from fully remote part-time gigs to full-time hybrid seats at production studios, and every listing shows its rate band up front so nobody wastes a call on a mismatched budget.`,
    `New roles land weekly as companies publish them, and the count in the heading is refreshed with the catalog sync.`,
    `Prefer browsing people instead of posts? The ${plural} talent grid and the hourly-rate benchmarks are one click away, and freelancers can create a profile to get matched to roles like these.`,
  ].join(" ");
}

/** GET /api/seo/landing/:slug — hire landing content for a role slug. */
export function getRoleLanding(roleSlug: string): RoleLanding | undefined {
  const role = ROLES.find((r) => r.slug === roleSlug);
  if (!role) return undefined;
  // Curated snapshots are an enhancement — fall back to generic values so a
  // role without curated data still renders correctly.
  const snap = STATS_SNAPSHOTS[role.slug] ?? FALLBACK_SNAPSHOT;
  return {
    slug: `hire/${role.slug}`,
    page_type: "hire",
    role: role.name,
    intro_copy: introCopyFor(role, snap),
    faq: faqFor(role, snap),
    stats_snapshot: snap,
    rate_distribution: RATE_DISTRIBUTIONS[role.slug] ?? FALLBACK_RATE_DISTRIBUTION,
    updated_at: DATA_AS_OF,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Accounts — platform.users shape (DATABASE_SCHEMA.md §3). Placeholder demo
// auth: real deployments verify via POST /api/auth/login against the database;
// the theme verifies client-side against this record so the login flow is
// demonstrable without a backend.
// ─────────────────────────────────────────────────────────────────────────────

export interface UserRecord {
  user_id: string;
  email: string;
  password_hash: string; // bcrypt — never expose via any API response
  display_name: string;
  role: "talent" | "company" | "admin";
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

/** Admin account — bcrypt hash of the demo password below. */
export const ADMIN_USER: UserRecord = {
  user_id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  email: "admin@marketplace.example",
  password_hash: "$2b$10$XAuyNHMLv3XvRQRcJPBtHOrU2y.oe.X.JsqRNsmQimCBkEL/XiVRy",
  display_name: "Admin",
  role: "admin",
  avatar_url: null,
  is_active: true,
  created_at: "2026-10-01T00:00:00Z",
};

export const USERS: UserRecord[] = [ADMIN_USER];

/** Demo credentials shown on the login page (placeholder data only). */
export const DEMO_CREDENTIALS = {
  email: ADMIN_USER.email,
  password: "Password123",
};

/* ------------------------------------------------------------------ */
/* Pipeline, messaging, notifications, referrals — added for the       */
/* authenticated surface (URL_STRUCTURE.md §9). Shapes follow          */
/* API_SPEC.md §5 (applications) and §8 (messaging).                   */
/* ------------------------------------------------------------------ */

/** Pipeline statuses for job applicants (DATABASE_SCHEMA.md job_applications). */
export type PipelineStatus =
  | "identified"
  | "contacted"
  | "responded"
  | "screening"
  | "interviewing"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export const PIPELINE_STATUSES: PipelineStatus[] = [
  "identified",
  "contacted",
  "responded",
  "screening",
  "interviewing",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
];

export interface Application {
  application_id: string;
  job_id: string;
  /** Numeric talent id — resolves via getTalentListItem(). */
  talent_account_id: number;
  status: PipelineStatus;
  rating: number | null;
  notes: string | null;
  last_contacted_at: string | null;
}

/** Job used by the demo company flow (create → checkout → publish → applicants). */
export const DEMO_COMPANY_JOB_ID = "3f2a9c1e-8b4d-4c6a-9e2f-1d5b7a3c8e01";

/** Talent used by the demo talent flow (pipeline, share space, payments). */
export const DEMO_TALENT_ID = 164714;

export const APPLICATIONS: Application[] = [
  {
    application_id: "app_001",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 164714,
    status: "offer",
    rating: 5,
    notes: "Strong reel; fast turnaround on the test edit. Offer sent.",
    last_contacted_at: "2026-09-28T10:12:00Z",
  },
  {
    application_id: "app_002",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 100241,
    status: "interviewing",
    rating: 4,
    notes: "Good call — scheduling a paid test project.",
    last_contacted_at: "2026-09-26T15:40:00Z",
  },
  {
    application_id: "app_003",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 132554,
    status: "contacted",
    rating: 4,
    notes: null,
    last_contacted_at: "2026-09-24T09:05:00Z",
  },
  {
    application_id: "app_004",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 119486,
    status: "responded",
    rating: 3,
    notes: "Interested, asking about the weekly volume.",
    last_contacted_at: "2026-09-23T18:22:00Z",
  },
  {
    application_id: "app_005",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 208843,
    status: "screening",
    rating: null,
    notes: null,
    last_contacted_at: null,
  },
  {
    application_id: "app_006",
    job_id: DEMO_COMPANY_JOB_ID,
    talent_account_id: 118802,
    status: "identified",
    rating: null,
    notes: null,
    last_contacted_at: null,
  },
  {
    application_id: "app_007",
    job_id: "8c1d5b7a-3e9f-4c2a-b6d8-9f1a2b3c4d05",
    talent_account_id: 164714,
    status: "interviewing",
    rating: 4,
    notes: "Second interview booked.",
    last_contacted_at: "2026-09-27T11:00:00Z",
  },
  {
    application_id: "app_008",
    job_id: "a2b3c4d5-e6f7-48a9-b0c1-d2e3f4a5b607",
    talent_account_id: 164714,
    status: "contacted",
    rating: null,
    notes: null,
    last_contacted_at: "2026-09-25T08:30:00Z",
  },
  {
    application_id: "app_009",
    job_id: "b7c8d9e0-f1a2-4b3c-8d4e-5f6a7b8c9d02",
    talent_account_id: 164714,
    status: "hired",
    rating: 5,
    notes: "Signed a 3-month retainer.",
    last_contacted_at: "2026-08-15T13:45:00Z",
  },
  {
    application_id: "app_010",
    job_id: "c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e08",
    talent_account_id: 164714,
    status: "rejected",
    rating: 2,
    notes: "Went with someone local.",
    last_contacted_at: "2026-08-02T16:10:00Z",
  },
];

export function listApplications(): Application[] {
  return APPLICATIONS;
}

export function getApplicationsByJob(jobId: string): Application[] {
  return APPLICATIONS.filter((application) => application.job_id === jobId);
}

export function getApplicationsByTalent(talentId: number): Application[] {
  return APPLICATIONS.filter((application) => application.talent_account_id === talentId);
}

/** Resolve a talent id to a list item (name/avatar fallbacks already applied). */
export function getTalentListItem(userId: number): TalentListItem | undefined {
  return listTalents().find((talent) => talent.user_id === userId);
}

/* ---------------------------- Messaging ---------------------------- */

export interface ConversationParticipant {
  user_id: string;
  display_name: string;
  avatar_fallback: string;
  area: string;
}

export interface Message {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface Conversation {
  conversation_id: string;
  job: { title: string } | null;
  participants: ConversationParticipant[];
  last_message: { body: string; created_at: string };
  unread_count: number;
}

const ME: ConversationParticipant = {
  user_id: ADMIN_USER.user_id,
  display_name: ADMIN_USER.display_name,
  avatar_fallback: "A",
  area: "Admin",
};

export const CONVERSATIONS: Conversation[] = [
  {
    conversation_id: "c_001",
    job: { title: "Senior Podcast Editor" },
    participants: [
      ME,
      { user_id: "t_164714", display_name: "Mya Walsh", avatar_fallback: "MW", area: "Podcast Producer" },
    ],
    last_message: { body: "Yes — I can start Monday. Sending my rate card now.", created_at: "2026-10-01T09:12:00Z" },
    unread_count: 2,
  },
  {
    conversation_id: "c_002",
    job: { title: "Sound Designer" },
    participants: [
      ME,
      { user_id: "t_100241", display_name: "Maya Chen", avatar_fallback: "MC", area: "Sound Designer" },
    ],
    last_message: { body: "Here are three concepts for the show refresh.", created_at: "2026-09-30T17:41:00Z" },
    unread_count: 0,
  },
  {
    conversation_id: "c_003",
    job: null,
    participants: [
      ME,
      { user_id: "t_132554", display_name: "Owen Park", avatar_fallback: "OP", area: "Show Notes Writer" },
    ],
    last_message: { body: "Thanks for the intro — happy to chat this week.", created_at: "2026-09-29T12:05:00Z" },
    unread_count: 1,
  },
  {
    conversation_id: "c_004",
    job: { title: "Podcast Editor (Gaming)" },
    participants: [
      ME,
      { user_id: "t_119486", display_name: "June Alvarez", avatar_fallback: "JA", area: "Podcast Editor" },
    ],
    last_message: { body: "Sent the revised cut with the new intro.", created_at: "2026-09-28T08:20:00Z" },
    unread_count: 0,
  },
];

export const MESSAGES: Message[] = [
  { message_id: "m_001", conversation_id: "c_001", sender_id: ADMIN_USER.user_id, body: "Hi Mya — your reel for the finance series stood out. Are you open to a weekly retainer?", created_at: "2026-09-30T14:02:00Z", read_at: "2026-09-30T14:20:00Z" },
  { message_id: "m_002", conversation_id: "c_001", sender_id: "t_164714", body: "Thanks! Yes, open to it. What's the weekly volume?", created_at: "2026-09-30T14:35:00Z", read_at: "2026-09-30T14:40:00Z" },
  { message_id: "m_003", conversation_id: "c_001", sender_id: ADMIN_USER.user_id, body: "Two full episodes and four clips per week.", created_at: "2026-09-30T15:01:00Z", read_at: "2026-09-30T15:10:00Z" },
  { message_id: "m_004", conversation_id: "c_001", sender_id: "t_164714", body: "That works. My rate is $48/hr for retainers.", created_at: "2026-10-01T09:05:00Z", read_at: null },
  { message_id: "m_005", conversation_id: "c_001", sender_id: "t_164714", body: "Yes — I can start Monday. Sending my rate card now.", created_at: "2026-10-01T09:12:00Z", read_at: null },
  { message_id: "m_006", conversation_id: "c_002", sender_id: "t_100241", body: "Here are three concepts for the show refresh.", created_at: "2026-09-30T17:41:00Z", read_at: "2026-09-30T18:00:00Z" },
  { message_id: "m_007", conversation_id: "c_003", sender_id: "t_132554", body: "Thanks for the intro — happy to chat this week.", created_at: "2026-09-29T12:05:00Z", read_at: null },
  { message_id: "m_008", conversation_id: "c_004", sender_id: "t_119486", body: "Sent the revised cut with the new intro.", created_at: "2026-09-28T08:20:00Z", read_at: "2026-09-28T09:00:00Z" },
];

export function listConversations(): Conversation[] {
  return CONVERSATIONS;
}

export function getConversation(conversationId: string): Conversation | undefined {
  return CONVERSATIONS.find((conversation) => conversation.conversation_id === conversationId);
}

export function getMessages(conversationId: string): Message[] {
  return MESSAGES.filter((message) => message.conversation_id === conversationId);
}

/** The participant who is not the signed-in user (recipient of the thread header). */
export function otherParticipant(conversation: Conversation): ConversationParticipant {
  return (
    conversation.participants.find((p) => p.user_id !== ADMIN_USER.user_id) ??
    conversation.participants[0]
  );
}

/* -------------------------- Notifications -------------------------- */

export interface Notification {
  id: string;
  type: "message" | "application" | "job" | "payment" | "system";
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n_001", type: "message", title: "New message from Mya Walsh", body: "Yes — I can start Monday. Sending my rate card now.", created_at: "2026-10-01T09:12:00Z", read: false },
  { id: "n_002", type: "application", title: "New applicant for Senior Podcast Editor", body: "Owen Park applied. Rating 4.0.", created_at: "2026-10-01T08:30:00Z", read: false },
  { id: "n_003", type: "payment", title: "Payout completed", body: "$1,240 was sent to your payout method.", created_at: "2026-09-30T16:00:00Z", read: true },
  { id: "n_004", type: "job", title: "Your job post is live", body: "\"Senior Podcast Editor\" is now accepting applicants.", created_at: "2026-09-29T10:15:00Z", read: true },
  { id: "n_005", type: "system", title: "Catalog refreshed", body: "Talent data was re-synced. Filters reflect the latest snapshot.", created_at: "2026-09-28T06:00:00Z", read: true },
  { id: "n_006", type: "application", title: "Application moved to Offer", body: "Mya Walsh — Senior Podcast Editor.", created_at: "2026-09-27T14:20:00Z", read: true },
];

export function listNotifications(): Notification[] {
  return NOTIFICATIONS;
}

/* ---------------------------- Referrals ---------------------------- */

export interface Referral {
  referral_id: string;
  referred_email: string;
  status: "pending" | "joined" | "rewarded";
  reward: number;
  created_at: string;
}

export const REFERRALS: Referral[] = [
  { referral_id: "r_001", referred_email: "sam@studio.example", status: "rewarded", reward: 50, created_at: "2026-08-10T09:00:00Z" },
  { referral_id: "r_002", referred_email: "lee@network.example", status: "joined", reward: 0, created_at: "2026-09-02T12:30:00Z" },
  { referral_id: "r_003", referred_email: "dana@studio.example", status: "pending", reward: 0, created_at: "2026-09-20T15:45:00Z" },
];

export function listReferrals(): Referral[] {
  return REFERRALS;
}
