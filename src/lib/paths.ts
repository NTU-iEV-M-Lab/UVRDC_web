export function normalizeBase(input = '/') {
  if (!input.startsWith('/') || input.includes('..') || /[?#\\]/.test(input)) throw new Error('BASE_PATH 必須是絕對網站路徑');
  return `/${input.split('/').filter(Boolean).join('/')}${input === '/' || !input.split('/').filter(Boolean).length ? '' : '/'}`;
}
export function withBase(path: string, base: string) {
  return normalizeBase(base) + path.replace(/^\/+/, '');
}
export function localPath(pathname: string, base: string) {
  const normalized = normalizeBase(base);
  if (normalized !== '/' && !pathname.startsWith(normalized)) return '/404.html';
  const path = normalized === '/' ? pathname : '/' + pathname.slice(normalized.length);
  return path.endsWith('.html') ? path : path.replace(/\/*$/, '/');
}
