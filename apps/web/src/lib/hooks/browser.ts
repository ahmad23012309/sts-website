"use client";

import { useSyncExternalStore } from "react";

/**
 * Hooks that read values owned by the browser.
 *
 * Each one goes through useSyncExternalStore rather than reading the value in
 * an effect and calling setState. Both approaches end up at the same answer,
 * but setState inside an effect renders the component a second time on every
 * mount, and on a page with as many of these as the homepage has that is a
 * visible flash of the wrong state. useSyncExternalStore also takes a separate
 * server snapshot, so the first client render matches the server's HTML and
 * hydration stays quiet.
 */

/** Subscribing to nothing: the value cannot change after the page loads. */
const neverChanges = () => () => {};

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // The server cannot know, and motion is the design's default.
    () => false,
  );
}

export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    (notify) => {
      window.addEventListener("scroll", notify, { passive: true });
      return () => window.removeEventListener("scroll", notify);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

/**
 * True where the browser has no IntersectionObserver.
 *
 * Reveal animations hide their content until it scrolls into view, so a browser
 * that cannot report that has to be shown everything at once instead. Every
 * current browser supports it; this exists so an old one is not left with a
 * blank page.
 */
export function useLacksIntersectionObserver(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => typeof IntersectionObserver === "undefined",
    () => false,
  );
}
