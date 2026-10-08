# Sidhu Travel Services — Website Project Plan

**Domain:** sidhutravelservices.com
**Repository:** ahmad23012309/sts-website
**Status:** Planning locked for Phase 1. Open items tracked in section 13.
**Last updated:** 2026-10-08

---

## 1. Project Summary

A marketing and booking website for Sidhu Travel Services, a Pakistan-based car
rental company serving two distinct audiences:

1. **Retail customers** renting small and mid-size cars (Toyota Yaris, Honda City,
   Honda Civic, Kia, and similar) for daily, weekly, or trip-based use.
2. **Corporate clients** taking vehicles on long-term contract, including
   well-established companies.

The site must present both audiences clearly, let either one self-serve enough
information to make a decision, and capture the booking or lead without friction.

The site is a **headless build**: WordPress acts purely as the content and data
backend; every public page is custom-coded. No WordPress theme is served to the
public.

---

## 2. Architecture

### 2.1 Overview

```
                    sidhutravelservices.com                cms.sidhutravelservices.com
                 ┌──────────────────────────┐            ┌──────────────────────────┐
  Visitor ─────▶ │  Next.js 15 (App Router) │ ──REST──▶  │  WordPress (headless)    │
                 │  TypeScript + Tailwind   │            │  sts-core plugin         │
                 │  ISR + edge caching      │ ◀──JSON──  │  cPanel / PHP 8.2 / MySQL │
                 └────────────┬─────────────┘            └──────────────────────────┘
                              │                                        │
                   server-only API routes                      custom DB tables
                              │                                 bookings / leads
                              ▼                                        │
                 ┌──────────────────────────┐                          │
                 │  Outbound integrations   │ ◀────────────────────────┘
                 │  • Email (SMTP)          │
                 │  • WhatsApp notification │
                 │  • Management software   │  ← webhook adapter, Phase 2
                 │    webhook (queued)      │
                 └──────────────────────────┘
```

### 2.2 Stack decisions

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js 15, App Router, TypeScript | Server-rendered HTML is mandatory for the SEO and AI-search goals; ISR gives static-level speed with editable content |
| Styling | Tailwind CSS v4 + CSS custom properties | Design tokens live in one place; theme changes stay cheap |
| Animation | Framer Motion, used sparingly | Premium feel without harming Core Web Vitals |
| 3D | `<model-viewer>` with self-hosted `.glb` | Faster and more SEO-friendly than an iframe; see section 6.3 |
| Backend / CMS | WordPress, headless, on existing cPanel | Owner-friendly admin; no new system to learn |
| CMS extension | Custom plugin `sts-core`, version-controlled in this repo | Field definitions and REST routes live in git, not only in a database |
| Database | WordPress MySQL + dedicated custom tables | Bookings and leads do not belong in `wp_posts` |
| Forms protection | Cloudflare Turnstile | Free, privacy-respecting, no user puzzle |
| Validation | Zod, server-side on every write | Client validation is UX only, never a control |
| Hosting (frontend) | Vercel (recommended) — see open item O-1 | cPanel Node hosting is fragile for Next.js SSR/ISR |
| Hosting (CMS) | Existing cPanel | Already owned |
| Analytics | GA4 + Search Console | Pending confirmation |

**Firebase is not used.** It was dropped because WordPress covers content, custom
MySQL tables cover bookings and availability, and adding a second data store would
mean maintaining the same records in two places.

### 2.3 Repository layout

```
sts-website/
├─ apps/
│  └─ web/                     Next.js application
│     ├─ src/app/              routes
│     ├─ src/components/       UI components
│     ├─ src/lib/              CMS client, pricing engine, schema builders
│     └─ src/styles/           design tokens
├─ wp/
│  └─ plugins/sts-core/        custom WordPress plugin (CPTs, fields, REST, tables)
├─ docs/                       this plan, content briefs, runbooks
└─ .github/workflows/          CI: lint, typecheck, build
```

