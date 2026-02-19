export const useLocale = () => {
  const hash = window.location.hash || '';
  return hash.startsWith('#/cn') ? 'cn' : 'en';
};

export const getLocalizedPath = (locale: string, href: string) =>
  locale === 'cn' ? `/cn${href}` : href;
