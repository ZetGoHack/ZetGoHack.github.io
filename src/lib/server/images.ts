import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Photo } from '../content-schema';
import { UPLOADS_DIR } from './paths';

export const MAX_UPLOAD_BYTES = 60 * 1024 * 1024;
const LONG_EDGE = 1600;

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, '')
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'photo'
  );
}

export async function storeUpload(buffer: Buffer, originalName: string): Promise<Photo> {
  const id = `${slugify(originalName)}-${randomBytes(3).toString('hex')}`;
  const { data, info } = await sharp(buffer, { failOn: 'error' })
    .rotate()
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, `${id}.jpg`), data);
  return {
    id,
    src: `/media/${id}.jpg`,
    alt: '',
    width: info.width,
    height: info.height,
    hidden: false,
  };
}
