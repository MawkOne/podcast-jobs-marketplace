#!/usr/bin/env node
/**
 * Podwires scraper — enumerates public content via the WordPress sitemaps and
 * extracts structured records. Node 18+, no dependencies.
 *
 * Legality / etiquette:
 *   - robots.txt for podwires.com explicitly ALLOWS AI crawlers and only
 *     disallows dashboards, auth, /wp-json, and /wp-admin — this script
 *     touches none of those.
 *   - Rate-limited by default (1.2s between requests) with retry/backoff.
 *   - Resumable: already-fetched URLs are skipped, so re-running continues.
 *   - Check the site's Terms & Conditions before any bulk run.
 *
 * Usage:
 *   node scripts/scrape-podwires.mjs --types jobs,members --limit 25
 *   node scripts/scrape-podwires.mjs --types all --out data/podwires
 *   node scripts/scrape-podwires.mjs --taxonomies        # taxonomy terms only
 *
 * Output (JSONL, one record per line):
 *   <out>/jobs.jsonl  <out>/members.jsonl  <out>/projects.jsonl
 *   <out>/events.jsonl  <out>/posts.jsonl
 *   <out>/taxonomy.json  <out>/summary.json
 */

import { mkdir, readFile, appendFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE = "https://podwires.com";
const UA = "Mozilla/5.0 (compatible; podwires-research; +https://example.com/bot)";

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const TYPES = (flag("types", "all") === "all"
  ? ["jobs", "members", "projects", "events", "posts"]
  : flag("types", "").split(",")
).filter(Boolean);
const LIMIT = Number(flag("limit", "0")) || 0; // 0 = no limit
const DELAY_MS = Number(flag("delay", "1200"));
const OUT = path.resolve(flag("out", "data/podwires"));
const TAXONOMIES_ONLY = has("taxonomies");

const SITEMAP = {
  jobs: "posts-job_listing-1",
  members: "posts-member-1",
  projects: "posts-producer_project-1",
  events: "posts-podcast_event-1",
  posts: "posts-post-1",
};
const TAXONOMY_SITEMAPS = {
  skills: "taxonomies-member_skill-1",
  job_categories: "taxonomies-job_category-1",
  job_types: "taxonomies-job_type-1",
  member_types: "taxonomies-member_type-1",
  blog_categories: "taxonomies-category-1",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, attempt = 1) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    if (attempt <= 3 && res.status >= 500) {
      await sleep(DELAY_MS * 2 ** attempt);
      return fetchText(url, attempt + 1);
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

async function sitemapUrls(name, limit = 0) {
  const xml = await fetchText(`${BASE}/wp-sitemap-${name}.xml`);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !u.includes("wp-sitemap"));
  return limit ? urls.slice(0, limit) : urls;
}

// ── extraction ──────────────────────────────────────────────────────────────
const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&#8217;/g, "\u2019").replace(/&#8211;/g, "\u2013")
    .replace(/&#8230;/g, "\u2026").replace(/&quot;/g, '"').replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

const meta = (html, prop, attr = "property") => {
  const m = html.match(new RegExp(`${attr}="${prop}" content="([^"]*)"`));
  return m ? decode(m[1]) : null;
};

const textLines = (html) => {
  const body = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  return decode(body.replace(/<[^>]+>/g, "\n"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
};

const after = (lines, label) => {
  const i = lines.indexOf(label);
  return i >= 0 && lines[i + 1] ? lines[i + 1].slice(0, 300) : null;
};

function parseJob(html, url) {
  const t = textLines(html);
  return {
    url,
    title: meta(html, "og:title"),
    description: meta(html, "og:description"),
    category: after(t, "Category"),
    job_type: after(t, "Job Type"),
    posted: after(t, "Posted"),
    deadline: after(t, "Deadline"),
    budget: (html.match(/\$[0-9][0-9,]{1,7}(?:\s*[-–]\s*\$?[0-9][0-9,]{1,7})?/) || [null])[0],
    client_id_verified: !/identity not verified/i.test(html),
  };
}

function parseMember(html, url) {
  return {
    url,
    name: (meta(html, "og:title") || "").split("|")[0].trim() || null,
    headline: meta(html, "og:description"),
    image: meta(html, "og:image") || meta(html, "twitter:image", "name"),
    id_verified: !/ID not verified/i.test(html),
    available: /available/i.test(html),
  };
}

function parseGeneric(html, url, labels) {
  const t = textLines(html);
  const rec = { url, title: meta(html, "og:title"), description: meta(html, "og:description") };
  for (const label of labels) rec[label.toLowerCase().replace(/\s+/g, "_")] = after(t, label);
  const date = html.match(
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}\b/,
  );
  if (date) rec.date = date[0];
  return rec;
}

const PARSERS = {
  jobs: parseJob,
  members: parseMember,
  projects: (h, u) => parseGeneric(h, u, ["Freelancer", "Category", "Client"]),
  events: (h, u) => parseGeneric(h, u, ["Location", "Organizer", "Category"]),
  posts: (h, u) => parseGeneric(h, u, ["Category", "Author"]),
};

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  await mkdir(OUT, { recursive: true });
  const summary = { startedAt: new Date().toISOString(), types: {}, taxonomies: {} };

  // Taxonomies: slug lists from the taxonomy sitemaps (no page fetches needed)
  const tax = {};
  for (const [key, sm] of Object.entries(TAXONOMY_SITEMAPS)) {
    try {
      const urls = await sitemapUrls(sm);
      tax[key] = urls.map((u) => {
        const slug = u.replace(/\/$/, "").split("/").pop();
        const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        return { slug, name };
      });
      summary.taxonomies[key] = tax[key].length;
      await sleep(DELAY_MS);
    } catch (e) {
      console.warn(`taxonomy ${key}: ${e.message}`);
    }
  }
  await writeFile(path.join(OUT, "taxonomy.json"), JSON.stringify(tax, null, 1));
  console.log(`taxonomy.json written (${Object.values(summary.taxonomies).reduce((a, b) => a + b, 0)} terms)`);
  if (TAXONOMIES_ONLY) {
    await writeFile(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 1));
    return;
  }

  for (const type of TYPES) {
    const sm = SITEMAP[type];
    if (!sm) {
      console.warn(`unknown type: ${type}`);
      continue;
    }
    const file = path.join(OUT, `${type}.jsonl`);
    const seen = new Set();
    if (existsSync(file)) {
      for (const line of (await readFile(file, "utf8")).split("\n")) {
        if (line.trim()) {
          try {
            seen.add(JSON.parse(line).url);
          } catch {
            /* skip malformed */
          }
        }
      }
    }

    let urls;
    try {
      urls = await sitemapUrls(sm, LIMIT);
    } catch (e) {
      console.warn(`${type}: sitemap failed — ${e.message}`);
      continue;
    }

    let fetched = 0;
    let skipped = 0;
    for (const url of urls) {
      if (seen.has(url)) {
        skipped++;
        continue;
      }
      try {
        const html = await fetchText(url);
        await appendFile(file, JSON.stringify(PARSERS[type](html, url)) + "\n");
        fetched++;
        if (fetched % 25 === 0) console.log(`  ${type}: ${fetched} fetched`);
      } catch (e) {
        console.warn(`  ${type}: ${url} — ${e.message}`);
      }
      await sleep(DELAY_MS);
    }
    summary.types[type] = { total_in_sitemap: urls.length, fetched, skipped_resumed: skipped };
    console.log(`${type}: fetched ${fetched}, skipped ${skipped} (resumed)`);
  }

  summary.finishedAt = new Date().toISOString();
  await writeFile(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 1));
  console.log(`\nOutput: ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
