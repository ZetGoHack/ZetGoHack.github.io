import type { APIRoute } from 'astro';
import { MIN_PASSWORD_LENGTH, setPassword, verifyPassword } from '../../../lib/server/auth';
import { json, setSessionCookie } from '../../../lib/server/http';

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const body = (await request.json().catch(() => null)) as { current?: unknown; next?: unknown } | null;
  const current = typeof body?.current === 'string' ? body.current : '';
  const next = typeof body?.next === 'string' ? body.next : '';

  if (!(await verifyPassword(current))) return json({ error: 'Текущий пароль неверный' }, 400);
  if (next.length < MIN_PASSWORD_LENGTH) {
    return json({ error: `Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов` }, 400);
  }

  await setPassword(next);
  await setSessionCookie(cookies, url.protocol === 'https:');
  return json({ ok: true });
};
