import type { Content, Photo } from '../content-schema';

export interface PublicAlbum {
  slug: string;
  title: string;
  cover: Photo;
  photos: Photo[];
}

export interface FeaturedSlide {
  photo: Photo;
  album: { slug: string; title: string } | null;
}

function photoIndex(content: Content): Map<string, Photo> {
  return new Map(content.photos.map((p) => [p.id, p]));
}

export function visibleAlbums(content: Content): PublicAlbum[] {
  const byId = photoIndex(content);
  const result: PublicAlbum[] = [];
  for (const album of content.albums) {
    if (album.hidden) continue;
    const photos = album.photoIds.map((id) => byId.get(id)).filter((p): p is Photo => !!p && !p.hidden);
    if (!photos.length) continue;
    const cover = photos.find((p) => p.id === album.coverId) ?? photos[0];
    result.push({ slug: album.slug, title: album.title, cover, photos });
  }
  return result;
}

export function findVisibleAlbum(content: Content, slug: string): PublicAlbum | undefined {
  return visibleAlbums(content).find((a) => a.slug === slug);
}

export function featuredSlides(content: Content): FeaturedSlide[] {
  const byId = photoIndex(content);
  const visible = new Map(visibleAlbums(content).flatMap((a) => a.photos.map((p) => [p.id, a] as const)));
  return content.featured
    .map((id) => byId.get(id))
    .filter((p): p is Photo => !!p && !p.hidden)
    .map((photo) => {
      const album = visible.get(photo.id);
      return { photo, album: album ? { slug: album.slug, title: album.title } : null };
    });
}

export function heroPhoto(content: Content): Photo | null {
  if (!content.home.heroPhotoId) return null;
  return photoIndex(content).get(content.home.heroPhotoId) ?? null;
}
