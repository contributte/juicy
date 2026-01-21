# Agent Guidelines

## Node.js Requirements

This monorepo requires **Node.js 24.x** or later.

All services run on Node.js 24.x runtime (configured in each service's `package.json`).

## Package Dependencies

### @sparticuz/chromium

Services using headless Chromium (fcbk, heatbadger, oggo, pdfx, socky) depend on `@sparticuz/chromium`.

**Important version compatibility:**
- Node.js 24.x requires `@sparticuz/chromium` >= 143.0.0
- The `@sparticuz/chromium` version should match the major Chromium version supported by `puppeteer-core`

If you encounter `libnspr4.so` or similar shared library errors, ensure the `@sparticuz/chromium` version supports the Node.js runtime being used.

## Vercel Deployment

Services are deployed to Vercel serverless functions. The environment detection uses:
- `VERCEL_REGION` (current standard)
- `NOW_REGION` (legacy, used in heatbadger)

When `VERCEL_REGION` is undefined or `dev1`, the service runs in development mode with local Chrome.
