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
| Primary phone | `+92 300 0000000` | Data intake §2 |
| WhatsApp number | `+92 300 0000000` | Data intake §2 |
| Corporate WhatsApp | empty | Data intake §2 |
| Email addresses | `info@` / `corporate@` | Data intake §2 |
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

## Deliberately empty, not placeholders

These render nothing on purpose and must stay that way until real content
exists:

- **Testimonials** — the section is hidden while no genuine reviews exist.
  Publishing invented reviews with `Review` structured data carries a Google
  manual action against the whole domain.
- **Corporate client logos** — industry labels are shown instead of names, until
  written permission is on file for each client.

## Content still to be written

`/about`, `/team`, `/terms`, `/privacy-policy`, `/cancellation-policy`,
`/payment-plans` — all pending the data intake form.