---

## 3. Design System

### 3.1 Colour palette

Extracted from the supplied reference screenshots, plus the requested yellow.

| Token | Hex | Use |
|---|---|---|
| `--c-ink` | `#121214` | Page background |
| `--c-surface` | `#1A1A1D` | Section background |
| `--c-card` | `#232227` | Cards, panels, modals |
| `--c-border` | `#333237` | Hairlines, dividers, card edges |
| `--c-gold` | `#C7A668` | Brand accent: logo lockup, rules, icons, secondary buttons |
| `--c-gold-light` | `#D9BC84` | Gold hover state |
| `--c-yellow` | `#FFC72C` | Primary call-to-action, price highlights, active states |
| `--c-yellow-deep` | `#E5A800` | Yellow hover state |
| `--c-text` | `#F5F3EF` | Primary text |
| `--c-text-muted` | `#A8A49C` | Secondary text, captions |
| `--c-whatsapp` | `#25D366` | WhatsApp controls only |
| `--c-available` | `#2ECC71` | Calendar: available |
| `--c-booked` | `#E5484D` | Calendar: booked |

**Gold versus yellow split.** Gold is the heritage accent and carries brand
identity: dividers, icon strokes, outlined buttons, the logo lockup. Yellow is the
action colour and is used only where we want a click: primary buttons, the fare
result figure, the active filter chip. Keeping them in separate roles stops the
palette looking muddy — two similar warm tones competing for the same job is the
most common way a dark gold theme goes wrong.

Contrast: `#FFC72C` on `#121214` is 11.9:1, and black text on `#FFC72C` is 12.4:1.
Both clear WCAG AA and AAA for normal text.

### 3.2 Typography

| Role | Font | Notes |
|---|---|---|
| H1–H4 | **Anton** | Condensed display face; set with generous letter-spacing on small sizes and never below 20px |
| Body copy, long-form | **Crimson Text** | Serif; minimum 17px on dark backgrounds for legibility |
| UI chrome | **Inter** — see open item O-2 | Buttons, form labels, table data, badges, specification numbers |

A serif at 13–14px on a near-black background loses definition, which is exactly
where booking forms, rate tables and specification grids live. A neutral sans for
that chrome only keeps the editorial feel intact while keeping the functional parts
readable. If this is rejected, everything falls back to Crimson Text at a larger
base size.

All fonts self-hosted as subset `.woff2` with `font-display: swap`. No Google Fonts
CDN request — it is a third-party round trip and a privacy liability.

### 3.3 Visual direction

**Reference material is reference only.** The supplied screenshots and any further
examples uploaded to `assets/` are used to understand layout decisions, information
hierarchy and component placement. Nothing is copied: the site gets its own
composition, spacing, motion and component design. Copying a competitor's layout
produces a site that looks derivative and carries copyright exposure on the design
work itself.

What is taken from the references is the structural thinking:

- Dark, cinematic surface with full-bleed vehicle photography
- Sticky translucent header with blurred backdrop
- Mega-menu dropdowns for Fleet categories and makes, with vehicle silhouettes
- Vehicle cards: large image, name left, price right in the accent colour,
  four-icon specification strip, dual action row (View Details / WhatsApp)
- Floating Call and WhatsApp pills, bottom right, on every page
- Top utility bar: social icons, phone number, language or currency slot

### 3.4 Responsive rules

Mobile is the primary target — the majority of Pakistani rental traffic is mobile.

- Breakpoints: 390 / 768 / 1024 / 1440
- The 3D viewer is fully gesture-controlled on touch and is never smaller than
  260px tall
- Sticky bottom action bar on mobile vehicle pages: price plus Book and WhatsApp
- Minimum touch target 44×44px throughout

---

## 4. WordPress Data Model (`sts-core` plugin)

### 4.1 Custom post types

