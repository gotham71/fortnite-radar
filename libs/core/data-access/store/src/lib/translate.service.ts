import { inject, Injectable } from '@angular/core';
import { LocaleService } from './locale.service';
import { TRANSLATIONS } from './translations';

function getByPath(obj: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : undefined;
}

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private localeService = inject(LocaleService);

  translate(key: string): string {
    const locale = this.localeService.locale();
    return getByPath(TRANSLATIONS[locale], key) ?? getByPath(TRANSLATIONS.en, key) ?? key;
  }
}
