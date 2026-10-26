import type { TechnicianWithServices } from './types';
import { serviceCategories } from './categories';
import { districts } from './districts';

/**
 * Demo technicians for UI testing.
 * Clearly labelled as demo data — not real professionals.
 * Phone numbers are intentionally left as empty strings.
 */
export const demoTechnicians: TechnicianWithServices[] = [
  {
    id: 'demo-001',
    name: 'Kamal Perera',
    slug: 'kamal-perera',
    phone: '',
    whatsapp_number: '',
    description_si:
      'නළ කාර්මික සේවා සපයන අත්දැකීම් බහුල වෘත්තිකයෙකු. නිවාස සහ වාණිජ ගොඩනැගිලි සඳහා සේවා සපයයි.',
    description_en:
      'Experienced plumber providing residential and commercial plumbing services.',
    district_code: 'CMB',
    town: 'Nugegoda',
    profile_image_url: null,
    indicative_price_lkr: 2500,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    services: [serviceCategories[0]], // Plumbing
    district: districts[0], // Colombo
  },
  {
    id: 'demo-002',
    name: 'Nimal Silva',
    slug: 'nimal-silva',
    phone: '',
    whatsapp_number: '',
    description_si:
      'විදුලි රැහැන් කිරීම, විදුලි පුවරු සවි කිරීම, සහ නඩත්තු කිරීමේ සේවා.',
    description_en:
      'Electrical wiring, panel installations, and maintenance services.',
    district_code: 'GMP',
    town: 'Kadawatha',
    profile_image_url: null,
    indicative_price_lkr: 3000,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    services: [serviceCategories[1]], // Electrical
    district: districts[1], // Gampaha
  },
  {
    id: 'demo-003',
    name: 'Ruwan Jayasinghe',
    slug: 'ruwan-jayasinghe',
    phone: '',
    whatsapp_number: '',
    description_si:
      'සියලු වර්ගයේ වායු සමීකරණ යන්ත්‍ර සවි කිරීම, අලුත්වැඩියා කිරීම සහ ගෑස් පිරවීම.',
    description_en:
      'AC installation, repair, and gas refilling for all brands.',
    district_code: 'CMB',
    town: 'Dehiwala',
    profile_image_url: null,
    indicative_price_lkr: 4000,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    services: [serviceCategories[2]], // AC
    district: districts[0], // Colombo
  },
  {
    id: 'demo-004',
    name: 'Saman Kumara',
    slug: 'saman-kumara',
    phone: '',
    whatsapp_number: '',
    description_si:
      'රෙදි සෝදන යන්ත්‍ර සහ ශීතකරණ අලුත්වැඩියා. සියලු ප්‍රමුඛ සන්නාම.',
    description_en:
      'Washing machine and refrigerator repairs. All major brands.',
    district_code: 'KDY',
    town: 'Peradeniya',
    profile_image_url: null,
    indicative_price_lkr: 3500,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-04T00:00:00Z',
    updated_at: '2024-01-04T00:00:00Z',
    services: [serviceCategories[3]], // Appliances
    district: districts[3], // Kandy
  },
  {
    id: 'demo-005',
    name: 'Priya Mendis',
    slug: 'priya-mendis',
    phone: '',
    whatsapp_number: '',
    description_si:
      'තීන්ත ආලේපනය, ලී වැඩ, සහ සාමාන්‍ය නිවාස අලුත්වැඩියා සේවා.',
    description_en:
      'Painting, woodwork, and general home repair services.',
    district_code: 'GLL',
    town: 'Galle Fort',
    profile_image_url: null,
    indicative_price_lkr: 2000,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z',
    services: [serviceCategories[4], serviceCategories[5]], // Home Repairs + Painting
    district: districts[6], // Galle
  },
  {
    id: 'demo-006',
    name: 'Dinesh Fernando',
    slug: 'dinesh-fernando',
    phone: '',
    whatsapp_number: '',
    description_si:
      'දුරකථන හා පරිගණක අලුත්වැඩියා — තිර මාරු කිරීම, මෘදුකාංග ස්ථාපනය.',
    description_en:
      'Phone and computer repairs — screen replacements, software installation.',
    district_code: 'CMB',
    town: 'Bambalapitiya',
    profile_image_url: null,
    indicative_price_lkr: 1500,
    published: true,
    verified: false,
    is_demo: true,
    created_at: '2024-01-06T00:00:00Z',
    updated_at: '2024-01-06T00:00:00Z',
    services: [serviceCategories[6]], // Electronics
    district: districts[0], // Colombo
  },
];

export function getDemoTechnician(
  idOrSlug: string
): TechnicianWithServices | undefined {
  return demoTechnicians.find(
    (t) => t.id === idOrSlug || t.slug === idOrSlug
  );
}
