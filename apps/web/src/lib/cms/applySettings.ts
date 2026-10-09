import type { CmsSettings } from "./settings-shape";

/**
 * Lays the backend's settings over the defaults in lib/site.ts.
 *
 * The merge is written out field by field rather than done generically. A deep
 * merge would silently accept a renamed or mistyped key from the backend and
 * leave the site showing a default nobody intended; this way a rename is a type
 * error at build time.
 *
 * An empty string from the backend means "not filled in" and keeps the
 * default. That matters because the WordPress settings screen saves every field
 * in a group together, so an untouched field arrives as an empty string rather
 * than as absent.
 */

function text(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Keeps a blank social link blank: an empty href is worse than no icon. */
function link(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed !== undefined && trimmed !== "" ? trimmed : fallback;
}

function flag(value: boolean | string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return value === "1" || value.toLowerCase() === "true";
}

function count(value: number | string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function list(value: string[] | undefined, fallback: string[]): string[] {
  return value && value.length > 0 ? value : fallback;
}

/** Composes the opening hours into the single line the site displays. */
function composeHours(
  hours: CmsSettings["hours"],
  fallback: string,
): string {
  if (!hours) return fallback;
  if (flag(hours.always_open, false)) return "Open 24 hours";

  const parts = [
    hours.weekdays?.trim() && `Mon to Fri ${hours.weekdays.trim()}`,
    hours.saturday?.trim() && `Sat ${hours.saturday.trim()}`,
    hours.sunday?.trim() && `Sun ${hours.sunday.trim()}`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : fallback;
}

export function applyCmsSettings<T extends SiteShape>(
  defaults: T,
  cms: CmsSettings | null,
): T {
  if (!cms) return defaults;

  const contact = cms.contact ?? {};
  const social = cms.social ?? {};
  const offer = cms.offer ?? {};
  const claims = cms.claims ?? {};
  const terms = cms.terms ?? {};
  const payments = cms.payments ?? {};

  return {
    ...defaults,
    contact: {
      ...defaults.contact,
      phone: text(contact.phone, defaults.contact.phone),
      phoneAlt: link(contact.phone_alt, defaults.contact.phoneAlt),
      whatsapp: text(contact.whatsapp, defaults.contact.whatsapp),
      whatsappCorporate: link(
        contact.whatsapp_corporate,
        defaults.contact.whatsappCorporate,
      ),
      email: text(contact.email, defaults.contact.email),
      emailCorporate: text(
        contact.email_corporate,
        defaults.contact.emailCorporate,
      ),
      addressLine: text(contact.address_line, defaults.contact.addressLine),
      city: text(contact.city, defaults.contact.city),
      // The map falls back to the address so it still points somewhere real.
      mapQuery: text(
        contact.map_query ?? contact.address_line,
        defaults.contact.mapQuery,
      ),
      googleBusinessUrl: link(
        contact.google_business_url,
        defaults.contact.googleBusinessUrl,
      ),
      googleReviewsUrl: link(
        contact.google_reviews_url ?? contact.google_business_url,
        defaults.contact.googleReviewsUrl,
      ),
      hours: composeHours(cms.hours, defaults.contact.hours),
    },
    social: {
      facebook: link(social.facebook, defaults.social.facebook),
      instagram: link(social.instagram, defaults.social.instagram),
      youtube: link(social.youtube, defaults.social.youtube),
      tiktok: link(social.tiktok, defaults.social.tiktok),
      linkedin: link(social.linkedin, defaults.social.linkedin),
    },
    rentalTerms: {
      included: list(terms.included, defaults.rentalTerms.included),
      excluded: list(terms.excluded, defaults.rentalTerms.excluded),
    },
    offer: {
      ...defaults.offer,
      enabled: flag(offer.enabled, defaults.offer.enabled),
      headline: text(offer.headline, defaults.offer.headline),
      body: text(offer.body, defaults.offer.body),
      code: text(offer.code, defaults.offer.code),
      terms: text(offer.terms, defaults.offer.terms),
      repeatAfterDays: count(
        offer.repeat_after_days,
        defaults.offer.repeatAfterDays,
      ),
    },
    legal: {
      ...defaults.legal,
      /**
       * The draft notice on the policy pages comes down only when the owner
       * ticks the box in the backend. Nothing on the site can tick it.
       */
      reviewed: flag(terms.legalReviewed, defaults.legal.reviewed),
      advancePercent: count(
        payments.advancePercent,
        defaults.legal.advancePercent,
      ),
      corporateCreditDays: count(
        payments.corporateCreditDays,
        defaults.legal.corporateCreditDays,
      ),
      paymentMethods: list(payments.methods, defaults.legal.paymentMethods),
    },
    claims: {
      yearsInService: text(
        claims.years_in_service,
        defaults.claims.yearsInService,
      ),
      clientsServed: text(claims.clients_served, defaults.claims.clientsServed),
      onTimeRate: text(claims.on_time_rate, defaults.claims.onTimeRate),
    },
  };
}

/** The part of the site config the backend is allowed to override. */
interface SiteShape {
  contact: {
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    whatsappCorporate: string;
    email: string;
    emailCorporate: string;
    addressLine: string;
    city: string;
    mapQuery: string;
    googleBusinessUrl: string;
    googleReviewsUrl: string;
    hours: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
  };
  rentalTerms: { included: string[]; excluded: string[] };
  offer: {
    enabled: boolean;
    headline: string;
    body: string;
    code: string;
    terms: string;
    repeatAfterDays: number;
  };
  legal: {
    reviewed: boolean;
    advancePercent: number;
    corporateCreditDays: number;
    paymentMethods: string[];
  };
  claims: {
    yearsInService: string;
    clientsServed: string;
    onTimeRate: string;
  };
}