**`vehicle`**
- Identity: make, model, variant, year, body type, slug
- Taxonomy `vehicle_category`: Economy, Sedan, SUV, Luxury, Van, Coaster
- Taxonomy `vehicle_make`: Toyota, Honda, Kia, Suzuki, …
- Specifications: transmission, fuel type, engine displacement, seats, doors,
  luggage capacity, air conditioning, mileage (city km/l), mileage (highway km/l)
- Colours: repeating group of { name, hex, gallery }
- Media: gallery, hero image, 360° frames (optional)
- 3D: `glb_url`, `sketchfab_uid`, `model_accuracy` (exact / representative)
- Rates: `rate_with_fuel_daily`, `rate_without_fuel_daily`, `rate_out_of_city_daily`,
  `rate_per_km`, `overtime_per_hour`, `driver_allowance`, `night_stay_charge`,
  `security_deposit`
- Flags: `available_for_corporate`, `is_featured`, `status`

**`route`** — fare presets: origin city, destination city, distance in km,
estimated duration, toll charges, notes.

**`testimonial`** — author name, company, rating, body, source, verified flag,
date. Only verified entries are eligible for structured data (see section 10.2).

**`team_member`** — name, role, photo, short biography, display order.

**`corporate_client`** — company name, logo, `logo_permission_granted` boolean,
anonymised label, case-study summary. **The logo is rendered only when
`logo_permission_granted` is true.** See section 10.1.

**`service`**, **`faq`**, **`city`** (for local landing pages), **`post`** (blog).

### 4.2 Global option groups

- **Fuel rates**: petrol, diesel, hi-octane, `updated_at`, source note
- **Pricing rules**: margin percentage, global without-fuel adjustment percentage,
  default driver allowance, night stay charge, return-leg fuel policy, rounding rule
- **Site settings**: phone numbers, WhatsApp numbers (retail and corporate),
  email, office address, map coordinates, opening hours
- **Social links**: Facebook, Instagram, YouTube, TikTok, LinkedIn, X — all editable
  from the admin, as required
- **Offers**: exit-intent offer headline, body, discount code, validity window,
  enable toggle

### 4.3 Custom database tables

Prefixed `sts_`, created on plugin activation:

- `sts_bookings` — every booking, with status lifecycle and source channel
- `sts_leads` — corporate callback requests and quick-form enquiries
- `sts_availability_blocks` — vehicle ID, start date, end date, reason
- `sts_webhook_queue` — outbound deliveries to the management software, with
  attempt count, next retry time, and last response

Bookings and leads are deliberately kept out of `wp_posts`: they carry personal
data, need indexed date-range queries, and must not be exposed by any generic
WordPress REST endpoint.

### 4.4 REST surface

Public, read-only, cached:
`/wp-json/sts/v1/vehicles`, `/vehicles/{slug}`, `/routes`, `/fuel-rates`,
`/pricing-rules`, `/settings`, `/testimonials`, `/team`, `/services`, `/faqs`,
`/availability/{vehicleId}`

Server-to-server, write, authenticated with a shared HMAC signature and rate
limited — reachable only from the Next.js API routes, never from a browser:
`POST /sts/v1/bookings`, `POST /sts/v1/leads`

The WordPress public frontend, XML-RPC, user enumeration, and the default REST
user endpoints are all disabled.

---

## 5. Pricing and Fare Engine

This is the most business-critical module, so the rules are written out explicitly
and implemented in one pure, unit-tested function
(`apps/web/src/lib/pricing/calculateFare.ts`).

### 5.1 Inputs

- Vehicle (mileage, rates, allowances)
- Trip type: within city / out of station / one-way transfer
- Distance in km (from the route table, or the Maps fallback)
- Number of days
- Fuel option: with fuel / without fuel
- Current fuel rate for the vehicle's fuel type
- Pricing rules (margin, allowances, return-leg policy)

### 5.2 Formula

