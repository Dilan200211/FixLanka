# FixLanka Tools — Keyword-to-URL Map & Search Intent Strategy

> **Data Integrity Note**: Search volumes and keyword difficulty metrics are intentionally omitted because no live keyword API dataset is connected; all intent classifications and competitor keyword opportunities below are qualitative planning targets, not measured SERP volume claims.

## Anti-Cannibalization Rules
1. Every tool page (`/tools/<slug>/`) owns **one unique `primaryKeyword`**.
2. Category pages (`/category/<slug>/`) target broad plural collection intents (`image tools`, `developer tools`, `security tools`, `file tools`, `text tools`, `converter tools`).
3. Blog articles (`/blog/<slug>/`) target `how-to`, `comparison`, `definition`, and `troubleshooting` informational queries and link directly to the corresponding transactional tool page.

---

## Tool Keyword Matrix (All 20 Tools)

| # | Tool | Canonical URL | Category | Primary Keyword | Secondary Keywords | Long-Tail & Question Targets | Search Intent |
|---|---|---|---|---|---|---|---|
| 1 | EXIF Metadata Viewer | `/tools/exif-metadata-viewer/` | `security-tools` | EXIF Metadata Viewer | view photo metadata, check image exif online, photo gps viewer, exif reader | check exif metadata in a photo without uploading; how do I see hidden metadata in a photo | Transactional-Utility |
| 2 | EXIF Privacy Cleaner | `/tools/exif-privacy-cleaner/` | `security-tools` | EXIF Privacy Cleaner | remove exif data online, remove gps from photo, strip photo metadata, exif remover | remove location data from photos before posting online; how do I remove gps location from a picture | Transactional-Utility |
| 3 | AI Metadata & C2PA Inspector | `/tools/ai-metadata-inspector/` | `security-tools` | C2PA Content Credentials Inspector | ai image metadata checker, inspect c2pa manifest, check if image has ai tags | inspect c2pa content credentials in jpg and png locally; how do I check if an image has c2pa metadata | Informational-Utility |
| 4 | Image Compressor | `/tools/image-compressor/` | `image-tools` | Image Compressor | compress image online, free image compressor, reduce image size, compress jpg, compress png | compress images online without losing quality; how to reduce image size for websites | Transactional-Utility |
| 5 | Image Resizer | `/tools/image-resizer/` | `image-tools` | Image Resizer | resize image online, photo resizer, change image dimensions, scale photo pixels | resize image by exact pixels without losing aspect ratio; how do I resize a photo without stretching it | Transactional-Utility |
| 6 | Image Format Converter | `/tools/image-converter/` | `image-tools` | Image Format Converter | png to jpg, jpg to webp, webp to png, convert image format online | convert png and jpg to webp online without uploading; how to convert images to webp online | Transactional-Utility |
| 7 | PDF Merger | `/tools/pdf-merger/` | `file-tools` | PDF Merger | merge pdf online, combine pdf files, join pdf documents, free pdf combiner | combine multiple pdf files into one without uploading; is it safe to merge confidential pdfs online | Transactional-Utility |
| 8 | PDF Splitter | `/tools/pdf-splitter/` | `file-tools` | PDF Splitter | split pdf online, extract pages from pdf, pdf page extractor, separate pdf pages | extract specific page ranges from pdf without uploading; how do I extract non-consecutive pages from a pdf | Transactional-Utility |
| 9 | PDF Compressor | `/tools/pdf-compressor/` | `file-tools` | PDF Compressor | compress pdf online, reduce pdf file size, shrink pdf, pdf optimizer | reduce pdf file size locally without uploading sensitive files; how to reduce pdf file size without losing text quality | Transactional-Utility |
| 10 | Video to GIF | `/tools/video-to-gif/` | `converter-tools` | Video to GIF Converter | mp4 to gif, convert video to gif online, webm to gif, free gif maker | convert mp4 clip to animated gif in browser without uploading; why are animated gifs larger than mp4 videos | Transactional-Utility |
| 11 | Audio Extractor | `/tools/audio-extractor/` | `converter-tools` | Audio Extractor from Video | extract audio from video online, mp4 to wav converter, save audio from video | extract wav audio from mp4 video without uploading; how to extract audio from a video without uploading it | Transactional-Utility |
| 12 | AI Prompt Optimizer | `/tools/ai-prompt-optimizer/` | `text-tools` | AI Prompt Optimizer | prompt improver, structured prompt builder, llm prompt optimizer, ai prompt generator | structure rough prompts for chatgpt claude and gemini locally; how do I structure a better ai prompt | Transactional-Utility |
| 13 | JSON Formatter & Validator | `/tools/json-formatter/` | `developer-tools` | JSON Formatter & Validator | format json online, json validator, beautify json, minify json | validate and beautify json with line and column error detection; how to find a syntax error in json | Transactional-Utility |
| 14 | Base64 Encoder / Decoder | `/tools/base64-encoder-decoder/` | `developer-tools` | Base64 Encoder & Decoder | base64 encode online, base64 decode utf8, text to base64, file to data uri | encode and decode utf8 unicode text to base64 without corruption; why does btoa fail on unicode emojis | Transactional-Utility |
| 15 | Meta Tag Generator | `/tools/meta-tag-generator/` | `developer-tools` | Meta Tag Generator | open graph tag generator, seo meta tags generator, google serp preview tool | generate html meta tags and open graph cards with live preview; what is the ideal length for title and meta description tags | Transactional-Utility |
| 16 | Social Media Image Resizer | `/tools/social-media-image-resizer/` | `image-tools` | Social Media Image Resizer | youtube thumbnail resizer, instagram image resizer, linkedin banner resizer | resize photos for youtube thumbnail 1280x720 and instagram 1080x1350; what size is a youtube thumbnail | Transactional-Utility |
| 17 | Social Post Preview | `/tools/social-post-preview/` | `text-tools` | Social Post Preview Simulator | x post preview, linkedin post preview tool, instagram caption preview | preview social media post copy and image before publishing; how will my linkedin or x post look on mobile | Transactional-Utility |
| 18 | Password Generator | `/tools/password-generator/` | `security-tools` | Cryptographic Password Generator | strong password generator, random password generator, secure password maker | generate strong random password locally with web crypto api; how to generate a strong password | Transactional-Utility |
| 19 | QR Code Generator | `/tools/qr-code-generator/` | `converter-tools` | QR Code Generator | free qr code maker, wifi qr code generator, svg qr code generator, static qr code | create non-expiring static qr code for wifi and urls; do static qr codes ever expire | Transactional-Utility |
| 20 | Word & Character Counter | `/tools/word-counter/` | `text-tools` | Word & Character Counter | word counter online, character count tool, reading time calculator, sentence counter | count words and characters without spaces in browser; how is article reading time calculated | Transactional-Utility |

---

## Competitor Keyword Opportunities (Qualitative)
- **Privacy-First Differentiator**: Most high-ranking tool competitors upload files to remote servers and enforce daily file limits or login gates. Targeting `without uploading`, `client-side`, `offline`, `no sign-up`, and `browser memory` captures privacy-conscious and enterprise users.
- **Format & Troubleshooting Questions**: Companion `/blog/` guides capture top-of-funnel questions (e.g., *Why PNG to JPG turns transparent pixels black*, *Why scanned PDFs barely shrink*, *Why btoa() breaks emojis*) and pass internal relevance directly to the matching utility.
