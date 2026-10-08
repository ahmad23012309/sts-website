import type { SketchfabModel } from "./types";

/**
 * Lives outside the viewer component because both server components and the
 * client viewer need it, and a function exported from a client module cannot
 * be called during rendering on the server.
 */
export function hasModel(
  value: SketchfabModel | null,
): value is SketchfabModel {
  return value !== null && value.uid.length > 0;
}
