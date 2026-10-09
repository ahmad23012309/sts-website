import * as fixtures from "./fixtures";
import { models3d } from "./models3d";
import * as wp from "./wordpress";
import type {
  AvailabilityResult,
  City,
  Faq,
  FuelRateRecord,
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
 * Everything the site renders passes through this module. With
 * NEXT_PUBLIC_DATA_SOURCE set to "cms" it reads WordPress; otherwise it serves
 * the preview fixtures. No component knows which.
 *
 * Each reader falls back to the fixtures if the backend is unreachable. A
 * rental site that returns a blank page because WordPress is restarting is
 * worse than one showing slightly stale content, and the failure is logged
 * rather than swallowed.
 */

export const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "fixtures";

export const isPreviewData = dataSource !== "cms";

async function read<T>(
  label: string,
  live: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  if (isPreviewData) return fallback();

  try {
    return await live();
  } catch (error) {
    console.error(
      `[cms] falling back to fixtures for ${label}:`,
      error instanceof Error ? error.message : error,
    );
    return fallback();
  }
}

export async function getVehicles(): Promise<Vehicle[]> {
  return read(
    "vehicles",
    () => wp.fetchVehicles(),
    () =>
      fixtures.vehicles.map((vehicle) => ({
        ...vehicle,
        model3d: models3d[vehicle.slug] ?? null,
      })),
  );
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const all = await getVehicles();
  return all.filter((vehicle) => vehicle.isFeatured);
}

export async function getVehicle(slug: string): Promise<Vehicle | null> {
  const all = await getVehicles();
  return all.find((vehicle) => vehicle.slug === slug) ?? null;
}

export async function getAvailability(
  vehicleId: string,
): Promise<AvailabilityResult> {
  return read(
    "availability",
    () => wp.fetchAvailability(vehicleId),
    () => ({ source: "none", blocks: [] }),
  );
}

export async function getFuelRates(): Promise<FuelRates> {
  return read(
    "fuel rates",
    async () => (await wp.fetchFuel()).current,
    () => fixtures.fuelRates,
  );
}

export async function getFuelHistory(): Promise<FuelRateRecord[]> {
  return read(
    "fuel history",
    async () => (await wp.fetchFuel()).history,
    () => fixtures.fuelHistory,
  );
}

export async function getPricingRules(): Promise<PricingRules> {
  return read("pricing rules", () => wp.fetchPricing(), () => fixtures.pricingRules);
}

export async function getRoutes(): Promise<Route[]> {
  return read("routes", () => wp.fetchRoutes(), () => fixtures.routes);
}

export async function getServices(): Promise<Service[]> {
  return read("services", () => wp.fetchServices(), () => fixtures.services);
}

export async function getCities(): Promise<City[]> {
  return read("cities", () => wp.fetchCities(), () => fixtures.cities);
}

export async function getCity(slug: string): Promise<City | null> {
  const all = await getCities();
  return all.find((city) => city.slug === slug) ?? null;
}

export async function getFaqs(): Promise<Faq[]> {
  return read("faqs", () => wp.fetchFaqs(), () => fixtures.faqs);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return read(
    "testimonials",
    () => wp.fetchTestimonials(),
    () => fixtures.testimonials,
  );
}

export * from "./types";
