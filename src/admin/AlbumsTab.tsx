import { useState } from 'preact/hooks';
import type { Photo } from '../lib/content-schema';
import Icon from './Icon';
import PhotoEditor from './PhotoEditor';
import PhotoGrid from './PhotoGrid';
import Uploader from './Uploader';
import { UNASSIGNED, newAlbumId, photoMap, slugify, unassignedPhotos, uniqueSlug } from './model';
import { move, useSortable } from './sortable';
import type { TabProps } from './types';

interface Props extends TabProps {
  onUploaded: (photo: Photo, revision: number, albumId: string | null) => void;
}

export default function AlbumsTab({ content, update, onUploaded }: Props) {
  const [selectedId, setSelectedId] = useState<string>(content.albums[0]?.id ?? UNASSIGNED);
  const [editingId, setEditingId] = useState<string | null>(null);

  const albumListRef = useSortable<HTMLUListElement>(
    (from, to) => update((draft) => (draft.albums = move(draft.albums, from, to))),
    '.drag-handle',
  );

  const byId = photoMap(content);
  const album = content.albums.find((a) => a.id === selectedId) ?? null;
  const isUnassigned = !album;
  const photos: Photo[] = album
    ? album.photoIds.map((id) => byId.get(id)).filter((p): p is Photo => !!p)
    : unassignedPhotos(content);
  const editing = editingId ? byId.get(editingId) : undefined;
  const loose = unassignedPhotos(content).length;

  const createAlbum = () => {
    const id = newAlbumId();
    update((draft) => {
      draft.albums.push({ id, slug: uniqueSlug(draft, 'novyy-albom'), title: 'Новый альбом', coverId: null, photoIds: [], hidden: false });
    });
    setSelectedId(id);
  };

  const deleteAlbum = () => {
    if (!album) return;
    const message = album.photoIds.length
      ? `Удалить альбом «${album.title}»? Его ${album.photoIds.length} фото не удалятся, а переедут в «Без альбома».`
      : `Удалить пустой альбом «${album.title}»?`;
    if (!confirm(message)) return;
    update((draft) => (draft.albums = draft.albums.filter((a) => a.id !== album.id)));
    setSelectedId(UNASSIGNED);
  };

  const patchAlbum = (fn: (a: NonNullable<typeof album>) => void) =>
    update((draft) => {
      const target = draft.albums.find((a) => a.id === selectedId);
      if (target) fn(target);
    });

  const togglePhoto = (photo: Photo, key: 'hidden' | 'featured') =>
    update((draft) => {
      if (key === 'hidden') {
        const target = draft.photos.find((p) => p.id === photo.id);
        if (target) target.hidden = !target.hidden;
      } else {
        draft.featured = draft.featured.includes(photo.id)
          ? draft.featured.filter((id) => id !== photo.id)
          : [...draft.featured, photo.id];
      }
    });

  return (
    <div class="albums-layout">
      <aside class="album-list-panel">
        <ul class="album-list" ref={albumListRef}>
          {content.albums.map((a) => (
            <li key={a.id} class={`album-list-item${a.id === selectedId ? ' is-active' : ''}${a.hidden ? ' is-hidden' : ''}`}>
              <span class="drag-handle" title="Перетащите, чтобы изменить порядок">
                <Icon name="grip" />
              </span>
              <button type="button" onClick={() => setSelectedId(a.id)}>
                <span class="album-list-title">{a.title}</span>
                <span class="album-list-meta">
                  {a.photoIds.length} фото{a.hidden ? ' · скрыт' : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          class={`album-list-item album-list-loose${isUnassigned ? ' is-active' : ''}`}
          onClick={() => setSelectedId(UNASSIGNED)}
        >
          <span class="album-list-title">Без альбома</span>
          <span class="album-list-meta">{loose} фото</span>
        </button>
        <button type="button" class="btn btn-block" onClick={createAlbum}>
          <Icon name="plus" /> Новый альбом
        </button>
      </aside>

      <section class="album-editor">
        {album ? (
          <div class="album-fields">
            <label class="field">
              <span>Название</span>
              <input
                value={album.title}
                maxLength={80}
                onInput={(e) => patchAlbum((a) => (a.title = e.currentTarget.value))}
                onBlur={() => {
                  if (album.slug.startsWith('novyy-albom')) {
                    update((draft) => {
                      const a = draft.albums.find((x) => x.id === album.id);
                      if (a) a.slug = uniqueSlug(draft, slugify(a.title), a.id);
                    });
                  }
                }}
              />
            </label>
            <label class="field">
              <span>Адрес страницы</span>
              <div class="slug-input">
                <span>/gallery/</span>
                <input
                  value={album.slug}
                  onChange={(e) =>
                    update((draft) => {
                      const a = draft.albums.find((x) => x.id === album.id);
                      if (a) a.slug = uniqueSlug(draft, slugify(e.currentTarget.value), a.id);
                    })
                  }
                />
              </div>
            </label>
            <div class="album-field-row">
              <label class="check">
                <input type="checkbox" checked={!album.hidden} onChange={(e) => patchAlbum((a) => (a.hidden = !e.currentTarget.checked))} />
                Показывать альбом на сайте
              </label>
              <button type="button" class="btn btn-danger btn-small" onClick={deleteAlbum}>
                <Icon name="trash" /> Удалить альбом
              </button>
            </div>
          </div>
        ) : (
          <p class="hint">
            Здесь фото, которые не лежат ни в одном альбоме: их не видно в галерее, но их можно поставить на главный экран
            или в карусель. Переложить фото в альбом можно в окне редактирования фото.
          </p>
        )}

        <Uploader
          key={selectedId}
          albumId={album?.id ?? null}
          onUploaded={(photo, revision) => onUploaded(photo, revision, album?.id ?? null)}
        />

        {photos.length ? (
          <>
            <p class="hint">
              Перетаскивайте фото, чтобы менять порядок. Клик по фото открывает описание, альбом и обрезку.
            </p>
            <PhotoGrid
              key={selectedId}
              photos={photos}
              coverId={album?.coverId}
              featured={content.featured}
              onReorder={
                album
                  ? (from, to) => patchAlbum((a) => (a.photoIds = move(a.photoIds, from, to)))
                  : undefined
              }
              onOpen={(p) => setEditingId(p.id)}
              onToggleHidden={(p) => togglePhoto(p, 'hidden')}
              onToggleFeatured={(p) => togglePhoto(p, 'featured')}
            />
          </>
        ) : (
          <p class="empty">В этом разделе пока нет фото - перетащите файлы в область загрузки выше.</p>
        )}
      </section>

      {editing && <PhotoEditor content={content} update={update} photo={editing} onClose={() => setEditingId(null)} />}
    </div>
  );
}
