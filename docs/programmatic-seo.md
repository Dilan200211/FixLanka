# FixLanka Tools — Programmatic SEO Architecture & Guardrails

## Purpose
Programmatic SEO allows FixLanka Tools to scale from 20 core utilities to specialized workflow pages (such as format-specific converters or preset-driven resizers) without creating thin or repetitive pages.

## Strict Indexability Rules
1. **No Thin Keyword-Swapped Pages**: Never generate pages that only swap a token in a template (e.g., `/tools/compress-jpg/`, `/tools/compress-jpeg/`, `/tools/compress-photo/` pointing to identical tools).
2. **Unique Value Requirement**: A programmatic page may only be indexed (`index, follow`) when it offers at least **two** of:
   - Pre-configured default tool parameters (e.g., output format locked to `image/webp` or preset locked to `1280x720`).
   - Distinct format compatibility, constraint notes, and practical input/output examples.
   - Dedicated FAQ and troubleshooting sections grounded in that format or preset.
3. **Canonical & `noindex` Enforcement**:
   - Filter/query variations (`/tools/?q=...`) remain canonical to `/tools/`.
   - Internal admin (`/admin/`) and error pages (`/404/`) carry `<meta name="robots" content="noindex, nofollow" />` and are excluded from `/sitemap.xml`.

## Scalable Registry Pattern
When adding specialized preset/format pages in future phases:
1. Define typed preset configs in `src/data/programmaticPresets.ts` (each with unique `slug`, `targetToolSlug`, `defaultOptions`, unique `seoTitle`, `seoDescription`, `primaryKeyword`, `examples`, and `faqs`).
2. Render through a dedicated static Astro route (`src/pages/tools/[preset].astro`) that passes `defaultOptions` directly into the React tool component.
3. Add a uniqueness check inside `scripts/seo-audit.mjs` so duplicate titles, duplicate descriptions, or near-identical bodies fail CI before deployment.
