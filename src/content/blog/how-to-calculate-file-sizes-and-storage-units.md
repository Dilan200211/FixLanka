---
title: "How to Calculate File Sizes and Storage Units (KB vs KiB, MB vs MiB)"
seoTitle: "KB vs KiB & MB vs MiB: File Size Units Explained"
metaDescription: "Learn the difference between decimal file units (KB, MB, GB) and binary units (KiB, MiB, GiB), and calculate photo, PDF, and WAV audio sizes cleanly."
excerpt: "Why does a 500 GB drive show up as 465 GiB, and why do file upload limits sometimes disagree? Here is how decimal and binary units work."
status: "published"
publishDate: 2026-11-26
updatedDate: 2026-11-26
author: "fixlanka-editorial"
category: "educational-guides"
tags: ["bytes", "kilobytes", "mebibytes", "storage units", "iec"]
featuredImage: "/blog-covers/default.svg"
imageAlt: "Educational chart concept comparing decimal KB/MB and binary KiB/MiB file units"
relatedTools: ["image-compressor", "pdf-compressor", "audio-extractor"]
relatedArticles: ["how-to-compress-images-without-losing-quality", "how-to-reduce-pdf-file-size"]
references:
  - title: "NIST: Prefixes for binary multiples (IEC 80000-13)"
    url: "https://physics.nist.gov/cuu/Units/binary.html"
faqs:
  - question: "How many bytes are in 1 MiB vs 1 MB?"
    answer: "1 decimal megabyte (MB) equals 1,000,000 bytes (10^6), whereas 1 binary mebibyte (MiB) equals 1,048,576 bytes (2^20)."
---

If you have ever uploaded a file your operating system labeled "9.8 MB" only for a web form to reject it for exceeding "10 MB", you ran into the gap between **decimal (SI)** and **binary (IEC)** byte prefixes.

## Decimal Units (Base 10) vs. Binary Units (Base 2)

Storage manufacturers, macOS Finder, and web standards typically count in powers of **1,000**, while Windows File Explorer and memory hardware often calculate in powers of **1,024** (even when displaying "MB" labels):

| Unit | Standard | Exact Bytes | Multiplier |
|---|---|---|---|
| **1 KB** (Kilobyte) | SI Decimal | `1,000` | `10^3` |
| **1 KiB** (Kibibyte) | IEC Binary | `1,024` | `2^10` |
| **1 MB** (Megabyte) | SI Decimal | `1,000,000` | `10^6` |
| **1 MiB** (Mebibyte) | IEC Binary | `1,048,576` | `2^20` |
| **1 GB** (Gigabyte) | SI Decimal | `1,000,000,000` | `10^9` |
| **1 GiB** (Gibibyte) | IEC Binary | `1,073,741,824` | `2^30` |

Because `1,073,741,824 / 1,000,000,000 ≈ 1.0737`, a `500 GB` (`500,000,000,000` bytes) SSD displays as roughly **465.66 GiB** inside binary-reporting operating systems.

## Practical File Size Formula for Uncompressed Audio (WAV)

When using tools like the [Audio Extractor](/tools/audio-extractor/), uncompressed PCM WAV audio size is easy to predict:

`Bytes = Sample Rate (Hz) * Bit Depth / 8 * Channels * Duration (seconds)`

For standard CD-quality stereo audio (`44,100 Hz`, `16-bit`, `2 channels`), 1 minute equals `44,100 * 2 * 2 * 60 = 10,584,000` bytes (about `10.09 MiB` or `10.58 MB`).

## Staying Under Strict Portal Upload Caps

When a form enforces a strict `2 MB` or `5 MB` cap, aim slightly under the limit so decimal vs. binary rounding never causes an upload rejection. You can verify exact byte reduction locally with the [Image Compressor](/tools/image-compressor/) or [PDF Compressor](/tools/pdf-compressor/).
