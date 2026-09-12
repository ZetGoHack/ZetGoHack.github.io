export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
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

const sportFinishJump: Photo = {
  src: '/photos/sport-finish-jump.jpg',
  alt: 'Runner leaping through the finish arch at a running event',
  width: 1067,
  height: 1600,
};
const sportRunnerPortrait: Photo = {
  src: '/photos/sport-runner-portrait.jpg',
  alt: 'Bearded runner mid-stride on a cold morning',
  width: 1067,
  height: 1600,
};
const sportSupermanFinish: Photo = {
  src: '/photos/sport-superman-finish.jpg',
  alt: 'Runner in a superhero costume celebrating at the finish line',
  width: 1067,
  height: 1600,
};
const natureTwinLakes: Photo = {
  src: '/photos/nature-twin-lakes.jpg',
  alt: 'Two turquoise alpine lakes seen from above',
  width: 1600,
  height: 1067,
};
const natureLupineFlowers: Photo = {
  src: '/photos/nature-lupine-flowers.jpg',
  alt: 'Purple lupine flowers backlit by the sun',
  width: 1600,
  height: 1067,
};
const natureLoneTreeLake: Photo = {
  src: '/photos/nature-lone-tree-lake.jpg',
  alt: 'A lone blossoming tree by a lake at golden hour',
  width: 1067,
  height: 1600,
};
const familyBwMotherBaby: Photo = {
  src: '/photos/family-bw-mother-baby.jpg',
  alt: 'Black-and-white portrait of a mother nose-to-nose with her baby',
  width: 1067,
  height: 1600,
};
const familyPoppyFieldFlowers: Photo = {
  src: '/photos/family-poppy-field-flowers.jpg',
  alt: 'Mother and son picking poppies together in a summer field',
  width: 1067,
  height: 1600,
};
const familyPoppyFieldEmbrace: Photo = {
  src: '/photos/family-poppy-field-embrace.jpg',
  alt: 'Mother embracing her son in a poppy field',
  width: 1500,
  height: 1000,
};

export const featured: Photo[] = [
  sportFinishJump,
  familyBwMotherBaby,
  natureTwinLakes,
  sportSupermanFinish,
];

export const gallery: Photo[] = [
  sportFinishJump,
  natureTwinLakes,
  familyBwMotherBaby,
  sportRunnerPortrait,
  natureLupineFlowers,
  familyPoppyFieldFlowers,
  sportSupermanFinish,
  natureLoneTreeLake,
  familyPoppyFieldEmbrace,
];
