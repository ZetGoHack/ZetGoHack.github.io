import { heroPhotos, type StockPhoto } from './photos';

export type HeroLayout = 'centered' | 'fullbleed' | 'split' | 'grid';

export interface Theme {
  id: string;
  name: string;
  fontsHref: string;
  heroLayout: HeroLayout;
  heroPhoto: StockPhoto;
  vars: Record<`--${string}`, string>;
}

const gf = (families: string[]) =>
  `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;

export const theme: Theme = {
  id: 'airy',
  name: 'Воздушный',
  fontsHref: gf(['Cormorant:ital,wght@0,400;0,500;1,400;1,500', 'Raleway:wght@300;400;500']),
  heroLayout: 'centered',
  heroPhoto: heroPhotos.seaCliffs,
  vars: {
    '--bg': '#f5f6f8',
    '--bg-alt': '#eceff3',
    '--fg': '#2b2f36',
    '--fg-muted': '#737a85',
    '--accent': '#7d93ab',
    '--accent-hover': '#62798f',
    '--line': '#dde2e8',
    '--card-bg': '#ffffff',
    '--header-bg': 'rgba(245, 246, 248, 0.9)',
    '--overlay': 'rgba(245, 246, 248, 0.4)',
    '--font-heading': '"Cormorant", Georgia, serif',
    '--font-body': '"Raleway", "Segoe UI", Arial, sans-serif',
    '--heading-weight': '500',
    '--heading-transform': 'none',
    '--heading-spacing': '0.01em',
    '--nav-transform': 'uppercase',
    '--nav-spacing': '0.16em',
    '--nav-size': '0.75rem',
    '--radius': '8px',
    '--button-radius': '4px',
  },
};

export function themeCss(t: Theme): string {
  const body = Object.entries(t.vars)
    .map(([k, v]) => `${k}:${v};`)
    .join('');
  return `:root{${body}}`;
}
