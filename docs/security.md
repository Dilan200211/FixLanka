# FixLanka Tools — Security & Privacy Architecture

## 1. Security Principles

### Client-Side Sandbox Processing
1. **Zero Data Transmission**: Uploaded user files are read directly into browser memory (via `FileReader` / `ArrayBuffer` / `HTMLImageElement`) and are processed by client-side WebAssembly, Canvas, or pure JS engines. No payload is dispatched to any backend server.
2. **Volatile Memory Model**: Processed buffers reside in browser memory only during the active tab session. When the user clears the tool session or navigates away, buffers are garbage collected and temporary Object URLs created with `URL.createObjectURL` are immediately revoked via `URL.revokeObjectURL`.
3. **No Dynamic Execution**: Absolutely no `eval()`, `new Function()`, or unescaped HTML interpolation (`dangerouslySetInnerHTML`) is allowed on user inputs.

---

## 2. Input Validation & File Integrity

### File Signature Verification (Magic Numbers)
MIME types provided by the browser file input dialog can easily be spoofed by altering file extensions. FixLanka Tools verifies the binary file header before processing:

| Format | Magic Number (Hex) | Offset |
|---|---|---|
| **JPEG** | `FF D8 FF` | 0 |
| **PNG** | `89 50 4E 47 0D 0A 1A 0A` | 0 |
| **WebP** | `52 49 46 46` ... `57 45 42 50` | 0 & 8 |
| **PDF** | `25 50 44 46` (`%PDF`) | 0 |
| **GIF** | `47 49 46 38` (`GIF8`) | 0 |
| **MP4** | `66 74 79 70` (`ftyp`) | 4 |

### Decompression Bomb & Resource Exhaustion Mitigation
- Hard file size boundaries are enforced at the file selection layer before reading file buffers into memory:
  - Images: 25 MB - 50 MB
  - PDFs: 40 MB - 50 MB
  - Video/Audio: 100 MB
- Canvas dimensions are bounded to maximum safe thresholds (8192 x 8192 pixels) to avoid mobile GPU memory overflows.

---

## 3. Provenance & Metadata Safety Rules

### Transparent Handling of Content Credentials (C2PA)
- Detection checks for JUMBF metadata boxes defined by the Coalition for Content Provenance and Authenticity (C2PA).
- When an image contains C2PA manifests, the user is warned that saving or stripping metadata may invalidate cryptographic signatures.
- **No Watermark Evasion**: FixLanka Tools explicitly rejects features designed to defeat invisible provenance watermarks (such as SynthID), strip C2PA signatures to disguise AI origins, or bypass platform AI disclosures.
- **Honest Detection Reporting**: If an image lacks AI tags, the tool explicitly clarifies: *"No supported AI metadata tags detected. Note: This does not guarantee human origin, as metadata can be omitted or stripped."*

---

## 4. Cryptographic Security for Utilities

- **Password Generation**: Uses the browser's cryptographically secure pseudo-random number generator (`window.crypto.getRandomValues()`). Passwords are never logged, cached, or transmitted.
- **Base64 Processing**: Handled safely with native `TextEncoder` and `TextDecoder` to avoid UTF-8 truncation vulnerabilities or malformed byte sequences.
