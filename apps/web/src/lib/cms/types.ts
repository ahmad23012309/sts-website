/**
 * Domain types.
 *
 * These mirror the WordPress data model described in docs/PROJECT_PLAN.md
 * section 4. Every component reads these types rather than a CMS response
 * shape, so replacing the fixture source with the live backend touches only
 * the adapter in ./index.ts.
 */

export type VehicleCategory =
  | "economy"
  | "sedan"
  | "suv"
  | "luxury"
  | "van"
  | "coaster"
  | "bus"
  | "pickup"
  | "convertible";

export type Transmission = "manual" | "automatic";

export type FuelType = "petrol" | "diesel" | "hybrid" | "electric";

/** How closely the 3D asset matches the actual vehicle on the forecourt. */
export type ModelAccuracy = "exact" | "representative" | "none";

/**
 * A third-party 3D model embedded from Sketchfab.
 *
 * Every published model carries licence terms, and most require the author to
 * be credited wherever the model appears, so the credit travels with the model
 * rather than being kept in a list somewhere else.
 */
export interface SketchfabModel {
  uid: string;
  title: string;
  authorName: string;
  authorUrl: string;
  modelUrl: string;
  license: string;
  accuracy: ModelAccuracy;
}

export interface VehicleColor {
  name: string;
  hex: string;
}

export interface VehicleRates {
  withFuelDaily: number;
  withoutFuelDaily: number;
  outOfCityDaily: number;
  perKm: number;
  overtimePerHour: number;
  driverAllowance: number;
  nightStayCharge: number;
  securityDeposit: number;
}

export interface VehicleSpecs {
  engineCc: number;
  seats: number;
  doors: number;
  luggage: number;
  transmission: Transmission;
  fuelType: FuelType;
  mileageCityKmpl: number;
  mileageHighwayKmpl: number;
  airConditioning: boolean;
}

export interface VehicleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  category: VehicleCategory;
  specs: VehicleSpecs;
  rates: VehicleRates;
  colors: VehicleColor[];
  images: VehicleImage[];
  features: string[];
  model3d: SketchfabModel | null;
  /** How many of this model are on the road, from the fleet register. */
  unitsInFleet: number;
  availableForCorporate: boolean;
  isFeatured: boolean;
}

export interface FuelRates {
  petrol: number;
  diesel: number;
  hiOctane: number;
  effectiveFrom: string;
  note: string;
}

/**
 * One published revision of the fuel rates.
 *
 * Diesel and hi-octane are nullable because the record we have for older dates
 * only covers petrol, and a blank is honest where a guess is not.
 */
export interface FuelRateRecord {
  effectiveFrom: string;
  petrol: number;
  diesel: number | null;
  hiOctane: number | null;
}

/** A discount band on the daily rate for longer rentals. */
export interface LongStayDiscount {
  minDays: number;
  percent: number;
}

export interface PricingRules {
  marginPercent: number;
  /** Highest matching band applies. */
  longStayDiscounts: LongStayDiscount[];
  withoutFuelAdjustPercent: number;
  defaultDriverAllowance: number;
  nightStayCharge: number;
  /** Whether a one-way trip is billed fuel for the empty return leg. */
  chargeReturnLegFuel: boolean;
  includedKmPerDay: number;
  roundToNearest: number;
}

export interface Route {
  origin: string;
  destination: string;
  distanceKm: number;
  estimatedHours: number;
  tollCharges: number;
}

export interface Testimonial {
  id: string;
  authorName: string;
  company: string | null;
  rating: number;
  body: string;
  source: string;
  date: string;
  /** Only verified testimonials are eligible for Review structured data. */
  verified: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: VehicleImage | null;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  icon: string;
  /** Who the service is for, in one line. */
  audience: string;
  body: string[];
  points: string[];
  /** Fleet categories this service draws on. */
  relatedCategories: VehicleCategory[];
}

export interface AvailabilityBlock {
  /** Inclusive ISO date. */
  from: string;
  /** Inclusive ISO date. */
  to: string;
  reason: "booked" | "maintenance" | "reserved";
}

/**
 * Where the availability came from.
 *
 * "none" means no booking system is connected yet, which the calendar says
 * plainly rather than drawing every day as free.
 */
export interface AvailabilityResult {
  source: "none" | "cms" | "management-software";
  blocks: AvailabilityBlock[];
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}
