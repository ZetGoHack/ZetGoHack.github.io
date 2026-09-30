import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR } from '../../lib/server/paths';

export const GET: APIRoute = async ({ params }) => {
  const file = params.file ?? '';
  if (!/^[a-z0-9-]+\.jpg$/.test(file)) return new Response(null, { status: 404 });
  try {
    const data = await readFile(path.join(UPLOADS_DIR, file));
    return new Response(data, {
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
};
