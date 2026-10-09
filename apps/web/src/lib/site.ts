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

export const site = {
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
    // PLACEHOLDER
    addressLine: "Office address to be confirmed",
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
   * Headline claims, supplied by the business. Editable in one place because
   * a visitor who doubts one of these numbers doubts the rest of the page.
   */
  claims: {
    yearsInService: "20+",
    clientsServed: "8,200+",
    onTimeRate: "99.8%",
  },
} as const;

export type SiteConfig = typeof site;
