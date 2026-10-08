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
    // PLACEHOLDER
    phone: "+92 300 0000000",
    // PLACEHOLDER
    phoneAlt: "",
    // PLACEHOLDER
    whatsapp: "+92 300 0000000",
    // PLACEHOLDER
    whatsappCorporate: "",
    // PLACEHOLDER
    email: "info@sidhutravelservices.com",
    // PLACEHOLDER
    emailCorporate: "corporate@sidhutravelservices.com",
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
} as const;

export type SiteConfig = typeof site;
