import * as fixtures from "./fixtures";
import type {
  Faq,
  FuelRates,
  PricingRules,
  Route,
  Service,
  Testimonial,
  Vehicle,
} from "./types";

/**
 * Content adapter.
 *
 * Everything the site renders passes through this module. Today it returns the
 * preview fixtures; when the WordPress backend is live, only the bodies of
 * these functions change and no component is touched.
 */

export const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "fixtures";

export const isPreviewData = dataSource !== "cms";

export async function getVehicles(): Promise<Vehicle[]> {
  return fixtures.vehicles;
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const all = await getVehicles();
  return all.filter((vehicle) => vehicle.isFeatured);
}

export async function getVehicle(slug: string): Promise<Vehicle | null> {
  const all = await getVehicles();
  return all.find((vehicle) => vehicle.slug === slug) ?? null;
}

export async function getFuelRates(): Promise<FuelRates> {
  return fixtures.fuelRates;
}

export async function getPricingRules(): Promise<PricingRules> {
  return fixtures.pricingRules;
}

export async function getRoutes(): Promise<Route[]> {
  return fixtures.routes;
}

export async function getServices(): Promise<Service[]> {
  return fixtures.services;
}

export async function getFaqs(): Promise<Faq[]> {
  return fixtures.faqs;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return fixtures.testimonials;
}

export * from "./types";
