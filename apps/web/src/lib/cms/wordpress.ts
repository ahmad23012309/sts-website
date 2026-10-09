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
 * The WordPress client.
 *
 * One place knows the shape of the backend's responses. If an endpoint moves
 * or a field is renamed, this file changes and nothing else does.
 */

const BASE = process.env.WORDPRESS_API_URL?.replace(/\/$/, "") ?? "";

export class CmsUnavailableError extends Error {
  constructor(path: string, status: number) {
    super(`The backend returned ${status} for ${path}`);
    this.name = "CmsUnavailableError";
  }
}

/**
 * Fetches and caches.
 *
 * `revalidate` is short for anything priced and longer for anything written
 * once, so a fuel rate reaches the site within a minute while a service page
 * is not re-fetched on every request.
 */
async function get<T>(path: string, revalidate: number): Promise<T> {
  if (!BASE) {
    throw new CmsUnavailableError(path, 0);
  }

  const response = await fetch(`${BASE}/wp-json/sts/v1${path}`, {
    next: { revalidate, tags: ["cms"] },
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new CmsUnavailableError(path, response.status);
  }

  return (await response.json()) as T;
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  return get<Vehicle[]>("/vehicles", 60);
}

export async function fetchFuel(): Promise<{
  current: FuelRates;
  history: FuelRateRecord[];
}> {
  return get("/fuel", 60);
}

export async function fetchPricing(): Promise<PricingRules> {
  return get<PricingRules>("/pricing", 60);
}

export async function fetchRoutes(): Promise<Route[]> {
  return get<Route[]>("/routes", 300);
}

export async function fetchAvailability(
  vehicleId: string,
): Promise<AvailabilityResult> {
  // Vehicle ids arrive as "v-123"; the backend keys availability by the number.
  const numeric = vehicleId.replace(/^v-/, "");
  return get<AvailabilityResult>(`/availability/${numeric}`, 30);
}

interface WpService {
  slug: string;
  title: string;
  content: string;
  audience: string;
  summary: string;
  points: string;
  related_classes: string;
}

export async function fetchServices(): Promise<Service[]> {
  const rows = await get<WpService[]>("/services", 300);

  return rows.map((row) => ({
    id: `s-${row.slug}`,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    icon: "route",
    audience: row.audience,
    body: splitParagraphs(row.content),
    points: splitLines(row.points),
    relatedCategories: splitList(row.related_classes) as Service["relatedCategories"],
  }));
}

interface WpCity {
  slug: string;
  title: string;
  is_base: boolean;
  intro: string;
  uses: string;
  areas: string;
  airport: string;
}

export async function fetchCities(): Promise<City[]> {
  const rows = await get<WpCity[]>("/cities", 300);

  return rows.map((row) => ({
    slug: row.slug,
    name: row.title,
    isBase: Boolean(row.is_base),
    intro: row.intro,
    uses: splitLines(row.uses),
    areas: splitLines(row.areas),
    airport: row.airport || null,
  }));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return get<Testimonial[]>("/testimonials", 300);
}

interface WpFaq {
  slug: string;
  title: string;
  content: string;
}

export async function fetchFaqs(): Promise<Faq[]> {
  const rows = await get<WpFaq[]>("/faqs", 300);
  return rows.map((row) => ({
    id: `f-${row.slug}`,
    question: row.title,
    answer: stripTags(row.content),
  }));
}

export interface WpClient {
  slug: string;
  name: string;
  industry: string;
  logo: string | null;
  width: number | null;
  height: number | null;
}

export async function fetchClients(): Promise<WpClient[]> {
  return get<WpClient[]>("/clients", 600);
}

function splitLines(value: string | null | undefined): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitList(value: string | null | undefined): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(html: string): string[] {
  return stripTags(html)
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}
