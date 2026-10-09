"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { bookingSchema } from "@/lib/validation/forms";
import type { PricingRules, Vehicle } from "@/lib/cms/types";
import { categoryLabels, orderedCategories, vehicleFullName } from "@/lib/vehicleDisplay";
import { site } from "@/lib/site";
import { formatPkr, whatsappLink } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 font-ui text-sm text-fg placeholder:text-fg-faint focus:border-red focus:outline-none";

const labelClass =
  "mb-1.5 block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-fg-muted uppercase";

function daysBetween(from: string, to: string) {
  if (!from || !to) return 0;
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.max(1, Math.round((end - start) / 86400000) || 1);
}

/**
 * The whole booking on one screen.
 *
 * The running total updates as the form is filled, so nobody reaches the end
 * and discovers a number they did not expect. It is still an estimate, and the
 * panel says so rather than implying the booking is priced and confirmed.
 */
export function BookingFlow({
  vehicles,
  rules,
}: {
  vehicles: Vehicle[];
  rules: PricingRules;
}) {
  const params = useSearchParams();
  const requested = params.get("vehicle");

  const [vehicleSlug, setVehicleSlug] = useState(
    vehicles.find((item) => item.slug === requested)?.slug ??
      vehicles[0]?.slug ??
      "",
  );
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [withFuel, setWithFuel] = useState(true);
  const [withDriver, setWithDriver] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const vehicle = vehicles.find((item) => item.slug === vehicleSlug);
  const days = daysBetween(pickupDate, dropoffDate);

  const estimate = useMemo(() => {
    if (!vehicle || days === 0) return null;

    const rate = withFuel
      ? vehicle.rates.withFuelDaily
      : vehicle.rates.withoutFuelDaily;
    const base = rate * days;

    const band = [...rules.longStayDiscounts]
      .sort((a, b) => b.minDays - a.minDays)
      .find((item) => days >= item.minDays);
    const discount = band ? (base * band.percent) / 100 : 0;

    const driver = withDriver ? vehicle.rates.driverAllowance * days : 0;

    return {
      rate,
      base,
      band,
      discount,
      driver,
      total: base - discount + driver,
    };
  }, [vehicle, days, withFuel, withDriver, rules.longStayDiscounts]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = bookingSchema.safeParse({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email") ?? "",
      city: data.get("city"),
      vehicleCategory: vehicle?.category ?? "",
      vehicleSlug,
      pickupDate,
      dropoffDate,
      pickupLocation: data.get("pickupLocation"),
      dropoffLocation: data.get("dropoffLocation") ?? "",
      withFuel,
      withDriver,
      notes: data.get("notes") ?? "",
      website: data.get("website") ?? "",
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        fieldErrors[key] ??= issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.message ?? "Could not send the request.");
        return;
      }

      setStatus("success");
      setMessage(body.message ?? "Request received.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send the request. Please call us instead.");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-xl rounded-card border border-red/40 bg-panel p-10 text-center">
        <p className="font-display text-3xl text-accent">Request received</p>
        <p className="mt-3 text-fg-muted">{message}</p>
        <p className="mt-6 font-ui text-sm text-fg-muted">
          Nothing has been charged. We confirm the vehicle and the final price
          before the booking is made.
        </p>
        <ButtonLink href="/fleet" variant="outline" size="lg" className="mt-8">
          Back to the fleet
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl">1. Choose the vehicle</h2>
          <label className="mt-4 block">
            <span className={labelClass}>Vehicle</span>
            <select
              value={vehicleSlug}
              onChange={(event) => setVehicleSlug(event.target.value)}
              className={fieldClass}
            >
              {orderedCategories.map((category) => {
                const group = vehicles.filter((item) => item.category === category);
                if (group.length === 0) return null;
                return (
                  <optgroup key={category} label={categoryLabels[category]}>
                    {group.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {vehicleFullName(item)} — {formatPkr(item.rates.withFuelDaily)}/day
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <span className={labelClass}>Fuel</span>
              <div className="flex rounded-pill border border-edge p-1">
                {[true, false].map((option) => (
                  <button
                    key={String(option)}
                    type="button"
                    onClick={() => setWithFuel(option)}
                    aria-pressed={withFuel === option}
                    className={`flex-1 rounded-pill px-3 py-2 font-ui text-xs font-semibold transition-colors ${
                      withFuel === option ? "bg-red text-white" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {option ? "With fuel" : "Without fuel"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Driver</span>
              <div className="flex rounded-pill border border-edge p-1">
                {[true, false].map((option) => (
                  <button
                    key={String(option)}
                    type="button"
                    onClick={() => setWithDriver(option)}
                    aria-pressed={withDriver === option}
                    className={`flex-1 rounded-pill px-3 py-2 font-ui text-xs font-semibold transition-colors ${
                      withDriver === option ? "bg-red text-white" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {option ? "With driver" : "Self-drive"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl">2. Dates and places</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Pick-up date" error={errors.pickupDate}>
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="Drop-off date" error={errors.dropoffDate}>
              <input
                type="date"
                value={dropoffDate}
                min={pickupDate || undefined}
                onChange={(event) => setDropoffDate(event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="City" error={errors.city}>
              <select name="city" className={fieldClass} defaultValue={site.cities[0]}>
                {site.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Pick-up point" error={errors.pickupLocation}>
              <input name="pickupLocation" type="text" className={fieldClass} placeholder="Address or landmark" />
            </Field>
            <Field label="Drop-off point" error={errors.dropoffLocation} className="sm:col-span-2">
              <input name="dropoffLocation" type="text" className={fieldClass} placeholder="Optional, if different" />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-2xl">3. Your details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Full name" />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="03XX XXXXXXX" />
            </Field>
            <Field label="Email" error={errors.email} className="sm:col-span-2">
              <input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="Optional" />
            </Field>
            <Field label="Anything we should know?" error={errors.notes} className="sm:col-span-2">
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 py-3 font-ui text-sm text-fg placeholder:text-fg-faint focus:border-red focus:outline-none"
                placeholder="Timings, number of passengers, route"
              />
            </Field>
          </div>
        </section>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-card border border-edge bg-panel p-7 shadow-card">
          <p className="eyebrow">Your booking</p>

          {vehicle ? (
            <>
              <h2 className="mt-3 text-2xl">{vehicleFullName(vehicle)}</h2>
              <p className="mt-1 font-ui text-xs text-fg-muted">
                {vehicle.specs.seats} seats &middot;{" "}
                {withFuel ? "with fuel" : "without fuel"} &middot;{" "}
                {withDriver ? "with driver" : "self-drive"}
              </p>
            </>
          ) : null}

          {estimate && vehicle ? (
            <>
              <dl className="mt-6 space-y-3 border-t border-edge pt-6">
                <Row
                  label="Vehicle"
                  detail={`${days} day${days > 1 ? "s" : ""} at ${formatPkr(estimate.rate)}`}
                  amount={formatPkr(estimate.base)}
                />
                {estimate.band ? (
                  <Row
                    label="Long-stay discount"
                    detail={`${estimate.band.percent}% from ${estimate.band.minDays} days`}
                    amount={`−${formatPkr(estimate.discount)}`}
                  />
                ) : null}
                {withDriver ? (
                  <Row
                    label="Driver allowance"
                    detail={`${days} day${days > 1 ? "s" : ""}`}
                    amount={formatPkr(estimate.driver)}
                  />
                ) : null}
              </dl>

              <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-edge pt-5">
                <span className="font-ui text-xs tracking-[0.14em] text-fg-muted uppercase">
                  Estimated
                </span>
                <span className="tabular text-3xl font-semibold text-price">
                  {formatPkr(estimate.total)}
                </span>
              </div>

              <p className="mt-4 font-ui text-[0.6875rem] leading-relaxed text-fg-faint">
                Within-city rate. Out-of-station travel, tolls and night stays
                are added once we know the route. Nothing is charged now.
              </p>
            </>
          ) : (
            <p className="mt-6 border-t border-edge pt-6 text-fg-muted">
              Choose the dates and the running total appears here.
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending" : "Send booking request"}
          </Button>

          {status === "error" && message ? (
            <p role="alert" className="mt-3 font-ui text-sm text-booked">
              {message}
            </p>
          ) : null}

          <ButtonLink
            href={whatsappLink(
              site.contact.whatsapp,
              vehicle
                ? `Hello ${site.name}, I would like to book the ${vehicleFullName(vehicle)}${
                    pickupDate ? ` from ${pickupDate}` : ""
                  }${dropoffDate ? ` to ${dropoffDate}` : ""}.`
                : `Hello ${site.name}, I would like to make a booking.`,
            )}
            variant="whatsapp"
            size="lg"
            className="mt-3 w-full"
          >
            <WhatsappIcon className="h-4 w-4" />
            Book on WhatsApp
          </ButtonLink>
        </div>
      </aside>
    </form>
  );
}

function Row({
  label,
  detail,
  amount,
}: {
  label: string;
  detail: string;
  amount: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>
        <span className="font-ui text-sm text-fg">{label}</span>
        <span className="mt-0.5 block font-ui text-[0.6875rem] text-fg-faint">
          {detail}
        </span>
      </dt>
      <dd className="tabular shrink-0 text-sm text-fg-muted">{amount}</dd>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block font-ui text-xs text-booked">{error}</span>
      ) : null}
    </label>
  );
}
