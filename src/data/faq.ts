import type { FAQItem } from '../types/tool';

export const GLOBAL_FAQS: FAQItem[] = [
  {
    question: 'Are my files uploaded to your servers?',
    answer: 'No. FixLanka Tools is built on a privacy-first, client-side architecture. Your files (images, PDFs, videos, and texts) are processed directly in your browser memory using HTML5 Canvas, Web Workers, and WebAssembly. No file data is sent to our servers by default.'
  },
  {
    question: 'Is FixLanka Tools free to use?',
    answer: 'Yes! FixLanka Tools is 100% free with no registration, no subscriptions, and no hidden paywalls.'
  },
  {
    question: 'What are the file size limits?',
    answer: 'Because processing occurs in your local browser memory, file limits are tailored to maintain peak device performance: images up to 30-50 MB, PDFs up to 40-50 MB, and videos up to 100 MB.'
  },
  {
    question: 'Can I use FixLanka Tools on my phone or tablet?',
    answer: 'Absolutely. Every tool is responsive and optimized for mobile touchscreens, tablets, and desktop workstations without horizontal scrolling.'
  },
  {
    question: 'Does FixLanka Tools inspect or remove C2PA Content Credentials?',
    answer: 'Our AI Metadata & C2PA Inspector transparently reveals embedded provenance manifests. Our privacy cleaner scrubs standard EXIF data (like GPS coordinates) while clearly alerting you when signed credentials would be affected. We do not provide tools to evade or defeat provenance watermarks.'
  }
];
