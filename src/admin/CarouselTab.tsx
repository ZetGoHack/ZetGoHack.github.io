import type { Photo } from '../lib/content-schema';
import Icon from './Icon';
import PhotoPicker from './PhotoPicker';
import { albumOfPhoto, photoMap } from './model';
import { move, useSortable } from './sortable';
import type { TabProps } from './types';

export default function CarouselTab({ content, update }: TabProps) {
  const byId = photoMap(content);
  const slides = content.featured.map((id) => byId.get(id)).filter((p): p is Photo => !!p);
  const listRef = useSortable<HTMLUListElement>((from, to) => update((draft) => (draft.featured = move(draft.featured, from, to))));

  const toggle = (photo: Photo) =>
    update((draft) => {
      draft.featured = draft.featured.includes(photo.id)
        ? draft.featured.filter((id) => id !== photo.id)
        : [...draft.featured, photo.id];
    });

  return (
    <div class="stack">
      <section class="panel">
        <h2>Настройки карусели</h2>
        <label class="check">
          <input
            type="checkbox"
            checked={content.home.showCarousel}
            onChange={(e) => update((draft) => (draft.home.showCarousel = e.currentTarget.checked))}
          />
          Показывать карусель на главной
        </label>
        <label class="field field-inline">
          <span>Автопрокрутка, секунд (0 - выключена)</span>
          <input
            type="number"
            min={0}
            max={60}
            value={content.home.autoplaySeconds}
            onChange={(e) =>
              update((draft) => (draft.home.autoplaySeconds = Math.max(0, Math.min(60, Math.round(Number(e.currentTarget.value) || 0)))))
            }
          />
        </label>
      </section>

      <section class="panel">
        <h2>Фото в карусели ({slides.length})</h2>
        <p class="hint">Перетаскивайте, чтобы поменять порядок. Скрытые фото на сайте не показываются, даже если стоят здесь.</p>
        <ul class="carousel-list" ref={listRef}>
          {slides.map((photo) => (
            <li key={photo.id} class={`carousel-list-item${photo.hidden ? ' is-hidden' : ''}`}>
              <span class="drag-handle">
                <Icon name="grip" />
              </span>
              <img src={photo.src} alt="" loading="lazy" decoding="async" />
              <span class="carousel-list-meta">
                <strong>{photo.alt || 'Без описания'}</strong>
                <span>{albumOfPhoto(content, photo.id)?.title ?? 'Без альбома'}{photo.hidden ? ' · скрыто' : ''}</span>
              </span>
              <button type="button" class="icon-btn" title="Убрать из карусели" aria-label="Убрать из карусели" onClick={() => toggle(photo)}>
                <Icon name="trash" />
              </button>
            </li>
          ))}
        </ul>
        {!slides.length && <p class="empty">Карусель пуста - выберите фото ниже.</p>}
      </section>

      <section class="panel">
        <h2>Добавить фото</h2>
        <p class="hint">Клик по фото добавляет его в конец карусели, повторный клик - убирает.</p>
        <PhotoPicker content={content} selectedIds={content.featured} onPick={toggle} />
      </section>
    </div>
  );
}
