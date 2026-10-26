import type { District } from './types';

/**
 * All 25 administrative districts of Sri Lanka.
 * Codes use a stable 2-3 letter abbreviation.
 */
export const districts: District[] = [
  { code: 'CMB', name_si: 'කොළඹ', name_en: 'Colombo' },
  { code: 'GMP', name_si: 'ගම්පහ', name_en: 'Gampaha' },
  { code: 'KLT', name_si: 'කළුතර', name_en: 'Kalutara' },
  { code: 'KDY', name_si: 'මහනුවර', name_en: 'Kandy' },
  { code: 'MTL', name_si: 'මාතලේ', name_en: 'Matale' },
  { code: 'NWE', name_si: 'නුවරඑළිය', name_en: 'Nuwara Eliya' },
  { code: 'GLL', name_si: 'ගාල්ල', name_en: 'Galle' },
  { code: 'MTR', name_si: 'මාතර', name_en: 'Matara' },
  { code: 'HBT', name_si: 'හම්බන්තොට', name_en: 'Hambantota' },
  { code: 'JFN', name_si: 'යාපනය', name_en: 'Jaffna' },
  { code: 'KLN', name_si: 'කිලිනොච්චි', name_en: 'Kilinochchi' },
  { code: 'MNR', name_si: 'මන්නාරම', name_en: 'Mannar' },
  { code: 'MUL', name_si: 'මුලතිව්', name_en: 'Mullaitivu' },
  { code: 'VAV', name_si: 'වව්නියාව', name_en: 'Vavuniya' },
  { code: 'TRC', name_si: 'ත්‍රිකුණාමලය', name_en: 'Trincomalee' },
  { code: 'BTT', name_si: 'මඩකලපුව', name_en: 'Batticaloa' },
  { code: 'AMP', name_si: 'අම්පාර', name_en: 'Ampara' },
  { code: 'PUT', name_si: 'පුත්තලම', name_en: 'Puttalam' },
  { code: 'KUR', name_si: 'කුරුණෑගල', name_en: 'Kurunegala' },
  { code: 'ANU', name_si: 'අනුරාධපුරය', name_en: 'Anuradhapura' },
  { code: 'POL', name_si: 'පොළොන්නරුව', name_en: 'Polonnaruwa' },
  { code: 'BAD', name_si: 'බදුල්ල', name_en: 'Badulla' },
  { code: 'MON', name_si: 'මොණරාගල', name_en: 'Monaragala' },
  { code: 'KEG', name_si: 'කෑගල්ල', name_en: 'Kegalle' },
  { code: 'RAT', name_si: 'රත්නපුර', name_en: 'Ratnapura' },
];

export function getDistrict(code: string): District | undefined {
  return districts.find((d) => d.code === code);
}

export function getDistrictName(code: string, locale: 'si' | 'en'): string {
  const d = getDistrict(code);
  if (!d) return code;
  return locale === 'si' ? d.name_si : d.name_en;
}
