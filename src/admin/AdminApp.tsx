import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import type { Content, Photo } from '../lib/content-schema';
import AlbumsTab from './AlbumsTab';
import { ApiError, loadContent, saveContent } from './api';
import CarouselTab from './CarouselTab';
import { applyUpload } from './model';
import PasswordTab from './PasswordTab';
import PricingTab from './PricingTab';
import TextsTab from './TextsTab';

const TABS = [
  ['albums', 'Альбомы и фото'],
  ['carousel', 'Карусель'],
  ['texts', 'Главная и тексты'],
  ['pricing', 'Цены'],
  ['password', 'Пароль'],
] as const;

type Tab = (typeof TABS)[number][0];
type Status = { kind: 'idle' | 'saving' | 'saved' } | { kind: 'error'; message: string; issues?: string[] };

function tabFromHash(): Tab {
  const hash = location.hash.slice(1);
  return (TABS.find(([id]) => id === hash)?.[0] ?? 'albums') as Tab;
}

export default function AdminApp() {
  const [saved, setSaved] = useState<Content | null>(null);
  const [draft, setDraft] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadContent()
      .then((c) => {
        setSaved(c);
        setDraft(c);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : 'Не удалось загрузить данные'));
  }, []);

  const dirty = useMemo(() => !!saved && !!draft && JSON.stringify(saved) !== JSON.stringify(draft), [saved, draft]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = useCallback((mutate: (draft: Content) => void) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      mutate(next);
      return next;
    });
    setStatus((s) => (s.kind === 'saved' ? { kind: 'idle' } : s));
  }, []);

  // An upload is already persisted server-side, so it goes into both copies and never counts as unsaved.
  const onUploaded = useCallback((photo: Photo, revision: number, albumId: string | null) => {
    const apply = (prev: Content | null) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      applyUpload(next, photo, albumId);
      next.revision = Math.max(next.revision, revision);
      return next;
    };
    setSaved(apply);
    setDraft(apply);
  }, []);

  const save = async () => {
    if (!draft) return;
    setStatus({ kind: 'saving' });
    try {
      const result = await saveContent(draft);
      setSaved(result);
      setDraft(result);
      setStatus({ kind: 'saved' });
    } catch (err) {
      if (err instanceof ApiError) setStatus({ kind: 'error', message: err.message, issues: err.issues });
      else setStatus({ kind: 'error', message: 'Нет связи с сервером' });
    }
  };

  const discard = () => {
    if (confirm('Отменить все несохранённые изменения?')) {
      setDraft(saved);
      setStatus({ kind: 'idle' });
    }
  };

  const switchTab = (next: Tab) => {
    setTab(next);
    history.replaceState(null, '', `#${next}`);
  };

  if (loadError) return <p class="form-error app-error">{loadError}</p>;
  if (!draft) return <p class="app-loading">Загрузка…</p>;

  return (
    <div class="app">
      <header class="topbar">
        <div class="topbar-row">
          <a class="topbar-brand" href="/admin">
            <img src="/resources/logo.png" alt="" width="600" height="600" />
            <span>Панель управления</span>
          </a>
          <div class="topbar-actions">
            <span class={`save-status save-status-${status.kind}`} role="status">
              {status.kind === 'saving' && 'Сохраняю…'}
              {status.kind === 'saved' && 'Сохранено'}
              {status.kind === 'error' && status.message}
              {status.kind === 'idle' && dirty && 'Есть несохранённые изменения'}
            </span>
            {dirty && (
              <button type="button" class="btn btn-small" onClick={discard}>
                Отменить
              </button>
            )}
            <button type="button" class="btn btn-primary" disabled={!dirty || status.kind === 'saving'} onClick={save}>
              Сохранить
            </button>
            <a class="btn btn-small" href="/" target="_blank" rel="noopener">
              Открыть сайт
            </a>
            <form method="post" action="/api/admin/logout">
              <button type="submit" class="btn btn-small btn-ghost">
                Выйти
              </button>
            </form>
          </div>
        </div>
        <nav class="tabs" aria-label="Разделы">
          {TABS.map(([id, label]) => (
            <button type="button" class={`tab${tab === id ? ' is-active' : ''}`} aria-current={tab === id ? 'page' : undefined} onClick={() => switchTab(id)}>
              {label}
            </button>
          ))}
        </nav>
        {status.kind === 'error' && status.issues?.length ? (
          <ul class="issues">
            {status.issues.map((issue) => (
              <li>{issue}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <main class="app-main">
        {tab === 'albums' && <AlbumsTab content={draft} update={update} onUploaded={onUploaded} />}
        {tab === 'carousel' && <CarouselTab content={draft} update={update} />}
        {tab === 'texts' && <TextsTab content={draft} update={update} />}
        {tab === 'pricing' && <PricingTab content={draft} update={update} />}
        {tab === 'password' && <PasswordTab />}
      </main>
    </div>
  );
}
