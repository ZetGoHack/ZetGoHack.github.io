import { useState } from 'preact/hooks';
import type { Content } from '../lib/content-schema';
import ListEditor from './ListEditor';
import PhotoPicker from './PhotoPicker';
import { photoMap } from './model';
import type { TabProps } from './types';

type SiteKey = keyof Content['site'];

const CONTACT_FIELDS: { key: SiteKey; label: string; placeholder: string }[] = [
  { key: 'phone', label: 'Телефон', placeholder: '+370 600 00000' },
  { key: 'email', label: 'Email', placeholder: 'name@example.com' },
  { key: 'instagram', label: 'Instagram (ссылка)', placeholder: 'https://instagram.com/…' },
  { key: 'telegram', label: 'Telegram (ссылка)', placeholder: 'https://t.me/…' },
  { key: 'handle', label: 'Ник на странице «Обо мне»', placeholder: '@username' },
];

export default function TextsTab({ content, update }: TabProps) {
  const [picking, setPicking] = useState(false);
  const hero = content.home.heroPhotoId ? photoMap(content).get(content.home.heroPhotoId) : undefined;
  const setSite = (key: SiteKey, value: string) => update((draft) => (draft.site[key] = value));

  return (
    <div class="stack">
      <section class="panel">
        <h2>Фото главного экрана</h2>
        <div class="hero-choice">
          {hero ? (
            <img src={hero.src} alt="" class="hero-preview" />
          ) : (
            <div class="hero-preview hero-preview-empty">Стандартное фото</div>
          )}
          <div class="stack-tight">
            <button type="button" class="btn" onClick={() => setPicking(!picking)}>
              {picking ? 'Свернуть выбор' : 'Выбрать фото'}
            </button>
            {hero && (
              <button type="button" class="btn btn-small" onClick={() => update((draft) => (draft.home.heroPhotoId = null))}>
                Вернуть стандартное
              </button>
            )}
            <p class="hint">Лучше всего подходят светлые горизонтальные кадры без лиц в центре: поверх фото идёт текст.</p>
          </div>
        </div>
        {picking && (
          <PhotoPicker
            content={content}
            selectedIds={hero ? [hero.id] : []}
            onPick={(photo) => {
              update((draft) => (draft.home.heroPhotoId = photo.id));
              setPicking(false);
            }}
          />
        )}
        <label class="field">
          <span>Слоган под «Welcome!»</span>
          <textarea rows={2} value={content.site.tagline} onInput={(e) => setSite('tagline', e.currentTarget.value)} />
        </label>
      </section>

      <section class="panel">
        <h2>Контакты и соцсети</h2>
        <div class="field-grid">
          {CONTACT_FIELDS.map(({ key, label, placeholder }) => (
            <label class="field">
              <span>{label}</span>
              <input value={content.site[key]} placeholder={placeholder} onInput={(e) => setSite(key, e.currentTarget.value)} />
            </label>
          ))}
        </div>
      </section>

      <section class="panel">
        <h2>Страница «Обо мне»</h2>
        <label class="field">
          <span>О себе</span>
          <textarea rows={6} value={content.about.bio} onInput={(e) => update((draft) => (draft.about.bio = e.currentTarget.value))} />
        </label>
        <div class="field">
          <span>Награды и достижения</span>
          <ListEditor
            items={content.about.awards}
            placeholder="Награда - год"
            addLabel="Добавить строку"
            onChange={(awards) => update((draft) => (draft.about.awards = awards))}
          />
        </div>
      </section>
    </div>
  );
}
