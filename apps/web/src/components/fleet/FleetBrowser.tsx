"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Vehicle, VehicleCategory } from "@/lib/cms/types";
import {
  categoryLabels,
  fuelLabels,
  orderedCategories,
  transmissionLabels,
} from "@/lib/vehicleDisplay";
import { cn, formatPkr } from "@/lib/utils";

type SortKey = "price-asc" | "price-desc" | "seats-desc" | "newest";

const seatBands = [
  { value: "2-5", label: "2 to 5", min: 2, max: 5 },
  { value: "6-9", label: "6 to 9", min: 6, max: 9 },
  { value: "10-15", label: "10 to 15", min: 10, max: 15 },
  { value: "16+", label: "16 and above", min: 16, max: Infinity },
];

const sorts: { value: SortKey; label: string }[] = [
  { value: "price-asc", label: "Price, lowest first" },
  { value: "price-desc", label: "Price, highest first" },
  { value: "seats-desc", label: "Most seats" },
  { value: "newest", label: "Newest" },
];

/**
 * Filters are held in the URL rather than in component state, so a filtered
 * view can be linked, bookmarked and indexed, and the back button behaves the
 * way a visitor expects.
 */
export function FleetBrowser({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * The filter state lives in the URL so a filtered view can be shared and
   * indexed. Reading it through the query string rather than the hook's object
   * keeps a stable value to key the filtering below on: the hook returns a new
   * object on every render, which would re-sort the whole fleet each time.
   */
  const query = params.toString();

  const selected = useMemo(() => {
    const current = new URLSearchParams(query);
    return {
      category: current.getAll("category"),
      seats: current.getAll("seats"),
      transmission: current.getAll("transmission"),
      fuel: current.getAll("fuel"),
      sort: (current.get("sort") as SortKey | null) ?? "price-asc",
    };
  }, [query]);

  const activeCount =
    selected.category.length +
    selected.seats.length +
    selected.transmission.length +
    selected.fuel.length;

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    const current = next.getAll(key);
    next.delete(key);
    for (const item of current) {
      if (item !== value) next.append(key, item);
    }
    if (!current.includes(value)) next.append(key, value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  const availableCategories = useMemo(
    () =>
      orderedCategories.filter((category) =>
        vehicles.some((vehicle) => vehicle.category === category),
      ),
    [vehicles],
  );

  const results = useMemo(() => {
    const filtered = vehicles.filter((vehicle) => {
      if (
        selected.category.length > 0 &&
        !selected.category.includes(vehicle.category)
      ) {
        return false;
      }
      if (selected.seats.length > 0) {
        const inBand = seatBands.some(
          (band) =>
            selected.seats.includes(band.value) &&
            vehicle.specs.seats >= band.min &&
            vehicle.specs.seats <= band.max,
        );
        if (!inBand) return false;
      }
      if (
        selected.transmission.length > 0 &&
        !selected.transmission.includes(vehicle.specs.transmission)
      ) {
        return false;
      }
      if (
        selected.fuel.length > 0 &&
        !selected.fuel.includes(vehicle.specs.fuelType)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (selected.sort) {
      case "price-desc":
        sorted.sort((a, b) => b.rates.withFuelDaily - a.rates.withFuelDaily);
        break;
      case "seats-desc":
        sorted.sort((a, b) => b.specs.seats - a.specs.seats);
        break;
      case "newest":
        sorted.sort((a, b) => b.year - a.year);
        break;
      default:
        sorted.sort((a, b) => a.rates.withFuelDaily - b.rates.withFuelDaily);
    }
    return sorted;
  }, [vehicles, selected]);

  const totalUnits = results.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[17rem_1fr] lg:gap-12">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-center justify-between gap-4 border-b border-edge pb-4">
          <p className="inline-flex items-center gap-2 font-ui text-sm font-semibold text-fg">
            <SlidersHorizontal className="h-4 w-4 text-accent" aria-hidden />
            Filters
          </p>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 font-ui text-xs text-fg-muted underline underline-offset-4 hover:text-accent"
            >
              <X className="h-3 w-3" aria-hidden />
              Clear {activeCount}
            </button>
          ) : null}
        </div>

        <FilterGroup title="Vehicle type">
          {availableCategories.map((category) => (
            <Check
              key={category}
              label={categoryLabels[category as VehicleCategory]}
              count={countUnits(
                vehicles.filter((vehicle) => vehicle.category === category),
              )}
              checked={selected.category.includes(category)}
              onChange={() => toggle("category", category)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Seats">
          {seatBands.map((band) => (
            <Check
              key={band.value}
              label={band.label}
              count={countUnits(
                vehicles.filter(
                  (vehicle) =>
                    vehicle.specs.seats >= band.min &&
                    vehicle.specs.seats <= band.max,
                ),
              )}
              checked={selected.seats.includes(band.value)}
              onChange={() => toggle("seats", band.value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Transmission">
          {(["automatic", "manual"] as const).map((value) => (
            <Check
              key={value}
              label={transmissionLabels[value]}
              count={countUnits(
                vehicles.filter(
                  (vehicle) => vehicle.specs.transmission === value,
                ),
              )}
              checked={selected.transmission.includes(value)}
              onChange={() => toggle("transmission", value)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Fuel">
          {(["petrol", "diesel", "hybrid"] as const).map((value) => (
            <Check
              key={value}
              label={fuelLabels[value]}
              count={countUnits(
                vehicles.filter((vehicle) => vehicle.specs.fuelType === value),
              )}
              checked={selected.fuel.includes(value)}
              onChange={() => toggle("fuel", value)}
            />
          ))}
        </FilterGroup>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-edge pb-4">
          <p className="font-ui text-sm text-fg-muted">
            <span className="font-semibold text-fg">{results.length}</span>{" "}
            {results.length === 1 ? "model" : "models"}
            {results.length > 0 ? (
              <>
                {" "}
                &middot; {totalUnits} vehicles
                {results.length > 1 ? (
                  <>
                    {" "}
                    &middot; from{" "}
                    <span className="tabular text-fg">
                      {formatPkr(
                        Math.min(
                          ...results.map((item) => item.rates.withFuelDaily),
                        ),
                      )}
                    </span>{" "}
                    per day
                  </>
                ) : null}
              </>
            ) : null}
          </p>

          <label className="inline-flex items-center gap-2">
            <span className="font-ui text-xs tracking-[0.1em] text-fg-muted uppercase">
              Sort
            </span>
            <select
              value={selected.sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-10 rounded-[0.5rem] border border-edge bg-page-alt px-3 font-ui text-sm text-fg focus:border-red focus:outline-none"
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-12 rounded-card border border-edge bg-panel p-10 text-center">
            <h2 className="text-2xl">Nothing matches those filters</h2>
            <p className="mt-3 text-fg-muted">
              Try removing one, or tell us what you need and we will find it.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 font-ui text-sm font-semibold text-accent underline decoration-red/40 decoration-2 underline-offset-[6px] uppercase hover:decoration-red"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                priority={index < 3}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Filter counts are vehicles on the road, not models. */
function countUnits(list: Vehicle[]) {
  return list.reduce((sum, vehicle) => sum + vehicle.unitsInFleet, 0);
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-edge py-5">
      <h2 className="mb-3 font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
        {title}
      </h2>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function Check({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-center gap-3 py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[0.25rem] border transition-colors",
            checked ? "border-red bg-red" : "border-edge-strong bg-panel",
          )}
        >
          {checked ? (
            <svg viewBox="0 0 10 8" className="h-2.5 w-2.5" fill="none">
              <path
                d="M1 4.2 3.5 6.7 9 1.2"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span className="flex-1 font-ui text-sm text-fg">{label}</span>
        <span className="tabular font-ui text-xs text-fg-faint">{count}</span>
      </label>
    </li>
  );
}
