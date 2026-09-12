export interface NavItem {
  href: string;
  label: string;
}

export interface PricingPackage {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export const site = {
  name: 'Andrey Soyka',
  brand: 'Soyka Photography',
  // TODO: replace with the real phone number
  phone: '+370-668-88888',
  // TODO: replace with real email / social links
  email: 'contact@example.com',
  instagram: 'https://instagram.com/yourhandle',
  telegram: 'https://t.me/yourhandle',
  handle: '@yourhandle',
  // TODO: replace with the real tagline
  tagline: 'Wedding, portrait & event photography — timeless images of your best moments.',
  logo: '/resources/logo.png',
} as const;

export const nav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About me' },
  { href: '/pricing', label: 'Prices' },
  { href: '/gallery', label: 'Gallery' },
];

// TODO: replace bracketed placeholders with the real bio and awards
export const about = {
  bio: "[A few sentences about who you are, how long you've been shooting, and what kind of photography you specialize in — weddings, portraits, events, etc.]",
  awards: [
    '[Award / Title] — [Year]',
    '[Award / Title] — [Year]',
    '[Award / Title] — [Year]',
    '[Award / Title] — [Year]',
  ],
};

// TODO: replace bracketed prices, hours and feature lists with real package details
export const pricing: PricingPackage[] = [
  {
    name: 'Basic',
    price: '$[XXX]',
    features: ['[X] hours of coverage', '[XX] edited photos', 'Online gallery'],
  },
  {
    name: 'Standard',
    price: '$[XXX]',
    highlighted: true,
    features: ['[X] hours of coverage', '[XX] edited photos', 'Online gallery', '[Extra feature]'],
  },
  {
    name: 'Premium',
    price: '$[XXX]',
    features: [
      '[X] hours of coverage',
      '[XX] edited photos',
      'Online gallery',
      '[Extra feature]',
      '[Extra feature]',
    ],
  },
];
