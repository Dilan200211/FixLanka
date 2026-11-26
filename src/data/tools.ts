import type { ToolDefinition, ToolCategory } from '../types/tool';

export const TOOLS: ToolDefinition[] = [
  // 1. EXIF Metadata Viewer
  {
    id: 'exif-metadata-viewer',
    slug: 'exif-metadata-viewer',
    name: 'EXIF Metadata Viewer',
    category: 'security-tools',
    secondaryCategories: ['image-tools', 'file-tools'],
    description:
      'Inspect full EXIF, IPTC, XMP, camera specs, and GPS coordinates from your photos directly inside your browser without uploading files.',
    shortDescription: 'View full EXIF, camera settings, and GPS metadata from images.',
    icon: 'Camera',
    keywords: ['exif viewer', 'photo metadata', 'gps location', 'camera settings', 'iptc', 'xmp'],
    primaryKeyword: 'EXIF Metadata Viewer',
    secondaryKeywords: ['view photo metadata', 'check image exif online', 'photo gps viewer', 'exif reader'],
    longTailKeywords: [
      'how to check exif metadata in a photo without uploading',
      'view camera shutter speed and iso from jpg online',
      'check if a photo contains gps coordinates',
    ],
    questionKeywords: ['how do I see hidden metadata in a photo', 'what exif data does my phone save'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/tiff', 'image/png', 'image/webp'],
    supportedOutputTypes: ['application/json', 'text/plain'],
    maxFileSize: 52428800,
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-privacy-cleaner', 'ai-metadata-inspector', 'image-compressor'],
    relatedArticles: ['what-is-exif-data-and-why-it-matters', 'how-to-remove-metadata-from-images'],
    seoTitle: 'EXIF Metadata Viewer — Inspect Photo GPS & Camera Tags',
    seoDescription:
      'Inspect camera settings, ISO, focal length, timestamps, and GPS coordinates in JPEG, PNG, TIFF, and WebP photos locally in your browser with zero uploads.',
    instructions: [
      'Select or drag & drop an image file (JPEG, PNG, TIFF, or WebP).',
      'The file is parsed locally in browser memory without server upload.',
      'Explore categorized sections: Camera & Lens, Exposure & Capture, GPS Location, and Technical tags.',
      'Copy metadata as structured JSON or download the full metadata report.',
    ],
    featuresList: [
      'Extracts camera make, model, lens, aperture, shutter speed, and ISO',
      'Detects GPS latitude, longitude, and elevation with instant map link',
      'Parses IPTC and XMP extended tags',
      'Zero server upload with 100% in-browser binary parsing',
    ],
    examples: [
      {
        title: 'Audit a smartphone photo before sharing',
        input: 'IMG_2041.jpg (4.2 MB, captured on mobile)',
        output: 'Reveals GPS coordinates, capture timestamp, f/1.8 aperture, and device model in JSON or table view.',
      },
      {
        title: 'Export camera settings for photography review',
        input: 'landscape_raw_export.jpg',
        output: 'Downloadable metadata.json containing focal length (35mm), shutter speed (1/250s), and ISO 100.',
      },
    ],
    faqs: [
      {
        question: 'Are my images uploaded to any server?',
        answer:
          'No. FixLanka Tools reads and parses image binary headers completely within your browser memory. Your files never leave your device.',
      },
      {
        question: 'Which image formats contain EXIF metadata?',
        answer: 'JPEG, TIFF, and WebP formats commonly contain EXIF data. PNG images may include IPTC or XMP chunks.',
      },
    ],
    privacyNotice:
      'Your image is processed strictly in your local browser sandbox. No file content or metadata is transmitted or stored remotely.',
  },

  // 2. EXIF Privacy Cleaner
  {
    id: 'exif-privacy-cleaner',
    slug: 'exif-privacy-cleaner',
    name: 'EXIF Privacy Cleaner',
    category: 'security-tools',
    secondaryCategories: ['image-tools'],
    description:
      'Scrub sensitive GPS location coordinates, camera serial numbers, and personal device information before publishing images online.',
    shortDescription: 'Remove GPS coordinates, device info, and private EXIF data.',
    icon: 'ShieldOff',
    keywords: ['exif remover', 'remove gps', 'scrub photo metadata', 'privacy cleaner', 'anonymize image'],
    primaryKeyword: 'EXIF Privacy Cleaner',
    secondaryKeywords: ['remove exif data online', 'remove gps from photo', 'strip photo metadata', 'exif remover'],
    longTailKeywords: [
      'remove location data from photos before posting online',
      'strip exif metadata from jpg without uploading',
      'how to delete camera serial number from image',
    ],
    questionKeywords: ['how do I remove gps location from a picture', 'does stripping exif reduce quality'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 31457280,
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-metadata-viewer', 'ai-metadata-inspector', 'image-compressor'],
    relatedArticles: ['how-to-remove-metadata-from-images', 'what-is-exif-data-and-why-it-matters'],
    seoTitle: 'EXIF Privacy Cleaner — Remove Photo GPS & Device Tags',
    seoDescription:
      'Safely remove GPS coordinates, camera serial numbers, and personal EXIF metadata from images locally in your browser without uploading files.',
    instructions: [
      'Upload an image to inspect its embedded personal metadata tags.',
      'Review detected privacy flags (such as GPS coordinates or device identifiers).',
      'Select your desired output format and compression quality.',
      'Click "Clean & Download Sanitized Image" to generate a clean version.',
    ],
    featuresList: [
      'Removes GPS latitude, longitude, and altitude tags',
      'Strips camera serial number, owner name, and software identifiers',
      'Preserves visual orientation and transparency',
      'Provides before-and-after file size and metadata verification',
    ],
    examples: [
      {
        title: 'Sanitize a marketplace listing photo',
        input: 'bike_for_sale.jpg containing home GPS coordinates',
        output: 'Clean JPEG with 0 GPS tags and 0 device identifiers while preserving image dimensions.',
      },
      {
        title: 'Lossless metadata removal via PNG export',
        input: 'scanned_id_card.jpg',
        output: 'Re-encoded PNG without EXIF software or scanner metadata.',
      },
    ],
    faqs: [
      {
        question: 'Does cleaning metadata alter image quality?',
        answer:
          'Re-encoding into JPEG may slightly adjust compression. You can select maximum quality (100%) or choose PNG/WebP to minimize any visual loss.',
      },
      {
        question: 'Does this strip C2PA Content Credentials?',
        answer:
          'Re-encoding strips standard EXIF tags. If an image contains cryptographic C2PA provenance signatures, re-encoding will invalidate them; the tool clearly notifies you when provenance manifests are present.',
      },
    ],
    privacyNotice: 'Sanitization happens purely in browser memory. The original file is never overwritten on your device.',
  },

  // 3. AI Metadata & C2PA Inspector
  {
    id: 'ai-metadata-inspector',
    slug: 'ai-metadata-inspector',
    name: 'AI Metadata & C2PA Inspector',
    category: 'security-tools',
    secondaryCategories: ['image-tools'],
    description:
      'Detect AI generation markers, generator software signatures, and inspect C2PA Content Credentials manifests in images locally.',
    shortDescription: 'Inspect C2PA Content Credentials and AI generator markers.',
    icon: 'Fingerprint',
    keywords: ['c2pa inspector', 'ai metadata', 'content credentials', 'midjourney metadata', 'dalle tags'],
    primaryKeyword: 'C2PA Content Credentials Inspector',
    secondaryKeywords: ['ai image metadata checker', 'inspect c2pa manifest', 'check if image has ai tags'],
    longTailKeywords: [
      'inspect c2pa content credentials in jpg and png locally',
      'check iptc digitalSourceType and ai generator tags in photos',
      'how to verify image provenance metadata in browser',
    ],
    questionKeywords: ['how do I check if an image has c2pa metadata', 'does missing ai metadata prove human origin'],
    searchIntent: 'informational-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
    supportedOutputTypes: ['application/json'],
    maxFileSize: 52428800,
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['exif-metadata-viewer', 'exif-privacy-cleaner'],
    relatedArticles: ['what-is-exif-data-and-why-it-matters', 'how-to-remove-metadata-from-images'],
    seoTitle: 'AI Metadata & C2PA Inspector — Check Image Provenance',
    seoDescription:
      'Inspect C2PA Content Credentials JUMBF manifests, IPTC digitalSourceType assertions, and AI generator tags in images locally with zero uploads.',
    instructions: [
      'Drop an image into the inspector.',
      'The engine searches for JUMBF (C2PA) manifest boxes and IPTC/XMP generative AI tags.',
      'Review the evidence card detailing detected claims, generators, and software signatures.',
      'Inspect signing details and detection limitations clearly.',
    ],
    featuresList: [
      'Detects JUMBF (C2PA / CAI) Content Credentials boxes',
      'Identifies known generator tags in IPTC and XMP metadata',
      'Inspects IPTC DigitalSourceType and software assertions',
      'Reports detection scope honestly without false human-authorship claims',
    ],
    examples: [
      {
        title: 'Verify Content Credentials on a news graphic',
        input: 'editorial_photo.jpg with embedded C2PA JUMBF box',
        output: 'Displays detected C2PA claim generator, assertions, and JSON summary.',
      },
      {
        title: 'Inspect social download with stripped headers',
        input: 'recompressed_social.jpg',
        output: 'Reports no AI metadata found while clarifying that platforms often strip headers on upload.',
      },
    ],
    faqs: [
      {
        question: 'Does a missing AI tag prove an image was taken by a human?',
        answer:
          'No. AI metadata can be stripped or omitted by editing software or social platforms. A lack of AI markers is not proof of human authorship.',
      },
      {
        question: 'Can this tool remove invisible watermarks like SynthID?',
        answer:
          'No. FixLanka Tools does not provide tools to evade or remove invisible provenance watermarks or bypass platform AI labels.',
      },
    ],
    privacyNotice: 'Analyzed entirely in your browser. No image data or provenance claims are sent to remote servers.',
  },

  // 4. Image Compressor
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image-tools',
    description:
      'Compress JPEG, WebP, and PNG images locally with adjustable quality and instant before/after byte savings calculation.',
    shortDescription: 'Compress JPEG, WebP, and PNG photos locally with zero uploads.',
    icon: 'Minimize2',
    keywords: ['image compressor', 'reduce photo size', 'compress jpg', 'shrink png', 'webp compressor'],
    primaryKeyword: 'Image Compressor',
    secondaryKeywords: ['compress image online', 'free image compressor', 'reduce image size', 'compress jpg', 'compress png'],
    longTailKeywords: [
      'compress images online without losing quality',
      'reduce jpg file size for free without uploading',
      'shrink photos for whatsapp and email in browser',
    ],
    questionKeywords: ['how to reduce image size for websites', 'what quality setting is best for jpeg compression'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/jpeg', 'image/webp', 'image/png'],
    maxFileSize: 31457280,
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-resizer', 'image-converter', 'exif-privacy-cleaner'],
    relatedArticles: ['how-to-compress-images-without-losing-quality', 'best-image-formats-jpg-png-webp-avif'],
    seoTitle: 'Free Image Compressor — Shrink JPG, PNG & WebP Locally',
    seoDescription:
      'Compress JPEG, PNG, and WebP images locally in your browser with adjustable quality, batch processing, and before/after file size comparison. Zero uploads.',
    instructions: [
      'Choose or drag & drop one or multiple images.',
      'Adjust the quality slider to balance image size and visual fidelity.',
      'Preview the compressed file size and percentage reduction.',
      'Download individual images or batch download all compressed results.',
    ],
    featuresList: [
      'Adjustable compression quality from 1% to 100%',
      'Batch processing of multiple files at once',
      'Before-and-after byte savings and reduction percentage',
      '100% browser-based compression with zero server uploads',
    ],
    examples: [
      {
        title: 'Compress a hero photograph for a blog post',
        input: 'hero_camera.jpg (4.5 MB, 4000x3000 px)',
        output: 'Output at 80% quality in WebP or JPEG drops to under 450 KB while preserving sharp detail.',
      },
      {
        title: 'Batch shrink photos for email attachments',
        input: '5 smartphone JPEGs totaling 22 MB',
        output: 'Compressed batch ready for standard 25 MB email attachment limits.',
      },
    ],
    faqs: [
      {
        question: 'What is the recommended compression quality?',
        answer:
          'A quality level between 75% and 85% typically reduces JPEG or WebP file size substantially with minimal visible quality loss.',
      },
    ],
    privacyNotice: 'All compression operations execute locally in your browser memory.',
  },

  // 5. Image Resizer
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image-tools',
    description:
      'Resize image dimensions by width and height, percentage, or standard resolution presets with aspect ratio locking.',
    shortDescription: 'Resize image dimensions by pixel, percentage, or preset.',
    icon: 'Scaling',
    keywords: ['image resizer', 'resize photo', 'scale image', 'change picture dimensions'],
    primaryKeyword: 'Image Resizer',
    secondaryKeywords: ['resize image online', 'photo resizer', 'change image dimensions', 'scale photo pixels'],
    longTailKeywords: [
      'resize image by exact pixels without losing aspect ratio',
      'scale photo to 1080p or 50 percent locally in browser',
      'free online image resizer with no file upload',
    ],
    questionKeywords: ['how do I resize a photo without stretching it', 'will downscaling make an image blurry'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    supportedOutputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 31457280,
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-compressor', 'image-converter', 'social-media-image-resizer'],
    relatedArticles: ['how-to-compress-images-without-losing-quality', 'best-image-formats-jpg-png-webp-avif'],
    seoTitle: 'Free Image Resizer — Scale Photos by Pixels or Presets',
    seoDescription:
      'Resize JPEG, PNG, and WebP dimensions by exact pixels, percentage, or presets with aspect ratio lock. Fast client-side scaling with zero uploads.',
    instructions: [
      'Upload an image to inspect its current pixel dimensions.',
      'Enter new width and height values, or choose a percentage or preset.',
      'Keep aspect ratio lock enabled to avoid visual distortion.',
      'Preview the resized image and click Download.',
    ],
    featuresList: [
      'Exact pixel dimension controls with aspect ratio lock',
      'Quick scaling presets (25%, 50%, 75%, 200%)',
      'High-quality Canvas interpolation',
      'Customizable output format (JPEG, PNG, WebP)',
    ],
    examples: [
      {
        title: 'Resize a 4K screenshot for documentation',
        input: 'dashboard_3840x2160.png',
        output: 'Scaled down to 1280x720 px with locked 16:9 ratio for crisp web embedding.',
      },
      {
        title: 'Create a 512x512 square avatar',
        input: 'portrait_2048x2048.jpg',
        output: 'Exact 512x512 px WebP or PNG ready for profile uploads.',
      },
    ],
    faqs: [
      {
        question: 'Will resizing my image make it blurry?',
        answer:
          'Downscaling preserves clarity. Upscaling beyond the original dimensions may cause soft edges because new pixel data is interpolated.',
      },
    ],
    privacyNotice: 'Zero server uploads. Processed purely in browser canvas memory.',
  },

  // 6. Image Format Converter
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Format Converter',
    category: 'image-tools',
    secondaryCategories: ['converter-tools'],
    description:
      'Convert images between PNG, JPEG, and modern WebP formats in browser memory with verified MIME types and magic byte checks.',
    shortDescription: 'Convert between PNG, JPEG, and WebP formats client-side.',
    icon: 'RefreshCw',
    keywords: ['image converter', 'png to jpg', 'jpg to webp', 'convert photo format', 'webp to png'],
    primaryKeyword: 'Image Format Converter',
    secondaryKeywords: ['png to jpg', 'jpg to webp', 'webp to png', 'convert image format online'],
    longTailKeywords: [
      'convert png and jpg to webp online without uploading',
      'convert transparent png to jpg with custom background color',
      'free batch image format converter in browser',
    ],
    questionKeywords: ['how to convert images to webp online', 'what happens to transparency when converting png to jpg'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
    supportedOutputTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxFileSize: 31457280,
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['image-compressor', 'image-resizer'],
    relatedArticles: ['how-to-convert-images-to-webp', 'best-image-formats-jpg-png-webp-avif'],
    seoTitle: 'Free Image Converter — Convert PNG, JPG & WebP Locally',
    seoDescription:
      'Convert PNG, JPEG, WebP, GIF, and BMP images in your browser with genuine binary encoding, transparency fill options, and zero server uploads.',
    instructions: [
      'Select or drop one or multiple images.',
      'Select your target format (PNG, JPEG, or WebP).',
      'Adjust background fill color for transparent images converting to JPEG.',
      'Download your converted files instantly.',
    ],
    featuresList: [
      'Converts to PNG, JPEG, and WebP',
      'Handles alpha transparency with custom fill color options',
      'Validates genuine binary file signatures (magic bytes)',
      'Zero server upload for total confidentiality',
    ],
    examples: [
      {
        title: 'Convert website PNG assets to WebP',
        input: 'product_shot.png (1.8 MB)',
        output: 'Converted product_shot.webp for smaller web payloads and faster LCP.',
      },
      {
        title: 'Flatten transparent PNG logo to white-background JPEG',
        input: 'logo_transparent.png',
        output: 'Clean logo.jpg filled with #ffffff behind transparent alpha pixels.',
      },
    ],
    faqs: [
      {
        question: 'Does this tool just rename the file extension?',
        answer:
          'No. The tool decodes the raw image bitmap and encodes it using the target format encoder, producing genuine binary files.',
      },
    ],
    privacyNotice: 'Conversion is performed entirely on your device.',
  },

  // 7. PDF Merger
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    category: 'file-tools',
    description:
      'Combine multiple PDF documents into a single organized file. Reorder files in browser memory without uploading sensitive records.',
    shortDescription: 'Combine multiple PDF files into one document in browser memory.',
    icon: 'FilePlus',
    keywords: ['merge pdf', 'combine pdf', 'join pdf documents', 'pdf combiner'],
    primaryKeyword: 'PDF Merger',
    secondaryKeywords: ['merge pdf online', 'combine pdf files', 'join pdf documents', 'free pdf combiner'],
    longTailKeywords: [
      'combine multiple pdf files into one without uploading',
      'merge confidential pdf contracts safely in browser',
      'reorder and join pdf documents for free',
    ],
    questionKeywords: ['is it safe to merge confidential pdfs online', 'how do I combine two pdf files on my phone'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 52428800,
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: true,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-splitter', 'pdf-compressor'],
    relatedArticles: ['how-to-reduce-pdf-file-size'],
    seoTitle: 'Free PDF Merger — Combine PDF Files Privately Online',
    seoDescription:
      'Merge multiple PDF documents into one file directly in your browser using pdf-lib. Reorder documents easily with zero server uploads.',
    instructions: [
      'Select two or more PDF documents.',
      'Use the up/down controls to arrange files in the desired order.',
      'Click "Merge PDFs" to assemble the combined document.',
      'Download the final merged PDF immediately.',
    ],
    featuresList: [
      'Merge multiple PDF documents client-side',
      'Interactive file reordering controls',
      'Reads and displays page counts for each file',
      'Local PDF assembly via pdf-lib',
    ],
    examples: [
      {
        title: 'Assemble a job application packet',
        input: 'resume.pdf (2 pages) + cover_letter.pdf (1 page) + portfolio.pdf (4 pages)',
        output: 'Single ordered 7-page PDF ready to submit.',
      },
      {
        title: 'Combine monthly invoices for accounting',
        input: 'invoice_oct.pdf + invoice_nov.pdf',
        output: 'Combined PDF assembled locally without sending financial data to a server.',
      },
    ],
    faqs: [
      {
        question: 'Is it safe to merge confidential contracts here?',
        answer:
          'Yes. FixLanka Tools executes PDF operations locally in your browser memory. Your files are never sent over the internet to any server.',
      },
    ],
    privacyNotice: 'Processed strictly in local browser memory. Files are never transmitted.',
  },

  // 8. PDF Splitter
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'file-tools',
    description:
      'Extract specific pages or page ranges from a PDF document into a newly generated, clean PDF file locally.',
    shortDescription: 'Extract specific pages or page ranges from any PDF document.',
    icon: 'Split',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'pdf page extractor'],
    primaryKeyword: 'PDF Splitter',
    secondaryKeywords: ['split pdf online', 'extract pages from pdf', 'pdf page extractor', 'separate pdf pages'],
    longTailKeywords: [
      'extract specific page ranges from pdf without uploading',
      'save selected pages from a large pdf in browser',
      'split pdf by custom page numbers like 1-3, 5, 8-10',
    ],
    questionKeywords: ['how do I extract non-consecutive pages from a pdf', 'can I split a pdf without uploading it'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 52428800,
    maxFileSizeFormatted: '50 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-merger', 'pdf-compressor'],
    relatedArticles: ['how-to-reduce-pdf-file-size'],
    seoTitle: 'Free PDF Splitter — Extract PDF Pages in Your Browser',
    seoDescription:
      'Extract custom page ranges (e.g. 1-3, 5, 8-10) or single pages from PDF documents locally in browser memory with zero uploads.',
    instructions: [
      'Upload the PDF document you want to split.',
      'Review the total page count displayed by the tool.',
      'Enter the pages or range you wish to extract (e.g., 1-4, 7, 10-12).',
      'Click "Extract Pages" and download your newly created PDF.',
    ],
    featuresList: [
      'Supports range syntax (e.g., "1-5, 8, 11-14")',
      'Interactive page selection controls',
      'Accurate page count and structure parsing',
      '100% private in-browser document generation',
    ],
    examples: [
      {
        title: 'Extract signed signature pages from a contract',
        input: 'agreement_24pages.pdf, range "1, 22-24"',
        output: 'New 4-page PDF containing only the cover and signature pages.',
      },
      {
        title: 'Pull one chapter from a study handbook',
        input: 'handbook.pdf, range "15-28"',
        output: 'Clean 14-page study excerpt PDF.',
      },
    ],
    faqs: [
      {
        question: 'Can I extract non-consecutive pages?',
        answer: 'Yes. Simply type comma-separated numbers and ranges, such as "1, 3, 5-8".',
      },
    ],
    privacyNotice: 'Document parsing occurs in browser memory. No data is sent to a server.',
  },

  // 9. PDF Compressor
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'file-tools',
    description:
      'Optimize PDF file size by deduplicating objects and compressing internal streams without third-party server exposure.',
    shortDescription: 'Optimize PDF file size with client-side object stream compression.',
    icon: 'FileArchive',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf optimizer'],
    primaryKeyword: 'PDF Compressor',
    secondaryKeywords: ['compress pdf online', 'reduce pdf file size', 'shrink pdf', 'pdf optimizer'],
    longTailKeywords: [
      'reduce pdf file size locally without uploading sensitive files',
      'compress pdf object streams in browser for free',
      'why do some scanned pdfs not compress much',
    ],
    questionKeywords: ['how to reduce pdf file size without losing text quality', 'why did my scanned pdf stay the same size'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['application/pdf'],
    supportedOutputTypes: ['application/pdf'],
    maxFileSize: 41943040,
    maxFileSizeFormatted: '40 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['pdf-merger', 'pdf-splitter'],
    relatedArticles: ['how-to-reduce-pdf-file-size'],
    seoTitle: 'Free PDF Compressor — Reduce PDF File Size Locally',
    seoDescription:
      'Optimize PDF size client-side using object stream compression while preserving crisp text and vector fidelity. Zero server uploads.',
    instructions: [
      'Upload a PDF file to analyze its structural overhead.',
      'Select compression level (Standard or Maximum Stream Optimization).',
      'Click "Compress PDF" to process streams in browser memory.',
      'Review the byte reduction and download your optimized PDF.',
    ],
    featuresList: [
      'Object stream deduplication and recompression',
      'Calculates accurate before and after byte savings',
      'Preserves vector fidelity and text searchability',
      'No server uploads for complete confidentiality',
    ],
    examples: [
      {
        title: 'Optimize an uncompressed report exported from design tools',
        input: 'annual_report_uncompressed.pdf (8.4 MB)',
        output: 'Stream-compressed PDF with smaller object overhead and crisp searchable text.',
      },
      {
        title: 'Inspect pre-compressed scan behavior',
        input: 'already_compressed_scan.pdf',
        output: 'Shows exact byte difference transparently so you keep whichever version is smaller.',
      },
    ],
    faqs: [
      {
        question: 'Why do some PDFs not shrink significantly?',
        answer:
          'PDFs that already consist mostly of pre-compressed scanned JPEG images or linearized streams cannot be substantially compressed without downsampling embedded bitmaps.',
      },
    ],
    privacyNotice: 'Optimized purely in local browser memory.',
  },

  // 10. Video to GIF
  {
    id: 'video-to-gif',
    slug: 'video-to-gif',
    name: 'Video to GIF',
    category: 'converter-tools',
    description:
      'Convert video clips (MP4, WebM, MOV) into animated GIFs locally with start/end time trimming, FPS, and width controls.',
    shortDescription: 'Convert video clips into animated GIFs with trim and FPS controls.',
    icon: 'Film',
    keywords: ['video to gif', 'mp4 to gif', 'make animated gif', 'gif maker'],
    primaryKeyword: 'Video to GIF Converter',
    secondaryKeywords: ['mp4 to gif', 'convert video to gif online', 'webm to gif', 'free gif maker'],
    longTailKeywords: [
      'convert mp4 clip to animated gif in browser without uploading',
      'trim video and export 10 fps gif for documentation',
      'mov to gif converter with width and frame rate control',
    ],
    questionKeywords: ['why are animated gifs larger than mp4 videos', 'what fps should I use for a documentation gif'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    supportedOutputTypes: ['image/gif'],
    maxFileSize: 104857600,
    maxFileSizeFormatted: '100 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['audio-extractor', 'image-compressor'],
    relatedArticles: ['how-to-compress-images-without-losing-quality'],
    seoTitle: 'Free Video to GIF Converter — MP4 & WebM to GIF Online',
    seoDescription:
      'Convert MP4, WebM, and MOV clips into animated GIFs locally in your browser with start/end trim, FPS, and width scaling. Zero uploads.',
    instructions: [
      'Upload a video clip (MP4, WebM, or MOV).',
      'Set the start and end time markers for the segment you want to animate.',
      'Choose your frame rate (5 to 20 FPS) and target width.',
      'Click "Generate GIF", preview the animation, and download.',
    ],
    featuresList: [
      'Interactive video playback scrubber for precision trimming',
      'Configurable frame rates (5, 10, 15, 20 fps) and resolutions',
      'Real-time encoding progress percentage indicator',
      'Instant GIF playback preview before download',
    ],
    examples: [
      {
        title: 'Create a lightweight UI walkthrough GIF',
        input: 'screen_recording.mp4 (00:02 to 00:06, 10 FPS, 640 px width)',
        output: 'Smooth 4-second GIF89a animation suitable for GitHub READMEs or support tickets.',
      },
      {
        title: 'Extract a short reaction clip from MOV',
        input: 'clip.mov (3 seconds at 15 FPS)',
        output: 'Looping animated GIF encoded in browser memory.',
      },
    ],
    faqs: [
      {
        question: 'Why are GIFs larger than videos?',
        answer:
          'GIF is a legacy format without inter-frame temporal compression. Keeping the duration short (under 6 seconds) and FPS around 10 to 15 produces optimal file sizes.',
      },
    ],
    privacyNotice: 'Processed on your computer using HTML5 Video and Canvas encoding.',
  },

  // 11. Audio Extractor
  {
    id: 'audio-extractor',
    slug: 'audio-extractor',
    name: 'Audio Extractor',
    category: 'converter-tools',
    secondaryCategories: ['file-tools'],
    description:
      'Extract audio tracks from video files into uncompressed WAV audio directly on your device without uploading large videos.',
    shortDescription: 'Extract pristine audio tracks from videos right in your browser.',
    icon: 'Music',
    keywords: ['extract audio from video', 'video to wav', 'audio ripper', 'mp4 to audio'],
    primaryKeyword: 'Audio Extractor from Video',
    secondaryKeywords: ['extract audio from video online', 'mp4 to wav converter', 'save audio from video', 'video audio extractor'],
    longTailKeywords: [
      'extract wav audio from mp4 video without uploading',
      'save audio track from webm or mov locally in browser',
      'extract sound from large video file on device',
    ],
    questionKeywords: ['how to extract audio from a video without uploading it', 'what format does the audio extractor export'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'],
    supportedOutputTypes: ['audio/wav'],
    maxFileSize: 104857600,
    maxFileSizeFormatted: '100 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['video-to-gif'],
    relatedArticles: ['how-to-calculate-file-sizes-and-storage-units'],
    seoTitle: 'Audio Extractor — Extract WAV Audio from Video Locally',
    seoDescription:
      'Extract clean WAV audio tracks from MP4, WebM, MOV, and MKV video files locally via the Web Audio API without uploading gigabytes to a server.',
    instructions: [
      'Upload a video file containing an audio track.',
      'The browser decodes the audio track using Web Audio API.',
      'Preview the extracted audio in the built-in media player.',
      'Click "Download Audio File" to save the WAV track.',
    ],
    featuresList: [
      'Decodes multi-channel audio directly from video containers',
      'Uncompressed PCM WAV audio export',
      'Built-in audio player preview before download',
      'Zero data upload over the internet',
    ],
    examples: [
      {
        title: 'Save a spoken lecture audio track from MP4',
        input: 'lecture_recording.mp4 (45 MB)',
        output: 'Standalone audio.wav ready for offline listening or transcription.',
      },
      {
        title: 'Extract clean audio from a screen capture',
        input: 'demo_capture.webm',
        output: 'Uncompressed WAV track decoded via browser Web Audio API.',
      },
    ],
    faqs: [
      {
        question: 'Does this require uploading my video to a cloud server?',
        answer:
          'No. The audio stream is decoded directly by your browser using the HTML5 Web Audio API, saving bandwidth and protecting your privacy.',
      },
    ],
    privacyNotice: 'Extracted purely inside your browser memory.',
  },

  // 12. AI Prompt Optimizer
  {
    id: 'ai-prompt-optimizer',
    slug: 'ai-prompt-optimizer',
    name: 'AI Prompt Optimizer',
    category: 'text-tools',
    description:
      'Transform rough prompt drafts into structured instructions with role context, constraints, and formatting rules for LLMs and image generators.',
    shortDescription: 'Structure AI prompts with context, constraints, and clarity.',
    icon: 'Wand2',
    keywords: ['prompt optimizer', 'prompt engineering', 'chatgpt prompt helper', 'midjourney prompt enhancer'],
    primaryKeyword: 'AI Prompt Optimizer',
    secondaryKeywords: ['prompt improver', 'structured prompt builder', 'llm prompt optimizer', 'ai prompt generator'],
    longTailKeywords: [
      'structure rough prompts for chatgpt claude and gemini locally',
      'rule based ai prompt optimizer without api keys',
      'improve coding and writing prompts with constraints',
    ],
    questionKeywords: ['does this prompt optimizer send prompts to an external api', 'how do I structure a better ai prompt'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 1048576,
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['word-counter', 'ai-metadata-inspector'],
    relatedArticles: ['essential-free-online-tools-for-productivity'],
    seoTitle: 'AI Prompt Optimizer — Structure Better Prompts Locally',
    seoDescription:
      'Turn vague drafts into structured AI prompts with role context, constraints, and output formats locally in your browser without external API calls.',
    instructions: [
      'Enter your initial draft idea or prompt.',
      'Select your target domain (Coding, Writing, Image Generation, Research, or Reasoning).',
      'Customize role, tone, and constraint parameters.',
      'Click "Optimize Prompt" and copy the structured output to your clipboard.',
    ],
    featuresList: [
      'Templates for Coding, Copywriting, Image Generation, and Research',
      'Adds explicit constraints, boundary conditions, and output format',
      'One-click clipboard copy and Markdown formatting',
      'Works offline with zero external API fees',
    ],
    examples: [
      {
        title: 'Refine a vague coding request',
        input: '"write a script to rename files"',
        output: 'Structured prompt specifying language, error handling, dry-run flag, and edge-case constraints.',
      },
      {
        title: 'Structure a technical article brief',
        input: '"explain base64 encoding"',
        output: 'Prompt with audience level, section outline, and factual accuracy constraints.',
      },
    ],
    faqs: [
      {
        question: 'Does this call an external paid AI model?',
        answer:
          'No. The optimizer uses deterministic rule-based prompt engineering templates and heuristics inside your browser.',
      },
    ],
    privacyNotice: 'Your prompt text is never saved or transmitted to any third party.',
  },

  // 13. JSON Formatter & Validator
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer-tools',
    description:
      'Format, validate, beautify, and minify JSON payloads locally with exact syntax error line and column detection.',
    shortDescription: 'Beautify, validate, and minify JSON with syntax error detection.',
    icon: 'Braces',
    keywords: ['json formatter', 'json validator', 'beautify json', 'minify json', 'json lint'],
    primaryKeyword: 'JSON Formatter & Validator',
    secondaryKeywords: ['format json online', 'json validator', 'beautify json', 'minify json'],
    longTailKeywords: [
      'validate and beautify json with line and column error detection',
      'format sensitive api json payload locally in browser',
      'minify json for production without server upload',
    ],
    questionKeywords: ['how to find a syntax error in json', 'is it safe to paste api payloads into a json formatter'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['application/json', 'text/plain'],
    supportedOutputTypes: ['application/json'],
    maxFileSize: 10485760,
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['base64-encoder-decoder', 'meta-tag-generator'],
    relatedArticles: ['how-to-format-and-validate-json-online', 'base64-encoding-explained'],
    seoTitle: 'JSON Formatter & Validator — Beautify & Lint JSON Locally',
    seoDescription:
      'Format, minify, and validate JSON data in your browser with line and column error highlighting, key counts, and zero server uploads.',
    instructions: [
      'Paste your raw JSON into the editor or upload a .json file.',
      'Select your desired indentation (2 spaces, 4 spaces, or compact minify).',
      'Syntax errors are automatically highlighted with precise error positions.',
      'Copy the clean JSON or download it as a .json file.',
    ],
    featuresList: [
      'Instant validation with exact line and column error indicators',
      '2-space, 4-space, and tab indentation options',
      'One-click JSON minification for production payloads',
      'Displays key count, node depth, and raw byte size metrics',
    ],
    examples: [
      {
        title: 'Catch a trailing comma in config.json',
        input: '{"name": "fixlanka", "port": 4321,}',
        output: 'Highlights exact syntax error line/column before you deploy.',
      },
      {
        title: 'Minify a formatted API fixture',
        input: 'Pretty-printed 4-space JSON (14.2 KB)',
        output: 'Compact single-line JSON with whitespace stripped.',
      },
    ],
    faqs: [
      {
        question: 'Can I format sensitive API responses or config files in JSON?',
        answer:
          'Yes. FixLanka Tools does not log or transmit your data. All parsing and formatting run locally in JavaScript memory.',
      },
    ],
    privacyNotice: 'Your JSON data remains strictly inside your browser tab.',
  },

  // 14. Base64 Encoder / Decoder
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    category: 'developer-tools',
    secondaryCategories: ['converter-tools'],
    description:
      'Safely encode and decode UTF-8 text and binary files to and from Base64 strings without character corruption.',
    shortDescription: 'Encode and decode UTF-8 text and files with Base64 safely.',
    icon: 'Binary',
    keywords: ['base64 encoder', 'base64 decoder', 'base64 to text', 'utf8 base64', 'data uri'],
    primaryKeyword: 'Base64 Encoder & Decoder',
    secondaryKeywords: ['base64 encode online', 'base64 decode utf8', 'text to base64', 'file to data uri'],
    longTailKeywords: [
      'encode and decode utf8 unicode text to base64 without corruption',
      'convert small image or svg to base64 data uri locally',
      'url safe base64 encoder and decoder in browser',
    ],
    questionKeywords: ['why does btoa fail on unicode emojis', 'what is url-safe base64 encoding'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain', '*/*'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 10485760,
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['json-formatter', 'password-generator'],
    relatedArticles: ['base64-encoding-explained', 'how-to-format-and-validate-json-online'],
    seoTitle: 'Base64 Encoder & Decoder — UTF-8 Safe Online Tool',
    seoDescription:
      'Encode and decode UTF-8 text, emojis, URL-safe Base64 strings, and file Data URIs locally in your browser with TextEncoder and zero uploads.',
    instructions: [
      'Select whether you want to Encode or Decode.',
      'Type or paste your text into the input field, or upload a small file.',
      'Toggle URL-safe encoding mode if passing strings in query parameters.',
      'Copy your encoded Base64 string or decoded output with one click.',
    ],
    featuresList: [
      'UTF-8 safe encoding via TextEncoder and TextDecoder',
      'URL-safe Base64 mode (- and _ substitution)',
      'Real-time encoding as you type',
      'File-to-Base64 Data URI converter mode',
    ],
    examples: [
      {
        title: 'Encode Unicode text safely',
        input: 'Hello FixLanka 🚀',
        output: 'SGVsbG8gRml4TGFua2Eg8J+agA== (round-trips back cleanly with UTF-8)',
      },
      {
        title: 'Generate a URL-safe token payload',
        input: '{"scope":"read+write"} with URL-safe toggle enabled',
        output: 'Base64url output replacing + and / with - and _.',
      },
    ],
    faqs: [
      {
        question: 'Why do standard atob/btoa functions corrupt emojis and foreign characters?',
        answer:
          'Standard browser btoa() treats input as Latin-1. FixLanka Tools uses modern TextEncoder to ensure full UTF-8 Unicode compatibility.',
      },
    ],
    privacyNotice: 'Executed in browser memory. Nothing is sent to any server.',
  },

  // 15. Meta Tag Generator
  {
    id: 'meta-tag-generator',
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    category: 'developer-tools',
    description:
      'Generate complete SEO meta tags, Open Graph (OG) tags, Twitter Cards, and robots directives with live SERP and social previews.',
    shortDescription: 'Generate Open Graph, Twitter Cards, and SEO meta tags with live preview.',
    icon: 'Tag',
    keywords: ['meta tag generator', 'open graph generator', 'twitter card preview', 'seo meta tags', 'serp preview'],
    primaryKeyword: 'Meta Tag Generator',
    secondaryKeywords: ['open graph tag generator', 'seo meta tags generator', 'google serp preview tool'],
    longTailKeywords: [
      'generate html meta tags and open graph cards with live preview',
      'check seo title and meta description character length',
      'create twitter summary large image card tags',
    ],
    questionKeywords: ['what is the ideal length for title and meta description tags', 'which open graph tags are required'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/html'],
    maxFileSize: 1048576,
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-post-preview', 'word-counter'],
    relatedArticles: ['essential-free-online-tools-for-productivity'],
    seoTitle: 'Free Meta Tag Generator — SEO & Open Graph Preview',
    seoDescription:
      'Generate HTML SEO meta tags, Open Graph tags, Twitter Cards, and robots directives with live Google SERP snippet preview locally in your browser.',
    instructions: [
      'Fill in your webpage title, description, canonical URL, and social image.',
      'Toggle robots indexing directives (index, follow, noarchive).',
      'Review the live Google Search snippet and social card previews.',
      'Click "Copy HTML Meta Tags" and paste them inside your HTML <head> tag.',
    ],
    featuresList: [
      'Generates standard SEO, Open Graph, and Twitter Card metadata',
      'Live Google Search result snippet preview',
      'Character count indicators for title and description lengths',
      'One-click ready-to-paste HTML code output',
    ],
    examples: [
      {
        title: 'Prepare head tags for a product launch page',
        input: 'Title (54 chars), Description (148 chars), Canonical URL, OG image URL',
        output: 'Complete <title>, <meta>, <link rel="canonical">, og:*, and twitter:* HTML snippet.',
      },
      {
        title: 'Mark an internal page noindex',
        input: 'Robots toggle set to noindex, nofollow',
        output: 'Outputs <meta name="robots" content="noindex, nofollow" />.',
      },
    ],
    faqs: [
      {
        question: 'What is the optimal length for title and description tags?',
        answer:
          'Keep titles around 50 to 60 characters and descriptions around 140 to 160 characters so search snippets remain clear and readable.',
      },
    ],
    privacyNotice: 'All data entered remains strictly in your browser.',
  },

  // 16. Social Media Image Resizer
  {
    id: 'social-media-image-resizer',
    slug: 'social-media-image-resizer',
    name: 'Social Media Image Resizer',
    category: 'image-tools',
    description:
      'Resize and crop images to exact dimensions for YouTube, Instagram, X (Twitter), Facebook, and LinkedIn banners and posts.',
    shortDescription: 'Resize photos for YouTube, Instagram, X, Facebook, and LinkedIn.',
    icon: 'Maximize',
    keywords: ['social media image resizer', 'youtube thumbnail size', 'instagram square resizer', 'twitter banner size'],
    primaryKeyword: 'Social Media Image Resizer',
    secondaryKeywords: ['youtube thumbnail resizer', 'instagram image resizer', 'linkedin banner resizer'],
    longTailKeywords: [
      'resize photos for youtube thumbnail 1280x720 and instagram 1080x1350',
      'crop or pad images for linkedin cover and x header locally',
      'free social media graphic resizer without watermark',
    ],
    questionKeywords: ['what size is a youtube thumbnail or instagram portrait post', 'should I use cover crop or contain padding'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    supportedOutputTypes: ['image/png', 'image/jpeg'],
    maxFileSize: 31457280,
    maxFileSizeFormatted: '30 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-post-preview', 'image-resizer', 'image-compressor'],
    relatedArticles: ['how-to-compress-images-without-losing-quality', 'best-image-formats-jpg-png-webp-avif'],
    seoTitle: 'Social Media Image Resizer — YouTube, IG & X Presets',
    seoDescription:
      'Resize and crop images for YouTube thumbnails, Instagram posts, X headers, Facebook covers, and LinkedIn banners locally with zero uploads.',
    instructions: [
      'Upload the graphic or photo you want to prepare.',
      'Select your target social platform and format preset.',
      'Choose fitting mode (Cover crop or Contain with padding).',
      'Preview the result and download your optimized social graphic.',
    ],
    featuresList: [
      'Presets for YouTube, Instagram, X (Twitter), Facebook, and LinkedIn',
      'Contain vs. Cover aspect ratio handling with background color selection',
      'High-quality Canvas pixel scaling',
      'Instant PNG or JPEG download',
    ],
    examples: [
      {
        title: 'Prepare a YouTube thumbnail',
        input: '1920x1080 capture -> YouTube Thumbnail preset (1280x720)',
        output: 'Exact 1280x720 PNG/JPEG ready for YouTube Studio.',
      },
      {
        title: 'Fit a wide graphic into an Instagram Portrait post',
        input: 'landscape_banner.png -> Instagram Portrait (1080x1350) in Contain mode',
        output: 'Centered 1080x1350 graphic with matched background fill and no cropped text.',
      },
    ],
    faqs: [
      {
        question: 'Are the platform preset dimensions up to date?',
        answer:
          'Yes. Presets cover common platform guidelines such as YouTube Thumbnail (1280x720) and Instagram Post (1080x1080 / 1080x1350).',
      },
    ],
    privacyNotice: 'Zero server uploads. Processed purely in browser canvas memory.',
  },

  // 17. Social Post Preview
  {
    id: 'social-post-preview',
    slug: 'social-post-preview',
    name: 'Social Post Preview',
    category: 'text-tools',
    description:
      'Preview how your social posts will look on X (Twitter), LinkedIn, Facebook, and Instagram before publishing.',
    shortDescription: 'Preview your posts for X, LinkedIn, Facebook, and Instagram.',
    icon: 'Eye',
    keywords: ['social post preview', 'twitter post simulator', 'linkedin post preview', 'facebook preview'],
    primaryKeyword: 'Social Post Preview Simulator',
    secondaryKeywords: ['x post preview', 'linkedin post preview tool', 'instagram caption preview'],
    longTailKeywords: [
      'preview social media post copy and image before publishing',
      'check character count limit for x linkedin and instagram',
      'test desktop and mobile social feed layout locally',
    ],
    questionKeywords: ['how will my linkedin or x post look on mobile', 'what is the character limit on x and linkedin'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain', 'image/*'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 10485760,
    maxFileSizeFormatted: '10 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['social-media-image-resizer', 'meta-tag-generator'],
    relatedArticles: ['essential-free-online-tools-for-productivity'],
    seoTitle: 'Social Post Preview — X, LinkedIn & Instagram Simulator',
    seoDescription:
      'Simulate how social posts, attachments, and character counts appear across X (Twitter), LinkedIn, Facebook, and Instagram locally before publishing.',
    instructions: [
      'Select the social media platform you want to preview.',
      'Enter your display name, username handle, and post text.',
      'Optionally attach a local image preview.',
      'Inspect desktop and mobile feed layout previews before posting.',
    ],
    featuresList: [
      'Visual feed layouts for X (Twitter), LinkedIn, Facebook, and Instagram',
      'Live character counters with platform limit warnings',
      'Supports local image attachments without server upload',
      'Desktop and mobile feed width toggles',
    ],
    examples: [
      {
        title: 'Check line breaks in a LinkedIn announcement',
        input: 'Draft product update with 3 short paragraphs and 16:9 image',
        output: 'Live feed card showing fold truncation and image framing.',
      },
      {
        title: 'Verify a thread opener fits within 280 characters',
        input: '272-character draft for X',
        output: 'Live counter turns green with 8 characters remaining.',
      },
    ],
    faqs: [
      {
        question: 'Is this an official platform preview?',
        answer:
          'This tool provides a visual approximation based on public feed layout styles to help you review copy and imagery before publishing.',
      },
    ],
    privacyNotice: 'Previewed locally in browser DOM. No post drafts are saved.',
  },

  // 18. Password Generator
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'security-tools',
    description:
      'Generate cryptographically strong passwords locally using window.crypto.getRandomValues() with bit entropy estimation.',
    shortDescription: 'Generate cryptographically strong passwords locally with zero tracking.',
    icon: 'Key',
    keywords: ['password generator', 'random password', 'strong password', 'secure password generator'],
    primaryKeyword: 'Cryptographic Password Generator',
    secondaryKeywords: ['strong password generator', 'random password generator', 'secure password maker'],
    longTailKeywords: [
      'generate strong random password locally with web crypto api',
      'create 24 character password excluding ambiguous characters',
      'offline password generator with entropy score',
    ],
    questionKeywords: ['how to generate a strong password', 'what makes a password secure'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: [],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 0,
    maxFileSizeFormatted: 'N/A',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['qr-code-generator', 'base64-encoder-decoder'],
    relatedArticles: ['how-to-generate-strong-passwords', 'what-makes-a-password-secure'],
    seoTitle: 'Free Password Generator — Cryptographic & 100% Private',
    seoDescription:
      'Generate strong random passwords locally using window.crypto.getRandomValues(). Customize length, character sets, and entropy with zero tracking.',
    instructions: [
      'Select your desired password length (8 to 128 characters).',
      'Toggle character options: uppercase, lowercase, numbers, and special symbols.',
      'Optionally exclude ambiguous characters (such as l, 1, I, O, 0).',
      'Click "Generate Password" and copy it to your password manager.',
    ],
    featuresList: [
      'Powered by window.crypto.getRandomValues() for cryptographic randomness',
      'Configurable length from 8 to 128 characters',
      'Bit entropy calculation and password strength grading',
      'Zero storage, transmission, or logging',
    ],
    examples: [
      {
        title: 'Create a high-entropy database or admin password',
        input: 'Length 24, uppercase + lowercase + numbers + symbols',
        output: 'Random 24-character string with ~150+ bits of entropy.',
      },
      {
        title: 'Generate a readable Wi-Fi or PIN-friendly key',
        input: 'Length 16, ambiguous characters excluded (no l/1/I/0/O)',
        output: 'Unambiguous random password easy to type manually.',
      },
    ],
    faqs: [
      {
        question: 'Can FixLanka Tools see my generated password?',
        answer:
          'Never. The password is generated entirely on your device using the browser native crypto API. It is never logged or sent across any network.',
      },
    ],
    privacyNotice:
      'Generated completely in client-side memory using Web Cryptography API. Passwords are never saved, tracked, or transmitted.',
  },

  // 19. QR Code Generator
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'converter-tools',
    description:
      'Generate custom static QR codes for URLs, plain text, Wi-Fi credentials, and contacts locally with instant PNG and SVG export.',
    shortDescription: 'Create high-res QR codes for URLs, text, Wi-Fi, and contacts.',
    icon: 'QrCode',
    keywords: ['qr code generator', 'create qr code', 'wifi qr code', 'free qr generator', 'svg qr code'],
    primaryKeyword: 'QR Code Generator',
    secondaryKeywords: ['free qr code maker', 'wifi qr code generator', 'svg qr code generator', 'static qr code'],
    longTailKeywords: [
      'create non-expiring static qr code for wifi and urls',
      'generate vector svg qr code locally in browser',
      'custom color qr code generator with png export',
    ],
    questionKeywords: ['do static qr codes ever expire', 'how do I create a wifi qr code for guests'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['image/png', 'image/svg+xml'],
    maxFileSize: 1048576,
    maxFileSizeFormatted: '1 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['password-generator', 'word-counter'],
    relatedArticles: ['essential-free-online-tools-for-productivity'],
    seoTitle: 'Free QR Code Generator — Static PNG & SVG Export',
    seoDescription:
      'Create non-expiring static QR codes for URLs, plain text, Wi-Fi networks, and contacts locally in your browser with instant PNG and SVG download.',
    instructions: [
      'Select data type: Website URL, Plain Text, or Wi-Fi Network.',
      'Enter the content you want encoded.',
      'Choose your error correction level (L, M, Q, H) and customize colors.',
      'Download your QR code in crisp vector SVG or high-res PNG format.',
    ],
    featuresList: [
      'Supports URLs, raw text, Wi-Fi credentials, and contact info',
      'Four error correction levels (Low, Medium, Quartile, High)',
      'Custom foreground and background color pickers',
      'Instant vector SVG and raster PNG downloads',
    ],
    examples: [
      {
        title: 'Create a guest Wi-Fi QR code',
        input: 'SSID: GuestNet, Security: WPA/WPA2',
        output: 'Encodes standard WIFI:T:WPA;S:GuestNet;P:...;; payload as printable SVG.',
      },
      {
        title: 'Export a crisp vector QR for print flyers',
        input: 'https://fixlanka.com/ with Error Correction H',
        output: 'Scalable SVG file ready for print layouts at any DPI.',
      },
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer:
          'No. These are standard static QR codes. They directly encode your destination text or URL and work indefinitely without subscriptions or tracking redirects.',
      },
    ],
    privacyNotice: 'Generated purely in your browser without tracking or intermediary redirects.',
  },

  // 20. Word & Character Counter
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text-tools',
    description:
      'Live text statistics: count words, characters with and without spaces, sentences, paragraphs, and estimated reading and speaking times.',
    shortDescription: 'Live word, character, sentence, paragraph & reading time counter.',
    icon: 'FileText',
    keywords: ['word counter', 'character counter', 'reading time calculator', 'sentence counter', 'text stats'],
    primaryKeyword: 'Word & Character Counter',
    secondaryKeywords: ['word counter online', 'character count tool', 'reading time calculator', 'sentence counter'],
    longTailKeywords: [
      'count words and characters without spaces in browser',
      'calculate article reading time and speaking time',
      'private word counter that does not store text',
    ],
    questionKeywords: ['how is article reading time calculated', 'how many characters fit in a meta description'],
    searchIntent: 'transactional-utility',
    supportedInputTypes: ['text/plain'],
    supportedOutputTypes: ['text/plain'],
    maxFileSize: 5242880,
    maxFileSizeFormatted: '5 MB',
    acceptsMultipleFiles: false,
    processingMode: 'client',
    availabilityStatus: 'available',
    featured: true,
    relatedTools: ['ai-prompt-optimizer', 'meta-tag-generator'],
    relatedArticles: ['essential-free-online-tools-for-productivity'],
    seoTitle: 'Word & Character Counter — Live Text Stats & Reading Time',
    seoDescription:
      'Count words, characters with and without spaces, sentences, paragraphs, and reading or speaking time instantly in your browser with zero tracking.',
    instructions: [
      'Type or paste your text into the text area.',
      'Watch statistics update instantly in real time.',
      'Inspect word count, character count, sentences, paragraphs, and reading time.',
      'Use the copy or clear buttons to manage your text.',
    ],
    featuresList: [
      'Real-time counters for words, characters, sentences, and paragraphs',
      'Calculates estimated reading time (200 wpm) and speaking time (130 wpm)',
      'Distinguishes characters with spaces and without spaces',
      'One-click text copy and clear controls',
    ],
    examples: [
      {
        title: 'Verify a 155-character meta description',
        input: 'Draft SEO summary pasted into editor',
        output: 'Shows exact character count with spaces so snippets stay concise.',
      },
      {
        title: 'Time a 5-minute presentation script',
        input: '650-word speech draft',
        output: 'Reports ~5 min speaking time at 130 words per minute.',
      },
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer:
          'Reading time is calculated using an average reading speed of 200 words per minute, and speaking time at 130 words per minute.',
      },
    ],
    privacyNotice: 'Your text is never sent over any network or stored on any server.',
  },
];

// Helper functions for registry querying
export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(
  category: ToolCategory,
  includeSecondary = false
): ToolDefinition[] {
  return TOOLS.filter(
    (t) =>
      t.category === category ||
      (includeSecondary && t.secondaryCategories?.includes(category))
  );
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
      tool.primaryKeyword.toLowerCase().includes(q) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });
}
