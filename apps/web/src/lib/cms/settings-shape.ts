/**
 * The shape of the backend's /sts/v1/settings response.
 *
 * Every field is optional: the backend only sends what has been filled in, and
 * an empty field must fall back to the default rather than blanking the site.
 */

export interface CmsSettings {
  contact?: {
    phone?: string;
    phone_alt?: string;
    whatsapp?: string;
    whatsapp_corporate?: string;
    email?: string;
    email_corporate?: string;
    address_line?: string;
    city?: string;
    map_query?: string;
    google_business_url?: string;
    google_reviews_url?: string;
  };
  hours?: {
    always_open?: boolean | string;
    weekdays?: string;
    saturday?: string;
    sunday?: string;
    holidays?: string;
  };
  social?: Partial<
    Record<
      "facebook" | "instagram" | "youtube" | "tiktok" | "linkedin" | "twitter",
      string
    >
  >;
  offer?: {
    enabled?: boolean | string;
    headline?: string;
    body?: string;
    code?: string;
    terms?: string;
    repeat_after_days?: number | string;
  };
  claims?: {
    years_in_service?: string;
    clients_served?: string;
    on_time_rate?: string;
  };
  terms?: {
    included?: string[];
    excluded?: string[];
    insurance?: string;
    legalReviewed?: boolean;
  };
  payments?: {
    advancePercent?: number;
    corporateCreditDays?: number;
    methods?: string[];
    bankDetails?: string;
    taxNote?: string;
  };
}
