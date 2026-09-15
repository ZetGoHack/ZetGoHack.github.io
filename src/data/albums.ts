import type { Photo } from './photos';

export interface Album {
  slug: string;
  title: string;
  cover: Photo;
  photos: Photo[];
}

function photo(src: string, alt: string, width: number, height: number, focus?: string): Photo {
  return { src: `/photos/${src}`, alt, width, height, focus };
}

const sportPhotos: Photo[] = [
  photo('sport-finish-jump.jpg', 'Runner leaping through the finish arch at a running event', 1067, 1600),
  photo('sport-crowd-start.jpg', 'Runners lined up at the start of a race', 1600, 1067),
  photo('sport-flag-runner.jpg', 'Runner leaping through a field holding a flag', 1600, 1067),
  photo('sport-descent.jpg', 'Runner descending a sandy trail', 1067, 1600),
  photo('sport-group-banner.jpg', 'Group of runners posing under an event banner', 1067, 1600),
  photo('sport-runner-portrait.jpg', 'Bearded runner mid-stride on a cold morning', 1067, 1600, 'center 28%'),
  photo('sport-suit-runner.jpg', 'Runner in a suit and sunglasses, playfully sprinting', 1600, 1067),
  photo(
    'sport-superman-finish.jpg',
    'Runner in a superhero costume celebrating at the finish line',
    1067,
    1600,
    'center 12%',
  ),
];

const naturePhotos: Photo[] = [
  photo('nature-twin-lakes.jpg', 'Two turquoise alpine lakes seen from above', 1600, 1067),
  photo('nature-peaks-lake.jpg', 'Jagged mountain peaks above a small lake', 1600, 1067),
  photo('nature-waterfall.jpg', 'Small waterfall over mossy rocks', 1600, 1067),
  photo('nature-lupine-flowers.jpg', 'Purple lupine flowers backlit by the sun', 1600, 1067),
  photo('nature-wooden-huts.jpg', 'Wooden huts in a green mountain valley', 1600, 1067),
  photo('nature-lone-tree-lake.jpg', 'A lone blossoming tree by a lake at golden hour', 1067, 1600),
];

const portraitsPhotos: Photo[] = [
  photo('portraits-poppy-blow.jpg', 'Woman blowing a flower in a poppy field', 1500, 1000),
  photo('portraits-golden-field.jpg', 'Woman in golden light among tall grass', 1067, 1600),
  photo('portraits-wheat-field.jpg', 'Woman walking through a golden wheat field', 1067, 1600),
  photo('portraits-beach-silhouette.jpg', 'Silhouette of a woman walking on the beach at sunset', 1067, 1600),
  photo('portraits-lupine-sunbeam.jpg', 'Woman with arms open in a lupine field, backlit', 1500, 1000),
  photo('portraits-lupine-basket.jpg', 'Woman walking with a flower basket through lupines', 1067, 1600),
  photo('portraits-lupine-basket-raised.jpg', 'Woman raising a flower basket in a lupine field', 1067, 1600),
  photo('portraits-night-lanterns.jpg', 'Woman with a lantern among candles at night', 1067, 1600),
];

const weddingPhotos: Photo[] = [
  photo('wedding-vows.jpg', 'Black-and-white portrait of bride and groom facing each other', 1067, 1600),
  photo('wedding-ceremony.jpg', 'Black-and-white wedding ceremony procession', 1600, 1067),
  photo('wedding-getting-ready.jpg', 'Black-and-white portrait of the groom getting ready', 1600, 1067),
  photo('wedding-bride-rose.jpg', 'Black-and-white close-up of the bride smiling with a rose', 1067, 1600),
  photo('wedding-autumn-park.jpg', 'Couple laughing together in an autumn park', 1067, 1600),
  photo('wedding-rustic-shed.jpg', 'Sepia-toned couple portrait by a rustic wooden shed', 1600, 1067),
  photo('wedding-old-shed.jpg', 'Sepia-toned couple standing in front of an old shed', 1600, 1067),
  photo('wedding-beach-umbrella.jpg', 'Bride and groom on the beach with a white umbrella', 1067, 1600),
];

const familyPhotos: Photo[] = [
  photo(
    'family-bw-mother-baby.jpg',
    'Black-and-white portrait of a mother nose-to-nose with her baby',
    1067,
    1600,
  ),
  photo('family-poppy-field-flowers.jpg', 'Mother and son picking poppies together in a summer field', 1067, 1600),
  photo('family-poppy-field-embrace.jpg', 'Mother embracing her son in a poppy field', 1500, 1000),
];

const bwPhotos: Photo[] = [
  photo('bw-beach-embrace.jpg', 'Black-and-white close-up of an embrace on the beach', 1600, 1333),
  photo('bw-makeup.jpg', 'Black-and-white portrait of makeup being applied', 1600, 1067),
  photo('bw-mirror-profile.jpg', 'Black-and-white profile portrait by a mirror', 1600, 1067),
  photo('bw-window-seat.jpg', 'Black-and-white portrait seated by a window', 1067, 1600),
];

const kidsPhotos: Photo[] = [
  photo('kids-kite-jump.jpg', 'Boy jumping with a red flag in a field', 1500, 1000),
  photo('kids-poppy-field.jpg', 'Boy sitting in a poppy field', 1500, 1000),
  photo('kids-flag-walk.jpg', 'Boy walking through a poppy field with a flag', 1067, 1600),
  photo('kids-portrait-hat.jpg', 'Boy in a hat and glasses standing in a field', 1067, 1600),
];

export const albums: Album[] = [
  { slug: 'weddings', title: 'Weddings', cover: weddingPhotos[0], photos: weddingPhotos },
  { slug: 'portraits', title: 'Portraits', cover: portraitsPhotos[0], photos: portraitsPhotos },
  { slug: 'family', title: 'Family', cover: familyPhotos[0], photos: familyPhotos },
  { slug: 'children', title: 'Children', cover: kidsPhotos[0], photos: kidsPhotos },
  { slug: 'sport', title: 'Sport', cover: sportPhotos[0], photos: sportPhotos },
  { slug: 'nature', title: 'Nature', cover: naturePhotos[0], photos: naturePhotos },
  { slug: 'black-and-white', title: 'Black & White', cover: bwPhotos[0], photos: bwPhotos },
];

export function getAlbum(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}

const albumByPhoto = new Map<Photo, Album>();
for (const album of albums) {
  for (const p of album.photos) albumByPhoto.set(p, album);
}

export function albumOf(p: Photo): Album | undefined {
  return albumByPhoto.get(p);
}

export const featured: Photo[] = [
  weddingPhotos[3],
  sportPhotos[0],
  naturePhotos[0],
  portraitsPhotos[4],
  familyPhotos[0],
  kidsPhotos[0],
  bwPhotos[0],
  sportPhotos[7],
];
