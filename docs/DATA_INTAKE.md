# Data Intake Form

Fill this in directly — edit the file on GitHub (pencil icon) and commit, or paste
the answers into the chat. Either works.

If a spreadsheet you already have covers a section, upload it to `assets/data/`
instead and write "see spreadsheet" against that section. Do not retype data that
already exists somewhere.

Blank templates for the tabular sections are in `assets/data/templates/`.

---

## 1. Company Identity

| Field | Answer |
|---|---|
| Full legal / trading name | |
| Short name used in headings | |
| Year founded | |
| Tagline (one line) | |
| What the company does, in 3–4 sentences | |
| Registration or NTN number (shown in footer as a trust signal — optional) | |

---

## 2. Contact Details

These feed the header, footer, contact page, and the structured data that puts the
business on Google Maps and in local search results. Incomplete data here directly
costs local ranking.

| Field | Answer |
|---|---|
| Primary phone | |
| Secondary phone | |
| WhatsApp number — retail customers | |
| WhatsApp number — corporate (same as retail if only one) | |
| Email — general | |
| Email — corporate enquiries | |
| Office address, full | |
| City | |
| Google Maps link or pin for the office | |
| Opening hours — weekdays | |
| Opening hours — weekend | |
| 24/7 service available? | |

---

## 3. Social Links

All of these become admin-editable. Leave blank what does not exist.

| Platform | URL |
|---|---|
| Facebook | |
| Instagram | |
| YouTube | |
| TikTok | |
| LinkedIn | |
| X / Twitter | |

---

## 4. Service Area

| Question | Answer |
|---|---|
| Cities where vehicles can be picked up | |
| Cities you deliver to | |
| Do you serve the whole country for out-of-station trips? | |
| Airport pick-up and drop-off offered? Which airports? | |

Each pick-up city gets its own landing page. These pages are the main source of
organic search traffic, so list every city that is genuinely served.

---

## 5. Fleet and Rates

**Upload `assets/data/templates/fleet-and-rates.csv` filled in, or your own
spreadsheet, to `assets/data/`.**

One row per vehicle. Columns:

- `make`, `model`, `variant`, `year`, `category`, `transmission`, `fuel_type`
- `engine_cc`, `seats`, `doors`, `luggage`, `colors` (comma-separated)
- `mileage_city_kmpl`, `mileage_highway_kmpl`
- `rate_with_fuel_daily`, `rate_without_fuel_daily`, `rate_out_of_city_daily`
- `rate_per_km`, `overtime_per_hour`, `driver_allowance`, `night_stay_charge`
- `security_deposit`, `available_for_corporate`, `quantity_owned`

---

## 6. Pricing Rules

These decide whether the fare calculator produces the same number you would quote
on the phone. If any answer here is wrong, every quote on the site is wrong.

| Question | Answer |
|---|---|
| On a one-way trip, do you charge fuel for the return leg? | |
| On a within-city rental, how many km are included per day? | |
| What is charged beyond the included km? | |
| Driver allowance per day | |
| Night stay charge, and when it applies | |
| Overtime: after how many hours, at what rate | |
| Are toll and motorway charges included or extra? | |
| Do you add a margin on top of fuel cost? What percentage? | |
| Are quotes rounded? To the nearest how much? | |
| Advance payment required? What percentage? | |
| Minimum rental duration | |
| Any discount for weekly or monthly rentals? | |

**Worked example — please provide one.** Take a real recent booking and write out
how you arrived at the price. For example: *Lahore to Islamabad, Toyota Corolla,
2 days, with fuel — I charged X total, made up of …*. One real example resolves
more ambiguity than ten answers above.

---

## 7. Route Distances

**Upload `assets/data/templates/routes.csv`,** or let the site start with the
common corridors and add more from the admin later.

Columns: `origin`, `destination`, `distance_km`, `estimated_hours`,
`toll_charges`, `notes`.

---

## 8. Fuel Rates — today's values

| Fuel | Rate per litre (PKR) |
|---|---|
| Petrol | |
| Diesel | |
| Hi-octane | |
| Date these are effective from | |

---

## 9. Corporate Clients

| Question | Answer |
|---|---|
| How many corporate clients currently? | |
| Total vehicles on corporate contract | |
| Typical contract length | |
| Do any contracts have a confidentiality clause? | |
| Any client who has given written permission to show their name or logo? | |
| Industries served (telecom, banking, FMCG, …) | |
| What is included in a corporate contract? (driver, maintenance, replacement vehicle, fuel card) | |
| Billing: monthly invoice, credit terms, advance? | |
| Are drivers vetted or trained? Describe the process | |

