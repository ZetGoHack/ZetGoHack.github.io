export interface Photo {
  id: number;
  alt: string;
}

export interface PicsumOptions {
  grayscale?: boolean;
  blur?: number;
}

export function picsum(id: number, width: number, height: number, opts: PicsumOptions = {}): string {
  const params = new URLSearchParams();
  if (opts.grayscale) params.set('grayscale', '');
  if (opts.blur) params.set('blur', String(opts.blur));
  const query = params.toString().replace(/=(&|$)/g, '$1');
  return `https://picsum.photos/id/${id}/${width}/${height}${query ? `?${query}` : ''}`;
}

export const heroPhotos = {
  goldenHour: { id: 65, alt: 'Golden-hour portrait from behind, sunlit field' },
  meadowPath: { id: 17, alt: 'Path through a summer meadow' },
  seaCliffs: { id: 37, alt: 'Coastal cliffs with wildflowers, pale sky' },
  softBeach: { id: 100, alt: 'Pale, hazy beach scene' },
  foggyRiver: { id: 1044, alt: 'River in morning fog between wooded hills' },
  sunsetMeadow: { id: 110, alt: 'Meadow at sunset' },
} satisfies Record<string, Photo>;

export const featured: Photo[] = [
  { id: 65, alt: 'Golden-hour portrait from behind' },
  { id: 17, alt: 'Path through a summer meadow' },
  { id: 76, alt: 'Rustic wooden cabin with a bicycle' },
  { id: 37, alt: 'Coastal cliffs with wildflowers' },
];

export const gallery: Photo[] = [
  { id: 65, alt: 'Golden-hour portrait from behind' },
  { id: 17, alt: 'Path through a summer meadow' },
  { id: 37, alt: 'Coastal cliffs with wildflowers' },
  { id: 100, alt: 'Hazy beach scene' },
  { id: 76, alt: 'Rustic wooden cabin with a bicycle' },
  { id: 1059, alt: 'Curated interior with framed prints' },
  { id: 110, alt: 'Meadow at sunset' },
  { id: 54, alt: 'Hilltop under a bright sky' },
  { id: 1050, alt: 'Sea cliffs and turquoise water' },
  { id: 28, alt: 'Forest stream in spring' },
  { id: 1044, alt: 'River in morning fog' },
  { id: 1015, alt: 'Fjord from above' },
  { id: 1036, alt: 'Snow-covered mountain valley' },
  { id: 1018, alt: 'Green mountain road' },
  { id: 111, alt: 'Vintage car on a city street' },
  { id: 103, alt: 'Resting in a golden field' },
];
