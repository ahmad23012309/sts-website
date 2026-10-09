"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { bookingSchema } from "@/lib/validation/forms";
import type { Vehicle } from "@/lib/cms/types";
import { site } from "@/lib/site";
import { formatPkr, whatsappLink } from "@/lib/utils";
import { vehicleFullName } from "@/lib/vehicleDisplay";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 font-ui text-sm text-fg focus:border-red focus:outline-none";

const labelClass =
  "mb-1.5 block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-fg-muted uppercase";

export function BookingPanel({ vehicle }: { vehicle: Vehicle }) {
  const [withFuel, setWithFuel] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const rate = withFuel
    ? vehicle.rates.withFuelDaily
    : vehicle.rates.withoutFuelDaily;

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
      vehicleCategory: vehicle.category,
      vehicleSlug: vehicle.slug,
      pickupDate: data.get("pickupDate"),
      dropoffDate: data.get("dropoffDate"),
      pickupLocation: data.get("pickupLocation"),
      dropoffLocation: "",
      withFuel,
      withDriver: data.get("withDriver") === "on",
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
        setMessage(
          body.message ?? "Could not send the request. Please call us instead.",
        );
        return;
      }

      setStatus("success");
      setMessage(body.message ?? "Request received. We will call you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send the request. Please call us instead.");
    }
  }

  return (
    <div className="rounded-card border border-edge bg-panel p-6 shadow-card">
      <div className="flex items-baseline justify-between gap-4 border-b border-edge pb-5">
        <div>
          <p className="font-ui text-[0.625rem] tracking-[0.14em] text-fg-muted uppercase">
            {withFuel ? "With fuel" : "Without fuel"}
          </p>
          <p className="tabular mt-1 text-3xl font-semibold text-price">
            {formatPkr(rate)}
          </p>
          <p className="font-ui text-xs text-fg-faint">per day</p>
        </div>
        <div className="flex rounded-pill border border-edge p-1">
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => setWithFuel(option)}
              aria-pressed={withFuel === option}
              className={`rounded-pill px-3.5 py-1.5 font-ui text-xs font-semibold transition-colors ${
                withFuel === option
                  ? "bg-red text-white"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {option ? "Fuel" : "No fuel"}
            </button>
          ))}
        </div>
      </div>

      {status === "success" ? (
        <div className="py-6">
          <p className="font-display text-2xl text-accent">Request received</p>
          <p className="mt-2 text-fg-muted">{message}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Your name" />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="03XX XXXXXXX" />
            </Field>
            <Field label="Pick-up date" error={errors.pickupDate}>
              <input name="pickupDate" type="date" className={fieldClass} />
            </Field>
            <Field label="Drop-off date" error={errors.dropoffDate}>
              <input name="dropoffDate" type="date" className={fieldClass} />
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
          </div>

          <label className="flex items-center gap-3 py-1">
            <input name="withDriver" type="checkbox" defaultChecked className="h-4 w-4 accent-[#CE1D17]" />
            <span className="font-ui text-sm text-fg">With a driver</span>
          </label>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending" : "Request this vehicle"}
          </Button>

          {status === "error" && message ? (
            <p role="alert" className="font-ui text-sm text-booked">
              {message}
            </p>
          ) : null}
        </form>
      )}

      <ButtonLink
        href={whatsappLink(
          site.contact.whatsapp,
          `Hello ${site.name}, I would like to book the ${vehicleFullName(vehicle)}.`,
        )}
        variant="whatsapp"
        size="lg"
        className="mt-3 w-full"
      >
        <WhatsappIcon className="h-4 w-4" />
        Book on WhatsApp
      </ButtonLink>

      <p className="mt-4 font-ui text-[0.6875rem] leading-relaxed text-fg-faint">
        Sending a request does not take payment. We confirm availability and the
        final price before anything is booked.
      </p>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block font-ui text-xs text-booked">{error}</span>
      ) : null}
    </label>
  );
}