---

## 10. Insurance and Safety

| Question | Answer |
|---|---|
| Are all vehicles insured? With whom? | |
| What does the cover include? | |
| Who bears damage liability — company or customer? | |
| Is a replacement vehicle guaranteed on breakdown? In how many hours? | |
| Are vehicles tracked? | |

Corporate buyers ask these questions first. Having real answers on the page
removes a phone call from the sales cycle.

---

## 11. Rental Terms

Needed for the Terms and Conditions page. This page is the company's legal
protection, so these must be the real policies, not invented ones.

| Question | Answer |
|---|---|
| Minimum driver age | |
| Documents required (CNIC, licence, …) | |
| Is a security deposit taken? How much, and when returned? | |
| Late return charge | |
| Fuel policy on without-fuel rentals (return full? charged on difference?) | |
| Cancellation policy and any charges | |
| What happens on an accident or damage | |
| Mileage limits and the charge for exceeding them | |
| Prohibited uses (racing, off-road, subletting, …) | |
| Inter-city travel permission needed? | |

---

## 12. Payment

| Question | Answer |
|---|---|
| What does "payment plans" mean for this business? | |
| Accepted methods (cash, bank transfer, JazzCash, EasyPaisa, card, cheque) | |
| Bank account details to publish, if any | |
| Should online payment be taken on the website in Phase 1, or Phase 2? | |
| Corporate credit terms (for example, 30-day invoice) | |
| Instalment options for long rentals? | |

---

## 13. Services

List every service offered, each with a one-line description. Starting points:

- Daily rental, with or without driver
- Monthly and long-term rental
- Corporate fleet leasing
- Airport transfer
- Wedding and event cars
- Tour packages
- Intercity transfer
- Staff pick and drop

---

## 14. Team

**Upload `assets/data/templates/team.csv`** or fill in here.

Columns: `name`, `role`, `short_bio`, `photo_filename`, `display_order`.

Photos go in `assets/brand/team/`.

---

## 15. Reviews and Testimonials

| Question | Answer |
|---|---|
| Do you have a Google Business Profile? Link it | |
| How many Google reviews, and the average rating? | |
| Do you have written testimonials from customers? | |
| Can corporate clients be quoted? With names, or anonymously? | |

If there are no genuine reviews yet, say so and the section stays hidden at
launch. It is switched on the moment real ones exist. Reviews are not invented —
section 10.2 of the project plan explains the consequence.

---

## 16. Offers

| Question | Answer |
|---|---|
| Exit-intent offer: what should it say, and what is the discount? | |
| Is there a discount code to apply? | |
| Any running promotions to feature on the homepage? | |
| First-time customer offer? | |

Whatever is published here is a promise to the customer, so it must be something
the business will actually honour.

---

## 17. Brand Assets

Upload to `assets/brand/`:

- Logo — SVG or AI preferred; PNG with a transparent background accepted
- Logo variants: light background, dark background, icon only
- Brand guidelines document, if one exists
- Any existing marketing material worth matching

| Question | Answer |
|---|---|
| Are the brand colours fixed, or is the palette in the plan acceptable? | |
| Is there an existing website to migrate content from? | |

---

## 18. Vehicle Photography

Upload to `assets/fleet/`, one folder per vehicle, named
`make-model-variant` — for example `toyota-yaris-ativ-x/`.

Per vehicle, ideally: front three-quarter, rear three-quarter, side, interior
front, interior rear, dashboard, boot.

| Question | Answer |
|---|---|
| Do you have real photographs of your own vehicles? | |
| If not, may manufacturer press images be used for now? | |

Real photographs of the actual fleet convert significantly better than catalogue
images, and visitors can tell the difference.

---

## 19. Technical Access

| Question | Answer |
|---|---|
| Is sidhutravelservices.com already registered? | |
| Where is DNS managed? | |
| cPanel hosting provider | |
| PHP version available | |
| Can a subdomain be created for the CMS? | |
| Frontend hosting: Vercel (recommended) or cPanel Node? | |
| Google Analytics property exists? | |
| Google Search Console access available? | |
| Google Business Profile claimed? | |

---

## 20. Content Tone

| Question | Answer |
|---|---|
| Formal and corporate, or warm and approachable? | |
| Any phrases the company always uses? | |
| Anything that must never appear on the site? | |
| Competitors worth looking at (for positioning, not for copying) | |
