"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { calculateFare, findRoute, type TripType } from "@/lib/pricing/calculateFare";
import type { FuelRates, PricingRules, Route, Vehicle } from "@/lib/cms/types";
import { categoryLabels, orderedCategories, vehicleFullName } from "@/lib/vehicleDisplay";
import { site } from "@/lib/site";
import { formatPkr, formatPkrPrecise, whatsappLink } from "@/lib/utils";

const tripTypes: { value: TripType; label: string; hint: string }[] = [
  { value: "within-city", label: "Within city", hint: "Vehicle stays in one city" },
  { value: "out-of-station", label: "Out of station", hint: "Travel and return" },
  { value: "one-way", label: "One-way drop", hint: "Dropped and released" },
];

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 font-ui text-sm text-fg focus:border-red focus:outline-none";

const labelClass =
  "mb-1.5 block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-fg-muted uppercase";

export function FareCalculator({
  vehicles,
  routes,
  fuelRates,
  rules,
}: {
  vehicles: Vehicle[];
  routes: Route[];
  fuelRates: FuelRates;
  rules: PricingRules;
}) {
  const params = useSearchParams();

  const places = useMemo(() => {
    const set = new Set<string>(site.cities);
    for (const route of routes) {
      set.add(route.origin);
      set.add(route.destination);
    }
    return [...set].sort();
  }, [routes]);

  // The homepage hero sends origin, category and date across, so the visitor
  // does not answer the same questions twice.
  const presetCategory = params.get("category");
  const presetVehicle =
    vehicles.find((vehicle) => vehicle.category === presetCategory) ??
    vehicles[0];

  // Open on a route we actually hold, so the first thing a visitor sees is a
  // worked estimate rather than a request for a distance.
  const requestedOrigin = params.get("origin");
  const openingRoute =
    routes.find((item) => item.origin === requestedOrigin) ?? routes[0];

  const [tripType, setTripType] = useState<TripType>("out-of-station");
  const [origin, setOrigin] = useState(openingRoute?.origin ?? places[0] ?? "");
  const [destination, setDestination] = useState(
    openingRoute?.destination ?? places[1] ?? "",
  );

  /**
   * Changing the start point usually invalidates the destination. Rather than
   * dropping the visitor into the manual-distance path, move to a destination
   * we have on file for the new origin where one exists.
   */
  function changeOrigin(value: string) {
    setOrigin(value);
    if (findRoute(routes, value, destination)) return;
    const known = routes.find(
      (item) => item.origin === value || item.destination === value,
    );
    if (!known) return;
    setDestination(known.origin === value ? known.destination : known.origin);
  }
  const [vehicleSlug, setVehicleSlug] = useState(presetVehicle?.slug ?? "");
  const [days, setDays] = useState(2);
  const [withFuel, setWithFuel] = useState(true);
  const [manualDistance, setManualDistance] = useState("");

  const vehicle = vehicles.find((item) => item.slug === vehicleSlug);
  const route =
    tripType === "within-city" ? null : findRoute(routes, origin, destination);

  const distanceKm =
    tripType === "within-city"
      ? rules.includedKmPerDay * Math.max(1, days)
      : (route?.distanceKm ?? Number(manualDistance) ?? 0);

  const needsDistance =
    tripType !== "within-city" && !route && Number(manualDistance) <= 0;

  const fare =
    vehicle && distanceKm > 0 && !needsDistance
      ? calculateFare({
          vehicle,
          tripType,
          distanceKm,
          days,
          withFuel,
          fuelRates,
          rules,
          tollCharges: route?.tollCharges ?? 0,
        })
      : null;

  const summary = fare && vehicle
    ? [
        `${vehicleFullName(vehicle)}`,
        tripType === "within-city"
          ? `Within ${origin}`
          : `${origin} to ${destination}`,
        `${days} day${days > 1 ? "s" : ""}`,
        withFuel ? "with fuel" : "without fuel",
        `estimated ${formatPkr(fare.total)}`,
      ].join(" — ")
    : "";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <div>
        <fieldset>
          <legend className={labelClass}>Trip type</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {tripTypes.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTripType(option.value)}
                aria-pressed={tripType === option.value}
                className={`rounded-card border p-4 text-left transition-colors ${
                  tripType === option.value
                    ? "border-red bg-red/5"
                    : "border-edge bg-panel hover:border-edge-strong"
                }`}
              >
                <span className="block font-ui text-sm font-semibold text-fg">
                  {option.label}
                </span>
                <span className="mt-1 block font-ui text-xs text-fg-muted">
                  {option.hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className={labelClass}>
              {tripType === "within-city" ? "City" : "From"}
            </span>
            <select
              value={origin}
              onChange={(event) => changeOrigin(event.target.value)}
              className={fieldClass}
            >
              {places.map((place) => (
                <option key={place} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </label>

          {tripType !== "within-city" ? (
            <label>
              <span className={labelClass}>To</span>
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className={fieldClass}
              >
                {places.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            <span className={labelClass}>Vehicle</span>
            <select
              value={vehicleSlug}
              onChange={(event) => setVehicleSlug(event.target.value)}
              className={fieldClass}
            >
              {orderedCategories.map((category) => {
                const group = vehicles.filter(
                  (item) => item.category === category,
                );
                if (group.length === 0) return null;
                return (
                  <optgroup key={category} label={categoryLabels[category]}>
                    {group.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {vehicleFullName(item)}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>

          <label>
            <span className={labelClass}>Days</span>
            <input
              type="number"
              min={1}
              max={60}
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className={fieldClass}
            />
            {rules.longStayDiscounts.length > 0 ? (
              <span className="mt-1.5 block font-ui text-xs text-fg-faint">
                {[...rules.longStayDiscounts]
                  .sort((a, b) => a.minDays - b.minDays)
                  .map((band) => `${band.minDays}+ days ${band.percent}% off`)
                  .join(" · ")}
              </span>
            ) : null}
          </label>
        </div>

        {needsDistance ? (
          <label className="mt-4 block">
            <span className={labelClass}>Distance one way, in kilometres</span>
            <input
              type="number"
              min={1}
              value={manualDistance}
              onChange={(event) => setManualDistance(event.target.value)}
              className={fieldClass}
              placeholder="e.g. 420"
            />
            <span className="mt-1.5 block font-ui text-xs text-fg-faint">
              We do not have this route on file yet, so enter the distance and
              we will check it when we confirm.
            </span>
          </label>
        ) : null}

        <fieldset className="mt-6">
          <legend className={labelClass}>Fuel</legend>
          <div className="flex rounded-pill border border-edge p-1">
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                onClick={() => setWithFuel(option)}
                aria-pressed={withFuel === option}
                className={`flex-1 rounded-pill px-4 py-2.5 font-ui text-sm font-semibold transition-colors ${
                  withFuel === option
                    ? "bg-red text-white"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {option ? "With fuel" : "Without fuel"}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-card border border-edge bg-panel p-7 shadow-card">
        {fare && vehicle ? (
          <>
            <p className="eyebrow">Estimate</p>
            <h2 className="mt-3 text-2xl">
              {tripType === "within-city"
                ? `Within ${origin}`
                : `${origin} to ${destination}`}
            </h2>
            <p className="mt-1.5 font-ui text-xs text-fg-muted">
              {vehicleFullName(vehicle)} &middot; {days} day
              {days > 1 ? "s" : ""} &middot;{" "}
              {withFuel ? "with fuel" : "without fuel"}
              {tripType !== "within-city"
                ? ` · ${distanceKm} km each way`
                : null}
            </p>

            <dl className="mt-7 space-y-3.5 border-t border-edge pt-7">
              {fare.lines.map((line) => (
                <div
                  key={line.label}
                  className="flex items-baseline justify-between gap-6"
                >
                  <dt>
                    <span className="font-ui text-sm text-fg">{line.label}</span>
                    <span className="mt-0.5 block font-ui text-[0.6875rem] text-fg-faint">
                      {line.detail}
                    </span>
                  </dt>
                  <dd className="tabular shrink-0 text-sm text-fg-muted">
                    {formatPkr(line.amount)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex items-baseline justify-between gap-6 border-t border-edge pt-6">
              <span className="font-ui text-xs tracking-[0.14em] text-fg-muted uppercase">
                Estimated total
              </span>
              <span className="tabular text-3xl font-semibold text-price">
                {formatPkr(fare.total)}
              </span>
            </div>

            <p className="mt-5 font-ui text-[0.6875rem] leading-relaxed text-fg-faint">
              Includes a {rules.marginPercent}% service charge. Fuel calculated
              at {formatPkrPrecise(fare.fuelRatePerLitre)} per litre, the rate
              in force from {fare.fuelRateEffectiveFrom}. This is an estimate:
              the price is confirmed when we check availability.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href={`/fleet/${vehicle.slug}`} size="lg">
                Book this vehicle
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(
                  site.contact.whatsapp,
                  `Hello ${site.name}, I used the fare calculator: ${summary}. Please confirm.`,
                )}
                variant="whatsapp"
                size="lg"
              >
                <WhatsappIcon className="h-4 w-4" />
                Send this quote on WhatsApp
              </ButtonLink>
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center py-16 text-center">
            <div>
              <p className="font-display text-2xl text-fg">
                Fill in the trip
              </p>
              <p className="mt-2 max-w-xs text-fg-muted">
                {needsDistance
                  ? "Enter the distance and the estimate appears here."
                  : "Choose a route and a vehicle and the breakdown appears here."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
