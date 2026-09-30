import type { Photo } from '../lib/content-schema';
import Icon from './Icon';
import { useSortable } from './sortable';

interface Props {
  photos: Photo[];
  coverId?: string | null;
  featured: string[];
  onReorder?: (from: number, to: number) => void;
  onOpen: (photo: Photo) => void;
  onToggleHidden: (photo: Photo) => void;
  onToggleFeatured: (photo: Photo) => void;
}

export default function PhotoGrid({ photos, coverId, featured, onReorder, onOpen, onToggleHidden, onToggleFeatured }: Props) {
  const ref = useSortable<HTMLUListElement>((from, to) => onReorder?.(from, to), '.photo-thumb');

  return (
    <ul class="photo-grid" ref={ref}>
      {photos.map((photo) => {
        const inCarousel = featured.includes(photo.id);
        return (
          <li key={photo.id} class={`photo-card${photo.hidden ? ' is-hidden' : ''}`}>
            <button type="button" class="photo-thumb" onClick={() => onOpen(photo)} title="Редактировать">
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" style={{ objectPosition: photo.focus ?? 'center' }} />
              {coverId === photo.id && <span class="badge">Обложка</span>}
              {!photo.alt && <span class="badge badge-warn">Нет описания</span>}
            </button>
            <div class="photo-actions">
              <button
                type="button"
                class={`icon-btn${photo.hidden ? '' : ' is-on'}`}
                title={photo.hidden ? 'Скрыто - показать' : 'Показывается - скрыть'}
                aria-label={photo.hidden ? 'Показать на сайте' : 'Скрыть с сайта'}
                aria-pressed={!photo.hidden}
                onClick={() => onToggleHidden(photo)}
              >
                <Icon name={photo.hidden ? 'eyeOff' : 'eye'} />
              </button>
              <button
                type="button"
                class={`icon-btn${inCarousel ? ' is-on is-star' : ''}`}
                title={inCarousel ? 'В карусели - убрать' : 'Добавить в карусель'}
                aria-label={inCarousel ? 'Убрать из карусели' : 'Добавить в карусель'}
                aria-pressed={inCarousel}
                onClick={() => onToggleFeatured(photo)}
              >
                <Icon name="star" filled={inCarousel} />
              </button>
              <button type="button" class="icon-btn" title="Редактировать" aria-label="Редактировать" onClick={() => onOpen(photo)}>
                <Icon name="pencil" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
