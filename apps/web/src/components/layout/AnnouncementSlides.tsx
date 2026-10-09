"use client";

import { useEffect, useState } from "react";

export interface Announcement {
  key: string;
  label: string;
  value: string;
}

/**
 * The announcement bar, as a slideshow.
 *
 * One item at a time, changing every few seconds. It pauses while the pointer
 * is over it or anything inside has focus, and under prefers-reduced-motion it
 * stops rotating and lays every item out at once, so nothing is hidden from
 * someone who cannot watch it cycle.
 */
export function AnnouncementSlides({ items }: { items: Announcement[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [staticList, setStaticList] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStaticList(query.matches);
    const onChange = () => setStaticList(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || staticList || items.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % items.length),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [paused, staticList, items.length]);

  if (items.length === 0) return null;

  if (staticList) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4">
        {items.map((item) => (
          <li key={item.key} className="font-ui text-xs text-ink">
            {item.label} <strong className="font-semibold">{item.value}</strong>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="relative h-5 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {items.map((item, position) => (
        <p
          key={item.key}
          aria-hidden={position !== index}
          className={`absolute inset-0 flex items-center justify-center gap-2 px-4 font-ui text-xs whitespace-nowrap text-ink transition-all duration-500 ${
            position === index
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <span>{item.label}</span>
          <strong className="font-semibold">{item.value}</strong>
        </p>
      ))}
    </div>
  );
}
