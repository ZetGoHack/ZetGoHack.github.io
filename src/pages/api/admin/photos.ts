import type { APIRoute } from 'astro';
import { updateContent } from '../../../lib/server/content-store';
import { json } from '../../../lib/server/http';
import { MAX_UPLOAD_BYTES, storeUpload } from '../../../lib/server/images';

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const file = form.get('file');
  const albumId = String(form.get('albumId') ?? '');
  if (!(file instanceof File)) return json({ error: 'Файл не передан' }, 400);
  if (file.size > MAX_UPLOAD_BYTES) return json({ error: 'Файл слишком большой (максимум 60 МБ)' }, 413);

  let photo;
  try {
    photo = await storeUpload(Buffer.from(await file.arrayBuffer()), file.name);
  } catch {
    return json({ error: 'Не удалось прочитать изображение. Поддерживаются JPEG, PNG и WebP.' }, 415);
  }

  const content = await updateContent((current) => {
    current.photos.push(photo);
    const album = current.albums.find((a) => a.id === albumId);
    if (album) {
      album.photoIds.push(photo.id);
      album.coverId ??= photo.id;
    }
    return current;
  });
  return json({ photo, revision: content.revision });
};
