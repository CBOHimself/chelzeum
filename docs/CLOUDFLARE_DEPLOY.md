# Deploy Chelzeum on Cloudflare (site + API on one domain)

Everything runs on **Cloudflare Pages**: static Vite build at `chelzeum.net` and the signup API at `chelzeum.net/api/subscribe`. No Vercel required.

---

## Overview

| Piece | Where |
|--------|--------|
| React site | Cloudflare Pages (`dist/` after `npm run build`) |
| Signup API | Pages Function → `functions/api/subscribe.js` |
| Captcha | Cloudflare **Turnstile** (site key in build, secret in Pages) |
| Email | **Resend** (recommended) or Gmail app password (fallback) |

---

## Part 1 — Turnstile (you may already have this)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Turnstile** → your widget.
2. Under **Hostname management**, add:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (e.g. `chelzeum.net`, `www.chelzeum.net`, and your `*.pages.dev` preview host if you test previews).
3. Copy:
   - **Site key** → used in the browser
   - **Secret key** → used only on the server

---

## Part 2 — Email with Resend (recommended on Cloudflare)

Gmail SMTP is awkward on Workers. **Resend** uses HTTP and works reliably on Pages Functions. Mail still arrives at **chelzeum@gmail.com**.

1. Sign up at [resend.com](https://resend.com).
2. **API Keys** → Create API key → copy it (`re_...`).
3. **Domains** → Add `chelzeum.net` (or your live domain).
4. Resend shows DNS records (SPF, DKIM). Add them in **Cloudflare DNS** for the same zone (usually one-click if the zone is already on Cloudflare).
5. Wait until the domain shows **Verified**.
6. Choose a **From** address, e.g. `signup@chelzeum.net` → use  
   `Chelzeum Signups <signup@chelzeum.net>` as `RESEND_FROM_EMAIL`.

Until the domain is verified, you can test with Resend’s sandbox sender:  
`Chelzeum Signups <onboarding@resend.dev>` (only delivers to the email on your Resend account).

---

## Part 3 — Connect the repo to Cloudflare Pages

1. Push this project to **GitHub** (or GitLab).
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the `chelzeum` repository.
4. **Build settings**:

   | Setting | Value |
   |---------|--------|
   | Framework preset | None (or Vite) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (repo root) |

5. **Do not deploy yet** — set environment variables first (Part 4).

---

## Part 4 — Environment variables (Dashboard)

In your Pages project → **Settings** → **Environment variables**.

### Production (and Preview if you want signup on preview URLs)

**Build variables** (available when Vite runs `npm run build`):

| Name | Type | Example / notes |
|------|------|------------------|
| `VITE_TURNSTILE_SITE_KEY` | Plaintext | Turnstile **site** key |
| `VITE_SIGNUP_API_URL` | Plaintext | `/api/subscribe` |

**Runtime secrets** (Pages Functions only — encrypt these):

| Name | Notes |
|------|--------|
| `TURNSTILE_SECRET_KEY` | Turnstile **secret** key |
| `RESEND_API_KEY` | Resend `re_...` key |
| `RESEND_FROM_EMAIL` | e.g. `Chelzeum Signups <signup@chelzeum.net>` |
| `SIGNUP_TO_EMAIL` | `chelzeum@gmail.com` |

**Optional** (Gmail fallback; skip if you use Resend):

| Name | Notes |
|------|--------|
| `GMAIL_USER` | `chelzeum@gmail.com` |
| `GMAIL_APP_PASSWORD` | Google [App Password](https://myaccount.google.com/apppasswords) |

Click **Save**, then trigger a **new deployment** (Deployments → Retry deployment or push a commit).

---

## Part 5 — Custom domain

1. Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `chelzeum.net` (and `www` if you use it).
3. Cloudflare will add or confirm DNS records in the zone.
4. Wait for **Active** SSL status.
5. Add the same hostnames in **Turnstile** (Part 1).

Your popup will POST to `https://chelzeum.net/api/subscribe` automatically when `VITE_SIGNUP_API_URL=/api/subscribe`.

---

## Part 6 — Local development

### Frontend only (no real email)

```bash
cp .env.example .env
# Fill VITE_TURNSTILE_SITE_KEY with your site key
npm run dev
```

Signup submit will fail against `/api/subscribe` unless you run the Pages dev server below.

### Frontend + API together (recommended)

```bash
npm run build
cp .dev.vars.example .dev.vars
# Edit .dev.vars with TURNSTILE_SECRET_KEY, RESEND_API_KEY, etc.
npm run pages:dev
```

Opens a local URL (often `http://localhost:8788`) with both the site and `/api/subscribe`.

For local Turnstile, keep `localhost` in the widget hostnames.

---

## Part 7 — Verify production

1. Open the live site in a private window.
2. Wait for the signup popup (or clear dismissal: DevTools → Application → Local Storage → delete `chelzeum-signup-dismissed`).
3. Complete Turnstile, fill the form, submit.
4. Check **chelzeum@gmail.com** (and Resend **Logs** if nothing arrives).

**Deployments → Functions** (or Real-time logs) show errors if Turnstile or Resend misconfigured.

---

## Part 8 — What was removed / ignored

- **`api/subscribe.js`** at repo root (old Vercel handler) — replaced by `functions/api/subscribe.js`.
- **`vercel.json`** — not used on Cloudflare.
- You do **not** need a separate Vercel project.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Turnstile widget error / “invalid site key” | `VITE_TURNSTILE_SITE_KEY` wrong or hostname not listed in Turnstile |
| Submit returns 404 on `/api/subscribe` | Redeploy after `functions/` exists; check build output includes Functions |
| “Captcha failed” | `TURNSTILE_SECRET_KEY` missing or mismatched pair with site key |
| “Email is not configured” | Add `RESEND_API_KEY` (and redeploy) or Gmail vars |
| Resend 403 / domain error | Verify domain in Resend; fix `RESEND_FROM_EMAIL` to use that domain |
| SPA routes 404 on refresh | Ensure `public/_redirects` and `public/_routes.json` are in `dist` (they live under `public/` and copy on build) |
| Popup dismissed forever | `localStorage.removeItem('chelzeum-signup-dismissed')` |

---

## Quick reference — files in this repo

| File | Purpose |
|------|---------|
| `functions/api/subscribe.js` | Pages Function route `/api/subscribe` |
| `functions/_lib/handleSubscribe.js` | Turnstile + email logic |
| `wrangler.toml` | Pages + `nodejs_compat` for optional Gmail |
| `.dev.vars` | Local function secrets (gitignored) |
| `.env` | Local Vite `VITE_*` only |
| `public/_redirects` | SPA fallback |
| `public/_routes.json` | Don’t run SPA rewrite on `/api/*` |
