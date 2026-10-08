#!/usr/bin/env node
/**
 * Finds candidate Sketchfab models for every vehicle in the fleet.
 *
 * Reads the fleet from the site's own fixtures so the two can never fall out of
 * step, queries the public Sketchfab search API, and writes the candidates to
 * assets/data/sketchfab-candidates.json for a human to choose from.
 *
 * Nothing is selected automatically. Model quality varies enormously and a
 * wrong body shape on a vehicle page is worse than no model at all.
 *
 *   node scripts/sketchfab-search.mjs
 *   node scripts/sketchfab-search.mjs --only toyota-coaster
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturesPath = path.join(root, "apps/web/src/lib/cms/fixtures.ts");
const outputPath = path.join(root, "assets/data/sketchfab-candidates.json");

const API = "https://api.sketchfab.com/v3/search";
const PER_VEHICLE = 8;

/** Pulls make/model/variant/slug out of the fixtures without compiling them. */
async function readFleet() {
  const source = await readFile(fixturesPath, "utf8");
  const blocks = source.split("    id: \"v-").slice(1);
  return blocks.map((block) => {
    const field = (name) =>
      block.match(new RegExp(`${name}: "([^"]*)"`))?.[1] ?? "";
    return {
      slug: field("slug"),
      make: field("make"),
      model: field("model"),
      variant: field("variant"),
      year: Number(block.match(/year: (\d+)/)?.[1] ?? 0),
    };
  });
}

async function search(query) {
  const url = new URL(API);
  url.searchParams.set("type", "models");
  url.searchParams.set("q", query);
  url.searchParams.set("sort_by", "-likeCount");
  url.searchParams.set("count", String(PER_VEHICLE));

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Sketchfab search returned ${response.status}`);
  }

  const body = await response.json();
  return (body.results ?? []).map((result) => ({
    uid: result.uid,
    title: result.name,
    authorName: result.user?.displayName ?? result.user?.username ?? "Unknown",
    authorUrl: result.user?.profileUrl ?? "",
    modelUrl: result.viewerUrl ?? `https://sketchfab.com/3d-models/${result.uid}`,
    license: result.license?.label ?? "see model page",
    faceCount: result.faceCount ?? null,
    likes: result.likeCount ?? 0,
    thumbnail: result.thumbnails?.images?.at(-1)?.url ?? null,
  }));
}

async function main() {
  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex === -1 ? null : process.argv[onlyIndex + 1];

  const fleet = await readFleet();
  const targets = only ? fleet.filter((v) => v.slug === only) : fleet;

  if (targets.length === 0) {
    console.error(only ? `No vehicle with slug "${only}"` : "No vehicles found");
    process.exitCode = 1;
    return;
  }

  const output = {};
  for (const vehicle of targets) {
    // Two passes: the exact variant first, then the bare model, because a
    // market-specific trim rarely exists but the body usually does.
    const queries = [
      `${vehicle.make} ${vehicle.model} ${vehicle.variant}`,
      `${vehicle.make} ${vehicle.model}`,
    ];

    const seen = new Set();
    const candidates = [];

    for (const query of queries) {
      try {
        for (const candidate of await search(query)) {
          if (seen.has(candidate.uid)) continue;
          seen.add(candidate.uid);
          candidates.push({ ...candidate, matchedQuery: query });
        }
      } catch (error) {
        console.error(`  ${vehicle.slug}: ${query} failed — ${error.message}`);
      }
    }

    output[vehicle.slug] = {
      vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.variant} (${vehicle.year})`,
      candidates,
    };

    console.log(
      `${vehicle.slug.padEnd(26)} ${String(candidates.length).padStart(2)} candidates`,
    );
  }

  await writeFile(outputPath, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`\nWritten to ${path.relative(root, outputPath)}`);
}

await main();
