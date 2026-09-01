import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Cosmetic, CosmeticsSearchResponse } from "@fortnite-radar/models";
import { LocaleService } from "./locale.service";
import { TranslateService } from "./translate.service";

@Injectable({ providedIn: 'root' })
export class CosmeticsStoreService {
  private http = inject(HttpClient);
  private localeService = inject(LocaleService);
  private translateService = inject(TranslateService);
  private readonly _results = signal<Cosmetic[] | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _loading = signal(false);
  private readonly _searched = signal(false);

  readonly results = computed(() => this._results() ?? []);
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._loading());
  readonly searched = computed(() => this._searched());

  search(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    this._loading.set(true);
    this._error.set(null);
    this._searched.set(true);

    this.http.get<CosmeticsSearchResponse>(
      `/api/getCosmetics?name=${encodeURIComponent(trimmed)}&lang=${this.localeService.locale()}`
    ).subscribe({
      next: (response) => {
        this._results.set(response.data);
        this._loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this._loading.set(false);
        if (error.status === 404) {
          this._results.set([]);
        } else {
          console.error('Failed to search cosmetics:', error);
          this._results.set(null);
          this._error.set(this.translateService.translate('locker.error'));
        }
      }
    });
  }
}
