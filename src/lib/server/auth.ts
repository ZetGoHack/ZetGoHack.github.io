import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { AUTH_FILE } from './paths';

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const SESSION_COOKIE = 'soyka_admin';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const MIN_PASSWORD_LENGTH = 10;

interface AuthState {
  salt: string;
  hash: string;
  secret: string;
}

let state: AuthState | null = null;
let stateMtimeMs = 0;

async function hashPassword(password: string, salt: Buffer): Promise<string> {
  return (await scrypt(password, salt, 64)).toString('hex');
}

async function persist(next: AuthState): Promise<void> {
  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  const tmp = `${AUTH_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(next, null, 2), { encoding: 'utf8', mode: 0o600 });
  await rename(tmp, AUTH_FILE);
  state = next;
  stateMtimeMs = (await stat(AUTH_FILE)).mtimeMs;
}

async function buildState(password: string): Promise<AuthState> {
  const salt = randomBytes(16);
  return {
    salt: salt.toString('hex'),
    hash: await hashPassword(password, salt),
    secret: randomBytes(32).toString('hex'),
  };
}

export function generatePassword(): string {
  return randomBytes(12).toString('base64url');
}

async function loadState(): Promise<AuthState> {
  try {
    const { mtimeMs } = await stat(AUTH_FILE);
    if (!state || mtimeMs !== stateMtimeMs) {
      state = JSON.parse(await readFile(AUTH_FILE, 'utf8')) as AuthState;
      stateMtimeMs = mtimeMs;
    }
    return state;
  } catch {
    const password = process.env.SOYKA_ADMIN_PASSWORD || generatePassword();
    await persist(await buildState(password));
    if (!process.env.SOYKA_ADMIN_PASSWORD) {
      console.log(
        `\n[admin] No admin password was set, so one was generated.\n[admin] Password: ${password}\n[admin] Log in at /admin and change it. This is the only time it is shown.\n`,
      );
    }
    return state!;
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const s = await loadState();
  const expected = Buffer.from(s.hash, 'hex');
  const actual = Buffer.from(await hashPassword(password, Buffer.from(s.salt, 'hex')), 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function setPassword(password: string): Promise<void> {
  await persist(await buildState(password));
}

function sign(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function createSessionToken(): Promise<string> {
  const s = await loadState();
  const exp = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS);
  return `${exp}.${sign(s.secret, `admin.${exp}`)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, mac] = token.split('.');
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const s = await loadState();
  const expected = Buffer.from(sign(s.secret, `admin.${exp}`));
  const actual = Buffer.from(mac);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; lockedUntil: number }>();

export function loginLockedFor(ip: string): number {
  const entry = failures.get(ip);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 1000);
}

export function recordLoginFailure(ip: string): void {
  if (failures.size > 1000) {
    for (const [key, value] of failures) if (value.lockedUntil <= Date.now()) failures.delete(key);
  }
  const entry = failures.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILURES) {
    entry.lockedUntil = Date.now() + LOCK_MS;
    entry.count = 0;
  }
  failures.set(ip, entry);
}

export function clearLoginFailures(ip: string): void {
  failures.delete(ip);
}

export async function initAuth(): Promise<void> {
  await loadState();
}
