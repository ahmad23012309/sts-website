# Deployment

Two things are deployed separately, because they need different servers:

| Part | What it needs | Where |
|---|---|---|
| **Website** (Next.js) | Node.js | Vercel |
| **Backend** (WordPress) | PHP and MySQL | the existing cPanel host |

WordPress needs PHP; Next.js needs Node. One machine rarely does both well,
and keeping them apart means the website stays up even while the backend is
being worked on.

---

## 1. The website

### First deployment

1. Create an account at vercel.com and sign in with GitHub.
2. **Add New → Project**, choose `ahmad23012309/sts-website`.
3. Set **Root Directory** to `apps/web`. Everything else is detected.
4. Add the environment variables from `apps/web/.env.example`. For a first
   preview only two matter:
   - `NEXT_PUBLIC_SITE_URL` — the address it will be served from
   - `NEXT_PUBLIC_DATA_SOURCE` — leave as `fixtures` until WordPress is live
5. **Deploy.** It takes two or three minutes and gives back a URL ending in
   `.vercel.app`.

From then on every push to the branch deploys itself. A pull request gets its
own preview URL, so a change can be seen before it reaches the live site.

### Putting it on sidhutravelservices.com

1. In the Vercel project: **Settings → Domains → Add**, enter
   `sidhutravelservices.com`.
2. Vercel shows the DNS records to create. At the registrar, add them:
   - `A` record on `@` pointing at the address Vercel gives
   - `CNAME` on `www` pointing at `cname.vercel-dns.com`
3. DNS takes anywhere from minutes to a few hours. The HTTPS certificate is
   issued automatically once it resolves.
4. Update `NEXT_PUBLIC_SITE_URL` to `https://sidhutravelservices.com` and
   redeploy, so canonical links and structured data point at the real domain.

### If cPanel has to host the website too

It can, through **Setup Node.js App**, but Next.js on shared cPanel hosting is
awkward: it needs a long-running Node process, and these hosts restart or cap
them. If that route is taken, the alternative is a static export, which would
cost the booking endpoints. Vercel's free tier covers a site of this size, so
there is no saving in doing it the hard way.

---

## 2. The backend

1. In cPanel, create the subdomain `cms.sidhutravelservices.com`.
2. Install WordPress into it.
3. Install the `sts-core` plugin from `wp/plugins/sts-core`.
4. Harden it: disable the public theme, disable XML-RPC, disable the file
   editor, force HTTPS, turn on two-factor authentication for admin accounts.
5. In Vercel, set `WORDPRESS_API_URL` to the subdomain,
   `SUBMISSION_WEBHOOK_URL` and `SUBMISSION_WEBHOOK_SECRET`, then switch
   `NEXT_PUBLIC_DATA_SOURCE` to `cms` and redeploy. The preview-data strip
   disappears on its own.

---

## 3. After the first live deployment

- **Search Console** — add the property, verify by DNS or by the HTML file,
  then submit `https://sidhutravelservices.com/sitemap.xml`. The sitemap is
  generated from the content, so it needs submitting once and never again.
- **Google Business Profile** — claim the listing, and put its link into
  `site.contact.googleBusinessUrl` so the footer map and the reviews section
  point at the real listing.
- **Analytics** — add the GA4 measurement ID when there is one.
- **Legal** — set `site.legal.reviewed` to true once a lawyer has read the
  four policy pages, which removes the draft notices.

---

## Checklist before going live

- [ ] Real fleet photographs uploaded
- [ ] Real rate card entered, replacing the placeholders
- [ ] Insurance cover confirmed and added to the inclusions
- [ ] Legal pages confirmed and reviewed
- [ ] Office address and opening hours confirmed
- [ ] Headline claims confirmed: years in service, clients served, on-time rate
- [ ] Written permission on file for each client logo shown
- [ ] `NEXT_PUBLIC_DATA_SOURCE` switched to `cms`
- [ ] Sitemap submitted to Search Console