```
base          = days × daily_rate_for_trip_type
fuel_cost     = with_fuel
                  ? (billable_distance ÷ mileage_kmpl) × fuel_rate_per_litre
                  : 0
billable_distance = one_way ? distance : distance × 2      (policy, see O-3)
driver_cost   = days × driver_allowance
night_stay    = nights_away × night_stay_charge
extras        = toll_charges + requested_add_ons
subtotal      = base + fuel_cost + driver_cost + night_stay + extras
total         = round_up_to_nearest_100(subtotal × (1 + margin_percent ÷ 100))
```

Every quote is rendered as an itemised breakdown, not a single number, and is
labelled an estimate with the fuel rate and date it was based on. A customer who
can see the arithmetic trusts it and argues about it less.

### 5.3 Fuel rates

Updated manually from the WordPress admin (petrol, diesel, hi-octane). Saving a
rate revalidates every page that depends on it, so the calculator, the vehicle
pages and the public fuel-price page all move together within seconds.

Automatic scraping of OGRA or PSO is deliberately not implemented: it breaks
silently whenever the source page changes, and it puts the site in an unclear
position with respect to those sites' terms. A manual field with a visible
"last updated" stamp is more reliable and more honest to the visitor.

### 5.4 Without-fuel rate control

Both mechanisms are built, since the owner may want either:

1. **Per-vehicle edit** — change one car's without-fuel daily rate directly
2. **Global adjustment** — a single percentage field that shifts every
   without-fuel rate at once, shown with a live preview of the resulting rates
   before saving

### 5.5 Distance source

1. **Primary:** curated `route` table in WordPress, covering the common corridors
   (Lahore–Islamabad, Lahore–Karachi, Lahore–Multan, Islamabad–Murree, and so on).
   Instant, free, and editable by the owner.
2. **Fallback:** Google Distance Matrix API for routes not in the table, called
   server-side with the key never exposed to the browser, with the result cached
   back so the same route is never charged twice.

The fallback stays switched off until billing is confirmed (open item O-4). Until
then, an unknown route shows a "request a quote" path instead of a wrong number.

---

## 6. Feature Specifications

### 6.1 Fleet

Filterable, sortable grid: category, make, transmission, seats, price range,
availability on a chosen date. Filters are reflected in the URL so a filtered view
is linkable and indexable. Each card: image, name, price, four key specifications,
View Details, WhatsApp.

### 6.2 Vehicle detail page

Order of content, matching the requested structure:

