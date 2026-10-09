# STS Core

The backend for sidhutravelservices.com. WordPress holds the content and the
numbers; the website reads them and renders the pages.

Nothing the office needs to change should ever require a developer. If
something turns out to be fixed in the website's code that ought to be
editable here, that is a bug in this plugin, not a feature request.

## Installing

1. Copy `sts-core` into `wp-content/plugins/` on the CMS install.
2. Activate it. Tables are created and the vehicle classes are seeded.
3. Fill in **Sidhu Travel → Contact**, then the other settings groups.
4. Under **Management software**, set the webhook URL and a signing secret.
   The same secret goes into the website's `SUBMISSION_WEBHOOK_SECRET`.

## The menu

| Screen | What it is for |
|---|---|
| **Bookings** | Every booking and enquiry, with a status you can change inline |
| **Vehicles** | The fleet: specifications, rates, photographs, 3D model |
| **Services, Cities, Clients, Testimonials, Team, Routes, FAQs** | The content behind those parts of the site |
| **Contact, Opening hours, Social links** | What appears in the header, footer and contact page |
| **Fuel rates** | Today's prices. Saving writes a row to the history the fuel page is built from |
| **Pricing rules** | Service charge, included kilometres, long-stay discounts, return-leg fuel |
| **Payments, What the rate covers, Offer, Announcement bar** | The rest of what the site says |
| **API keys** | Keys for the management software |
| **Delivery queue** | Bookings on their way out, and any that failed |
| **Rate changes** | Who changed which price, and when |

## How a booking travels

1. The website validates the submission and signs it.
2. `POST /wp-json/sts/v1/submissions` verifies the signature and stores it.
3. The same payload is queued for the management software.
4. The queue is drained immediately, and again every five minutes. Failures
   back off — one minute, five, fifteen, an hour, four hours, twelve — and
   then stop and wait in **Delivery queue** to be sent again by hand.

The booking is stored **before** it is queued, so it is never lost because the
software was unreachable, and the office has it either way.

## Security

- The signing secret proves a submission came from the website. The timestamp
  is part of what is signed and must be within five minutes, so a captured
  request cannot be replayed. Comparison is constant-time.
- API keys are stored as a hash. The plain key exists once, on the screen that
  creates it. A stolen database does not yield a working key.
- The public front end redirects away; this install is not a website.
- XML-RPC is off, user enumeration through the REST API is removed, and the
  core REST API requires a login. The plugin's own `/sts/v1/` read routes stay
  public, because that is what the website reads.
- Login errors do not say whether the username existed.

## The read API

All public, all cacheable for a minute:

```
GET /wp-json/sts/v1/settings
GET /wp-json/sts/v1/pricing
GET /wp-json/sts/v1/fuel
GET /wp-json/sts/v1/vehicles
GET /wp-json/sts/v1/vehicles/{slug}
GET /wp-json/sts/v1/routes
GET /wp-json/sts/v1/services
GET /wp-json/sts/v1/cities
GET /wp-json/sts/v1/clients
GET /wp-json/sts/v1/testimonials
GET /wp-json/sts/v1/team
GET /wp-json/sts/v1/faqs
GET /wp-json/sts/v1/availability/{vehicleId}
```

Testimonials are only returned when marked verified, and client logos only
when marked to show. Both defaults are off.

## For the management software

```
GET   /wp-json/sts/v1/bookings?status=new&limit=50
PATCH /wp-json/sts/v1/bookings/{id}      body: {"status":"confirmed"}
```

Authenticate with `Authorization: Bearer sts_...`.

Deliveries arrive signed:

```
X-STS-Timestamp: 1760000000
X-STS-Signature: hex hmac_sha256("<timestamp>.<body>", secret)
X-STS-Event:     booking.created
```

Verify by recomputing the signature and comparing in constant time, and reject
anything more than five minutes old.
