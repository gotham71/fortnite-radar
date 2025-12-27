import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { FortniteNewsResponse, Motd, SaveTheWorldNews } from "@fortnite-radar/models";
import { finalize, Observable } from "rxjs";
import { LoadingStoreService } from "./loading-store.service";

@Injectable({ providedIn: 'root' })
export class NewsStoreService {
  private http = inject(HttpClient);
  private readonly getNewsUrl = 'https://fortnite-api.com/v2/news?language=en';
  private readonly _news = signal<FortniteNewsResponse | null>(null);
  readonly news = computed(() => this._news());

  private isLoading = inject(LoadingStoreService);

  private withLoading<T>(obs$: Observable<T>): Observable<T> {
    this.isLoading.showLoading();
    return obs$.pipe(finalize(() => this.isLoading.hideLoading()));
  }

  readonly motds = computed<Motd[]>(() => {
    const items = this.news()?.data.br.motds ?? [];
    return [...items].sort((a, b) => b.sortingPriority - a.sortingPriority);
  });

  readonly motdsData = computed<SaveTheWorldNews>(() => {
    const motdsCarroussel = this.news()?.data?.stw ?? {date: '', messages: [], hash: ''};
    return motdsCarroussel;
  });

  readonly motdsCarroussel = computed<string>(() => {
    const motdsCarroussel = this.news()?.data?.br?.image ?? '';
    return motdsCarroussel;
  });

  loadNews() {
    this.withLoading(
      this.http.get<FortniteNewsResponse>(this.getNewsUrl)
    ).subscribe({
        next: (response) => {
          this._news.set(response);
        },
        error: (error) => {
          console.error('Failed to load news:', error);
          this._news.set(null);
        }
      });
  }
}
