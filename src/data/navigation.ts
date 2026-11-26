export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'Tools', href: '/tools/' },
  { label: 'Categories', href: '/category/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'About', href: '/about/' },
];

export const FOOTER_LEGAL_NAV: NavItem[] = [
  { label: 'About Us', href: '/about/' },
  { label: 'How We Work', href: '/how-we-work/' },
  { label: 'Editorial Policy', href: '/editorial-policy/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Service', href: '/terms-of-service/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Contact', href: '/contact/' },
];
