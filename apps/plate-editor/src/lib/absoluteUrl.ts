export function absoluteUrl(path: string) {
  return `${import.meta.env.VITE_APP_URL ?? 'http://localhost:3000'}${path}`;
}
