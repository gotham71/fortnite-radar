export type ApiLocale = 'en' | 'es';

/** Normalizes the ?lang= query param to a locale fortnite-api.com understands, defaulting to English. */
export function resolveLocale(lang: unknown): ApiLocale {
  return lang === 'es' ? 'es' : 'en';
}
