export interface AuthorProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  url: string;
  sameAs?: string[];
}

export const AUTHORS: Record<string, AuthorProfile> = {
  'dilan-vinod': {
    id: 'dilan-vinod',
    name: 'Dilan Vinod',
    role: 'Creator & Software Engineer, FixLanka Tools',
    bio: 'Builds privacy-first, client-side web utilities in Sri Lanka using Astro, TypeScript, and browser-native APIs.',
    url: 'https://fixlanka.com/about/',
    sameAs: ['https://github.com/Dilan200211'],
  },
  'fixlanka-editorial': {
    id: 'fixlanka-editorial',
    name: 'FixLanka Editorial Team',
    role: 'Technical Documentation & Review',
    bio: 'Maintains tool documentation, format specifications, and practical how-to guides grounded in web standards.',
    url: 'https://fixlanka.com/editorial-policy/',
    sameAs: ['https://github.com/Dilan200211/FixLanka'],
  },
};

export function getAuthorById(id: string): AuthorProfile {
  return AUTHORS[id] ?? AUTHORS['fixlanka-editorial'];
}
