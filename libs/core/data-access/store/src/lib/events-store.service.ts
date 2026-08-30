import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { CompetitiveMode, CompetitiveModesResponse } from "@fortnite-radar/models";
import { finalize } from "rxjs";
import { LoadingStoreService } from "./loading-store.service";

@Injectable({ providedIn: 'root' })
export class EventsStoreService {
  private http = inject(HttpClient);
  private readonly isLoading = inject(LoadingStoreService);
  private readonly _modes = signal<CompetitiveMode[] | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly modes = computed(() => this._modes() ?? []);
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._modes() === null && this._error() === null);

  getCompetitiveModes() {
    this._error.set(null);
    this.isLoading.showLoading();
    this.http.get<CompetitiveModesResponse>(`/api/getPlaylists`)
      .pipe(finalize(() => this.isLoading.hideLoading()))
      .subscribe({
        next: (response) => {
          this._modes.set(response.data);
        },
        error: (error) => {
          console.error('Failed to load competitive modes:', error);
          this._modes.set([]);
          this._error.set('Competitive modes are currently unavailable. Please try again later.');
        }
      });
  }
}
