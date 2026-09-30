import type { APIRoute } from 'astro';
import { contentSchema } from '../../../lib/content-schema';
import { getContent, updateContent } from '../../../lib/server/content-store';
import { json } from '../../../lib/server/http';

class StaleRevision extends Error {}

export const GET: APIRoute = async () => json(await getContent());

export const PUT: APIRoute = async ({ request }) => {
  const parsed = contentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: 'Данные не прошли проверку', issues: parsed.error.issues.map((i) => i.message) }, 400);
  }
  try {
    const saved = await updateContent((current) => {
      if (current.revision !== parsed.data.revision) throw new StaleRevision();
      return parsed.data;
    });
    return json(saved);
  } catch (err) {
    if (err instanceof StaleRevision) {
      return json({ error: 'Контент изменился в другой вкладке или окне. Обновите страницу.' }, 409);
    }
    throw err;
  }
};
