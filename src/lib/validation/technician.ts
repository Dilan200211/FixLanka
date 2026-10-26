import { normalizeLKPhone } from '../phone';
import { districts } from '../districts';

export interface TechnicianFormData {
  name: string;
  slug?: string;
  phone: string;
  whatsapp_number: string;
  description_si: string;
  description_en: string;
  district_code: string;
  town: string;
  profile_image_url?: string | null;
  indicative_price_lkr?: number | null;
  category_ids: string[];
  published?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateTechnicianInput(data: TechnicianFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Name
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  // Phone validation (if provided)
  if (data.phone && data.phone.trim()) {
    const normalized = normalizeLKPhone(data.phone);
    if (!normalized) {
      errors.phone = 'Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)';
    }
  }

  // WhatsApp validation (if provided)
  if (data.whatsapp_number && data.whatsapp_number.trim()) {
    const normalized = normalizeLKPhone(data.whatsapp_number);
    if (!normalized) {
      errors.whatsapp_number = 'Please enter a valid Sri Lankan WhatsApp number (e.g., 0771234567 or +94771234567)';
    }
  }

  // District code
  if (!data.district_code) {
    errors.district_code = 'District is required';
  } else {
    const districtExists = districts.some((d) => d.code === data.district_code);
    if (!districtExists) {
      errors.district_code = 'Invalid district selected';
    }
  }

  // Town
  if (!data.town || data.town.trim().length < 2) {
    errors.town = 'Town is required (at least 2 characters)';
  } else if (data.town.trim().length > 80) {
    errors.town = 'Town must not exceed 80 characters';
  }

  // Indicative price
  if (data.indicative_price_lkr !== undefined && data.indicative_price_lkr !== null) {
    if (isNaN(data.indicative_price_lkr) || data.indicative_price_lkr < 0) {
      errors.indicative_price_lkr = 'Price must be a positive number';
    }
  }

  // Profile image URL (only http / https)
  if (data.profile_image_url && data.profile_image_url.trim()) {
    try {
      const url = new URL(data.profile_image_url);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.profile_image_url = 'Image URL must use http or https protocol';
      }
    } catch {
      errors.profile_image_url = 'Invalid URL format';
    }
  }

  // Categories
  if (!data.category_ids || data.category_ids.length === 0) {
    errors.category_ids = 'Select at least one service category';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base || 'tech'}-${randomSuffix}`;
}
