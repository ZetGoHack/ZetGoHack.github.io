import type { Content } from '../lib/content-schema';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly issues: string[] = [],
  ) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  if (res.status === 401) {
    location.href = '/admin/login';
    throw new ApiError('Сессия истекла, войдите снова', 401);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: string[] };
  if (!res.ok) throw new ApiError(data.error ?? `Ошибка сервера (${res.status})`, res.status, data.issues);
  return data as T;
}

export const loadContent = () => request<Content>('/api/admin/content');

export const saveContent = (content: Content) =>
  request<Content>('/api/admin/content', { method: 'PUT', body: JSON.stringify(content) });

export const changePassword = (current: string, next: string) =>
  request<{ ok: true }>('/api/admin/password', { method: 'POST', body: JSON.stringify({ current, next }) });
