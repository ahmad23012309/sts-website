# Placeholders

Everything on this list is a stand-in. The site must not go live until each one
is replaced with real information.

While `NEXT_PUBLIC_DATA_SOURCE` is anything other than `cms`, a yellow ribbon
sits at the top of every page saying the figures are placeholders. It disappears
on its own once the backend is connected, so it cannot be left on by accident.

## Business details — `apps/web/src/lib/site.ts`

| Value | Current placeholder | Needed from |
|---|---|---|
| Tagline | "Rent a car in Pakistan, on your terms" | Data intake §1 |
| Description | Generic summary | Data intake §1 |
| Primary phone | **Supplied** — `+92 306 4441944` | — |
| WhatsApp number | **Supplied** — `+92 306 4441944` | — |
| Corporate WhatsApp | empty, if there is a separate line | Data intake §2 |
| Email addresses | **Supplied** — `sidhutravel44@gmail.com`, `sidhupvtltd44@gmail.com` | — |
| Office address | "Office address to be confirmed" | Data intake §2 |
| Opening hours | "Open 24 hours" | Data intake §2 |
| Social links | all empty — icons hide themselves | Data intake §3 |
| Cities | Lahore, Islamabad, Rawalpindi, Karachi, Multan | Data intake §4 |

The contact values feed the `AutoRental` structured data that places the company
in Google's local results. Wrong values there are worse than none.

## Fleet and pricing — `apps/web/src/lib/cms/fixtures.ts`

| Value | Current placeholder | Needed from |
|---|---|---|
| Fleet list | **Supplied.** 81 vehicles across 20 models, from the register in `assets/data/list-of-vehicles-and-models.pdf` | — |
| Vehicle specifications | Indicative figures per model | Data intake §5, official brochures |
| All daily, per-km and allowance rates | Invented | Data intake §5 |
| Mileage figures | Indicative | Data intake §5, official brochures |
| Fuel rates | Preview values | Data intake §8 |
| Pricing rules: margin, included km, return-leg policy | Assumed | Data intake §6 |
| Route distances | Approximate | Data intake §7 |

## Brand

| Value | Status |
|---|---|
| Logo | Supplied. The scan was background-removed and is in use, but it is a raster image — a vector version (SVG, AI or EPS) is still wanted so the mark stays sharp at every size and in print |
| Palette | Final. Sampled from the logo artwork |
| Vehicle photography | Still outstanding. `VehicleMedia` draws a placeholder labelled "photography pending" |

## Awaiting Sketchfab model selection

`model3d` is `null` on every vehicle. The viewer, the credit line and the
`/attributions` page are all built and working; each vehicle lights up as soon
as a Sketchfab model UID, title, author, author URL, model URL and licence are
recorded against it.

Sketchfab is blocked by this environment's network policy, so the models could
not be chosen from here. Either allow `sketchfab.com` and `api.sketchfab.com`
in the environment's network settings, or supply the model links directly.

Models are mounted only when the visitor presses "View in 3D", because the
Sketchfab player costs several megabytes. Licences that require crediting the
author are honoured by the credit line beneath every viewer and on the
attributions page.

## Claims that need confirming

These are published as fact and a customer may test any of them.

| Claim | Where |
|---|---|
| 20+ years in service | Announcement ticker |
| 8,200+ clients served | Announcement ticker |
| 99.8% on-time record | Announcement ticker |
| 10% off first booking, code FIRST10 | Exit-intent offer |
| What a rental includes and excludes | Every vehicle page |
| Long-stay discounts: 10% from 7 days, 15% from 14, 20% from 30 | Fare calculator |

All live in `apps/web/src/lib/site.ts` and the pricing rules, so each is a
one-line change.

**Insurance is deliberately absent** from the "included" list. Until the cover
actually in force is known, an insurance claim is the worst kind to publish: it
is the first thing a corporate client checks and the first thing disputed after
an accident. Confirm the cover and it goes on the page.

## Deliberately empty, not placeholders

These render nothing on purpose and must stay that way until real content
exists:

- **Testimonials** — the section is hidden while no genuine reviews exist.
  Publishing invented reviews with `Review` structured data carries a Google
  manual action against the whole domain.
- **Corporate client logos** — industry labels are shown instead of names, until
  written permission is on file for each client.

## Legal pages — drafted, not approved

`/terms`, `/privacy-policy`, `/cancellation-policy` and `/payment-plans` are
written and live. They are **drafts**, and the pages say so: while
`site.legal.reviewed` is false each one carries a notice that it is under
review and that the signed rental agreement governs where the two differ.

What they are built from:

- **Terms, cancellation and payment** — common practice in the Pakistani
  rental market. A minimum driver age of 21 with a surcharge under 25, licence
  plus CNIC or passport, an International Driving Permit for a foreign licence
  not in the Roman alphabet, and a deposit held and returned on check-in are
  the market norms the drafts follow. Every number lives in `site.legal` or the
  pricing rules.
- **Privacy** — written from what this website actually does, which is the one
  policy that can be accurate without asking anyone. It describes the real
  legal position: Pakistan has no enacted data protection statute, the Personal
  Data Protection Bill is still a draft, privacy is protected under Article 14
  of the Constitution, and PECA 2016 as amended applies. It claims adherence to
  the draft bill's principles rather than compliance with a law that does not
  exist.

**Before launch:** the owner confirms every figure, a lawyer reads all four,
then `site.legal.reviewed` is set to true and the notices disappear.

| Value to confirm | Draft |
|---|---|
| Minimum driver age | 21 |
| Young driver surcharge under | 25 |
| Licence held for | 12 months |
| Grace period on return | 60 minutes |
| Advance to confirm a booking | 50% |
| Corporate credit terms | 30 days |
| Cancellation bands | Free over 48h, 25% at 24–48h, 50% under 24h, none after start |
| Payment methods | Cash, bank transfer, JazzCash, EasyPaisa, company cheque |
| Included and excluded in the rate | See `site.rentalTerms` |

## Cities

`/rent-a-car/lahore`, `islamabad`, `rawalpindi`, `karachi`, `multan`. Lahore is
confirmed as the base. **The other four need confirming** — the pages say they
are served from Lahore rather than implying a depot in each, but if we do not
serve one of them it should come out of `site.cities` and its page goes with
it.

## Pages not built, and why

`/team` and `/reviews` are **removed from the menu** rather than built empty. A
menu entry leading to a blank page costs more trust than the missing page does.
Both appear the moment there is content: team names and photographs for one,
genuine reviews for the other.

## Fleet photography

Four vehicles now carry a picture: the Coaster, the Hiace, the Corolla Altis
and the Land Cruiser AXG. These are **manufacturer press renders** of the exact
models on the register, cut out of their white studio backgrounds, supplied so
the layout could be reviewed with real vehicles in it.

They must be replaced with the company's own photographs before launch:

- A render shows a trim level, a colour and a condition the customer may not
  get. A photograph of the actual coaster is both honest and more persuasive.
- The renders belong to Toyota. Publishing them on a commercial site is the
  manufacturer's call, not ours.

What to shoot, for each vehicle on the register: a three-quarter front on a
plain light background, an interior looking down the aisle or at the rear seat,
and the luggage space. Landscape, as wide as the camera allows. Dropping them in
needs nothing but the file and four lines in `fixtures.ts`, or an upload in
WordPress once the backend is connected.

The remaining sixteen models still show the drawn placeholder, which is
deliberate: an empty frame would look broken, and a borrowed photograph of the
wrong vehicle would be worse.
