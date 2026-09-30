import type { Album, Content, Photo } from '../lib/content-schema';

export const UNASSIGNED = '__unassigned';

export function photoMap(content: Content): Map<string, Photo> {
  return new Map(content.photos.map((p) => [p.id, p]));
}

export function albumOfPhoto(content: Content, photoId: string): Album | undefined {
  return content.albums.find((a) => a.photoIds.includes(photoId));
}

export function unassignedPhotos(content: Content): Photo[] {
  const placed = new Set(content.albums.flatMap((a) => a.photoIds));
  return content.photos.filter((p) => !placed.has(p.id));
}

export function applyUpload(content: Content, photo: Photo, albumId: string | null): void {
  if (content.photos.some((p) => p.id === photo.id)) return;
  content.photos.push(photo);
  const album = content.albums.find((a) => a.id === albumId);
  if (album) {
    album.photoIds.push(photo.id);
    album.coverId ??= photo.id;
  }
}

export function removePhoto(content: Content, photoId: string): void {
  content.photos = content.photos.filter((p) => p.id !== photoId);
  for (const album of content.albums) {
    album.photoIds = album.photoIds.filter((id) => id !== photoId);
    if (album.coverId === photoId) album.coverId = album.photoIds[0] ?? null;
  }
  content.featured = content.featured.filter((id) => id !== photoId);
  if (content.home.heroPhotoId === photoId) content.home.heroPhotoId = null;
}

export function movePhotoToAlbum(content: Content, photoId: string, targetAlbumId: string): void {
  for (const album of content.albums) {
    if (!album.photoIds.includes(photoId)) continue;
    album.photoIds = album.photoIds.filter((id) => id !== photoId);
    if (album.coverId === photoId) album.coverId = album.photoIds[0] ?? null;
  }
  const target = content.albums.find((a) => a.id === targetAlbumId);
  if (target) {
    target.photoIds.push(photoId);
    target.coverId ??= photoId;
  }
}

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ą: 'a', č: 'c', ę: 'e', ė: 'e', į: 'i', š: 's',
  ų: 'u', ū: 'u', ž: 'z',
};

export function slugify(text: string): string {
  return (
    [...text.toLowerCase()]
      .map((ch) => TRANSLIT[ch] ?? ch)
      .join('')
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'album'
  );
}

export function uniqueSlug(content: Content, base: string, exceptAlbumId?: string): string {
  const taken = new Set(content.albums.filter((a) => a.id !== exceptAlbumId).map((a) => a.slug));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

export function newAlbumId(): string {
  return `album-${Math.random().toString(36).slice(2, 8)}`;
}

export function focusPercent(photo: Photo): number | null {
  const match = photo.focus?.match(/^center (\d+)%$/);
  return match ? Number(match[1]) : null;
}
