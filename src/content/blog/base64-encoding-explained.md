---
title: "Base64 Encoding Explained (And Why Unicode Breaks Naive Encoders)"
seoTitle: "Base64 Encoding Explained — UTF-8 & Data URIs"
metaDescription: "Learn how Base64 turns binary bytes into ASCII text, why JavaScript btoa() corrupts Unicode emojis, and how UTF-8 TextEncoder fixes it."
excerpt: "Base64 represents arbitrary binary bytes using 64 safe ASCII characters. Learn how it works, when to use URL-safe Base64, and how UTF-8 fits in."
status: "published"
publishDate: 2026-11-26
updatedDate: 2026-11-26
author: "dilan-vinod"
category: "technology"
tags: ["base64", "utf-8", "encoding", "data uri", "rfc 4648"]
featuredImage: "/blog-covers/default.svg"
imageAlt: "Technical explanation of Base64 binary-to-text encoding and UTF-8 handling"
relatedTools: ["base64-encoder-decoder", "json-formatter"]
relatedArticles: ["how-to-format-and-validate-json-online"]
references:
  - title: "IETF RFC 4648: The Base16, Base32, and Base64 Data Encodings"
    url: "https://datatracker.ietf.org/doc/html/rfc4648"
  - title: "MDN Web Docs: Base64 and the Unicode Problem"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Base64"
faqs:
  - question: "Is Base64 a form of encryption?"
    answer: "No. Base64 is a reversible encoding scheme with no secret key. Anyone can decode a Base64 string immediately."
---

Base64 is one of the most misunderstood encodings in web development. It does not encrypt or compress data; instead, it converts arbitrary binary bytes into plain ASCII characters so binary payloads can travel safely through text-only channels such as JSON, email headers, URLs, and CSS Data URIs.

## How Base64 Maps Bytes to 64 Characters

Standard Base64 (defined in **RFC 4648**) splits input bytes into 24-bit groups (3 bytes) and maps every 6 bits into one of 64 printable characters: `A–Z`, `a–z`, `0–9`, `+`, and `/` (with `=` used as padding at the end when input bytes are not a multiple of 3).

Because every 3 input bytes expand into 4 ASCII characters, Base64 increases payload size by roughly **33%**.

## Standard Base64 vs. URL-Safe Base64 (`base64url`)

Standard Base64 uses `+`, `/`, and `=`, which carry special meanings in URLs and query strings. **URL-safe Base64** (RFC 4648 Section 5) swaps `+` for `-` and `/` for `_` so tokens and parameters pass cleanly through URLs without percent-encoding headaches.

## Why Naive `btoa()` Corrupts Emojis and Non-ASCII Text

In browsers, the legacy `window.btoa()` function expects single-byte Latin-1 characters. Passing a string containing an emoji (`🚀`) or multi-byte UTF-8 characters (`සිංහල`, `世界`) throws an `InvalidCharacterError`.

To handle Unicode properly, text must first be converted to raw UTF-8 bytes via `TextEncoder`, encoded to Base64, and decoded back via `TextDecoder`.

You can test UTF-8 Base64 encoding, URL-safe mode, and file-to-Data-URI conversion directly inside the [Base64 Encoder / Decoder](/tools/base64-encoder-decoder/).
