# Deploying, step by step

Everything here happens in a browser. Nothing needs a terminal.

The build has been checked from a clean install exactly the way Vercel runs
it — delete everything, `npm ci`, `npm run build` — and it completes with no
errors, so there should be no surprises.

---

## Part 1 — the website on Vercel, about five minutes

### 1. Make the account

Go to **vercel.com** and choose **Sign Up**, then **Continue with GitHub**.
Use the GitHub account that owns `ahmad23012309/sts-website`. Choose the
**Hobby** plan; it is free and covers a site of this size.

### 2. Give Vercel access to the repository

GitHub will ask which repositories Vercel may see. Choose **Only select
repositories** and pick **sts-website**. Vercel does not need the rest.

### 3. Import the project

On the Vercel dashboard: **Add New → Project**. `sts-website` appears in the
list. Press **Import**.

### 4. The one setting that matters

On the configuration screen, find **Root Directory** and press **Edit**.
Choose the folder:

```
apps/web
```

This is the only setting to change. Framework, build command and output are
all detected once the root directory is right. Getting this wrong is the usual
reason a first deployment fails, so it is worth checking twice.

### 5. Environment variables

Still on the same screen, open **Environment Variables** and add these two.
Name on the left, value on the right:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://sidhutravelservices.com` |
| `NEXT_PUBLIC_DATA_SOURCE` | `fixtures` |

Leave the rest for now. They are for the WordPress backend, which does not
exist yet. `fixtures` keeps the preview strip on screen, which is what we
want until the real rates are in.

### 6. Deploy

Press **Deploy**. It takes two to three minutes. You get an address ending in
`.vercel.app` — send it to me and I will check every page on it.

From then on, **every push deploys itself**. Nothing to repeat.

---

## Part 2 — the real domain, once you are happy

1. In the project: **Settings → Domains**.
2. Type `sidhutravelservices.com` and press **Add**.
3. Vercel shows two DNS records. At whoever sold you the domain, add them:
   - an **A** record on `@`, pointing at the address Vercel shows
   - a **CNAME** on `www`, pointing at `cname.vercel-dns.com`
4. Wait. DNS takes anywhere from a few minutes to a few hours. HTTPS is issued
   automatically once it resolves; nothing to buy or install.
5. Tell me when it is live and I will switch `NEXT_PUBLIC_SITE_URL` over, so
   the canonical links and the structured data point at the real address.

---

## What to check on the preview

Things I cannot see from here, because this environment blocks the sites
involved:

- **The 3D models.** Open any of these and press the model: Hiace, Prado,
  Fortuner, Land Cruiser, Sportage, Corolla, Civic, Copen, Sorento, Haval H6.
  If one stays blank, that model does not allow embedding and we swap it.
- **The footer map.** It should show the location. If it is wrong, send the
  exact address or the Google Business link and it moves.
- **The whole site on your phone.** Especially the header, the contact rail
  and the booking form.

---

## If you would rather I did it

I can, but only from a session running on your own computer rather than this
one, which lives in the cloud and cannot reach your browser. Open the Claude
desktop app, or run `claude remote-control` in a terminal inside the project
folder, and the work carries on there with the browser available.
