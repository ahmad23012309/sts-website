import type { SketchfabModel } from "./types";

/**
 * Sketchfab models, keyed by vehicle slug.
 *
 * Kept apart from the fleet data so that adding a model never touches the
 * vehicle record, and so the whole 3D programme can be reviewed in one file.
 *
 * Entries are written by `npm run sketchfab:apply`, which reads the links in
 * assets/data/sketchfab-models.json and fetches each model's title, author and
 * licence from Sketchfab. They can also be filled in by hand.
 *
 * A vehicle missing from this map simply shows its photographs instead.
 */
export const models3d: Record<string, SketchfabModel> = {};
