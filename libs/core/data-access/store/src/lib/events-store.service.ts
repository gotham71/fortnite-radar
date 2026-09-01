import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { CompetitiveMode, CompetitiveModesResponse } from "@fortnite-radar/models";
import { LocaleService } from "./locale.service";
import { TranslateService } from "./translate.service";

@Injectable({ providedIn: 'root' })
export class EventsStoreService {
  private http = inject(HttpClient);
  private localeService = inject(LocaleService);
  private translateService = inject(TranslateService);
  private readonly _modes = signal<CompetitiveMode[] | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly modes = computed(() => this._modes() ?? []);
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._modes() === null && this._error() === null);

  getCompetitiveModes() {
    this._error.set(null);
    this._modes.set(null);
    this.http.get<CompetitiveModesResponse>(`/api/getPlaylists?lang=${this.localeService.locale()}`)
      .subscribe({
        next: (response) => {
          this._modes.set(response.data);
        },
        error: (error) => {
          console.error('Failed to load competitive modes:', error);
          this._modes.set([]);
          this._error.set(this.translateService.translate('events.error'));
        }
      });
  }
}
