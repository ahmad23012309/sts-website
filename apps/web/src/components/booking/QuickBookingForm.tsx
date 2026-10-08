"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { quickBookingSchema } from "@/lib/validation/forms";
import { site } from "@/lib/site";

const categories = [
  { value: "economy", label: "Economy" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "luxury", label: "Luxury" },
  { value: "van", label: "Van" },
  { value: "coaster", label: "Coaster" },
];

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-line bg-ink px-4 font-ui text-sm text-text placeholder:text-faint focus:border-red focus:outline-none";

export function QuickBookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage("");

    const form = new FormData(event.currentTarget);
    const parsed = quickBookingSchema.safeParse({
      name: form.get("name"),
      phone: form.get("phone"),
      city: form.get("city"),
      vehicleCategory: form.get("vehicleCategory"),
      pickupDate: form.get("pickupDate"),
      website: form.get("website"),
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
      const response = await fetch("/api/bookings/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.message ?? "Could not send your request. Please call us instead.");
        return;
      }

      setStatus("success");
      setMessage(body.message ?? "Request received. We will call you shortly.");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send your request. Please call us instead.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-red/45 bg-card p-6">
        <p className="font-display text-2xl text-red-bright">Request received</p>
        <p className="mt-2 text-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Your name" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="03XX XXXXXXX" />
        </Field>
        <Field label="City" error={errors.city}>
          <select name="city" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select city
            </option>
            {site.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vehicle type" error={errors.vehicleCategory}>
          <select name="vehicleCategory" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select type
            </option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pick-up date" error={errors.pickupDate} className="sm:col-span-2">
          <input name="pickupDate" type="date" className={fieldClass} />
        </Field>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending" : "Request a call back"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>

      {status === "error" && message ? (
        <p role="alert" className="font-ui text-sm text-booked">
          {message}
        </p>
      ) : null}
    </form>
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
      <span className="mb-1.5 block font-ui text-[0.6875rem] font-semibold tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block font-ui text-xs text-booked">{error}</span>
      ) : null}
    </label>
  );
}
