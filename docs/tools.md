# FixLanka Tools — Tool Specifications & Implementation Catalog

This document details the technical specifications, processing models, limits, and supported formats for the initial 20 tools and future extensions.

---

## Initial 20 Tools Specifications

### 1. EXIF Metadata Viewer (`/tools/exif-metadata-viewer`)
- **Category**: Privacy & Metadata
- **Processing Mode**: Client-side (Local memory)
- **Supported Formats**: JPEG, TIFF, PNG, WebP, HEIC/AVIF (where supported by browser/exifr)
- **Engine**: `exifr`
- **Capabilities**: Parses IFD0, Exif, GPS coordinates with decimal conversion, IPTC tags, XMP blocks. Displays camera make/model, shutter speed, aperture, ISO, focal length, software, creation dates.
- **Output**: Visual structured metadata tables, one-click JSON copy, downloadable `.json` report.
- **Max File Size**: 50 MB

### 2. EXIF Privacy Cleaner (`/tools/exif-privacy-cleaner`)
- **Category**: Privacy & Metadata
- **Processing Mode**: Client-side
- **Supported Formats**: JPEG, PNG, WebP
- **Engine**: Canvas rendering with visual orientation preservation & stripping of metadata headers.
- **Capabilities**: Detects present sensitive tags (GPS lat/long, device serial number, software tag, camera model, timestamps). Removes selected or all privacy-sensitive tags. Discloses re-encoding effects transparently.
- **Max File Size**: 30 MB

### 3. AI Metadata & C2PA Inspector (`/tools/ai-metadata-inspector`)
- **Category**: Privacy & Metadata
- **Processing Mode**: Client-side
- **Supported Formats**: JPEG, PNG, WebP, TIFF, SVG
- **Engine**: Native binary parser for JUMBF (`c2pa` manifest boxes) + IPTC/XMP `digitalSourceType` / `Software` / `prompt` tag extraction.
- **Capabilities**: Checks for standard AI generator tags (Midjourney, DALL-E, Stable Diffusion, Firefly) and official C2PA Content Credentials manifests. Reports validation status, assertions, signing entity, and limitations (without claiming human authorship if absent).
- **Max File Size**: 50 MB

### 4. Image Compressor (`/tools/image-compressor`)
- **Category**: Image
- **Processing Mode**: Client-side
- **Supported Formats**: JPEG, WebP, PNG
- **Engine**: HTML5 Canvas / OffscreenCanvas
- **Capabilities**: Dynamic quality slider (1% to 100%), real-time output size preview, side-by-side visual comparison, byte savings percentage calculation.
- **Max File Size**: 25 MB

### 5. Image Resizer (`/tools/image-resizer`)
- **Category**: Image
- **Processing Mode**: Client-side
- **Supported Formats**: JPEG, PNG, WebP
- **Engine**: High-quality Canvas scaling (`imageSmoothingEnabled = true`, `imageSmoothingQuality = 'high'`)
- **Capabilities**: Explicit pixel dimensions (W/H), aspect ratio lock toggle, percentage scaling (25%, 50%, 75%, 200%), common standard presets (Full HD, 4K, Avatar, Thumbnail).
- **Max File Size**: 30 MB

### 6. Image Format Converter (`/tools/image-converter`)
- **Category**: Image
- **Processing Mode**: Client-side
- **Supported Formats (In)**: JPEG, PNG, WebP, BMP, GIF, SVG
- **Supported Formats (Out)**: PNG, JPEG, WebP
- **Engine**: Canvas rasterization and `toBlob()` conversion. Validates actual output MIME type and binary signatures.
- **Capabilities**: Alpha channel preservation options (e.g. background fill color for transparent PNG -> JPEG conversion), quality tuning for lossy outputs.
- **Max File Size**: 30 MB

### 7. PDF Merger (`/tools/pdf-merger`)
- **Category**: PDF & Documents
- **Processing Mode**: Client-side
- **Supported Formats**: PDF (.pdf)
- **Engine**: `pdf-lib`
- **Capabilities**: Multi-file drag & drop, interactive page count analysis, up/down reordering of input files, single merged PDF compilation and download.
- **Max File Size**: 50 MB per file, up to 10 files

### 8. PDF Splitter (`/tools/pdf-splitter`)
- **Category**: PDF & Documents
- **Processing Mode**: Client-side
- **Supported Formats**: PDF (.pdf)
- **Engine**: `pdf-lib`
- **Capabilities**: Reads total page count, allows custom range expressions (e.g. "1-3, 5, 8-10") or individual page extraction, exports cleanly partitioned PDF documents.
- **Max File Size**: 50 MB

### 9. PDF Compressor (`/tools/pdf-compressor`)
- **Category**: PDF & Documents
- **Processing Mode**: Client-side
- **Supported Formats**: PDF (.pdf)
- **Engine**: `pdf-lib` object stream compression, duplicate resource optimization, font deduplication.
- **Capabilities**: Safe stream optimization, compression ratio estimation, comparison of before/after file size without content destruction.
- **Max File Size**: 40 MB

