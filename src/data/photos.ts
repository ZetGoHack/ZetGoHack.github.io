export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  focus?: string;
}

export interface StockPhoto {
  id: number;
  alt: string;
}

export interface PicsumOptions {
  blur?: number;
}

export function picsum(id: number, width: number, height: number, opts: PicsumOptions = {}): string {
  const params = new URLSearchParams();
  if (opts.blur) params.set('blur', String(opts.blur));
  const query = params.toString();
  return `https://picsum.photos/id/${id}/${width}/${height}${query ? `?${query}` : ''}`;
}

// TODO: replace with a real hero photo.
export const heroPhotos = {
  goldenHour: { id: 65, alt: 'Golden-hour portrait from behind, sunlit field' },
  meadowPath: { id: 17, alt: 'Path through a summer meadow' },
  seaCliffs: { id: 37, alt: 'Coastal cliffs with wildflowers, pale sky' },
  softBeach: { id: 100, alt: 'Pale, hazy beach scene' },
  foggyRiver: { id: 1044, alt: 'River in morning fog between wooded hills' },
  sunsetMeadow: { id: 110, alt: 'Meadow at sunset' },
} satisfies Record<string, StockPhoto>;
