import type { FuelRates, PricingRules, Route, Vehicle } from "@/lib/cms/types";

export type TripType = "within-city" | "out-of-station" | "one-way";

export interface FareInput {
  vehicle: Vehicle;
  tripType: TripType;
  /** Single-leg distance in kilometres. */
  distanceKm: number;
  days: number;
  withFuel: boolean;
  fuelRates: FuelRates;
  rules: PricingRules;
  tollCharges?: number;
}

export interface FareLine {
  label: string;
  detail: string;
  amount: number;
}

export interface FareResult {
  lines: FareLine[];
  discountPercent: number;
  subtotal: number;
  margin: number;
  total: number;
  billableDistanceKm: number;
  litresRequired: number;
  fuelRatePerLitre: number;
  fuelRateEffectiveFrom: string;
}

function roundUpTo(value: number, step: number) {
  if (step <= 0) return Math.round(value);
  return Math.ceil(value / step) * step;
}

function ratePerLitre(vehicle: Vehicle, fuelRates: FuelRates) {
  switch (vehicle.specs.fuelType) {
    case "diesel":
      return fuelRates.diesel;
    case "petrol":
    case "hybrid":
      return fuelRates.petrol;
    case "electric":
      return 0;
  }
}

function dailyRate(vehicle: Vehicle, tripType: TripType, withFuel: boolean) {
  if (tripType === "within-city") {
    return withFuel
      ? vehicle.rates.withFuelDaily
      : vehicle.rates.withoutFuelDaily;
  }
  return vehicle.rates.outOfCityDaily;
}

/**
 * Produces an itemised fare estimate.
 *
 * The breakdown is returned rather than a single figure: a customer who can see
 * how the number was reached disputes it less, and the office can reproduce any
 * quote the site has given.
 *
 * The rules this encodes are documented in docs/PROJECT_PLAN.md section 5.2 and
 * must be confirmed against the owner's actual quoting method before launch.
 */
export function calculateFare(input: FareInput): FareResult {
  const {
    vehicle,
    tripType,
    distanceKm,
    days,
    withFuel,
    fuelRates,
    rules,
    tollCharges = 0,
  } = input;

  const safeDays = Math.max(1, Math.round(days));
  const lines: FareLine[] = [];

  const base = dailyRate(vehicle, tripType, withFuel) * safeDays;
  lines.push({
    label: "Vehicle",
    detail: `${safeDays} day${safeDays > 1 ? "s" : ""} at the ${
      tripType === "within-city" ? "within-city" : "out-of-station"
    } rate`,
    amount: base,
  });

  // The discount applies to the daily rate only, not to fuel or allowances,
  // because those costs do not fall when the rental runs longer.
  const band = [...rules.longStayDiscounts]
    .sort((a, b) => b.minDays - a.minDays)
    .find((item) => safeDays >= item.minDays);

  if (band) {
    lines.push({
      label: "Long-stay discount",
      detail: `${band.percent}% off the daily rate from ${band.minDays} days`,
      amount: -(base * band.percent) / 100,
    });
  }

  const chargeReturnLeg = tripType !== "one-way" || rules.chargeReturnLegFuel;
  const billableDistanceKm =
    tripType === "within-city"
      ? Math.max(distanceKm, rules.includedKmPerDay * safeDays)
      : chargeReturnLeg
        ? distanceKm * 2
        : distanceKm;

  const fuelRatePerLitre = ratePerLitre(vehicle, fuelRates);
  const mileage =
    tripType === "within-city"
      ? vehicle.specs.mileageCityKmpl
      : vehicle.specs.mileageHighwayKmpl;

  const litresRequired =
    withFuel && mileage > 0 ? billableDistanceKm / mileage : 0;
  const fuelCost = litresRequired * fuelRatePerLitre;

  if (withFuel && fuelCost > 0) {
    lines.push({
      label: "Fuel",
      detail: `${billableDistanceKm.toLocaleString("en-PK")} km at ${mileage} km/l`,
      amount: fuelCost,
    });
  }

  if (tripType !== "within-city") {
    const driverCost = vehicle.rates.driverAllowance * safeDays;
    lines.push({
      label: "Driver allowance",
      detail: `${safeDays} day${safeDays > 1 ? "s" : ""}`,
      amount: driverCost,
    });

    const nights = Math.max(0, safeDays - 1);
    if (nights > 0) {
      lines.push({
        label: "Night stay",
        detail: `${nights} night${nights > 1 ? "s" : ""}`,
        amount: vehicle.rates.nightStayCharge * nights,
      });
    }
  }

  if (tollCharges > 0) {
    lines.push({
      label: "Tolls",
      detail: "Motorway and toll charges",
      amount: tollCharges,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const margin = subtotal * (rules.marginPercent / 100);
  const total = roundUpTo(subtotal + margin, rules.roundToNearest);

  return {
    lines,
    discountPercent: band?.percent ?? 0,
    subtotal,
    margin,
    total,
    billableDistanceKm,
    litresRequired,
    fuelRatePerLitre,
    fuelRateEffectiveFrom: fuelRates.effectiveFrom,
  };
}

export function findRoute(
  routes: Route[],
  origin: string,
  destination: string,
): Route | null {
  const normalise = (value: string) => value.trim().toLowerCase();
  return (
    routes.find(
      (route) =>
        (normalise(route.origin) === normalise(origin) &&
          normalise(route.destination) === normalise(destination)) ||
        (normalise(route.origin) === normalise(destination) &&
          normalise(route.destination) === normalise(origin)),
    ) ?? null
  );
}
