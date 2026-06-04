#!/usr/bin/env bash
# Cloudflare Pages CI deploy — used as "Deploy command": bash scripts/pages-deploy.sh
set -euo pipefail

# A personal CLOUDFLARE_API_TOKEN in Pages env vars overrides the build system's
# token and often fails deploy (Wrangler prints "Super Administrator" then errors).
if [ "${CF_PAGES:-}" = "1" ]; then
  unset CLOUDFLARE_API_TOKEN
  unset CLOUDFLARE_ACCOUNT_ID
  unset CF_API_TOKEN
fi

exec npx wrangler pages deploy --commit-dirty=true
