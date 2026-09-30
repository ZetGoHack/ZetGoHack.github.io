import type { APIRoute } from 'astro';
import { clearLoginFailures, loginLockedFor, recordLoginFailure, verifyPassword } from '../../../lib/server/auth';
import { setSessionCookie } from '../../../lib/server/http';

export const POST: APIRoute = async ({ request, cookies, clientAddress, url, redirect }) => {
  const locked = loginLockedFor(clientAddress);
  if (locked > 0) return redirect(`/admin/login?error=locked&wait=${locked}`, 303);

  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  if (!password || !(await verifyPassword(password))) {
    recordLoginFailure(clientAddress);
    return redirect('/admin/login?error=invalid', 303);
  }

  clearLoginFailures(clientAddress);
  await setSessionCookie(cookies, url.protocol === 'https:');
  return redirect('/admin', 303);
};
