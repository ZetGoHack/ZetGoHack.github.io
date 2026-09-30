import { useEffect } from 'preact/hooks';
import type { Photo } from '../lib/content-schema';
import { UNASSIGNED, albumOfPhoto, focusPercent, movePhotoToAlbum, removePhoto } from './model';
import type { TabProps } from './types';

interface Props extends TabProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoEditor({ content, update, photo, onClose }: Props) {
  const album = albumOfPhoto(content, photo.id);
  const focus = focusPercent(photo);
  const inCarousel = content.featured.includes(photo.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const patch = (fn: (p: Photo) => void) =>
    update((draft) => {
      const target = draft.photos.find((p) => p.id === photo.id);
      if (target) fn(target);
    });

  const onMove = (targetId: string) =>
    update((draft) => {
      if (targetId === UNASSIGNED) {
        for (const a of draft.albums) {
          a.photoIds = a.photoIds.filter((id) => id !== photo.id);
          if (a.coverId === photo.id) a.coverId = a.photoIds[0] ?? null;
        }
      } else {
        movePhotoToAlbum(draft, photo.id, targetId);
      }
    });

  const onDelete = () => {
    if (!confirm('Удалить это фото с сайта? После сохранения файл будет удалён окончательно.')) return;
    update((draft) => removePhoto(draft, photo.id));
    onClose();
  };

  return (
    <div class="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="modal" role="dialog" aria-modal="true" aria-label="Редактирование фото">
        <div class="modal-preview">
          <img
            src={photo.src}
            alt=""
            style={{ objectPosition: photo.focus ?? 'center' }}
            width={photo.width}
            height={photo.height}
          />
          <p class="hint">Так фото обрезается в карточках галереи.</p>
        </div>
        <div class="modal-body">
          <label class="field">
            <span>Описание</span>
            <textarea
              rows={3}
              value={photo.alt}
              placeholder="Что на фото - для поисковиков и незрячих посетителей"
              onInput={(e) => patch((p) => (p.alt = e.currentTarget.value))}
            />
          </label>

          <label class="field">
            <span>Альбом</span>
            <select value={album?.id ?? UNASSIGNED} onChange={(e) => onMove(e.currentTarget.value)}>
              {content.albums.map((a) => (
                <option value={a.id}>{a.title}</option>
              ))}
              <option value={UNASSIGNED}>- Без альбома -</option>
            </select>
          </label>

          <div class="field">
            <span>Точка фокуса при обрезке (по вертикали)</span>
            <div class="focus-row">
              <input
                type="range"
                min={0}
                max={100}
                value={focus ?? 50}
                onInput={(e) => patch((p) => (p.focus = `center ${e.currentTarget.value}%`))}
              />
              <span class="focus-value">{focus === null ? 'центр' : `${focus}%`}</span>
              {focus !== null && (
                <button type="button" class="btn btn-small" onClick={() => patch((p) => delete p.focus)}>
                  Сбросить
                </button>
              )}
            </div>
            <p class="hint">Сдвиньте вверх, если в карточке обрезается голова.</p>
          </div>

          <label class="check">
            <input type="checkbox" checked={!photo.hidden} onChange={(e) => patch((p) => (p.hidden = !e.currentTarget.checked))} />
            Показывать на сайте
          </label>
          <label class="check">
            <input
              type="checkbox"
              checked={inCarousel}
              onChange={(e) =>
                update((draft) => {
                  draft.featured = e.currentTarget.checked
                    ? [...draft.featured, photo.id]
                    : draft.featured.filter((id) => id !== photo.id);
                })
              }
            />
            В карусели на главной
          </label>
          {album && (
            <label class="check">
              <input
                type="radio"
                checked={album.coverId === photo.id}
                onChange={() =>
                  update((draft) => {
                    const a = draft.albums.find((x) => x.id === album.id);
                    if (a) a.coverId = photo.id;
                  })
                }
              />
              Обложка альбома «{album.title}»
            </label>
          )}

          <div class="modal-actions">
            <button type="button" class="btn btn-danger" onClick={onDelete}>
              Удалить фото
            </button>
            <button type="button" class="btn btn-primary" onClick={onClose}>
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
