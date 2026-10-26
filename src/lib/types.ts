// Types shared across the application

export type Locale = 'si' | 'en';

export interface ServiceCategory {
  id: string;
  slug: string;
  name_si: string;
  name_en: string;
  active: boolean;
  icon?: string; // Lucide icon name
}

export interface District {
  code: string;
  name_si: string;
  name_en: string;
}

export interface Technician {
  id: string;
  name: string;
  slug: string;
  phone: string;
  whatsapp_number: string;
  description_si: string;
  description_en: string;
  district_code: string;
  town: string;
  profile_image_url: string | null;
  indicative_price_lkr: number | null;
  published: boolean;
  verified: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  services?: ServiceCategory[];
  district?: District;
}

export interface TechnicianWithServices extends Technician {
  services: ServiceCategory[];
  district: District;
}
