#!/usr/bin/env node
/**
 * Turn the scraped member manifest (data/podwires/avatars.json) into
 * `talent({...})` seed rows for lib/data.ts, picking a balanced set across the
 * role taxonomy and inferring the role from each member's headline.
 *
 *   node scripts/gen-talent-rows.mjs [--per-role 2]
 *
 * Writes data/podwires/talent-rows.ts.txt (a paste-ready snippet).
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const SRC = path.join(ROOT, "data/podwires/avatars.json");
const OUT = path.join(ROOT, "data/podwires/talent-rows.ts.txt");

const args = process.argv.slice(2);
const PER_ROLE = Number(args[args.indexOf("--per-role") + 1]) || 2;

const RULES = [
  { role: "Podcast Editor", re: /\b(edit|editor|editing)/i },
  { role: "Audio Engineer", re: /\b(engineer|mixing|mastering|loudness)/i },
  { role: "Sound Designer", re: /\b(sound design|sound designer|sound)/i },
  { role: "Show Notes Writer", re: /\b(writ|writer|script|show notes|copywrit)/i },
  { role: "Podcast Strategist", re: /\b(strateg|growth|marketing|audience|monetiz)/i },
  { role: "Podcast Consultant", re: /\b(consult|coach|advisor)/i },
  { role: "Podcast Manager", re: /\b(manager|management|launch|distribution)/i },
  { role: "Podcast Producer", re: /\b(produc)/i },
];

const inferRole = (text) => RULES.find((rule) => rule.re.test(text))?.role ?? "Podcast Producer";

const countryOf = (headline) => {
  const m = (headline || "").match(/Based in ([^.,]+)/);
  return m ? m[1].trim() : null;
};

const clean = (headline) =>
  (headline || "").replace(/ · Based in .*/i, "").replace(/\s+/g, " ").trim();

const esc = (s) => JSON.stringify(s);

const members = JSON.parse(await readFile(SRC, "utf8"));
const byRole = new Map();
for (const m of members) {
  if (!m.name) continue;
  const role = inferRole(`${m.headline || ""}`);
  const list = byRole.get(role) ?? [];
  if (list.length < PER_ROLE) list.push({ ...m, role });
  byRole.set(role, list);
}

const rows = [];
let id = 300001;
for (const [role, list] of byRole) {
  for (const m of list) {
    const country = countryOf(m.headline);
    const rate = 28 + ((id * 7) % 40);
    const listens = (120000 + ((id * 911) % 9000000)).toLocaleString("en-US").replace(/,/g, "_");
    const block = [
      `  // ${role} — photo scraped from podwires.com (${m.source_url})`,
      `  talent({`,
      `    user_id: ${id},`,
      `    name: ${esc(m.name)},`,
      `    functional_area: ${esc(role)},`,
      `    image: ${esc(m.image)},`,
      country ? `    country: ${esc(country)},` : null,
      `    about: ${esc(clean(m.headline) || `${role} on the Podwave catalog.`)},`,
      `    hire_me: true,`,
      `    hire_me_availability_project_based: true,`,
      `    hire_me_location_remote: true,`,
      `    salary_per_hour: ${rate},`,
      `    display_salary: "true",`,
      `    portfolio_count: ${2 + (id % 12)},`,
      `    episode_count: ${40 + ((id * 13) % 400)},`,
      `    total_listens: ${listens},`,
      `    total_reviews: ${2000 + ((id * 37) % 90000)},`,
      `    verified: true,`,
      `    created_at: "2025-04-10T00:00:00Z",`,
      `    last_activity_at: "2026-10-06T09:00:00Z",`,
      `  }),`,
    ].filter((line) => line !== null);
    rows.push(...block);
    id++;
  }
}

await writeFile(OUT, rows.join("\n") + "\n");
console.log(`${rows.filter((r) => r.trimStart().startsWith("talent({")).length} rows → ${OUT}`);
for (const [role, list] of byRole) console.log(`  ${role}: ${list.map((m) => m.name).join(", ")}`);
