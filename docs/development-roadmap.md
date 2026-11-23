# FixLanka Tools — Development Roadmap

This document outlines the phased development roadmap for FixLanka Tools from initial foundation to 100+ tools expansion.

---

## Phase 1: Foundation (Current)
- [x] Repository initialization & Git version control
- [x] Architecture design documentation (`architecture.md`, `development-roadmap.md`)
- [ ] Project scaffolding with Astro, React, TypeScript, Tailwind CSS, and Lucide icons
- [ ] Global styling tokens, dark-first charcoal theme, and theme switcher
- [ ] Central typed Tool Registry with all 10 long-term categories and initial 20 tools
- [ ] Shared layout components: `BaseLayout.astro`, `ToolLayout.astro`, `CategoryLayout.astro`
- [ ] Dynamic routing: `/`, `/tools/[slug]`, `/categories/[slug]`
- [ ] Static informative pages: `/about`, `/privacy`, `/terms`, `/contact`
- [ ] Fast client-side tool search and category navigation
- [ ] Shared file validation & processing engine framework
- [ ] Cloudflare Pages configuration & build validation

## Phase 2: Privacy & Image Tools
- [ ] **EXIF Metadata Viewer**: Comprehensive EXIF, IPTC, XMP, GPS viewer with JSON report export
- [ ] **EXIF Privacy Cleaner**: Detect & strip GPS/device identifiers, preserve orientation, re-encode safely
- [ ] **AI Metadata & C2PA Inspector**: Detect AI tags, inspect Content Credentials, report validation state
- [ ] **Image Compressor**: Canvas-based multi-format compressor with quality slider, before/after preview
- [ ] **Image Resizer**: Width/height controls, aspect ratio lock, standard presets, scale percentages
- [ ] **Image Format Converter**: Multi-format client-side conversion (JPEG, PNG, WebP) with signature checks

## Phase 3: PDF & Media Tools
- [ ] **PDF Merger**: Multi-file reorderable PDF combiner using `pdf-lib`
- [ ] **PDF Splitter**: Page range extraction, individual page selection, and export
- [ ] **PDF Compressor**: Object stream compression and duplicate resource optimization
- [ ] **Video to GIF**: WebAssembly-powered video snippet to animated GIF converter with FPS/width control
- [ ] **Audio Extractor**: Extract MP3/WAV audio streams directly from video files

## Phase 4: AI, Developer & SEO Utilities
- [ ] **AI Prompt Optimizer**: Prompt structure enhancer, clarity improvements, customizable templates
- [ ] **JSON Formatter & Validator**: Beautify, minify, syntax validation, error line highlighting, copy/download
- [ ] **Base64 Encoder / Decoder**: Safe UTF-8 text and binary data encoder/decoder
- [ ] **Meta Tag Generator**: Complete Open Graph, Twitter Cards, robots tag generator with live preview

## Phase 5: Social, Security & Everyday Utilities
- [ ] **Social Media Image Resizer**: Exact presets for YouTube, Instagram, Twitter/X, LinkedIn, Facebook
- [ ] **Social Post Preview**: Accurate live preview for Twitter/X, LinkedIn, Facebook, and Instagram posts
- [ ] **Password Generator**: Cryptographically secure (`crypto.getRandomValues`), customizable character sets
- [ ] **QR Code Generator**: High-speed customizable QR generator (URL, text, WiFi, vCard) with PNG/SVG export
- [ ] **Word & Character Counter**: Real-time word, character, sentence, paragraph, and reading time counter

## Phase 6: Production Readiness & Quality Assurance
- [ ] Comprehensive unit test suite with Vitest
- [ ] End-to-end user journey tests with Playwright
- [ ] SEO audit: canonical tags, Schema.org WebApplication & BreadcrumbList structured data, sitemap
- [ ] Accessibility audit: keyboard navigation, ARIA roles, color contrast
- [ ] Security audit: CSP headers, file signature verification, URL object revocation
- [ ] Production build optimization & Cloudflare Pages deployment verification

## Phase 7: Expansion (100+ Tools Target)
- Implementation of remaining tools across the 10 categories:
  - Advanced PDF tools (PDF to Image, Page Organizer, Watermark)
  - Audio tools (Audio Trimmer, Volume Normalizer)
  - Developer utilities (XML to JSON, Regex Tester, Hash Generator, JWT Decoder, Diff Checker)
  - SEO utilities (Robots.txt Generator, Sitemap Generator, Schema Markup Generator)
  - Daily calculators (Percentage, Age, Unit Converter, Time Zone Converter)
