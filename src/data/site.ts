export interface NavItem {
  href: string;
  label: string;
}

export const site = {
  name: 'Andrey Soyka',
  brand: 'Soyka Photography',
  logo: '/resources/logo.png',
} as const;

export const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About me' },
  { href: '/pricing', label: 'Prices' },
  { href: '/gallery', label: 'Gallery' },
];
