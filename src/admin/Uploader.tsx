import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';
import ru_RU from '@uppy/locales/lib/ru_RU';
import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';
import { useEffect, useRef } from 'preact/hooks';
import type { Photo } from '../lib/content-schema';

interface Props {
  albumId: string | null;
  onUploaded: (photo: Photo, revision: number) => void;
}

export default function Uploader({ albumId, onUploaded }: Props) {
  const target = useRef<HTMLDivElement>(null);
  const callback = useRef(onUploaded);
  callback.current = onUploaded;

  useEffect(() => {
    if (!target.current) return;
    const uppy = new Uppy({
      locale: ru_RU,
      autoProceed: true,
      restrictions: { maxFileSize: 60 * 1024 * 1024, allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'] },
      meta: { albumId: albumId ?? '' },
    })
      .use(Dashboard, {
        inline: true,
        target: target.current,
        height: 230,
        width: '100%',
        proudlyDisplayPoweredByUppy: false,
        note: 'JPEG, PNG или WebP до 60 МБ. Фото автоматически уменьшаются для сайта.',
      })
      .use(XHRUpload, {
        endpoint: '/api/admin/photos',
        fieldName: 'file',
        allowedMetaFields: ['albumId'],
        limit: 2,
        shouldRetry: (xhr) => xhr.status === 0,
        onAfterResponse(xhr) {
          if (xhr.status === 401) location.href = '/admin/login';
          if (xhr.status >= 400) {
            let message = `Ошибка сервера (${xhr.status})`;
            try {
              message = JSON.parse(xhr.responseText).error ?? message;
            } catch {}
            throw new Error(message);
          }
        },
      });

    uppy.on('upload-success', (_file, response) => {
      const body = response.body as unknown as { photo: Photo; revision: number };
      callback.current(body.photo, body.revision);
    });
    uppy.on('complete', (result) => {
      if (!result.failed?.length) setTimeout(() => uppy.clear(), 1200);
    });

    return () => uppy.destroy();
  }, [albumId]);

  return <div ref={target} class="uploader" />;
}
