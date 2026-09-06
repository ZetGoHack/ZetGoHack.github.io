import { heroPhotos, type Photo } from './photos';

export type HeroLayout = 'centered' | 'fullbleed' | 'split' | 'grid';

export interface Theme {
  id: string;
  name: string;
  description: string;
  fontsHref: string;
  heroLayout: HeroLayout;
  heroPhoto: Photo;
  grayscale?: boolean;
  vars: Record<`--${string}`, string>;
}

const gf = (families: string[]) =>
  `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;

export const themes: Theme[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    description:
      'Чистый белый фон, много воздуха, крупная фотография на всю ширину и тонкий гарнитурный шрифт. Ощущение печатного журнала — фото говорит само за себя, интерфейс почти незаметен.',
    fontsHref: gf(['Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400', 'Jost:wght@300;400;500']),
    heroLayout: 'fullbleed',
    heroPhoto: heroPhotos.meadowPath,
    vars: {
      '--bg': '#ffffff',
      '--bg-alt': '#f7f7f5',
      '--fg': '#161616',
      '--fg-muted': '#6f6f6f',
      '--accent': '#9a7b4f',
      '--accent-hover': '#7d6238',
      '--line': '#e7e5e0',
      '--card-bg': '#ffffff',
      '--header-bg': 'rgba(255, 255, 255, 0.92)',
      '--overlay': 'rgba(255, 255, 255, 0)',
      '--font-heading': '"Cormorant Garamond", Georgia, serif',
      '--font-body': '"Jost", "Helvetica Neue", Arial, sans-serif',
      '--heading-weight': '400',
      '--heading-transform': 'none',
      '--heading-spacing': '0.01em',
      '--nav-transform': 'uppercase',
      '--nav-spacing': '0.14em',
      '--nav-size': '0.78rem',
      '--radius': '0px',
      '--button-radius': '0px',
    },
  },
  {
    id: 'warm',
    name: 'Крем',
    description:
      'Тёплый кремовый фон, терракотовый акцент, мягкие скругления. Герой разделён на две колонки: текст слева, высокое фото справа. Уютное «свадебное» настроение, дружелюбно и не холодно.',
    fontsHref: gf(['Playfair+Display:ital,wght@0,400;0,500;1,400', 'Nunito+Sans:wght@300;400;600']),
    heroLayout: 'split',
    heroPhoto: heroPhotos.goldenHour,
    vars: {
      '--bg': '#faf6f0',
      '--bg-alt': '#f2eadf',
      '--fg': '#3a322b',
      '--fg-muted': '#7d7169',
      '--accent': '#c07a56',
      '--accent-hover': '#a8643f',
      '--line': '#e8dccd',
      '--card-bg': '#fffdf9',
      '--header-bg': 'rgba(250, 246, 240, 0.92)',
      '--overlay': 'rgba(250, 246, 240, 0)',
      '--font-heading': '"Playfair Display", Georgia, serif',
      '--font-body': '"Nunito Sans", "Segoe UI", Arial, sans-serif',
      '--heading-weight': '500',
      '--heading-transform': 'none',
      '--heading-spacing': '0',
      '--nav-transform': 'none',
      '--nav-spacing': '0.02em',
      '--nav-size': '0.95rem',
      '--radius': '14px',
      '--button-radius': '999px',
    },
  },
  {
    id: 'studio',
    name: 'Студия',
    description:
      'Строгий монохром: белый фон, чёрный текст, тонкие линии, никаких скруглений. Гигантское имя вместо слогана и сразу сетка фотографий. Современный «галерейный» стиль, подойдёт если делать упор на репортаж и портрет.',
    fontsHref: gf(['Manrope:wght@400;600;800']),
    heroLayout: 'grid',
    heroPhoto: heroPhotos.foggyRiver,
    grayscale: true,
    vars: {
      '--bg': '#ffffff',
      '--bg-alt': '#ffffff',
      '--fg': '#000000',
      '--fg-muted': '#6a6a6a',
      '--accent': '#000000',
      '--accent-hover': '#555555',
      '--line': '#000000',
      '--card-bg': '#ffffff',
      '--header-bg': 'rgba(255, 255, 255, 0.96)',
      '--overlay': 'rgba(255, 255, 255, 0)',
      '--font-heading': '"Manrope", "Helvetica Neue", Arial, sans-serif',
      '--font-body': '"Manrope", "Helvetica Neue", Arial, sans-serif',
      '--heading-weight': '800',
      '--heading-transform': 'uppercase',
      '--heading-spacing': '-0.03em',
      '--nav-transform': 'uppercase',
      '--nav-spacing': '0.08em',
      '--nav-size': '0.8rem',
      '--radius': '0px',
      '--button-radius': '0px',
    },
  },
  {
    id: 'airy',
    name: 'Воздушный',
    description:
      'Светло-серо-голубой фон, пыльно-синий акцент, курсивные заголовки. Герой — фото на весь экран под лёгкой светлой дымкой с текстом по центру (та же композиция, что сейчас, но в светлой гамме). Нежно, романтично, пастельно.',
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
  },
  {
    id: 'classic',
    name: 'Тёмный (текущий)',
    description:
      'Текущее оформление для сравнения: чёрный фон, бисквитный текст, Oswald. Лицо с главной убрано и заменено на атмосферный пейзаж. Клиент просил уйти от чёрного, поэтому этот вариант — точка отсчёта, а не кандидат.',
    fontsHref: gf(['Oswald:wght@300;400;700']),
    heroLayout: 'centered',
    heroPhoto: heroPhotos.foggyRiver,
    vars: {
      '--bg': '#000000',
      '--bg-alt': '#1c1c1c',
      '--fg': '#ffe4c4',
      '--fg-muted': '#c9b598',
      '--accent': '#ffc57d',
      '--accent-hover': '#ffd9a8',
      '--line': 'rgba(131, 131, 131, 0.3)',
      '--card-bg': 'rgba(27, 27, 27, 0.6)',
      '--header-bg': '#000000',
      '--overlay': 'rgba(0, 0, 0, 0.55)',
      '--font-heading': '"Oswald", Impact, sans-serif',
      '--font-body': '"Oswald", Arial, sans-serif',
      '--heading-weight': '700',
      '--heading-transform': 'uppercase',
      '--heading-spacing': '0.02em',
      '--nav-transform': 'uppercase',
      '--nav-spacing': '0.04em',
      '--nav-size': '1rem',
      '--radius': '6px',
      '--button-radius': '0px',
    },
  },
];

export const DEFAULT_THEME_ID = 'editorial';

export const defaultTheme: Theme = themes.find((t) => t.id === DEFAULT_THEME_ID)!;

export function getTheme(id: string | undefined): Theme | undefined {
  return themes.find((t) => t.id === id);
}

export function themeCss(theme: Theme): string {
  const body = Object.entries(theme.vars)
    .map(([k, v]) => `${k}:${v};`)
    .join('');
  return `:root{${body}}`;
}
