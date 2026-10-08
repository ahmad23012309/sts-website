import { z } from "zod";

/**
 * Shared between the browser and the API routes. The client copy is for
 * feedback only; the server validates every submission again, because anything
 * the browser enforces can be bypassed.
 */

const pakistaniPhone = z
  .string()
  .trim()
  .min(10, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    return (
      /^(03\d{9})$/.test(digits) ||
      /^(923\d{9})$/.test(digits) ||
      /^(0\d{9,10})$/.test(digits)
    );
  }, "Enter a valid Pakistani phone number");

const name = z
  .string()
  .trim()
  .min(2, "Enter your name")
  .max(80, "Name is too long");

export const quickBookingSchema = z.object({
  name,
  phone: pakistaniPhone,
  city: z.string().trim().min(2, "Select a city").max(60),
  vehicleCategory: z.string().trim().min(2, "Select a vehicle type").max(40),
  pickupDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a pick-up date"),
  /** Must stay empty. A filled value means an automated submission. */
  website: z.string().max(0).optional(),
});

export const bookingSchema = quickBookingSchema.extend({
  email: z.email("Enter a valid email address").optional().or(z.literal("")),
  vehicleSlug: z.string().trim().min(2).max(120),
  dropoffDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select a drop-off date"),
  pickupLocation: z.string().trim().min(2).max(160),
  dropoffLocation: z.string().trim().min(2).max(160).optional().or(z.literal("")),
  withFuel: z.boolean(),
  withDriver: z.boolean(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const corporateLeadSchema = z.object({
  contactName: name,
  companyName: z.string().trim().min(2, "Enter the company name").max(120),
  designation: z.string().trim().max(80).optional().or(z.literal("")),
  phone: pakistaniPhone,
  email: z.email("Enter a valid email address"),
  fleetSize: z.coerce.number().int().min(1).max(500),
  contractLength: z.string().trim().max(60).optional().or(z.literal("")),
  requirements: z.string().trim().max(2000).optional().or(z.literal("")),
  website: z.string().max(0).optional(),
});

export type QuickBookingInput = z.infer<typeof quickBookingSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type CorporateLeadInput = z.infer<typeof corporateLeadSchema>;
