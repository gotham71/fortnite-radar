import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { FortniteNewsResponse, Motd } from "@fortnite-radar/models";

@Injectable({ providedIn: 'root' })
export class NewsStoreService {
  private http = inject(HttpClient);
  private readonly _news = signal<FortniteNewsResponse | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly news = computed(() => this._news());
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._news() === null && this._error() === null);

  readonly motds = computed<Motd[]>(() => {
    const items = this.news()?.data.br.motds ?? [];
    return [...items].sort((a, b) => b.sortingPriority - a.sortingPriority);
  });

  getNewsList() {
    this._error.set(null);
    this.http.get<FortniteNewsResponse>(`/api/getNews`)
      .subscribe({
        next: (response) => {
          this._news.set(response);
        },
        error: (error) => {
          console.error('Failed to load news:', error);
          this._news.set(null);
          this._error.set('News are currently unavailable. Please try again later.');
        }
      });
  }
}
