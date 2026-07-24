#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for the BrandForge AI SPA.
# Deploys the static Vite build with SPA fallback rewrites.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/2] vite build"
bun install
bun run build

echo "[2/2] assemble .vercel/output (static SPA)"
rm -rf .vercel/output
mkdir -p .vercel/output
cp -R dist .vercel/output/static

cat > .vercel/output/config.json <<'JSON'
{
  "version": 3,
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
JSON

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
