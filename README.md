# FixLanka Tools

> **Free, High-Performance, Privacy-First Online Utilities for Global Users.**  
> Built with Astro, React, TypeScript, and Tailwind CSS. Hosted statically on Cloudflare Pages.

Official Domain: [https://fixlanka.com](https://fixlanka.com)

---

## 🌟 Vision & Key Highlights

FixLanka Tools is a production-grade utility toolbox designed for worldwide creators, developers, designers, and privacy advocates. Every tool processes data directly inside browser memory using HTML5 Canvas, Web Workers, WebAssembly, and native Web Cryptography—eliminating server-side file uploads by default.

- 🔒 **100% Client-Side Processing**: Files are processed in your computer's RAM. No backend uploads.
- ⚡ **Sub-Second Static Performance**: Pre-rendered with Astro SSG for blazing edge delivery.
- 🎨 **Dark-First Modern Tech Aesthetic**: Charcoal surfaces, subtle borders, responsive layout, and persistent theme switcher.
- 🛡️ **Transparent Provenance & Privacy**: Built-in C2PA manifest inspection and EXIF GPS scrubbing without deceptive watermark bypasses.
- 🆓 **Zero Cost & No Registration**: No paywalls, no tracking cookies, and no account barriers.

---

## 🛠️ The Initial 20 Working Tools

### 1. Privacy & Metadata
- **[EXIF Metadata Viewer](/tools/exif-metadata-viewer)**: Extract camera hardware, aperture, shutter speed, ISO, timestamps, GPS geolocation (with OpenStreetMap links), IPTC tags, and XMP blocks. Download structured JSON reports.
- **[EXIF Privacy Cleaner](/tools/exif-privacy-cleaner)**: Detect and sanitize GPS coordinates, device serial numbers, and private camera tags while preserving visual orientation.
- **[AI Metadata & C2PA Inspector](/tools/ai-metadata-inspector)**: Inspect standard JUMBF manifest boxes (Coalition for Content Provenance and Authenticity) and detect Midjourney, DALL-E, and Stable Diffusion generation tags.

### 2. Image Processing
- **[Image Compressor](/tools/image-compressor)**: In-browser JPEG, WebP, and PNG compression with a real-time quality slider, before/after preview, and byte savings calculation.
- **[Image Resizer](/tools/image-resizer)**: Scale by pixels, percentage, or common presets (Full HD, 4K, Avatar) with aspect ratio locking.
- **[Image Format Converter](/tools/image-converter)**: Genuine bitmap conversion between PNG, JPEG, and WebP formats with verified file signature (magic byte) headers.

### 3. PDF & Documents
- **[PDF Merger](/tools/pdf-merger)**: Reorder and combine multiple PDF documents into a single file in browser memory via `pdf-lib`.
- **[PDF Splitter](/tools/pdf-splitter)**: Extract custom page ranges (e.g. `1-3, 5, 8-10`) or individual page selections into a clean new document.
- **[PDF Compressor](/tools/pdf-compressor)**: Optimize PDF internal object streams and deduplicate structural overhead without third-party server exposure.

### 4. Video & Audio
- **[Video to GIF](/tools/video-to-gif)**: Convert video segments (MP4, WebM, MOV) into high-quality animated GIFs with start/end trimming, FPS control, and output scaling.
- **[Audio Extractor](/tools/audio-extractor)**: Decode audio streams directly from video files using the Web Audio API and export high-fidelity uncompressed WAV tracks.

### 5. AI & Creator
- **[AI Prompt Optimizer](/tools/ai-prompt-optimizer)**: Enhance raw prompts with structured chain-of-thought, constraints, and negative guidance for Coding, Midjourney, and Copywriting.

### 6. Developer Tools
- **[JSON Formatter & Validator](/tools/json-formatter)**: Beautify, validate, and minify JSON payloads with exact line and column syntax error reporting.
- **[Base64 Encoder / Decoder](/tools/base64-encoder-decoder)**: Full UTF-8 Unicode encoding/decoding and file Data URI generator without character corruption.

### 7. SEO & Website
- **[Meta Tag Generator](/tools/meta-tag-generator)**: Generate Open Graph, Twitter Cards, and SEO meta tags with live Google Search and social sharing card previews.

### 8. Social Media
- **[Social Media Image Resizer](/tools/social-media-image-resizer)**: Pixel-perfect presets for YouTube (Thumbnails & Banners), Instagram (Square, Portrait, Stories), Twitter/X, LinkedIn, and Facebook.
- **[Social Post Preview](/tools/social-post-preview)**: Simulate how copy and media appear on Twitter/X, LinkedIn, Facebook, and Instagram with real-time character counters.

### 9. Security & Privacy
- **[Password Generator](/tools/password-generator)**: Cryptographically secure random passwords using `window.crypto.getRandomValues()` with entropy calculation and strength grading. Zero transmission or storage.

### 10. Everyday Utilities
- **[QR Code Generator](/tools/qr-code-generator)**: Create custom QR codes for URLs, text, Wi-Fi credentials, and vCards with instant SVG vector and PNG export.
- **[Word & Character Counter](/tools/word-counter)**: Real-time text analysis for words, characters (with/without spaces), sentences, paragraphs, and reading/speaking times.

---

## 📁 Repository & Architecture Structure

```
fixlanka/
├── public/                 # Static assets, favicon, robots.txt, _headers
├── src/
│   ├── components/
│   │   ├── cards/          # Reusable Tool & Category cards
│   │   ├── common/         # ThemeToggle, search modals, breadcrumbs
│   │   ├── file-upload/    # Reusable FileDropzone with magic byte validation
│   │   ├── layout/         # Header, Footer, navigation
│   │   └── search/         # Client-side instantaneous search dialog (Cmd+K)
│   ├── data/
│   │   ├── categories.ts   # 10 Long-term categories
│   │   ├── tools.ts        # Typed Tool Registry & query helpers
│   │   ├── navigation.ts   # Menu configuration
│   │   └── faq.ts          # Global platform FAQs
│   ├── features/           # Interactive React tool implementations
│   │   ├── ai/             # Prompt Optimizer
│   │   ├── developer/      # JSON Formatter, Base64 Tool
│   │   ├── everyday/       # QR Code Generator, Word Counter
│   │   ├── image/          # Compressor, Resizer, Format Converter
│   │   ├── media/          # Video to GIF, Audio Extractor
│   │   ├── metadata/       # EXIF Viewer, Privacy Cleaner, C2PA Inspector
│   │   ├── pdf/            # PDF Merger, Splitter, Compressor
│   │   ├── security/       # Password Generator
│   │   ├── seo/            # Meta Tag Generator
│   │   └── social/         # Social Resizer, Post Preview
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── ToolLayout.astro
│   │   └── CategoryLayout.astro
│   ├── lib/
│   │   ├── file/           # File signatures & validation
│   │   ├── formatting/     # Byte size formatters
│   │   ├── download/       # Safe download trigger & object URL revocation
│   │   └── media/          # Pure JS GIF encoder & WAV audio encoder
│   ├── pages/              # Static & dynamic SSG Astro routes
│   └── types/              # Strict TypeScript interfaces
├── tests/                  # Vitest test suite
└── docs/                   # Architecture, Roadmap, Tools, Deployment, Security
```

---

## 🚀 Development & Build

### Prerequisites
- Node.js 20+ (Node 20+ recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Visit `http://localhost:4321` in your browser.

### 3. Run Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
Static output is generated into the `dist/` folder.

---

## ☁️ Cloudflare Pages Deployment

1. Connect the GitHub repository to **Cloudflare Pages**.
2. Set **Framework preset** to `Astro`.
3. Set **Build command** to `npm run build`.
4. Set **Build output directory** to `dist`.
5. Under **Environment variables**, set `NODE_VERSION: 20`.
6. Attach custom domain `fixlanka.com`.

---

## 🛡️ License

MIT License. Free for global personal and commercial use.
