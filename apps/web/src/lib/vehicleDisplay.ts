import type {
  FuelType,
  Transmission,
  Vehicle,
  VehicleCategory,
} from "@/lib/cms/types";

export const categoryLabels: Record<VehicleCategory, string> = {
  economy: "Economy",
  sedan: "Sedan",
  suv: "SUV",
  luxury: "Luxury",
  van: "Van",
  coaster: "Coaster",
  bus: "Bus",
  pickup: "Pickup",
  convertible: "Convertible",
};

export const categoryBlurbs: Record<VehicleCategory, string> = {
  economy: "Small, frugal cars for city running and short trips.",
  sedan: "Comfortable saloons for daily use, airport runs and intercity travel.",
  suv: "Higher seating, more luggage and the ability to leave the main road.",
  luxury: "Executive vehicles for guests, directors and formal occasions.",
  van: "Seven to thirteen seats for teams, families and group transfers.",
  coaster: "Twenty-two seats, the backbone of our staff transport contracts.",
  bus: "Intercity coaches for large groups and long distances.",
  pickup: "Double cabs for site work, field teams and equipment.",
  convertible: "Presentation vehicles for weddings, shoots and events.",
};

export const transmissionLabels: Record<Transmission, string> = {
  manual: "Manual",
  automatic: "Automatic",
};

export const fuelLabels: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
};

export function vehicleName(vehicle: Vehicle) {
  return `${vehicle.make} ${vehicle.model}`;
}

export function vehicleFullName(vehicle: Vehicle) {
  return `${vehicle.make} ${vehicle.model} ${vehicle.variant}`;
}

export const orderedCategories: VehicleCategory[] = [
  "coaster",
  "van",
  "bus",
  "sedan",
  "suv",
  "luxury",
  "pickup",
  "economy",
  "convertible",
];
