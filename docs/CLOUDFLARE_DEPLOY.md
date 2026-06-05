# Deploy Chelzeum on Cloudflare

Single **Worker** serves the Vite `dist/` site and `/api/subscribe`. Matches the dashboard that only shows **Build command** / **Deploy command** (no output directory field).

---

## Dashboard build settings (exact values)

| Field | Value |
|--------|--------|
| **Production branch** | `main` (not `cloudflare/workers-autoconfig`) |
| **Build command** | `npm run build` |
| **Deploy command** | leave **empty** (defaults to `npx wrangler deploy`) **or** `npm run deploy` |
| **Root directory** | `/` |

Output directory is **`./dist`** in `wrangler.toml` under `[assets]` — not shown in the dashboard.

---

## Do not merge the autoconfig branch

`cloudflare/workers-autoconfig` was opened by Cloudflare’s bot with a different setup (`wrangler.jsonc` + `@cloudflare/vite-plugin`). **Use `main` only.** Close or ignore that PR unless you intentionally migrate to that stack.

---

## Environment variables

**Build (plaintext):**

| Name | Value |
|------|--------|
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key |
| `VITE_SIGNUP_API_URL` | `/api/subscribe` |

**Secrets (encrypt):**

| Name | Notes |
|------|--------|
| `TURNSTILE_SECRET_KEY` | Turnstile secret |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | e.g. `Chelzeum Signups <signup@chelzeum.net>` |
| `SIGNUP_TO_EMAIL` | `chelzeum@gmail.com` |

**Remove** if present (they break CI deploy): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CF_API_TOKEN`.

---

## `wrangler.toml` project name

```toml
name = "chelzeum"
```

Must match the project name in **Workers & Pages** exactly. Two custom domains on `chelzeum.net` is fine — that does not affect the build name.

---

## Local dev

```bash
cp .env.example .env          # VITE_TURNSTILE_SITE_KEY
cp .dev.vars.example .dev.vars  # secrets for /api/subscribe locally
npm run pages:dev             # build + wrangler dev (site + API)
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Super Administrator` then deploy failed | Remove `CLOUDFLARE_API_TOKEN` from env vars; ensure deploy uses `wrangler deploy` with `[assets]` + `main` in `wrangler.toml` |
| `wrangler deploy` says missing entry-point / assets | Pull latest `main` (Worker + `[assets] directory = "./dist"`) |
| `Project not found` on `wrangler pages deploy` | You have a **Worker** project — use `wrangler deploy`, not `pages deploy` |
| Signup 404 | Worker `worker/index.js` must be deployed; check `VITE_SIGNUP_API_URL=/api/subscribe` |
| Turnstile error **110200** | Domain not authorized for that **site key**. On production, add `chelzeum.net` / `www.chelzeum.net` to the widget that owns your `VITE_TURNSTILE_SITE_KEY`. For **local dev**, use Cloudflare test keys instead (automatic in `npm run dev`; set `TURNSTILE_ALLOW_TEST_KEYS=true` + test secret in `.dev.vars` for `npm run pages:dev`). Use `http://localhost`, not `127.0.0.1`. To test production keys locally, set `VITE_TURNSTILE_USE_PRODUCTION=true` in `.env`. |

---

## Repo layout

| Path | Role |
|------|------|
| `worker/index.js` | Routes `/api/subscribe` + serves static assets |
| `functions/_lib/handleSubscribe.js` | Turnstile + Resend |
| `wrangler.toml` | Worker name, `main`, `[assets]` → `./dist` |
| `public/_redirects` | Optional; SPA fallback is handled by Worker assets config |
