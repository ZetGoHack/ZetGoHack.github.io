import type { AstroCookies } from 'astro';
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken } from './auth';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function setSessionCookie(cookies: AstroCookies, secure: boolean): Promise<void> {
  cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
