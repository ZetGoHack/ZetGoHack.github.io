import { randomBytes, scrypt } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const dataDir = path.resolve(process.env.SOYKA_DATA_DIR ?? '.data');
const authFile = path.join(dataDir, 'auth.json');
const password = process.argv[2] || randomBytes(12).toString('base64url');

if (password.length < 10) {
  console.error('Password must be at least 10 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await promisify(scrypt)(password, salt, 64);
const state = { salt: salt.toString('hex'), hash: hash.toString('hex'), secret: randomBytes(32).toString('hex') };

await mkdir(dataDir, { recursive: true });
const tmp = `${authFile}.${process.pid}.tmp`;
await writeFile(tmp, JSON.stringify(state, null, 2), { encoding: 'utf8', mode: 0o600 });
await rename(tmp, authFile);

console.log(`Admin password reset (${authFile}).`);
console.log(`New password: ${password}`);
