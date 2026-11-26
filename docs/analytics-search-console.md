# Google Search Console & GA4 Analytics Guide

## 1. Google Search Console (Already Verified)
Your domain (`fixlanka.com`) is already verified in Google Search Console. Complete these ongoing checks after deployment:

1. **Submit Sitemap**:
   - Open **Indexing → Sitemaps** and submit:
     `https://fixlanka.com/sitemap.xml`
   - Confirm status shows **Success** and matches the number of built indexable routes.
2. **Monitor Indexing & Redirects**:
   - Check **Indexing → Pages** for legacy URLs (`/privacy`, `/terms`, `/categories/*`) migrating cleanly via `301` in `public/_redirects` to `/privacy-policy/`, `/terms-of-service/`, and `/category/*`.
   - Confirm `/admin/` and `/404/` remain excluded via `noindex, nofollow`.
3. **Inspect Individual URLs**:
   - Use **URL Inspection** on key landing pages (`/`, `/tools/image-compressor/`, `/blog/how-to-compress-images-without-losing-quality/`) to confirm Googlebot sees the rendered HTML and structured data cleanly.

---

## 2. Google Analytics 4 (GA4) Setup
GA4 is pre-wired in `src/layouts/BaseLayout.astro`, `src/layouts/ToolLayout.astro`, and `src/layouts/BlogLayout.astro` without loading external scripts unless configured.

1. Create a GA4 Web Stream for `https://fixlanka.com/` and copy the Measurement ID (`G-XXXXXXXXXX`).
2. Add it to your Cloudflare Workers / Pages environment variables (and local `.env`):
   ```env
   PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Rebuild and deploy.

### Events Automatically Tracked (Zero PII / Zero File Data)
| Event | Trigger | Parameters |
|---|---|---|
| `tool_opened` | Tool page loads | `tool_slug` |
| `tool_used` | User interacts with tool inputs/files | `tool_slug` |
| `tool_completed` | User clicks download, copy, merge, extract, compress, or generate | `tool_slug`, `action` |
| `article_read` | Reader scrolls 75% through a blog article | `article_slug` |
| `related_tool_clicked` | User clicks a related tool card on a tool page | `from_tool`, `target_href` |
