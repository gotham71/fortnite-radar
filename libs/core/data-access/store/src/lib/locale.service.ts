import { Injectable, signal } from '@angular/core';

export type AppLocale = 'en' | 'es';

const STORAGE_KEY = 'fortnite-radar:locale';

function detectBrowserLocale(): AppLocale {
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return lang?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

function readStoredLocale(): AppLocale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'es' ? stored : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly _locale = signal<AppLocale>(readStoredLocale() ?? detectBrowserLocale());
  readonly locale = this._locale.asReadonly();

  setLocale(locale: AppLocale) {
    this._locale.set(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage unavailable (private mode, etc.) - the choice just won't persist
    }
  }

  toggleLocale() {
    this.setLocale(this._locale() === 'es' ? 'en' : 'es');
  }
}
