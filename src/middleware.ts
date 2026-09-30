import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, initAuth, verifySessionToken } from './lib/server/auth';

void initAuth();

const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/api/admin/login']);

export const onRequest = defineMiddleware(async (ctx, next) => {
  const pathname = ctx.url.pathname.replace(/\/+$/, '') || '/';
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin/');
  if (!isAdminPage && !isAdminApi) return next();

  // Astro's built-in origin check only covers form content types; JSON admin calls get the same check here.
  if (isAdminApi && ctx.request.method !== 'GET') {
    const origin = ctx.request.headers.get('origin');
    if (!origin || origin !== ctx.url.origin) {
      return new Response(JSON.stringify({ error: 'Bad origin' }), { status: 403 });
    }
  }

  const authed = await verifySessionToken(ctx.cookies.get(SESSION_COOKIE)?.value);
  ctx.locals.isAdmin = authed;

  if (!authed && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    if (isAdminApi) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
    return ctx.redirect('/admin/login');
  }
  if (authed && pathname === '/admin/login') return ctx.redirect('/admin');

  const response = await next();
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
});
