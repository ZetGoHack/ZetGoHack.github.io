import path from 'node:path';

export const DATA_DIR = path.resolve(process.env.SOYKA_DATA_DIR ?? '.data');
export const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
export const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
