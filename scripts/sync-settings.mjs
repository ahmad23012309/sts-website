#!/usr/bin/env node
/**
 * Pulls the backend's settings into the frontend.
 *
 * Contact details, opening hours, social links, the offer and the headline
 * claims are read by components that render in the browser and so cannot await
 * a fetch. This script fetches them once and writes them into
 * apps/web/src/lib/cms/settings.generated.ts, where lib/site.ts lays them over
 * its defaults.
 *
 * It runs before the build. If the backend is unreachable the build continues
 * on the committed defaults rather than failing, because a site that is one
 * phone number out of date is better than a site that will not deploy.
 *
 *   WORDPRESS_API_URL=https://cms.example.com npm run sync:settings
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "apps",
  "web",
  "src",
  "lib",
  "cms",
  "settings.generated.ts",
);

const HEADER = `/**
 * Generated file. Do not edit by hand.
 *
 * \`npm run sync:settings\` fetches the backend's settings endpoint and rewrites
 * this file. It is committed with a null export so the site builds, and serves
 * the values in lib/site.ts, when no backend is reachable.
 *
 * Settings live here rather than behind an async read because contact details,
 * opening hours, social links and the offer are imported by components that
 * render on the client and cannot await a fetch. Everything that changes often
 * enough to need live reads -- rates, fuel prices, vehicles, availability --
 * goes through the adapter in ./index.ts instead and is never baked in here.
 */

import type { CmsSettings } from "./settings-shape";
`;

/** Only these groups are baked in. The rest are read live by the adapter. */
const GROUPS = [
  "contact",
  "hours",
  "social",
  "offer",
  "claims",
  "terms",
  "payments",
];

async function write(settings, syncedAt) {
  const body =
    settings === null
      ? "export const cmsSettings: CmsSettings | null = null;"
      : `export const cmsSettings: CmsSettings | null = ${JSON.stringify(
          settings,
          null,
          2,
        )};`;

  const stamp =
    syncedAt === null
      ? "export const cmsSettingsSyncedAt: string | null = null;"
      : `export const cmsSettingsSyncedAt: string | null = ${JSON.stringify(
          syncedAt,
        )};`;

  await writeFile(
    OUT,
    `${HEADER}\n${body}\n\n/** When the values above were taken from the backend. */\n${stamp}\n`,
    "utf8",
  );
}

async function main() {
  const base = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");

  if (!base) {
    console.log(
      "[settings] WORDPRESS_API_URL is not set; keeping the defaults in lib/site.ts.",
    );
    return;
  }

  const url = `${base}/wp-json/sts/v1/settings`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  let payload;
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`the backend returned ${response.status}`);
    }

    payload = await response.json();
  } catch (error) {
    // Deliberately not a failure: see the note at the top of this file.
    console.warn(
      `[settings] could not read ${url} (${
        error instanceof Error ? error.message : error
      }); building on the defaults in lib/site.ts.`,
    );
    return;
  } finally {
    clearTimeout(timer);
  }

  const settings = {};
  for (const group of GROUPS) {
    const value = payload?.[group];
    // An array here means the backend had nothing in the group; keeping it
    // would write a [] into a file typed as an object.
    if (value && typeof value === "object" && !Array.isArray(value)) {
      settings[group] = value;
    }
  }

  if (Object.keys(settings).length === 0) {
    console.warn(
      "[settings] the backend sent nothing usable; building on the defaults.",
    );
    return;
  }

  await write(settings, new Date().toISOString());
  console.log(
    `[settings] wrote ${Object.keys(settings).join(", ")} from ${base}.`,
  );
}

main().catch((error) => {
  console.error("[settings]", error);
  process.exitCode = 1;
});
