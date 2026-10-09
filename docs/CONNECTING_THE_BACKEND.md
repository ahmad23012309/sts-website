# Connecting the website to the WordPress backend

The website runs on fixtures until it is told otherwise. Everything below is
what switches it over to reading the real backend. Nothing here needs code
changes: it is four environment variables on the website and two fields in
WordPress.

## How content travels

There are two paths, and they are deliberately different.

**Live reads.** Vehicles, rates, fuel prices, availability, routes, services,
cities, testimonials and FAQs are fetched from `/wp-json/sts/v1/` on the
server, cached briefly, and re-read when the cache expires. Anything priced is
cached for 60 seconds; availability for 30; pages that rarely change for 300.
If the backend is down or slow the site serves the fixtures and logs the
reason, because a rental site that shows slightly stale rates is better than
one that shows an error page.

**Baked-in settings.** Contact details, opening hours, social links, the exit
offer, the headline claims, what the rate includes, and the payment terms are
read once at build time and written into
`apps/web/src/lib/cms/settings.generated.ts`. They are handled this way because
the header, the floating contact rail, the booking forms and the offer all run
in the browser and cannot wait on a fetch. The trade-off: a change to these
takes effect on the next build, not immediately. The cache-clear hook below
makes that automatic.

Anything either path does not supply falls back to `apps/web/src/lib/site.ts`,
which is where the current placeholder values live.

## On the website (Vercel → Settings → Environment Variables)

| Name | Value | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_DATA_SOURCE` | `cms` | Without this the site stays on fixtures no matter what else is set. |
| `WORDPRESS_API_URL` | `https://sidhutravelservices.com` (or wherever WordPress lives) | No trailing slash. The code appends `/wp-json/sts/v1/...` itself. |
| `NEXT_PUBLIC_SITE_URL` | `https://sidhutravelservices.com` | Used for canonical URLs, the sitemap and structured data. |
| `REVALIDATE_SECRET` | a long random string | Shared with WordPress so it can clear the cache. Generate one and keep it secret. |

Add them to Production, Preview and Development, then redeploy. The build log
prints `[settings] wrote contact, hours, ...` when it reached the backend, and
`[settings] could not read ...` when it did not — if you see the second line,
the site deployed on the placeholders and `WORDPRESS_API_URL` is wrong or
WordPress is blocking the request.

## In WordPress (STS → Settings → Management software)

| Field | Value |
| --- | --- |
| Website cache-clear address | `https://sidhutravelservices.com/api/revalidate` |
| Cache-clear secret | the same string as `REVALIDATE_SECRET` |

With these filled in, every save of a vehicle, service, city, client,
testimonial, route or FAQ, and every change to a settings group, sends one
signed ping to the website and the cached content is dropped at once. The ping
carries no content — the website re-reads what it needs itself — so a captured
ping cannot be used to put anything on the site. It is signed with
HMAC-SHA256 over `<timestamp>.<body>`, compared in constant time, and rejected
after five minutes.

Changes to the baked-in settings still need a rebuild to appear. Add a Vercel
Deploy Hook and paste its URL in the same screen if the business wants those
automatic too.

## Checking it worked

1. Open `https://<your-wordpress>/wp-json/sts/v1/settings` in a browser. You
   should see JSON. If you see a login page or a 404, the plugin is not active
   or permalinks need saving once under Settings → Permalinks.
2. Change the petrol price in STS → Settings → Fuel rates and save.
3. Reload `/fuel-prices` on the website. The new rate should be there within a
   few seconds. If it takes a minute, the cache-clear hook is not configured
   and the site is waiting for the cache to expire on its own.
4. Change the phone number in STS → Settings → Contact and save, then redeploy.
   The header, the contact rail and the WhatsApp buttons should all follow it.

## What is still on placeholders

Until the backend has real values in them, these come from `lib/site.ts` and
are wrong on purpose so they are easy to spot: the street address, the map
location, the Google Business link, the second phone number, the corporate
WhatsApp number, and the insurance line. `docs/PLACEHOLDERS.md` is the full
list.

## Starter data

Activating the plugin fills WordPress with what the website was built from: the
twenty vehicles on the register with their specifications and rates, the six
services, the five cities, the nine routes, the questions, the client list, and
the contact, fuel, pricing, payment and offer settings. It runs by itself on the
first admin page load after activation, and can be run again from **Sidhu
Travel → Starter data**.

Re-running it only adds what is missing. A vehicle that already exists is left
alone and a setting that already has a value is not touched, so it can never
undo an afternoon's editing.

The file it reads, `data/starter.json`, is generated from the website's own
fixtures by `npm run export:starter`. Change a rate in the fixtures and the
starter data follows; the two cannot drift apart.

Two things are deliberately left switched off:

- **Client logos.** Every client is imported with its logo hidden and
  "written permission held" unticked. Publishing a company's mark without
  permission is the company's risk to take, not ours, so it is a tick per
  client in their own screen.
- **Testimonials.** None are imported. The endpoint only returns ones marked
  verified, because invented review markup risks a manual action against the
  whole domain.

## If the backend looks empty

The website asks for `/wp-json/sts/v1/...` first and falls back to
`/?rest_route=/sts/v1/...` when that returns 404. The pretty form only exists
once WordPress is using pretty permalinks, which a fresh install is not; the
fallback means the site works either way. Setting **Settings → Permalinks** to
**Post name** once is still worth doing, since the pretty form is cached better.
