import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { PlayerStats, PlayerStatsResponse } from "@fortnite-radar/models";

@Injectable({ providedIn: 'root' })
export class PlayerStatsStoreService {
  private http = inject(HttpClient);
  private readonly _stats = signal<PlayerStats | null>(null);
  private readonly _error = signal<string | null>(null);
  private readonly _loading = signal(false);

  readonly stats = computed(() => this._stats());
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._loading());

  search(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    this._loading.set(true);
    this._error.set(null);
    this._stats.set(null);

    this.http.get<PlayerStatsResponse>(`/api/getPlayerStats?name=${encodeURIComponent(trimmed)}`)
      .subscribe({
        next: (response) => {
          this._stats.set(response.data);
          this._loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load player stats:', error);
          this._stats.set(null);
          this._loading.set(false);
          this._error.set(
            error.status === 404
              ? `No player found named "${trimmed}".`
              : 'Stats are currently unavailable. Please try again later.'
          );
        }
      });
  }
}
