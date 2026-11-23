import type { ToolDefinition, ToolCategory, AvailabilityStatus } from '../types/tool';

export const TOOLS: ToolDefinition[] = [
  // 1. EXIF Metadata Viewer
  {
    id: 'exif-metadata-viewer',
    slug: 'exif-metadata-viewer',
    name: 'EXIF Metadata Viewer',
    category: 'privacy-metadata',
    description: 'Inspect full EXIF, IPTC, XMP, camera specs, GPS coordinates, and embedded technical tags from your photos directly in your browser.',
    shortDescription: 'View full EXIF, camera settings, and GPS metadata from images.',
    icon: 'Camera',
    keywords: ['exif viewer', 'photo metadata', 'gps location', 'camera settings', 'iptc', 'xmp'],
    supportedInputTypes: ['image/jpeg', 'image/tiff', 'image/png', 'image/webp'],
    supportedOutputTypes: ['application/json', 'text/plain'],
    maxFileSize: 52428800, // 50 MB
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-privacy-cleaner', 'ai-metadata-inspector', 'image-compressor'],
    seoTitle: 'Free EXIF Metadata Viewer — Inspect Photo Camera & GPS Info Online',
    seoDescription: 'View camera settings, ISO, focal length, timestamps, and GPS coordinates hidden in JPEG, PNG, TIFF, and WebP images. 100% private in-browser tool.',
    instructions: [
      'Select or drag & drop an image file (JPEG, PNG, TIFF, or WebP).',
      'The file is parsed locally in browser memory without server upload.',
      'Explore categorized sections: Camera & Lens, Exposure & Capture, GPS Location, and Technical tags.',
      'Copy metadata as structured JSON or download the full metadata report.'
    ],
    featuresList: [
      'Extracts camera make, model, lens, aperture, shutter speed, and ISO',
      'Detects GPS latitude, longitude, and elevation with instant map link',
      'Parses IPTC and XMP extended tags',
      'Zero server upload — 100% private in-browser analysis'
    ],
    faqs: [
      {
        question: 'Are my images uploaded to any server?',
        answer: 'No. FixLanka Tools reads and parses image binary headers completely within your browser memory. Your files never leave your device.'
      },
      {
        question: 'Which image formats contain EXIF metadata?',
        answer: 'JPEG, TIFF, and WebP formats commonly contain EXIF data. PNG images may include IPTC or XMP chunks.'
      }
    ],
    privacyNotice: 'Your image is processed strictly in your local browser sandbox. No file content or metadata is transmitted or stored remotely.'
  },

  // 2. EXIF Privacy Cleaner
  {
    id: 'exif-privacy-cleaner',
    slug: 'exif-privacy-cleaner',
    name: 'EXIF Privacy Cleaner',
    category: 'privacy-metadata',
    description: 'Scrub sensitive GPS location coordinates, camera serial numbers, and personal device information before publishing images online.',
    shortDescription: 'Remove GPS coordinates, device info, and private EXIF data.',
    icon: 'ShieldOff',
    keywords: ['exif remover', 'remove gps', 'scrub photo metadata', 'privacy cleaner', 'anonymize image'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 31457280, // 30 MB
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-metadata-viewer', 'ai-metadata-inspector', 'image-compressor'],
    seoTitle: 'Free EXIF Privacy Cleaner — Remove GPS & Device Tags Online',
    seoDescription: 'Safely wipe GPS coordinates, camera serial numbers, and personal metadata from images before sharing. Preserves visual orientation without server uploads.',
    instructions: [
      'Upload an image to inspect its embedded personal metadata tags.',
      'Review detected privacy flags (such as GPS coordinates or device identifiers).',
      'Select your desired output format and compression quality.',
      'Click "Clean & Download Sanitized Image" to generate a clean version.'
    ],
    featuresList: [
      'Removes GPS latitude, longitude, and altitude tags',
      'Strips camera serial number, owner name, and software identifiers',
      'Preserves correct visual orientation and transparency',
      'Provides side-by-side file size and metadata verification'
    ],
    faqs: [
      {
        question: 'Does cleaning metadata alter image quality?',
        answer: 'Re-encoding into JPEG may slightly adjust compression. You can select maximum quality (100%) or choose PNG/WebP to minimize any visual loss.'
      },
      {
        question: 'Does this strip C2PA Content Credentials?',
        answer: 'Re-encoding strips standard EXIF tags. If an image contains cryptographic C2PA provenance signatures, re-encoding will invalidate them; the tool clearly notifies you when provenance manifests are present.'
      }
    ],
    privacyNotice: 'Sanitization happens purely in browser memory. The original file is never overwritten on your device.'
  },

  // 3. AI Metadata & C2PA Inspector
  {
    id: 'ai-metadata-inspector',
    slug: 'ai-metadata-inspector',
    name: 'AI Metadata & C2PA Inspector',
    category: 'privacy-metadata',
    description: 'Detect AI generation markers, generator software signatures, and inspect C2PA Content Credentials manifests in images.',
    shortDescription: 'Inspect C2PA Content Credentials and AI generator markers.',
    icon: 'Fingerprint',
    keywords: ['c2pa inspector', 'ai metadata', 'content credentials', 'midjourney metadata', 'dalle tags', 'synthid'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
    supportedOutputTypes: ['application/json'],
    maxFileSize: 52428800, // 50 MB
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-metadata-viewer', 'exif-privacy-cleaner'],
    seoTitle: 'AI Metadata & C2PA Content Credentials Inspector — FixLanka',
    seoDescription: 'Inspect C2PA Content Credentials manifests, AI generator software tags, and provenance assertions in your photos. Transparent, evidence-based reporting.',
    instructions: [
      'Drop an image into the inspector.',
      'The engine searches for JUMBF (C2PA) manifest boxes and IPTC/XMP generative AI tags.',
      'Review the evidence card detailing detected claims, generators, and software signatures.',
      'Inspect signing certificates and validation details where present.'
    ],
    featuresList: [
      'Detects JUMBF (C2PA / CAI) Content Credentials boxes',
      'Identifies known AI tools (Midjourney, DALL-E, Stable Diffusion, Adobe Firefly)',
      'Inspects IPTC DigitalSourceType and XMP prompt assertions',
      'Transparently explains detection limitations without false guarantees'
    ],
    faqs: [
      {
        question: 'Does a missing AI tag prove an image was taken by a human?',
        answer: 'No. AI metadata can be stripped or omitted by editing software. A lack of AI markers is not proof of human authorship.'
      },
      {
        question: 'Can this tool remove invisible watermarks like SynthID?',
        answer: 'No. FixLanka Tools does not provide tools to evade or remove invisible provenance watermarks or bypass platform AI labels.'
      }
    ],
    privacyNotice: 'Analyzed entirely in your browser. No image data or provenance claims are sent to remote servers.'
  },

  // 4. Image Compressor
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    description: 'Compress JPEG, WebP, and PNG images locally with adjustable quality and instant before/after byte savings calculation.',
    shortDescription: 'Compress JPEG, WebP, and PNG photos locally with zero loss in speed.',
    icon: 'Minimize2',
    keywords: ['image compressor', 'reduce photo size', 'compress jpg', 'shrink png', 'webp compressor'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/jpeg', 'image/webp', 'image/png'],
    maxFileSize: 31457280, // 30 MB
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-resizer', 'image-converter', 'exif-privacy-cleaner'],
    seoTitle: 'Free Image Compressor — Shrink Images Locally Without Server Upload',
    seoDescription: 'Reduce image file sizes instantly in your browser. Adjustable compression slider, real-time before/after comparison, and fast batch processing.',
    instructions: [
      'Choose or drag & drop one or multiple images.',
      'Adjust the quality slider to balance image size and visual fidelity.',
      'Preview the compressed file size and percentage reduction.',
      'Download individual images or batch download all compressed results.'
    ],
    featuresList: [
      'Adjustable compression quality from 1% to 100%',
      'Batch processing of multiple files at once',
      'Visual before/after comparison with zoom inspection',
      'Immediate byte savings percentage and bandwidth estimation'
    ],
    faqs: [
      {
        question: 'What is the recommended compression quality?',
        answer: 'A quality level between 75% and 85% typically reduces file size by 60-80% with virtually no perceptible loss in quality.'
      }
    ],
    privacyNotice: 'All compression operations execute locally in your browser memory.'
  },

  // 5. Image Resizer
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    description: 'Resize image dimensions by width and height, percentage, or standard resolution presets with aspect ratio locking.',
    shortDescription: 'Resize image dimensions by pixel, percentage, or preset.',
    icon: 'Scaling',
    keywords: ['image resizer', 'resize photo', 'scale image', 'change picture dimensions'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    supportedOutputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 31457280, // 30 MB
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-compressor', 'image-converter', 'social-media-image-resizer'],
    seoTitle: 'Free Online Image Resizer — Scale Photos by Pixels or Percentage',
    seoDescription: 'Easily change image dimensions online. Lock aspect ratio, pick standard presets (1080p, 4K, Avatar), or scale by percentage. Fast and private.',
    instructions: [
      'Upload an image to inspect its current pixel dimensions.',
      'Enter new width and height values, or choose a percentage / preset.',
      'Toggle aspect ratio lock to avoid visual distortion.',
      'Preview the resized image and click Download.'
    ],
    featuresList: [
      'Exact pixel dimension controls with aspect ratio lock',
      'Quick scaling presets (25%, 50%, 75%, 200%)',
      'High-quality bicubic canvas interpolation',
      'Customizable output format (JPEG, PNG, WebP)'
    ],
    faqs: [
      {
        question: 'Will resizing my image make it blurry?',
        answer: 'Downscaling preserves clarity. Upscaling beyond the original dimensions may cause soft edges because new pixel data is interpolated.'
      }
    ],
    privacyNotice: 'Zero server uploads. Processed purely in browser canvas memory.'
  },

  // 6. Image Format Converter
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Format Converter',
    category: 'image',
    description: 'Convert images between PNG, JPEG, and modern WebP formats in browser memory with verified MIME types and magic byte checks.',
    shortDescription: 'Convert between PNG, JPEG, and WebP formats client-side.',
    icon: 'RefreshCw',
    keywords: ['image converter', 'png to jpg', 'jpg to webp', 'convert photo format', 'webp to png'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
    supportedOutputTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxFileSize: 31457280, // 30 MB
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-compressor', 'image-resizer'],
    seoTitle: 'Free Image Format Converter — Convert PNG, JPG & WebP in Browser',
    seoDescription: 'Convert images to PNG, JPEG, or WebP without server uploads. High-fidelity color conversion with transparency controls and genuine file signatures.',
    instructions: [
      'Select or drop one or multiple images.',
      'Select your target format (PNG, JPEG, or WebP).',
      'Adjust background fill color for transparent images converting to JPEG.',
      'Download your converted files instantly.'
    ],
    featuresList: [
      'Converts to PNG, JPEG, and WebP',
      'Handles alpha transparency with custom fill color options',
      'Validates genuine binary file signatures (magic bytes)',
      'Zero server upload for total confidentiality'
    ],
    faqs: [
      {
        question: 'Does this tool just rename the file extension?',
        answer: 'No. The tool decodes the raw image bitmap and encodes it using the target format encoder, producing genuine, validated binary files.'
      }
    ],
    privacyNotice: 'Conversion is performed entirely on your device.'
  },

  // 7. PDF Merger
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    description: 'Combine multiple PDF documents into a single organized file. Reorder pages and files with drag-and-drop simplicity.',
    shortDescription: 'Combine multiple PDF files into one document in browser memory.',
    icon: 'FilePlus',
    keywords: ['merge pdf', 'combine pdf', 'join pdf documents', 'pdf combiner'],
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 52428800, // 50 MB
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-splitter', 'pdf-compressor'],
    seoTitle: 'Free PDF Merger — Combine PDF Files Securely Online',
    seoDescription: 'Merge multiple PDF documents into a single file directly in your browser. Reorder files easily, completely private with no server uploads.',
    instructions: [
      'Select two or more PDF documents.',
      'Use the up/down controls to arrange files in the desired order.',
      'Click "Merge PDFs" to assemble the combined document.',
      'Download the final merged PDF immediately.'
    ],
    featuresList: [
      'Merge unlimited PDF pages client-side',
      'Interactive file reordering controls',
      'Reads and displays page counts for each file',
      'Safe memory management via pdf-lib'
    ],
    faqs: [
      {
        question: 'Is it safe to merge confidential contracts here?',
        answer: 'Yes! FixLanka Tools executes PDF operations locally in your browser memory. Your files are never sent over the internet to any server.'
      }
    ],
    privacyNotice: 'Processed strictly in local browser memory. Files are never transmitted.'
  },

  // 8. PDF Splitter
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'pdf',
    description: 'Extract specific pages or page ranges from a PDF document into a newly generated, clean PDF file.',
    shortDescription: 'Extract specific pages or page ranges from any PDF document.',
    icon: 'Split',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf page extractor'],
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 52428800, // 50 MB
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-merger', 'pdf-compressor'],
    seoTitle: 'Free PDF Splitter — Extract Pages from PDF Online Privately',
    seoDescription: 'Extract custom page ranges (e.g. 1-3, 5, 8-10) or individual pages from PDF documents. Zero server uploads, fast in-browser processing.',
    instructions: [
      'Upload the PDF document you want to split.',
      'Review the total page count displayed by the tool.',
      'Enter the pages or range you wish to extract (e.g., 1-4, 7, 10-12).',
      'Click "Extract Pages" and download your newly created PDF.'
    ],
    featuresList: [
      'Supports range syntax (e.g., "1-5, 8, 11-14")',
      'Interactive page selector chips',
      'Accurate page count and structure parsing',
      '100% private in-browser document generation'
    ],
    faqs: [
      {
        question: 'Can I extract non-consecutive pages?',
        answer: 'Yes! Simply type comma-separated numbers and ranges, such as "1, 3, 5-8".'
      }
    ],
    privacyNotice: 'Document parsing occurs in browser memory. No data is sent to a server.'
  },

  // 9. PDF Compressor
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    description: 'Optimize PDF file size by deduplicating objects and compressing internal streams without third-party server exposure.',
    shortDescription: 'Optimize PDF file size with client-side object stream compression.',
    icon: 'FileArchive',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer'],
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 41943040, // 40 MB
    maxFileSizeFormatted: '40 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-merger', 'pdf-splitter'],
    seoTitle: 'Free PDF Compressor — Optimize PDF Size Locally in Browser',
    seoDescription: 'Safely reduce PDF file size with object stream compression and structural optimization. No file uploads, completely confidential.',
    instructions: [
      'Upload a PDF file to analyze its structural overhead.',
      'Select compression level (Standard or Maximum Stream Optimization).',
      'Click "Compress PDF" to process streams in browser memory.',
      'Review the byte reduction and download your optimized PDF.'
    ],
    featuresList: [
      'Object stream deduplication and recompression',
      'Calculates accurate before and after byte savings',
      'Preserves vector fidelity and text searchability',
      'No server uploads for complete confidentiality'
    ],
    faqs: [
      {
        question: 'Why do some PDFs not shrink significantly?',
        answer: 'PDFs that already consist mostly of pre-compressed scanned JPEG images or linearized streams cannot be substantially compressed without downsampling embedded bitmaps.'
      }
    ],
    privacyNotice: 'Optimized purely in local browser memory.'
  },

  // 10. Video to GIF
  {
    id: 'video-to-gif',
    slug: 'video-to-gif',
    name: 'Video to GIF',
    category: 'video-audio',
    description: 'Convert video clips (MP4, WebM, MOV) into animated GIFs with start/end time trimming, FPS, and width controls.',
    shortDescription: 'Convert video clips into animated GIFs with trim and FPS controls.',
    icon: 'Film',
    keywords: ['video to gif', 'mp4 to gif', 'make animated gif', 'gif maker'],
    supportedInputTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    supportedOutputTypes: ['image/gif'],
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFormatted: '100 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['audio-extractor', 'image-compressor'],
    seoTitle: 'Free Video to GIF Converter — Create Animated GIFs in Browser',
    seoDescription: 'Convert MP4, WebM, or MOV clips to high-quality animated GIFs. Trim start/end times, set frame rate, and adjust output width with zero server uploads.',
    instructions: [
      'Upload a video clip (MP4, WebM, or MOV).',
      'Set the start and end time markers for the segment you want to animate.',
      'Choose your frame rate (5 to 20 FPS) and target width.',
      'Click "Generate GIF", preview the animation, and download.'
    ],
    featuresList: [
      'Interactive video playback scrubber for precision trimming',
      'Configurable frame rates (5, 10, 15, 20 fps) and resolutions',
      'Real-time encoding progress percentage indicator',
      'Instant GIF playback preview before download'
    ],
    faqs: [
      {
        question: 'Why are GIFs larger than videos?',
        answer: 'GIF is a legacy format without inter-frame temporal compression. Keeping the duration short (under 6 seconds) and FPS around 10-15 produces optimal file sizes.'
      }
    ],
    privacyNotice: 'Processed on your computer using HTML5 Video and Canvas encoding.'
  },

  // 11. Audio Extractor
  {
    id: 'audio-extractor',
    slug: 'audio-extractor',
    name: 'Audio Extractor',
    category: 'video-audio',
    description: 'Extract audio tracks from video files into high-quality WAV audio directly on your device without uploading gigabytes.',
    shortDescription: 'Extract pristine audio tracks from videos right in your browser.',
    icon: 'Music',
    keywords: ['extract audio from video', 'video to mp3', 'video to wav', 'audio rip'],
    supportedInputTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'],
    supportedOutputTypes: ['audio/wav'],
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFormatted: '100 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['video-to-gif'],
    seoTitle: 'Free Audio Extractor — Extract Audio from Video in Browser',
    seoDescription: 'Extract crisp audio tracks from MP4, WebM, and MOV videos directly on your device using Web Audio API. 100% private, no server upload.',
    instructions: [
      'Upload a video file containing an audio track.',
      'The browser decodes the audio track using Web Audio API.',
      'Preview the extracted audio in the built-in media player.',
      'Click "Download Audio File" to save the high-fidelity track.'
    ],
    featuresList: [
      'Decodes multi-channel audio directly from video containers',
      'High-fidelity uncompressed WAV audio export',
      'Built-in audio player with waveform visualizer',
      'No data upload over the internet'
    ],
    faqs: [
      {
        question: 'Does this require uploading my video to a cloud server?',
        answer: 'No! The audio stream is decoded directly by your browser using the HTML5 Web Audio API, saving your bandwidth and protecting your privacy.'
      }
    ],
    privacyNotice: 'Extracted purely inside your browser memory.'
  },

  // 12. AI Prompt Optimizer
  {
    id: 'ai-prompt-optimizer',
    slug: 'ai-prompt-optimizer',
    name: 'AI Prompt Optimizer',
    category: 'ai-creator',
    description: 'Transform vague prompts into high-performing, structured instructions for ChatGPT, Claude, Gemini, and Midjourney.',
    shortDescription: 'Supercharge AI prompts with structured context, constraints & clarity.',
    icon: 'Wand2',
    keywords: ['prompt optimizer', 'prompt engineering', 'chatgpt prompt helper', 'midjourney prompt enhancer'],
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 1048576, // 1 MB
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['word-counter', 'ai-metadata-inspector'],
    seoTitle: 'Free AI Prompt Optimizer — Craft Superior LLM & Midjourney Prompts',
    seoDescription: 'Enhance your AI prompts with expert prompt engineering frameworks. Add role context, strict constraints, few-shot structures, and negative guidance.',
    instructions: [
      'Enter your initial draft idea or prompt.',
      'Select your target domain (Coding, Writing, Image Generation, Research, or Reasoning).',
      'Customize role, tone, and constraint parameters.',
      'Click "Optimize Prompt" and copy the structured output to your clipboard.'
    ],
    featuresList: [
      'Includes specialized templates for Coding, Copywriting, Midjourney, and Research',
      'Embeds chain-of-thought instructions and boundary conditions',
      'One-click clipboard copy and Markdown formatting',
      'Works offline with zero external API fees'
    ],
    faqs: [
      {
        question: 'Does this call an external paid AI model?',
        answer: 'No. The optimizer uses proven rule-based prompt engineering heuristics and template synthesis algorithms completely inside your browser.'
      }
    ],
    privacyNotice: 'Your prompt text is never saved or transmitted to any third party.'
  },

  // 13. JSON Formatter & Validator
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer',
    description: 'Format, validate, beautify, and minify JSON data with exact syntax error line and column detection.',
    shortDescription: 'Beautify, validate, and minify JSON with syntax error detection.',
    icon: 'Braces',
    keywords: ['json formatter', 'json validator', 'beautify json', 'minify json', 'json lint'],
    supportedInputTypes: ['application/json', 'text/plain'],
    supportedOutputTypes: ['application/json'],
    maxFileSize: 10485760, // 10 MB
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['base64-encoder-decoder', 'meta-tag-generator'],
    seoTitle: 'Free JSON Formatter & Validator — Beautify & Lint JSON Online',
    seoDescription: 'Format, minify, and validate JSON data instantly. Highlights syntax errors with precise line and column numbers. Copy or download formatted output.',
    instructions: [
      'Paste your raw JSON into the editor or upload a .json file.',
      'Select your desired indentation (2 spaces, 4 spaces, or compact minify).',
      'Syntax errors are automatically highlighted with precise error positions.',
      'Copy the clean JSON or download it as a `.json` file.'
    ],
    featuresList: [
      'Instant validation with exact line and column error indicators',
      '2-space, 4-space, and tab indentation options',
      'One-click JSON minification for production payloads',
      'Displays key count, node depth, and raw byte size metrics'
    ],
    faqs: [
      {
        question: 'Can I format sensitive API tokens or user data in JSON?',
        answer: 'Yes! FixLanka Tools does not log or transmit your data. All formatting is computed locally in JavaScript memory.'
      }
    ],
    privacyNotice: 'Your JSON data remains strictly inside your browser tab.'
  },

  // 14. Base64 Encoder / Decoder
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'developer',
    description: 'Safely encode and decode UTF-8 text and binary files to and from Base64 strings with zero character corruption.',
    shortDescription: 'Encode and decode UTF-8 text and files with Base64 safely.',
    icon: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 to text', 'utf8 base64', 'data uri'],
    supportedInputTypes: ['text/plain', '*/*'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 10485760, // 10 MB
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['json-formatter', 'password-generator'],
    seoTitle: 'Free Base64 Encoder & Decoder — UTF-8 Safe Online Tool',
    seoDescription: 'Fast, secure Base64 encoder and decoder supporting UTF-8 unicode text and file data URIs. No server uploads, zero character corruption.',
    instructions: [
      'Select whether you want to Encode or Decode.',
      'Type or paste your text into the input field, or upload a small file.',
      'Toggle URL-safe encoding mode if passing strings in query parameters.',
      'Copy your encoded Base64 string or decoded output with one click.'
    ],
    featuresList: [
      'Proper UTF-8 encoding via TextEncoder/TextDecoder to prevent accent corruption',
      'URL-safe Base64 mode (- and _ substitution)',
      'Real-time encoding as you type',
      'File-to-Base64 Data URI converter mode'
    ],
    faqs: [
      {
        question: 'Why do standard atob/btoa functions corrupt emojis and foreign characters?',
        answer: 'Standard browser btoa() treats input as Latin-1. FixLanka Tools uses modern TextEncoder to ensure full UTF-8 Unicode compatibility.'
      }
    ],
    privacyNotice: 'Executed in browser memory. Nothing is sent to any server.'
  },

  // 15. Meta Tag Generator
  {
    id: 'meta-tag-generator',
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'seo',
    description: 'Generate complete, SEO-optimized meta tags, Open Graph (OG) tags, Twitter Cards, and robots directives with live previews.',
    shortDescription: 'Generate Open Graph, Twitter Cards, and SEO meta tags with live preview.',
    icon: 'Tag',
    keywords: ['meta tag generator', 'open graph generator', 'twitter card preview', 'seo meta tags', 'serp preview'],
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/html'],
    maxFileSize: 1048576, // 1 MB
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-post-preview', 'word-counter'],
    seoTitle: 'Free Meta Tag Generator — Open Graph & Twitter Cards with Preview',
    seoDescription: 'Create perfect SEO meta tags, Open Graph cards, and Twitter Card tags. Includes live Google SERP preview and social sharing cards. Copy ready-to-paste HTML.',
    instructions: [
      'Fill in your webpage title, description, canonical URL, and social image.',
      'Toggle robots indexing directives (index, follow, noarchive).',
      'Review the live Google Search snippet and social card previews.',
      'Click "Copy HTML Meta Tags" and paste them inside your HTML `<head>` tag.'
    ],
    featuresList: [
      'Generates standard SEO, Open Graph, and Twitter Card metadata',
      'Live Google Search result snippet preview',
      'Character count indicators with optimal SEO length recommendations',
      'One-click ready-to-paste HTML code output'
    ],
    faqs: [
      {
        question: 'What is the optimal length for title and description tags?',
        answer: 'Keep titles between 50-60 characters and descriptions between 140-160 characters to prevent search engines from truncating them.'
      }
    ],
    privacyNotice: 'All data entered remains strictly in your browser.'
  },

  // 16. Social Media Image Resizer
  {
    id: 'social-media-image-resizer',
    slug: 'social-media-image-resizer',
    name: 'Social Media Image Resizer',
    category: 'social-media',
    description: 'Resize and crop images to exact dimensions for YouTube, Instagram, X (Twitter), Facebook, and LinkedIn banners and posts.',
    shortDescription: 'Resize photos for YouTube, Instagram, X, Facebook, and LinkedIn.',
    icon: 'Maximize',
    keywords: ['social media image resizer', 'youtube thumbnail size', 'instagram square resizer', 'twitter banner size'],
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/png', 'image/jpeg'],
    maxFileSize: 31457280, // 30 MB
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-post-preview', 'image-resizer', 'image-compressor'],
    seoTitle: 'Social Media Image Resizer — YouTube, Instagram, X, LinkedIn Presets',
    seoDescription: 'Instantly resize images for YouTube banners, Instagram stories/posts, Twitter headers, LinkedIn covers, and Facebook ads. Exact dimensions, 100% private.',
    instructions: [
      'Upload the graphic or photo you want to prepare.',
      'Select your target social platform and format preset.',
      'Choose fitting mode (Cover crop or Contain with padding).',
      'Preview the result and download your optimized social graphic.'
    ],
    featuresList: [
      'Presets for YouTube, Instagram, Twitter/X, Facebook, and LinkedIn',
      'Contain vs. Cover aspect ratio handling with background color selection',
      'High-quality Canvas pixel scaling',
      'Instant PNG or JPEG download'
    ],
    faqs: [
      {
        question: 'Are the platform preset dimensions up to date?',
        answer: 'Yes! Presets are configured for the latest social network guidelines (e.g., YouTube Thumbnail 1280x720, Instagram Post 1080x1080/1080x1350).'
      }
    ],
    privacyNotice: 'Zero server uploads. Processed purely in browser canvas memory.'
  },

  // 17. Social Post Preview
  {
    id: 'social-post-preview',
    slug: 'social-post-preview',
    name: 'Social Post Preview',
    category: 'social-media',
    description: 'Preview how your social posts will look on X (Twitter), LinkedIn, Facebook, and Instagram before hitting publish.',
    shortDescription: 'Preview your posts for Twitter, LinkedIn, Facebook, and Instagram.',
    icon: 'Eye',
    keywords: ['social post preview', 'twitter post simulator', 'linkedin post preview', 'facebook preview'],
    supportedInputTypes: ['text/plain', 'image/*'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 10485760, // 10 MB
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-media-image-resizer', 'meta-tag-generator'],
    seoTitle: 'Free Social Post Preview — Twitter, LinkedIn, Facebook & Instagram Simulator',
    seoDescription: 'Simulate how your social media updates and attachments appear on desktop and mobile feeds. Live character counts and layout verification.',
    instructions: [
      'Select the social media platform you want to preview.',
      'Enter your display name, username handle, and post text.',
      'Optionally upload an image attachment or link preview graphic.',
      'Inspect the simulated post appearance on desktop and mobile layouts.'
    ],
    featuresList: [
      'Faithful visual replicas of Twitter/X, LinkedIn, Facebook, and Instagram posts',
      'Live character counters with platform-specific limit warnings',
      'Supports image attachments and simulated link cards',
      'Desktop and mobile feed view toggles'
    ],
    faqs: [
      {
        question: 'Is this an official platform preview?',
        answer: 'This tool provides a visual approximation based on current public layout styles to help you format copy and imagery before publishing.'
      }
    ],
    privacyNotice: 'Previewed locally in browser DOM. No post drafts are saved.'
  },

  // 18. Password Generator
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'security',
    description: 'Generate cryptographically strong, uncrackable passwords using browser crypto.getRandomValues() with entropy estimation.',
    shortDescription: 'Generate cryptographically strong passwords locally with zero tracking.',
    icon: 'Key',
    keywords: ['password generator', 'random password', 'strong password', 'secure password generator'],
    supportedInputTypes: [],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 0,
    maxFileSizeFormatted: 'N/A',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['qr-code-generator', 'base64-encoder-decoder'],
    seoTitle: 'Free Password Generator — Cryptographically Secure & 100% Private',
    seoDescription: 'Generate strong, random passwords using browser cryptographic randomness (crypto.getRandomValues). Includes entropy score and character set filters.',
    instructions: [
      'Select your desired password length (8 to 128 characters).',
      'Toggle character options: uppercase, lowercase, numbers, and special symbols.',
      'Optionally exclude ambiguous characters (such as l, 1, I, O, 0).',
      'Click "Generate Password" and copy it to your password manager.'
    ],
    featuresList: [
      'Powered by window.crypto.getRandomValues() for true cryptographic security',
      'Configurable length from 8 to 128 characters',
      'Bit entropy calculation and password strength grading',
      'Zero storage, transmission, or logging — completely ephemeral'
    ],
    faqs: [
      {
        question: 'Can FixLanka Tools see my generated password?',
        answer: 'Never. The password is generated entirely on your device using the browser native crypto API. It is never logged or sent across any network.'
      }
    ],
    privacyNotice: 'Generated completely in client-side memory using Web Cryptography API. Passwords are never saved, tracked, or transmitted.'
  },

  // 19. QR Code Generator
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'everyday',
    description: 'Generate high-resolution custom QR codes for URLs, plain text, Wi-Fi network credentials, and contacts with instant PNG/SVG export.',
    shortDescription: 'Create high-res QR codes for URLs, text, Wi-Fi, and contacts.',
    icon: 'QrCode',
    keywords: ['qr code generator', 'create qr code', 'wifi qr code', 'free qr generator', 'svg qr code'],
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['image/png', 'image/svg+xml'],
    maxFileSize: 1048576, // 1 MB
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['password-generator', 'word-counter'],
    seoTitle: 'Free QR Code Generator — High-Resolution PNG & SVG Export',
    seoDescription: 'Create beautiful, custom QR codes for websites, plain text, Wi-Fi access, and contacts. Instant SVG vector and PNG export without sign-up.',
    instructions: [
      'Select data type: Website URL, Plain Text, or Wi-Fi Network.',
      'Enter the content you want encoded.',
      'Choose your error correction level (L, M, Q, H) and customize colors.',
      'Download your QR code in crisp vector SVG or high-res PNG format.'
    ],
    featuresList: [
      'Supports URLs, raw text, Wi-Fi credentials, and contact info',
      'Four error correction levels (Low, Medium, Quartile, High)',
      'Custom foreground and background color pickers',
      'Instant vector SVG and raster PNG downloads'
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No! These are standard static QR codes. They directly encode your destination text or URL and will work indefinitely without any subscription or redirect.'
      }
    ],
    privacyNotice: 'Generated purely in your browser without tracking or intermediary redirects.'
  },

  // 20. Word & Character Counter
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'everyday',
    description: 'Live text statistics: count words, characters with/without spaces, sentences, paragraphs, and estimated reading and speaking times.',
    shortDescription: 'Live word, character, sentence, paragraph & reading time counter.',
    icon: 'FileText',
    keywords: ['word counter', 'character counter', 'reading time calculator', 'sentence counter', 'text stats'],
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 5242880, // 5 MB
    maxFileSizeFormatted: '5 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['ai-prompt-optimizer', 'meta-tag-generator'],
    seoTitle: 'Free Word & Character Counter — Real-Time Text Statistics',
    seoDescription: 'Count words, characters, sentences, paragraphs, and calculate reading time as you type. Real-time text analysis with copy and clear controls.',
    instructions: [
      'Type or paste your text into the text area.',
      'Watch statistics update instantly in real time.',
      'Inspect word count, character count, sentences, paragraphs, and reading time.',
      'Use the copy or clear buttons to manage your text.'
    ],
    featuresList: [
      'Real-time counters for words, characters, sentences, and paragraphs',
      'Calculates estimated silent reading time and spoken presentation duration',
      'Distinguishes characters with spaces and without spaces',
      'One-click text copy and clear controls'
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated using the standard average reading speed of 200 words per minute, and speaking time at 130 words per minute.'
      }
    ],
    privacyNotice: 'Your text is never sent over any network or stored on any server.'
  }
];

// Helper functions for registry querying
export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getFeaturedTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.featured && t.availabilityStatus === 'available');
}

export function getAvailableTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.availabilityStatus === 'available');
}

export function getRelatedTools(toolSlug: string): ToolDefinition[] {
  const current = getToolBySlug(toolSlug);
  if (!current) return [];
  
  if (current.relatedTools && current.relatedTools.length > 0) {
    const matched = current.relatedTools
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is ToolDefinition => !!t);
    if (matched.length > 0) return matched;
  }

  // Fallback to tools in the same category
  return TOOLS.filter((t) => t.category === current.category && t.slug !== current.slug).slice(0, 3);
}

export function searchTools(query: string): ToolDefinition[] {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  
  return TOOLS.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });
}
