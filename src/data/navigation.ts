export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { label: 'All Tools', href: '/#all-tools' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Popular', href: '/#popular' },
  { label: 'About', href: '/about' },
];

export const FOOTER_LEGAL_NAV: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
