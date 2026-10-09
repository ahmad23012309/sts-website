/**
 * Generated file. Do not edit by hand.
 *
 * `npm run sync:settings` fetches the backend's settings endpoint and rewrites
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

export const cmsSettings: CmsSettings | null = null;

/** When the values above were taken from the backend. */
export const cmsSettingsSyncedAt: string | null = null;
