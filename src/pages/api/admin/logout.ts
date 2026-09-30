import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/server/http';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearSessionCookie(cookies);
  return redirect('/admin/login', 303);
};
