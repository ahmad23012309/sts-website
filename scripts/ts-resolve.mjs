/**
 * Lets Node import the website's TypeScript modules directly.
 *
 * Those modules are written for a bundler, so they import each other without a
 * file extension and through the "@/" alias. Node resolves neither. This hook
 * fills both gaps so a build script can read the fixtures as the source of
 * truth instead of a copy of them going stale.
 */

import { register } from "node:module";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const SRC = new URL("../apps/web/src/", import.meta.url);

export async function resolve(specifier, context, next) {
  let target = specifier;

  if (target.startsWith("@/")) {
    target = new URL(target.slice(2), SRC).href;
  }

  // Only real module extensions count. A file named settings.generated.ts is
  // imported as "./settings.generated", which a generic "has a dot" test would
  // mistake for an extension and refuse to resolve.
  const hasExtension = /\.(ts|tsx|js|mjs|cjs|json)$/i.test(target);
  if (!hasExtension) {
    const base = target.startsWith("file:")
      ? new URL(target)
      : new URL(target, context.parentURL ?? pathToFileURL(process.cwd()));

    for (const candidate of [".ts", ".tsx", "/index.ts"]) {
      const url = new URL(base.href + candidate);
      if (existsSync(url)) return next(url.href, context);
    }
  }

  return next(target, context);
}

register(import.meta.url, import.meta.url);
