"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { corporateLeadSchema } from "@/lib/validation/forms";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 font-ui text-sm text-fg placeholder:text-fg-faint focus:border-red focus:outline-none";

const labelClass =
  "mb-1.5 block font-ui text-[0.625rem] font-semibold tracking-[0.14em] text-fg-muted uppercase";

export function CallbackForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = corporateLeadSchema.safeParse({
      contactName: data.get("contactName"),
      companyName: data.get("companyName"),
      designation: data.get("designation") ?? "",
      phone: data.get("phone"),
      email: data.get("email"),
      fleetSize: data.get("fleetSize"),
      contractLength: data.get("contractLength") ?? "",
      requirements: data.get("requirements") ?? "",
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
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(
          body.message ?? "Could not send your enquiry. Please call us instead.",
        );
        return;
      }

      setStatus("success");
      setMessage(body.message ?? "Enquiry received.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send your enquiry. Please call us instead.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-red/40 bg-panel p-8">
        <p className="font-display text-2xl text-accent">Enquiry received</p>
        <p className="mt-2 text-fg-muted">{message}</p>
        <p className="mt-4 font-ui text-sm text-fg-muted">
          If it is urgent, call {site.contact.phone} and ask for the fleet desk.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Your name" error={errors.contactName}>
          <input name="contactName" type="text" autoComplete="name" className={fieldClass} placeholder="Full name" />
        </Field>
        <Field label="Company" error={errors.companyName}>
          <input name="companyName" type="text" autoComplete="organization" className={fieldClass} placeholder="Company name" />
        </Field>
        <Field label="Designation" error={errors.designation}>
          <input name="designation" type="text" autoComplete="organization-title" className={fieldClass} placeholder="Optional" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" className={fieldClass} placeholder="03XX XXXXXXX" />
        </Field>
        <Field label="Work email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" className={fieldClass} placeholder="name@company.com" />
        </Field>
        <Field label="Vehicles needed" error={errors.fleetSize}>
          <input name="fleetSize" type="number" min={1} max={500} defaultValue={1} className={fieldClass} />
        </Field>
        <Field label="Contract length" error={errors.contractLength} className="sm:col-span-2">
          <select name="contractLength" className={fieldClass} defaultValue="">
            <option value="">Not sure yet</option>
            <option value="1-3 months">1 to 3 months</option>
            <option value="3-6 months">3 to 6 months</option>
            <option value="6-12 months">6 to 12 months</option>
            <option value="12+ months">12 months or more</option>
            <option value="one-off">One-off movement</option>
          </select>
        </Field>
        <Field label="What do you need?" error={errors.requirements} className="sm:col-span-2">
          <textarea
            name="requirements"
            rows={4}
            className="w-full rounded-[0.5rem] border border-edge bg-page-alt px-4 py-3 font-ui text-sm text-fg placeholder:text-fg-faint focus:border-red focus:outline-none"
            placeholder="Routes, timings, number of staff, pick-up points"
          />
        </Field>
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending" : "Request a call back"}
      </Button>

      {status === "error" && message ? (
        <p role="alert" className="font-ui text-sm text-booked">
          {message}
        </p>
      ) : null}

      <p className="font-ui text-[0.6875rem] leading-relaxed text-fg-faint">
        We use these details to prepare a proposal and nothing else.
      </p>
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
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block font-ui text-xs text-booked">{error}</span>
      ) : null}
    </label>
  );
}
