import type { ServiceCategory } from './types';

/**
 * Default service categories with bilingual names.
 * Slugs are stable identifiers used in URLs and DB references.
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cat-plumbing',
    slug: 'plumbing',
    name_si: 'නළ කාර්මික සේවා',
    name_en: 'Plumbing',
    active: true,
    icon: 'Wrench',
  },
  {
    id: 'cat-electrical',
    slug: 'electrical',
    name_si: 'විදුලි අලුත්වැඩියා',
    name_en: 'Electrical Repairs',
    active: true,
    icon: 'Zap',
  },
  {
    id: 'cat-ac',
    slug: 'ac',
    name_si: 'වායු සමීකරණ සේවා',
    name_en: 'Air Conditioning',
    active: true,
    icon: 'Snowflake',
  },
  {
    id: 'cat-appliances',
    slug: 'appliances',
    name_si: 'ගෘහ උපකරණ අලුත්වැඩියා',
    name_en: 'Appliance Repairs',
    active: true,
    icon: 'WashingMachine',
  },
  {
    id: 'cat-home-repairs',
    slug: 'home-repairs',
    name_si: 'නිවාස අලුත්වැඩියා',
    name_en: 'Home Repairs',
    active: true,
    icon: 'Hammer',
  },
  {
    id: 'cat-painting',
    slug: 'painting',
    name_si: 'තීන්ත ආලේපන සහ ලී වැඩ',
    name_en: 'Painting & Carpentry',
    active: true,
    icon: 'PaintBucket',
  },
  {
    id: 'cat-electronics',
    slug: 'electronics',
    name_si: 'දුරකථන සහ පරිගණක අලුත්වැඩියා',
    name_en: 'Phone & Computer Repairs',
    active: true,
    icon: 'Smartphone',
  },
  {
    id: 'cat-cleaning',
    slug: 'cleaning',
    name_si: 'පිරිසිදු කිරීමේ සේවා',
    name_en: 'Cleaning Services',
    active: true,
    icon: 'SprayCan',
  },
];

export function getCategoryName(
  category: ServiceCategory,
  locale: 'si' | 'en'
): string {
  return locale === 'si' ? category.name_si : category.name_en;
}

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === slug);
}
