import { mkdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import seed from '../../../content/seed.json';
import { contentSchema, type Content } from '../content-schema';
import { CONTENT_FILE, DATA_DIR, UPLOADS_DIR } from './paths';

let cache: { mtimeMs: number; content: Content } | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function writeAtomic(file: string, data: string): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, data, 'utf8');
  await rename(tmp, file);
}

async function readFromDisk(): Promise<Content> {
  let mtimeMs: number;
  try {
    mtimeMs = (await stat(CONTENT_FILE)).mtimeMs;
  } catch {
    const initial = contentSchema.parse(seed);
    await writeAtomic(CONTENT_FILE, JSON.stringify(initial, null, 2));
    mtimeMs = (await stat(CONTENT_FILE)).mtimeMs;
    cache = { mtimeMs, content: initial };
    return initial;
  }
  if (cache && cache.mtimeMs === mtimeMs) return cache.content;
  const content = contentSchema.parse(JSON.parse(await readFile(CONTENT_FILE, 'utf8')));
  cache = { mtimeMs, content };
  return content;
}

export function getContent(): Promise<Content> {
  return readFromDisk();
}

async function deleteOrphanedUploads(before: Content, after: Content): Promise<void> {
  const kept = new Set(after.photos.map((p) => p.src));
  for (const p of before.photos) {
    if (kept.has(p.src) || !p.src.startsWith('/media/')) continue;
    await unlink(path.join(UPLOADS_DIR, path.basename(p.src))).catch(() => {});
  }
}

export function updateContent(mutate: (current: Content) => Content | Promise<Content>): Promise<Content> {
  const run = queue.then(async () => {
    const before = await readFromDisk();
    const next = contentSchema.parse(await mutate(structuredClone(before)));
    next.revision = before.revision + 1;
    await writeAtomic(CONTENT_FILE, JSON.stringify(next, null, 2));
    cache = { mtimeMs: (await stat(CONTENT_FILE)).mtimeMs, content: next };
    await deleteOrphanedUploads(before, next);
    return next;
  });
  queue = run.catch(() => {});
  return run;
}

export async function ensureDataDir(): Promise<void> {
  await mkdir(UPLOADS_DIR, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });
}
