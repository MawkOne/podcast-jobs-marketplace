#!/usr/bin/env node
/**
 * Download the scraped Podwires member photos into theme/public/avatars/ and
 * emit a small seed manifest (data/podwires/avatars.json) mapping each member to
 * a local /avatars/<file> path.
 *
 * These are real people's photos pulled from a public marketplace listing — use
 * them for LOCAL DESIGN PREVIEW ONLY. Check licensing/T&Cs before shipping, and
 * keep the files out of version control if in doubt.
 *
 *   node scripts/fetch-avatars.mjs [--limit 40]
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const OUT = path.join(ROOT, "theme/public/avatars");
const SRC = path.join(ROOT, "data/podwires/members.jsonl");
const UA = "Mozilla/5.0 (compatible; podwires-research; +https://example.com/bot)";

const args = process.argv.slice(2);
const LIMIT = Number(args[args.indexOf("--limit") + 1]) || 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT, { recursive: true });
  const rows = (await readFile(SRC, "utf8"))
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const manifest = [];
  for (const row of rows) {
    if (LIMIT && manifest.length >= LIMIT) break;
    if (!row.image || !row.url) continue;

    const slug = row.url.replace(/\/$/, "").split("/").pop();
    const ext = (row.image.match(/\.(jpe?g|png|webp)(?:$|\?)/i)?.[1] ?? "jpg").toLowerCase();
    const file = `${slug}.${ext}`;
    const dest = path.join(OUT, file);

    try {
      if (!existsSync(dest)) {
        const res = await fetch(row.image, { headers: { "User-Agent": UA } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        await sleep(300);
      }
      manifest.push({
        slug,
        name: row.name,
        headline: row.headline,
        image: `/avatars/${file}`,
        source_url: row.url,
      });
      console.log(`  ok  ${file}`);
    } catch (e) {
      console.warn(`  skip ${slug}: ${e.message}`);
    }
  }

  await writeFile(path.join(ROOT, "data/podwires/avatars.json"), JSON.stringify(manifest, null, 1));
  console.log(`\n${manifest.length} avatars → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
