# FixLanka Tools — Architecture Documentation

## 1. Overview
FixLanka Tools (`https://fixlanka.com`) is a high-performance, privacy-first, client-side utility platform designed for a worldwide audience. It provides a comprehensive suite of online tools spanning Privacy & Metadata, Image Processing, PDF & Documents, Video & Audio, AI & Creator tools, Developer utilities, SEO, Social Media, Security, and Everyday utilities.

### Core Architecture Principles
1. **Privacy-First & Local Processing**: All supported tools process user files locally in the browser memory using Canvas APIs, Web Workers, WebAssembly, and JavaScript parsing engines. Zero file uploads to any server by default.
2. **Static-First Performance**: Built on Astro with static site generation (SSG) for sub-second page loads, excellent SEO indexing, minimal client-side runtime overhead, and seamless hosting on Cloudflare Pages.
3. **Island Architecture**: Interactive tools are isolated React components hydrated on-demand (`client:load` or `client:idle`), ensuring non-interactive documentation, navigation, and landing sections have zero JS bloat.
4. **Unified Processing Pipeline**: Shared lifecycle management for file handling, status transitions, progress indication, memory cleanup, error recovery, and result downloads.
5. **Dark-First Modern Tech Aesthetic**: A sleek, dark charcoal UI with subtle borders, refined typography, responsive design, and local theme persistence.

---

## 2. Directory Structure

```
fixlanka/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── cards/              # ToolCard, CategoryCard, FeatureCard
│   │   ├── common/             # ThemeToggle, Breadcrumbs, Accordion, Modal
│   │   ├── file-upload/        # Drag-and-drop file input with signature validation
│   │   ├── layout/             # Header, Footer, MobileNav, SearchDialog
│   │   ├── processing/         # Progress indicators, status badges, cancel controls
│   │   ├── results/            # Output views, file download buttons, diff previews
│   │   └── seo/                # MetaTags, SchemaOrg (SoftwareApplication, BreadcrumbList)
│   ├── data/
│   │   ├── categories.ts       # All 10 categories metadata & descriptions
│   │   ├── faq.ts              # Global platform FAQs
│   │   ├── navigation.ts       # Main header and footer navigation links
│   │   └── tools.ts            # Central typed Tool Registry (20 active + future specs)
│   ├── features/               # Tool-specific interactive React implementations
│   │   ├── ai/                 # Prompt Optimizer
│   │   ├── developer/          # JSON Formatter, Base64 Encoder/Decoder
│   │   ├── everyday/           # Word/Character Counter
│   │   ├── image/              # Compressor, Resizer, Format Converter
│   │   ├── metadata/           # EXIF Viewer, Privacy Cleaner, C2PA Inspector
│   │   ├── pdf/                # PDF Merger, PDF Splitter, PDF Compressor
│   │   ├── security/           # Password Generator, QR Code Generator
│   │   ├── seo/                # Meta Tag Generator
│   │   └── social/             # Social Image Resizer, Social Post Preview
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Common HTML skeleton, SEO tags, dark-mode script
│   │   ├── CategoryLayout.astro# Category listing layout with filters
│   │   └── ToolLayout.astro    # Standardized 9-section tool page layout
│   ├── lib/
│   │   ├── file/               # Magic number / file signature checks, format helpers
│   │   ├── formatting/         # Byte size formatters, date formatters, string utils
│   │   └── processing/         # Shared processing lifecycle hooks & types
│   ├── pages/
│   │   ├── index.astro         # Homepage with hero, global search, categories, FAQs
│   │   ├── about.astro         # About FixLanka Tools
│   │   ├── contact.astro       # Contact form & information
│   │   ├── privacy.astro       # Comprehensive Privacy Policy
│   │   ├── terms.astro         # Terms of Service
│   │   ├── categories/
│   │   │   └── [slug].astro    # Dynamic routes for all 10 categories
│   │   └── tools/
│   │       └── [slug].astro    # Dynamic routes for all tools with SSG getStaticPaths()
│   ├── styles/
│   │   └── global.css          # Tailwind CSS & design token variables
│   └── types/
│       ├── file.ts             # File validation & signature interfaces
│       ├── processing.ts       # Common task status & state types
│       └── tool.ts             # Tool definition discriminated unions & types
├── tests/
│   ├── unit/                   # Vitest unit tests for tools & utilities
│   └── e2e/                    # Playwright end-to-end integration tests
├── docs/                       # Architecture, security, roadmap, deployment docs
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind styling configuration
├── tsconfig.json               # Strict TypeScript configuration
└── package.json
```

---

## 3. Technology Stack & Key Dependencies

| Layer | Technology | Rationale |
|---|---|---|
| **SSG / Meta-framework** | Astro (Static Output) | Pure static HTML generation for blazing speed, SEO supremacy, and native Cloudflare Pages compatibility. |
| **Component Hydration** | React + TypeScript | Rich state management, reactive processing feedback, and robust type safety for interactive utilities. |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first styling with dark-first palette tokens and clean iconography. |
| **Image Metadata** | Exifr | Lightweight, fast metadata parser supporting EXIF, TIFF, GPS, IPTC, XMP, and ICC profiles directly in browser. |
| **PDF Manipulation** | pdf-lib | Pure JavaScript PDF reader, merger, splitter, and stream optimizer without external dependencies. |
| **Media Processing** | FFmpeg.wasm / Canvas / Web Audio | Browser-side WebAssembly video/audio transformation without server roundtrips. |
| **Content Provenance** | C2PA & JUMBF parser | Standards-compliant detection and inspection of Coalition for Content Provenance and Authenticity manifests. |
| **Testing** | Vitest + Playwright | Rapid unit test feedback and browser integration testing. |

---

## 4. Shared Processing Framework

Every tool with file input integrates into the shared processing lifecycle:

```
[User Input / File Drop]
         │
         ▼
[File Validation] ──► Checks magic numbers (file signature) & max file size limits
         │
         ▼
[State: Validating -> Processing] ──► Dispatches to Worker / Canvas / WASM
         │
         ├── Progress callbacks (0% -> 100%)
         ├── Cancellation token support
         │
         ▼
[State: Completed / Failed]
         ├── Output Object URL generated
         ├── Comparison metrics (Before vs. After size, saving %)
         └── Download trigger & memory cleanup (URL.revokeObjectURL)
```

---

## 5. Security & Privacy Guarantees
- **Local Sandbox Execution**: Files never leave user RAM/IndexedDB.
- **Strict Content Validation**: File extensions are verified against binary signatures (magic numbers) to prevent polyglot file attacks.
- **Resource Limits**: Configurable input caps prevent decompression bombs and out-of-memory browser crashes.
- **Zero Script Injection**: Strict input sanitization and React JSX escaping protect against XSS.