### 10. Video to GIF (`/tools/video-to-gif`)
- **Category**: Video & Audio
- **Processing Mode**: Client-side (HTML5 Video & Canvas / FFmpeg.wasm)
- **Supported Formats**: MP4, WebM, MOV
- **Engine**: HTML5 Video frame extraction with animated GIF encoder
- **Capabilities**: Start and end time trimming, configurable FPS (5 to 20 fps), output width scaling, live preview, animated GIF download.
- **Max File Size**: 100 MB

### 11. Audio Extractor (`/tools/audio-extractor`)
- **Category**: Video & Audio
- **Processing Mode**: Client-side (Web Audio API / AudioContext / MediaStream / FFmpeg)
- **Supported Formats**: MP4, WebM, MKV, MOV, AVI
- **Engine**: Web Audio decoding & WAV/MP3 conversion pipeline
- **Capabilities**: Audio channel separation, volume gain check, high-fidelity WAV/MP3 export, audio preview player.
- **Max File Size**: 100 MB

### 12. AI Prompt Optimizer (`/tools/ai-prompt-optimizer`)
- **Category**: AI & Creator
- **Processing Mode**: Client-side
- **Capabilities**: Domain-specific optimization rules (Image generation, Coding, Copywriting, Research, System prompts). Enhances role clarity, step-by-step constraints, edge-case guidance, format specification, and negative constraints. One-click copy and prompt library export.

### 13. JSON Formatter & Validator (`/tools/json-formatter`)
- **Category**: Developer
- **Processing Mode**: Client-side
- **Capabilities**: 2-space, 4-space, tab indentation formatting, compact minification, syntax error detection with exact line and column numbers, key count, file size analysis, copy & download.

### 14. Base64 Encoder / Decoder (`/tools/base64-encoder-decoder`)
- **Category**: Developer
- **Processing Mode**: Client-side
- **Capabilities**: Full UTF-8 text encoding/decoding without character corruption (using `TextEncoder`/`TextDecoder`), URL-safe Base64 mode, file-to-data-URI encoding, invalid character validation.

### 15. Meta Tag Generator (`/tools/meta-tag-generator`)
- **Category**: SEO & Website
- **Processing Mode**: Client-side
- **Capabilities**: Live input for Title, Description, Canonical URL, Open Graph (OG), Twitter Card, Robots, Theme color. Real-time visual Google search snippet, Facebook preview, and Twitter card preview. One-click HTML tag copying.

### 16. Social Media Image Resizer (`/tools/social-media-image-resizer`)
- **Category**: Social Media
- **Processing Mode**: Client-side
- **Supported Platforms**:
  - YouTube (Banner: 2560x1440, Thumbnail: 1280x720)
  - Instagram (Square: 1080x1080, Portrait: 1080x1350, Story: 1080x1920)
  - Twitter/X (Header: 1500x500, Post: 1200x675)
  - Facebook (Cover: 820x312, Post: 1200x630)
  - LinkedIn (Cover: 1584x396, Post: 1200x627)
- **Capabilities**: Interactive preset selection, crop positioning (contain vs cover), padding fill, PNG/JPEG export.

### 17. Social Post Preview (`/tools/social-post-preview`)
- **Category**: Social Media
- **Processing Mode**: Client-side
- **Platforms**: Twitter/X, LinkedIn, Facebook, Instagram
- **Capabilities**: Profile avatar upload, author name, handle, post text with real-time character limit warnings per platform, attached media preview, responsive device toggle.

### 18. Password Generator (`/tools/password-generator`)
- **Category**: Security & Privacy
- **Processing Mode**: Client-side (Zero persistence or transmission)
- **Engine**: `window.crypto.getRandomValues()`
- **Capabilities**: Configurable length (8 to 128 characters), toggle uppercase, lowercase, numbers, special symbols, ambiguous character exclusion (`l`, `1`, `I`, `0`, `O`), password entropy estimation, strength meter, one-click copy.

### 19. QR Code Generator (`/tools/qr-code-generator`)
- **Category**: Everyday Utilities
- **Processing Mode**: Client-side
- **Input Modes**: URL, Plain Text, Wi-Fi Network config, vCard / Contact, Email
- **Capabilities**: Real-time rendering, error correction levels (L, M, Q, H), pixel size scaling, color customization (foreground/background), SVG and PNG instant download.

### 20. Word & Character Counter (`/tools/word-counter`)
- **Category**: Everyday Utilities
- **Processing Mode**: Client-side
- **Metrics**: Total words, characters (with spaces), characters (without spaces), sentences, paragraphs, estimated reading time (200 wpm), speaking time (130 wpm). Clear and copy actions.
