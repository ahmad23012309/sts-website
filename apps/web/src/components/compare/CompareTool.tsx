"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { VehicleMedia } from "@/components/vehicle/VehicleMedia";
import { ButtonLink } from "@/components/ui/Button";
import type { FuelRates, Vehicle, VehicleCategory } from "@/lib/cms/types";
import {
  categoryLabels,
  fuelLabels,
  orderedCategories,
  transmissionLabels,
  vehicleFullName,
} from "@/lib/vehicleDisplay";
import { cn, formatPkr, formatPkrPrecise } from "@/lib/utils";

const MAX = 3;

interface Row {
  label: string;
  values: string[];
  /** Lower is better, higher is better, or neither. */
  best?: "low" | "high";
  numbers?: number[];
}

/**
 * Compares vehicles of one class side by side.
 *
 * Comparison is restricted to a single class on purpose. A coaster against a
 * saloon produces a table full of differences that tell you nothing, because
 * nobody is choosing between them.
 */
export function CompareTool({
  vehicles,
  fuelRates,
}: {
  vehicles: Vehicle[];
  fuelRates: FuelRates;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const categories = useMemo(
    () =>
      orderedCategories.filter(
        (category) =>
          vehicles.filter((vehicle) => vehicle.category === category).length >=
          2,
      ),
    [vehicles],
  );

  const category =
    (params.get("category") as VehicleCategory | null) ?? categories[0] ?? "sedan";

  const inCategory = vehicles.filter((vehicle) => vehicle.category === category);

  const selectedSlugs = params.getAll("v").slice(0, MAX);
  const selected = selectedSlugs
    .map((slug) => inCategory.find((vehicle) => vehicle.slug === slug))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));

  const effective =
    selected.length > 0 ? selected : inCategory.slice(0, Math.min(2, inCategory.length));

  function update(next: URLSearchParams) {
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function setCategory(value: string) {
    const next = new URLSearchParams();
    next.set("category", value);
    update(next);
  }

  function toggle(slug: string) {
    const next = new URLSearchParams();
    next.set("category", category);
    const current = effective.map((vehicle) => vehicle.slug);
    const updated = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug].slice(0, MAX);
    for (const item of updated) next.append("v", item);
    update(next);
  }

  const fuelPriceFor = (vehicle: Vehicle) =>
    vehicle.specs.fuelType === "diesel" ? fuelRates.diesel : fuelRates.petrol;

  const rows: Row[] = useMemo(() => {
    if (effective.length === 0) return [];
    const perKm = effective.map(
      (v) => fuelPriceFor(v) / v.specs.mileageHighwayKmpl,
    );

    return [
      { label: "Variant", values: effective.map((v) => v.variant) },
      { label: "Year", values: effective.map((v) => String(v.year)) },
      {
        label: "In our fleet",
        values: effective.map((v) => String(v.unitsInFleet)),
        numbers: effective.map((v) => v.unitsInFleet),
        best: "high",
      },
      {
        label: "Seats",
        values: effective.map((v) => String(v.specs.seats)),
        numbers: effective.map((v) => v.specs.seats),
        best: "high",
      },
      {
        label: "Luggage",
        values: effective.map((v) => `${v.specs.luggage} bags`),
        numbers: effective.map((v) => v.specs.luggage),
        best: "high",
      },
      {
        label: "Transmission",
        values: effective.map((v) => transmissionLabels[v.specs.transmission]),
      },
      { label: "Fuel", values: effective.map((v) => fuelLabels[v.specs.fuelType]) },
      {
        label: "Engine",
        values: effective.map((v) => `${v.specs.engineCc} cc`),
        numbers: effective.map((v) => v.specs.engineCc),
      },
      {
        label: "Consumption, city",
        values: effective.map((v) => `${v.specs.mileageCityKmpl} km/l`),
        numbers: effective.map((v) => v.specs.mileageCityKmpl),
        best: "high",
      },
      {
        label: "Consumption, highway",
        values: effective.map((v) => `${v.specs.mileageHighwayKmpl} km/l`),
        numbers: effective.map((v) => v.specs.mileageHighwayKmpl),
        best: "high",
      },
      {
        label: "Fuel cost per km",
        values: perKm.map((value) => formatPkrPrecise(value)),
        numbers: perKm,
        best: "low",
      },
      {
        label: "With fuel, per day",
        values: effective.map((v) => formatPkr(v.rates.withFuelDaily)),
        numbers: effective.map((v) => v.rates.withFuelDaily),
        best: "low",
      },
      {
        label: "Without fuel, per day",
        values: effective.map((v) => formatPkr(v.rates.withoutFuelDaily)),
        numbers: effective.map((v) => v.rates.withoutFuelDaily),
        best: "low",
      },
      {
        label: "Out of station, per day",
        values: effective.map((v) => formatPkr(v.rates.outOfCityDaily)),
        numbers: effective.map((v) => v.rates.outOfCityDaily),
        best: "low",
      },
      {
        label: "Per kilometre",
        values: effective.map((v) => formatPkr(v.rates.perKm)),
        numbers: effective.map((v) => v.rates.perKm),
        best: "low",
      },
      {
        label: "Security deposit",
        values: effective.map((v) => formatPkr(v.rates.securityDeposit)),
        numbers: effective.map((v) => v.rates.securityDeposit),
        best: "low",
      },
    ];
  }, [effective, fuelRates]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
          Class
        </span>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={item === category}
            className={cn(
              "rounded-pill border px-4 py-2 font-ui text-xs font-medium transition-colors",
              item === category
                ? "border-red bg-red text-white"
                : "border-edge bg-panel text-fg-muted hover:border-edge-strong",
            )}
          >
            {categoryLabels[item]}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {inCategory.map((vehicle) => {
          const active = effective.some((item) => item.slug === vehicle.slug);
          const full = effective.length >= MAX && !active;
          return (
            <button
              key={vehicle.slug}
              type="button"
              onClick={() => toggle(vehicle.slug)}
              disabled={full}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 font-ui text-xs transition-colors",
                active
                  ? "border-red/60 bg-red/10 text-accent"
                  : "border-edge bg-panel text-fg-muted hover:border-edge-strong",
                full && "cursor-not-allowed opacity-40",
              )}
            >
              {active ? (
                <X className="h-3 w-3" aria-hidden />
              ) : (
                <Plus className="h-3 w-3" aria-hidden />
              )}
              {vehicleFullName(vehicle)}
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-ui text-xs text-fg-faint">
        Up to {MAX} vehicles of the same class. The better figure in each row is
        marked.
      </p>

      {effective.length < 2 ? (
        <div className="mt-10 rounded-card border border-edge bg-panel p-10 text-center">
          <h2 className="text-2xl">Pick at least two</h2>
          <p className="mt-3 text-fg-muted">
            Choose two or three vehicles from the same class to see them side by
            side.
          </p>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="w-44 pb-4" />
                {effective.map((vehicle) => (
                  <th key={vehicle.slug} scope="col" className="px-3 pb-4 align-bottom">
                    <Link href={`/fleet/${vehicle.slug}`} className="group block">
                      <span className="block aspect-[16/10] overflow-hidden rounded-card border border-edge">
                        <VehicleMedia vehicle={vehicle} sizes="20vw" />
                      </span>
                      <span className="mt-3 block text-lg transition-colors group-hover:text-accent">
                        {vehicle.make} {vehicle.model}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const target =
                  row.best && row.numbers
                    ? row.best === "low"
                      ? Math.min(...row.numbers)
                      : Math.max(...row.numbers)
                    : null;
                const allSame =
                  row.numbers && new Set(row.numbers).size === 1;

                return (
                  <tr key={row.label} className="border-b border-edge">
                    <th
                      scope="row"
                      className="py-3.5 pr-4 font-ui text-sm font-normal text-fg-muted"
                    >
                      {row.label}
                    </th>
                    {row.values.map((value, index) => {
                      const isBest =
                        target !== null &&
                        !allSame &&
                        row.numbers?.[index] === target;
                      return (
                        <td
                          key={`${row.label}-${index}`}
                          className={cn(
                            "tabular px-3 py-3.5 text-sm",
                            isBest
                              ? "font-semibold text-price"
                              : "text-fg",
                          )}
                        >
                          {value}
                          {isBest ? (
                            <span className="ml-2 rounded-pill bg-available/15 px-2 py-0.5 font-ui text-[0.5625rem] font-semibold tracking-wide text-available uppercase">
                              Best
                            </span>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <th scope="row" className="py-5 pr-4" />
                {effective.map((vehicle) => (
                  <td key={vehicle.slug} className="px-3 py-5">
                    <ButtonLink href={`/fleet/${vehicle.slug}`} size="sm">
                      View details
                    </ButtonLink>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