1. Vehicle name — make, model, variant, year (the page's single H1)
2. 3D model viewer with colour swatches
3. Price block: with fuel / without fuel, with a clear toggle
4. Key specifications grid
5. Full specification table
6. Fuel consumption and estimated running cost at today's fuel rate
7. Availability calendar
8. Booking panel — inline, no page change
9. WhatsApp booking button, pre-filled with the vehicle name
10. Similar vehicles and a "compare with" shortcut

### 6.3 3D models

Implementation: Google `<model-viewer>` with self-hosted `.glb` files, lazy-loaded
below the fold, with a poster image shown until the model is ready. Colour swatches
re-tint the body material at runtime rather than loading a separate file per colour.

Honest constraint, recorded so it is not a surprise later: exact 3D models of
Pakistani-market variants (Yaris ATIV X, City Aspire, and similar) largely do not
exist in free libraries. Each vehicle therefore carries a `model_accuracy` flag:

- `exact` — the real model, used as-is
- `representative` — correct body shape and class, labelled "representative 3D
  model — actual vehicle shown in photographs below"
- none — the photo gallery with colour swatches is shown instead, which still looks
  deliberate rather than broken

Any model sourced under a Creative Commons licence carries its required attribution
in a credits line on the page and in `/attributions`. This is a licence condition,
not an optional courtesy.

### 6.4 Comparison tool

Compare up to three vehicles of the same category side by side: every
specification, both rate types, fuel consumption, and estimated cost for a sample
trip at today's fuel rate. Differences are highlighted rather than left for the
reader to scan. Shareable via URL.

Specification data gathered from public sources carries an "indicative
specifications — confirmed at booking" note. Official brochures are requested in
open item O-5 so this can be upgraded to verified data.

### 6.5 Live fare calculator

Origin, destination, dates, vehicle, fuel option. Returns the itemised breakdown
from section 5.2 in real time, with the fuel rate used and its date shown. One
click converts the quote into a booking with the values carried across, and
another sends the same quote to WhatsApp as formatted text.

### 6.6 Daily fuel prices page

Public page listing petrol, diesel and hi-octane with the effective date, a short
plain-language note on what changed, and a historical table. Each vehicle's
running cost links back to it.

This page exists to earn organic traffic: fuel price is one of the highest-volume
recurring searches in Pakistan, it refreshes on a known schedule, and almost no
rental company competes for it. It is the cheapest traffic the site will get.

### 6.7 Availability calendar

Month view per vehicle: available, booked, blocked. Backed by
`sts_availability_blocks`, editable in the admin, and written to automatically when
a booking is confirmed. The read path goes through a single
`getAvailability(vehicleId, range)` function so that swapping the source to the
management software later is a change in one file.

### 6.8 Booking — two paths

Both write to the same validated endpoint and the same table.

- **Inline booking** — from the vehicle page, in a panel, without leaving the page
- **Instant booking page** — `/book`, a single-screen flow: vehicle, dates,
  pick-up and drop-off, fuel option, contact details, live running total, confirm

On submit: validate server-side, persist, send the customer a confirmation, alert
the office by email and WhatsApp, and enqueue the outbound webhook.

### 6.9 WhatsApp

- Floating sticky button on every page
- Per-vehicle button with a pre-filled message naming the vehicle and dates
- Quote hand-off from the fare calculator
- Separate retail and corporate numbers if supplied

### 6.10 Footer quick-booking form

Four fields only — vehicle, date, phone, city — posting to the same endpoint and
marked `source: footer_quick`. Deliberately short: it is a capture device, and
every extra field costs completions.

### 6.11 Corporate section

Dedicated `/corporate` area with the information a procurement decision needs:
fleet leasing terms, contract lengths, driver vetting and training, replacement
vehicle guarantee, insurance cover, monthly invoicing, and a service-level
summary. Callback request form routes to a separate lead pipeline with its own
notification, so a corporate enquiry is never buried under retail bookings.

Recommendations for keeping corporate clients well served, as requested:

- A gated corporate brochure PDF — a strong lead magnet for this audience
- Anonymised case studies with real numbers (fleet size, contract length, uptime)
- Named account manager with a direct line shown on the page
- **Phase 2 — corporate client portal**: authenticated access to the client's
  active vehicles, invoices, trip history, and a request form for additional
  vehicles. No competitor in this market offers it, and it is the single strongest
  retention feature available to this business.

### 6.12 Exit-intent offer

Desktop: mouse-leave detection. Mobile has no equivalent signal, so it triggers on
scroll depth combined with dwell time. Shown once per visitor per 30 days, stored
in `localStorage`, suppressed entirely during an active booking flow. Offer content
and the enable switch are editable in the admin. The offer content is pending in
open item O-6, and whatever is published will be honoured.

### 6.13 Reviews and testimonials

Homepage carousel plus a full `/reviews` page. **Only genuine reviews are
published**; see section 10.2 for why this is a hard line and not a preference.

---

## 7. Page Inventory

| Route | Purpose |
|---|---|
| `/` | Homepage |
| `/fleet` | Full fleet, filterable |
| `/fleet/[slug]` | Vehicle detail |
| `/fleet/category/[category]` | Category landing |
| `/compare` | Comparison tool |
| `/fare-calculator` | Live fare estimate |
| `/fuel-prices` | Daily fuel rates |
| `/book` | Instant booking |
| `/corporate` | Corporate services |
| `/corporate/callback` | Callback request |
| `/services` | Service list |
| `/services/[slug]` | Individual service |
| `/rent-a-car/[city]` | City landing pages |
| `/about` | About us |
| `/team` | Team |
| `/reviews` | Reviews |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/payment-plans` | Payment methods and corporate terms |
| `/terms` | Terms and conditions |
| `/privacy-policy` | Privacy policy |
| `/cancellation-policy` | Cancellation and refunds |
| `/attributions` | 3D model and asset credits |
| `/blog`, `/blog/[slug]` | SEO content |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Machine-readable |

---

## 8. SEO, AIO and GEO Plan

### 8.1 On-page

- Exactly one H1 per page; H2–H4 in strict hierarchy, never chosen for appearance
- Title and meta description editable per page in WordPress, with sensible
  generated defaults
- Canonical URLs, Open Graph and Twitter cards on every route
- Descriptive, keyword-aware slugs
- Every image carries meaningful alt text
- Internal linking: vehicle to category, category to city, city to fare calculator

### 8.2 Structured data (JSON-LD)

`Organization`, `LocalBusiness` / `AutoRental` with address, hours and geo,
`Product` + `Offer` per vehicle, `BreadcrumbList`, `FAQPage`, `WebSite` with
`SearchAction`, and `Review` / `AggregateRating` **only once genuine reviews
exist**.

### 8.3 Generative engine optimisation

- `llms.txt` describing the business, fleet and service area in plain text
- Direct question-and-answer blocks phrased the way people ask them, so an AI
  summary can lift a correct answer
- Entity-complete pages: full name, address, phone, service area and vehicle
  attributes present as text, not only inside images
- The fuel-price page as a citable, dated, factual reference

### 8.4 Performance budget

Target Lighthouse 95+ on mobile. LCP under 2.0s, CLS under 0.05, INP under 200ms.
AVIF and WebP via `next/image`, subset self-hosted fonts, deferred 3D, route-level
code splitting, ISR with on-demand revalidation from WordPress.

### 8.5 Search Console

`sitemap.xml` is generated from WordPress content at build and revalidation time.
Verification and submission require the live domain and account access, which this
session does not have. Deliverable: the verification file placed in the repository
plus a step-by-step runbook in `docs/SEARCH_CONSOLE.md`. See open item O-7.

---

## 9. Security

| Area | Control |
|---|---|
| Secrets | Environment variables only; never committed. `.env.example` documents the names |
| WordPress | Public frontend disabled, XML-RPC off, user enumeration blocked, admin behind 2FA, file editor disabled, auto-updates on |
| REST reads | Public but read-only, cached, and rate limited |
| REST writes | Server-to-server only, HMAC-signed, timestamped against replay, IP-allowlisted to the frontend |
| Forms | Cloudflare Turnstile, honeypot field, per-IP rate limit, server-side Zod validation on every field |
| Transport | HTTPS enforced, HSTS, secure cookies |
| Headers | Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| Personal data | Booking and lead data never logged in plain text; access restricted to admin roles |
| Dependencies | Lockfile committed, Dependabot enabled, CI blocks on high-severity advisories |
| Backups | Daily database and uploads backup on the cPanel host, retained 30 days |

---

## 10. Compliance Notes

### 10.1 Corporate client logos

Displaying a company's name or logo as a client is a trademark use and may breach a
confidentiality clause in the rental contract. The data model therefore gates every
logo behind an explicit `logo_permission_granted` flag, defaulting to false.

Until written permission exists, the section renders anonymised credentials —
"Trusted by leading telecom, banking and FMCG organisations", with case studies such
as "A leading telecom operator — 14 vehicles, 2 years". This reads as confident
rather than evasive, and carries no legal exposure. Logos are switched on
individually as permissions arrive. See open item O-8.

### 10.2 Reviews

Review and AggregateRating structured data must reflect real reviews. Fabricated
review markup is a documented Google policy violation and attracts a manual action,
which removes the entire site from search results — the exact opposite of the SEO
goal driving this project. Invented testimonials are also a consumer-protection
problem in their own right.

The build therefore ships the review components fully working but renders nothing
until real content is supplied. If no reviews exist yet, the section stays hidden
and the homepage uses trust signals that are true instead: years in operation,
fleet size, corporate client count, insurance status. See open item O-9.

### 10.3 Specification data

Specifications sourced from public references are labelled indicative until
official brochures replace them.

---

## 11. Integration with the Management Software

The management software is not yet built, so the website is built to connect to it
without being rewritten later.

Every booking and lead is written to `sts_webhook_queue` alongside its row in the
primary table. A worker drains the queue to a configurable endpoint with an HMAC
signature, exponential-backoff retries, and a dead-letter state after the final
attempt. The payload is a stable, versioned JSON contract documented in
`docs/INTEGRATION_CONTRACT.md`.

Consequences of this design:

- Turning the integration on later is a configuration change — a URL and a secret —
  not a code change
- A booking is never lost if the management software is down; it is simply retried
- The same contract can be consumed by the mobile application

Availability reads go through a single adapter function for the same reason: the
source can move from WordPress to the management software by swapping one
implementation.

---

## 12. Delivery Phases

**Phase 1 — core site**
Design system, all layout components, fleet and vehicle pages, comparison tool,
fare calculator, fuel-price page, both booking paths, WhatsApp integration,
corporate section with lead capture, all static pages, full SEO implementation,
sitemap, security hardening, WordPress plugin with the complete data model.

**Phase 2 — depth**
3D models across the full fleet, availability synchronised with the management
software, live webhook integration, payment gateway, corporate client portal,
blog programme, city landing-page expansion.

Phase 1 ships first and alone, because search ranking takes months to build and
every week the site is not live is a week of that clock not running.

---

## 13. Open Items

| ID | Item | Blocks |
|---|---|---|
| O-1 | Confirm frontend hosting: Vercel (recommended) or cPanel Node | Deployment |
| O-2 | Approve Inter for UI chrome alongside Anton and Crimson Text | Design system |
| O-3 | Confirm return-leg fuel policy on one-way trips | Fare engine |
| O-4 | Confirm whether Google Maps API billing will be enabled | Distance fallback |
| O-5 | Official specification brochures where available | Comparison data |
| O-6 | Exit-intent offer wording and discount | Offer component |
| O-7 | Search Console verification token or DNS access | Submission |
| O-8 | Written permission for any corporate client logo | Corporate section |
| O-9 | Real reviews, or confirmation to hide the section at launch | Reviews |
| O-10 | Complete rate card — blocked, see note below | Fare engine, all prices |
| O-11 | Fleet list with photographs | Fleet pages |
| O-12 | Contact details: phone, WhatsApp numbers, email, office address, hours | Schema, header, footer |
| O-13 | Cities served | City landing pages |
| O-14 | Team member details and photographs | Team page |
| O-15 | Terms and conditions: rental rules, age, licence, damage liability | Terms page |
| O-16 | Insurance status and cover | Corporate section, trust signals |
| O-17 | Definition of "payment plans" — methods, corporate credit terms, instalments | Payment page |
| O-18 | Online payment in Phase 1 or Phase 2 | Booking flow |
| O-19 | Analytics: GA4, Meta Pixel, cookie consent requirement | Tracking |
| O-20 | Logo files in vector format | Header, footer, favicon, Open Graph |

**Note on O-10.** The reference site nominated as the source for seed pricing,
`luxuryrentacar.pk`, is blocked by this environment's network policy, so the rates
could not be read automatically. Resolved by either allowing that host in the
environment's network settings, or supplying the rate card directly — the
spreadsheets already mentioned are likely to contain it.

Rates taken from a competitor are seed placeholders only. They are another
company's pricing, set for another company's cost base, and every figure needs the
owner's confirmation before launch. The admin makes changing them a one-field edit.
