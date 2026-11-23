# FixLanka Tools — Deployment Guide

## Target Platform: Cloudflare Pages
FixLanka Tools is architected as a static-first web platform (`output: 'static'`) with on-demand client hydration. This model is exceptionally well-suited for Cloudflare Pages:

- **Global CDN Distribution**: Served across Cloudflare's 300+ edge locations.
- **Zero Cold Starts**: Static assets and pre-rendered HTML ensure instant TTFB (Time to First Byte).
- **Zero Cost Execution**: Static hosting on Cloudflare Pages has unlimited free bandwidth and no server compute charges for static assets.
- **Custom Domain & SSL**: Automatic free SSL certificate for `https://fixlanka.com`.

---

## 1. Build Configuration

In the Cloudflare Pages Dashboard:
- **Project Name**: `fixlanka`
- **Framework Preset**: `Astro`
- **Build Command**: `npm run build`
- **Build Output Directory**: `dist`
- **Node.js Version**: `20.x` or higher (Set environment variable `NODE_VERSION: 20`)

---

## 2. Environment Variables & Headers

Configure HTTP security headers in public `_headers` file:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

*(Note: `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin` enable `SharedArrayBuffer` support required for multi-threaded WebAssembly / FFmpeg.wasm when needed).*

---

## 3. GitHub Actions CI/CD Pipeline (Optional Automated Deployment)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: fixlanka
          directory: dist
```

---

## 4. Custom Domain Configuration
1. In Cloudflare Dashboard, go to **Workers & Pages** -> **fixlanka** -> **Custom domains**.
2. Add `fixlanka.com` and `www.fixlanka.com`.
3. Cloudflare automatically sets up DNS CNAME records and provisions an SSL/TLS certificate.
