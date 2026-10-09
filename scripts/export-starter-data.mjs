#!/usr/bin/env node
/**
 * Builds the plugin's starter data from the website's fixtures.
 *
 * The office should not have to type twenty vehicles, their specifications and
 * their rates into WordPress by hand; the figures already exist, taken from the
 * fleet register. This writes them into the plugin as JSON, which the importer
 * reads once on the backend's first run.
 *
 * Generated rather than hand-written so the two cannot drift: change a rate in
 * the fixtures and the starter data follows on the next run.
 *
 *   npm run export:starter
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "apps", "web", "src", "lib");

const load = (path) => import(pathToFileURL(join(src, path)).href);

const [fixtures, models, clientList, siteConfig] = await Promise.all([
  load("cms/fixtures.ts"),
  load("cms/models3d.ts"),
  load("cms/clients.ts"),
  load("site.ts"),
]);

const { site } = siteConfig;
const lines = (list) => (list ?? []).join("\n");

const vehicles = fixtures.vehicles.map((vehicle) => {
  const model = models.models3d[vehicle.slug] ?? null;

  return {
    slug: vehicle.slug,
    title: `${vehicle.make} ${vehicle.model}`,
    content: vehicle.description ?? "",
    class: vehicle.category,
    meta: {
      make: vehicle.make,
      model: vehicle.model,
      variant: vehicle.variant,
      year: vehicle.year,
      units_in_fleet: vehicle.unitsInFleet,
      available_for_corporate: vehicle.availableForCorporate ? 1 : 0,
      is_featured: vehicle.isFeatured ? 1 : 0,

      engine_cc: vehicle.specs.engineCc,
      seats: vehicle.specs.seats,
      doors: vehicle.specs.doors,
      luggage: vehicle.specs.luggage,
      transmission: vehicle.specs.transmission,
      fuel_type: vehicle.specs.fuelType,
      mileage_city: vehicle.specs.mileageCityKmpl,
      mileage_highway: vehicle.specs.mileageHighwayKmpl,
      air_conditioning: vehicle.specs.airConditioning ? 1 : 0,

      rate_with_fuel: vehicle.rates.withFuelDaily,
      rate_without_fuel: vehicle.rates.withoutFuelDaily,
      rate_out_of_city: vehicle.rates.outOfCityDaily,
      rate_per_km: vehicle.rates.perKm,
      overtime_per_hour: vehicle.rates.overtimePerHour,
      driver_allowance: vehicle.rates.driverAllowance,
      night_stay_charge: vehicle.rates.nightStayCharge,
      security_deposit: vehicle.rates.securityDeposit,

      features: lines(vehicle.features),
      sketchfab_uid: model?.uid ?? "",
      sketchfab_title: model?.title ?? "",
      sketchfab_author: model?.authorName ?? "",
      sketchfab_license: model?.license ?? "",
      model_accuracy: model?.accuracy ?? "representative",
    },
  };
});

const services = fixtures.services.map((service) => ({
  slug: service.slug,
  title: service.title,
  content: (service.body ?? []).join("\n\n"),
  meta: {
    audience: service.audience,
    summary: service.summary,
    points: lines(service.points),
    related_classes: (service.relatedCategories ?? []).join(", "),
  },
}));

const cities = fixtures.cities.map((city) => ({
  slug: city.slug,
  title: city.name,
  content: "",
  meta: {
    is_base: city.isBase ? 1 : 0,
    intro: city.intro,
    uses: lines(city.uses),
    areas: lines(city.areas),
    airport: city.airport ?? "",
  },
}));

const routes = fixtures.routes.map((route) => ({
  slug: `${slugify(route.origin)}-${slugify(route.destination)}`,
  title: `${route.origin} to ${route.destination}`,
  content: "",
  meta: {
    origin: route.origin,
    destination: route.destination,
    distance_km: route.distanceKm,
    estimated_hours: route.estimatedHours,
    toll_charges: route.tollCharges ?? 0,
  },
}));

const faqs = fixtures.faqs.map((faq) => ({
  slug: slugify(faq.question).slice(0, 60),
  title: faq.question,
  content: faq.answer,
  meta: {},
}));

const clients = clientList.clients.map((client) => ({
  slug: client.slug,
  title: client.name,
  content: "",
  meta: {
    industry: client.industry ?? "",
    // Logos stay switched off until the business confirms it holds written
    // permission. Turning one on is a tick in the client's own screen.
    show_logo: 0,
    permission_on_file: 0,
  },
}));

const settings = {
  contact: {
    phone: site.contact.phone,
    phone_alt: site.contact.phoneAlt,
    whatsapp: site.contact.whatsapp,
    whatsapp_corporate: site.contact.whatsappCorporate,
    email: site.contact.email,
    email_corporate: site.contact.emailCorporate,
    address_line: site.contact.addressLine,
    city: site.contact.city,
    map_query: site.contact.mapQuery,
    google_business_url: site.contact.googleBusinessUrl,
    google_reviews_url: site.contact.googleReviewsUrl,
    public_site_url: site.url,
  },
  hours: { always_open: 1, weekdays: "", saturday: "", sunday: "", holidays: "" },
  social: site.social,
  fuel: {
    petrol: fixtures.fuelRates.petrol,
    diesel: fixtures.fuelRates.diesel,
    hi_octane: fixtures.fuelRates.hiOctane,
    effective_from: fixtures.fuelRates.effectiveFrom,
    note: fixtures.fuelRates.source ?? "",
  },
  pricing: {
    margin_percent: fixtures.pricingRules.marginPercent,
    included_km_per_day: fixtures.pricingRules.includedKmPerDay,
    round_to_nearest: fixtures.pricingRules.roundToNearest,
    charge_return_leg_fuel: fixtures.pricingRules.chargeReturnLegFuel ? 1 : 0,
    without_fuel_adjust: fixtures.pricingRules.withoutFuelAdjustPercent ?? 0,
    discount_7: discountFor(7),
    discount_14: discountFor(14),
    discount_30: discountFor(30),
  },
  payments: {
    advance_percent: site.legal.advancePercent,
    corporate_credit_days: site.legal.corporateCreditDays,
    methods: lines(site.legal.paymentMethods),
    bank_details: "",
    tax_note: "",
  },
  terms: {
    included: lines(site.rentalTerms.included),
    excluded: lines(site.rentalTerms.excluded),
    insurance: "",
    legal_reviewed: site.legal.reviewed ? 1 : 0,
  },
  offer: {
    enabled: site.offer.enabled ? 1 : 0,
    headline: site.offer.headline,
    body: site.offer.body,
    code: site.offer.code,
    terms: site.offer.terms,
    repeat_after_days: site.offer.repeatAfterDays,
  },
  claims: {
    years_in_service: site.claims.yearsInService,
    clients_served: site.claims.clientsServed,
    on_time_rate: site.claims.onTimeRate,
  },
};

function discountFor(days) {
  const band = (fixtures.pricingRules.longStayDiscounts ?? []).find(
    (entry) => entry.minDays === days,
  );
  return band ? band.percent : 0;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  settings,
  posts: {
    sts_vehicle: vehicles,
    sts_service: services,
    sts_city: cities,
    sts_route: routes,
    sts_faq: faqs,
    sts_client: clients,
  },
};

const out = join(root, "wp", "plugins", "sts-core", "data", "starter.json");
await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(payload, null, 1)}\n`, "utf8");

const counts = Object.entries(payload.posts)
  .map(([type, rows]) => `${rows.length} ${type.replace("sts_", "")}`)
  .join(", ");
console.log(`[starter] ${counts}, and ${Object.keys(settings).length} settings groups.`);
