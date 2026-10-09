"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityResult } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Month view of a vehicle's availability.
 *
 * When no booking system is connected the grid is shown but not coloured in,
 * and says so. Drawing every day as free would be a claim we cannot make, and
 * a visitor who books against it finds out the hard way.
 */
export function AvailabilityCalendar({
  availability,
}: {
  availability: AvailabilityResult;
}) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const [offset, setOffset] = useState(0);

  const viewed = new Date(today.getFullYear(), today.getMonth() + offset, 1);

  const blocked = useMemo(() => {
    const set = new Set<string>();
    for (const block of availability.blocks) {
      const cursor = new Date(block.from);
      const end = new Date(block.to);
      while (cursor <= end) {
        set.add(toKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return set;
  }, [availability.blocks]);

  const days: (Date | null)[] = [];
  // Monday-first grid.
  const leading = (new Date(viewed).getDay() + 6) % 7;
  for (let i = 0; i < leading; i += 1) days.push(null);

  const daysInMonth = new Date(
    viewed.getFullYear(),
    viewed.getMonth() + 1,
    0,
  ).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(viewed.getFullYear(), viewed.getMonth(), day));
  }

  const connected = availability.source !== "none";

  return (
    <div className="rounded-card border border-edge bg-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl">Availability</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((value) => Math.max(0, value - 1))}
            disabled={offset === 0}
            aria-label="Previous month"
            className="grid h-8 w-8 place-items-center rounded-full border border-edge text-fg-muted transition-colors hover:border-red hover:text-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setOffset((value) => Math.min(5, value + 1))}
            disabled={offset === 5}
            aria-label="Next month"
            className="grid h-8 w-8 place-items-center rounded-full border border-edge text-fg-muted transition-colors hover:border-red hover:text-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <p className="mt-1 font-ui text-sm text-fg-muted">
        {viewed.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
      </p>

      <div className="mt-5 grid grid-cols-7 gap-1">
        {weekdays.map((weekday) => (
          <span
            key={weekday}
            className="pb-1 text-center font-ui text-[0.625rem] font-semibold tracking-[0.08em] text-fg-faint uppercase"
          >
            {weekday}
          </span>
        ))}

        {days.map((date, index) => {
          if (!date) return <span key={`pad-${index}`} />;
          const past = date < today;
          const isBlocked = blocked.has(toKey(date));

          return (
            <span
              key={toKey(date)}
              className={cn(
                "tabular grid h-9 place-items-center rounded-[0.375rem] text-sm",
                past && "text-fg-faint/50",
                !past && !connected && "bg-page-alt text-fg-muted",
                !past && connected && isBlocked && "bg-booked/15 text-booked",
                !past &&
                  connected &&
                  !isBlocked &&
                  "bg-available/15 text-available",
              )}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>

      {connected ? (
        <ul className="mt-5 flex flex-wrap items-center gap-4 border-t border-edge pt-4 font-ui text-xs text-fg-muted">
          <li className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-[0.2rem] bg-available/40" />
            Available
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-[0.2rem] bg-booked/40" />
            Booked
          </li>
        </ul>
      ) : (
        <p className="mt-5 border-t border-edge pt-4 font-ui text-xs text-fg-muted">
          Live availability is not connected yet, so no day is marked free or
          taken. Send a request and we confirm the dates for you.
        </p>
      )}
    </div>
  );
}
