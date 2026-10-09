# What the Backend Controls

Everything on this list is editable by the office without a developer. Nothing
on this list should ever require a code change.

## Asked for

| Area | Fields |
|---|---|
| **Fleet** | Every vehicle: make, model, variant, year, class, specifications, colours, features, photographs, 3D model, how many are owned, and whether it is offered on contract |
| **Rates** | Per vehicle: with-fuel daily, without-fuel daily, out-of-station daily, per kilometre, overtime per hour, driver allowance, night stay, security deposit |
| **Packages** | Named packages with their own inclusions and prices, usable alongside the per-day rates |
| **Photographs** | Upload and reorder per vehicle; the first becomes the card image |
| **Contact** | Phone numbers, WhatsApp numbers (retail and corporate), both email addresses |
| **Social links** | Facebook, Instagram, YouTube, TikTok, LinkedIn, X. A blank one disappears from the site |
| **Payment methods** | The list shown on the payment page, with advance percentage and corporate credit days |
| **Office hours** | Per day, plus holidays and a 24/7 switch |
| **Address** | Street address and the map location, which moves the footer map |
| **Reviews** | Google Business link, Google reviews link, and manually added testimonials |
| **API keys** | Keys for the management software: issue, label, revoke, and see when each was last used |
| **Bookings** | Every booking and lead in the admin, with status, and also delivered to the management software |

## Things worth adding while we are here

Each of these is already in the code reading from a value that should be
editable rather than fixed.

| Area | Why it matters |
|---|---|
| **Fuel rates** | Every with-fuel quote is built on them. Daily edit, with the effective date and the history table that drives the fuel prices page |
| **Pricing rules** | Service charge percentage, included kilometres per day, rounding, whether a one-way trip is charged fuel for the return leg |
| **Long-stay discounts** | The bands: 10% from 7 days, 15% from 14, 20% from 30 |
| **Route table** | Origin, destination, distance, duration and tolls. This is what the fare calculator reads |
| **Availability** | Block dates per vehicle, so the calendar stops saying nothing is known |
| **The offer** | Headline, body, code, terms, and an on-off switch. Currently 10% off, code FIRST10 |
| **Announcement bar** | The claims that scroll across it: years in service, clients served, on-time record |
| **What the rate includes and excludes** | The two lists on every vehicle page. Insurance goes in here once confirmed |
| **Legal pages** | The four policy pages, plus the switch that removes the "draft under review" notice |
| **Cities** | Which cities get a landing page, and the Lahore areas listed in the footer |
| **Client logos** | Upload, reorder, and switch any single client off without losing the record |
| **Services** | The six service pages: text, bullet points and which vehicle classes each draws on |
| **Team** | Name, role, photograph, order. The page returns when there is content |
| **SEO per page** | Title and meta description, with the generated ones as defaults |
| **Notification recipients** | Which email addresses and WhatsApp numbers a new booking alerts |
| **Taxes and levies** | Shown separately on invoices |
| **A log of rate changes** | Who changed which rate and when. In a business priced on fuel, this is the record that settles a dispute with a customer or a driver |
| **Roles** | Who may edit rates, and who may only edit content. Not everyone with a login should be able to move a price |

## How bookings reach both places

A booking is written to the backend **and** queued for the management
software, not one or the other.

1. The website validates the submission and writes it to the backend.
2. The same payload is queued for delivery to the management software, signed
   so it can be verified.
3. Delivery retries with increasing gaps, and a failure after the last attempt
   is held in a dead-letter list the office can see and retry.

This means a booking is never lost because the management software was down,
and the office always has the record even before the software has it.

## API keys

The management software authenticates with a key issued in the backend. Each
key has a label, a creation date, a last-used date and a revoke button. Keys
are stored hashed, shown once at creation, and never again — the same way a
bank shows a card number once. Revoking one takes effect immediately.
