import { useState } from 'preact/hooks';
import type { Content, Photo } from '../lib/content-schema';
import { UNASSIGNED, photoMap, unassignedPhotos } from './model';

interface Props {
  content: Content;
  selectedIds: string[];
  onPick: (photo: Photo) => void;
}

export default function PhotoPicker({ content, selectedIds, onPick }: Props) {
  const [albumId, setAlbumId] = useState(content.albums[0]?.id ?? UNASSIGNED);
  const byId = photoMap(content);
  const album = content.albums.find((a) => a.id === albumId);
  const photos = album ? album.photoIds.map((id) => byId.get(id)).filter((p): p is Photo => !!p) : unassignedPhotos(content);

  return (
    <div class="picker">
      <label class="field field-inline">
        <span>Альбом</span>
        <select value={albumId} onChange={(e) => setAlbumId(e.currentTarget.value)}>
          {content.albums.map((a) => (
            <option value={a.id}>{a.title}</option>
          ))}
          <option value={UNASSIGNED}>- Без альбома -</option>
        </select>
      </label>
      {photos.length ? (
        <ul class="picker-grid">
          {photos.map((photo) => {
            const selected = selectedIds.includes(photo.id);
            return (
              <li key={photo.id}>
                <button
                  type="button"
                  class={`picker-item${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  title={photo.alt || 'Без описания'}
                  onClick={() => onPick(photo)}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p class="empty">В этом альбоме нет фото.</p>
      )}
    </div>
  );
}
