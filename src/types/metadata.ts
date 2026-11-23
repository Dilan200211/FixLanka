export interface ParsedExifData {
  make?: string;
  model?: string;
  lensModel?: string;
  software?: string;
  dateTimeOriginal?: string | Date;
  modifyDate?: string | Date;
  exposureTime?: number | string;
  fNumber?: number;
  iso?: number;
  focalLength?: number;
  focalLengthIn35mmFormat?: number;
  meteringMode?: string;
  flash?: string;
  whiteBalance?: string;
  imageWidth?: number;
  imageHeight?: number;
  orientation?: number | string;
  colorSpace?: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  gpsTimestamp?: string;
  iptc?: Record<string, unknown>;
  xmp?: Record<string, unknown>;
  allTags: Record<string, unknown>;
}

export type C2PAValidationStatus =
  | 'credentials-detected'
  | 'credentials-validated'
  | 'present-unverified'
  | 'no-credentials-detected'
  | 'unsupported-format'
  | 'inspection-failed';

export interface C2PAManifestInfo {
  status: C2PAValidationStatus;
  claimGenerator?: string;
  title?: string;
  format?: string;
  producer?: string;
  assertions?: Array<{
    label: string;
    data: unknown;
  }>;
  signatureIssuer?: string;
  signatureTime?: string;
  hasAiAssertions?: boolean;
  aiSignaturesDetected?: string[];
  rawSummary?: string;
  notes?: string[];
}
