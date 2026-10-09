/**
 * Site-wide configuration.
 *
 * Values marked PLACEHOLDER are stand-ins until the business supplies the real
 * data. They are listed in docs/PLACEHOLDERS.md and must all be replaced before
 * the site goes live: the contact details here feed the structured data that
 * places the business in local search results, and wrong values there are worse
 * than no values.
 *
 * Once the WordPress backend is connected these come from the settings endpoint
 * instead, and this file becomes the fallback.
 */

import { applyCmsSettings } from "./cms/applySettings";
import { cmsSettings } from "./cms/settings.generated";

const defaults = {
  name: "Sidhu Travel Services",
  shortName: "STS",
  // PLACEHOLDER
  tagline: "Rent a car in Pakistan, on your terms",
  // PLACEHOLDER
  description:
    "Car rental and corporate fleet services across Pakistan. Self-drive and chauffeur-driven vehicles, transparent fuel-based pricing and long-term contracts for business.",
  url: "https://sidhutravelservices.com",
  locale: "en_PK",

  contact: {
    phone: "+92 306 4441944",
    // PLACEHOLDER
    phoneAlt: "",
    whatsapp: "+92 306 4441944",
    // PLACEHOLDER — a separate corporate line, if there is one
    whatsappCorporate: "",
    email: "sidhutravel44@gmail.com",
    emailCorporate: "sidhupvtltd44@gmail.com",
    // PLACEHOLDER — the exact street address
    addressLine: "Office address to be confirmed",
    /**
     * What the footer map searches for. Replace with the exact address, or with
     * the coordinates from the Google Business listing, and the map moves with
     * it. No API key is needed for this kind of embed.
     */
    // PLACEHOLDER
    mapQuery: "Sidhu Travel Services, Lahore, Pakistan",
    /** PLACEHOLDER — the Google Business Profile link, for reviews and directions. */
    googleBusinessUrl: "",
    /** PLACEHOLDER — where the "leave a review" links point. */
    googleReviewsUrl: "",
    // PLACEHOLDER
    city: "Lahore",
    country: "Pakistan",
    // PLACEHOLDER
    hours: "Open 24 hours",
  },

  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
  },

  /** Pick-up cities. Each one gets a landing page. PLACEHOLDER list. */
  cities: ["Lahore", "Islamabad", "Rawalpindi", "Karachi", "Multan"],

  /**
   * Neighbourhoods we collect from and deliver to. Named explicitly because
   * "we cover Lahore" answers nobody's actual question, and because these are
   * the terms people search with.
   */
  serviceAreas: [
    "DHA, all phases",
    "Gulberg",
    "Johar Town",
    "Model Town",
    "Bahria Town",
    "Lahore Garrison",
    "Thokar Niaz Baig",
    "Saddar",
    "Mall Road",
    "Allama Iqbal International Airport",
  ],

  /**
   * What a rental does and does not cover.
   *
   * PLACEHOLDER — every line here is a promise to the customer and must be
   * confirmed before launch. Insurance is deliberately absent until the cover
   * in force is known; an unverified insurance claim is the worst kind to make.
   */
  rentalTerms: {
    included: [
      "A vehicle serviced and cleaned before handover",
      "Air conditioning and a full pre-trip check",
      "A direct line to us for the whole rental",
      "Roadside assistance if the vehicle lets you down",
    ],
    excluded: [
      "Fuel, on a without-fuel rental",
      "Tolls, motorway charges and parking",
      "The driver's meals and accommodation on overnight trips",
      "Damage beyond fair wear, charged against the security deposit",
    ],
  },

  /**
   * The offer shown on exit intent.
   *
   * Whatever is published here is a promise, so it is honoured. Setting
   * `enabled` to false removes it everywhere.
   */
  offer: {
    enabled: true,
    headline: "10% off your first booking",
    body: "New customers get 10% off the vehicle rate on a first confirmed booking. Quote the code when you send your request and we apply it to the quote.",
    code: "FIRST10",
    terms:
      "One use per customer, on the vehicle rate only, and not combined with a long-stay discount. Subject to availability.",
    /** Days before the same visitor is shown it again. */
    repeatAfterDays: 30,
  },

  /**
   * Policy values quoted on the legal pages.
   *
   * PLACEHOLDER — these are drafted from common practice in the Pakistani
   * rental market, not from the company's own rulebook. Every figure must be
   * confirmed by the owner, and the pages reviewed by a lawyer, before launch.
   * While `reviewed` is false the legal pages carry a notice saying so.
   */
  legal: {
    reviewed: false,
    lastUpdated: "2026-10-09",
    minimumDriverAge: 21,
    youngDriverSurchargeUnder: 25,
    licenceHeldMonths: 12,
    graceMinutesOnReturn: 60,
    advancePercent: 50,
    corporateCreditDays: 30,
    cancellation: [
      { window: "More than 48 hours before pick-up", charge: "No charge" },
      { window: "24 to 48 hours before pick-up", charge: "25% of the booking" },
      { window: "Less than 24 hours before pick-up", charge: "50% of the booking" },
      { window: "After the rental has started, or no-show", charge: "No refund" },
    ],
    paymentMethods: [
      "Cash at handover",
      "Bank transfer",
      "JazzCash and EasyPaisa",
      "Company cheque, for corporate accounts",
    ],
  },

  /**
   * Headline claims, supplied by the business. Editable in one place because
   * a visitor who doubts one of these numbers doubts the rest of the page.
   */
  claims: {
    yearsInService: "20+",
    clientsServed: "8,200+",
    onTimeRate: "99.8%",
  },
};

export type SiteConfig = typeof defaults;

/**
 * The live configuration.
 *
 * Whatever the backend has been given overrides the defaults above; anything it
 * has not been given keeps them. The merge happens at module load so every
 * component -- server-rendered or client-rendered -- reads the same values
 * synchronously.
 */
export const site: SiteConfig = applyCmsSettings(defaults, cmsSettings);
