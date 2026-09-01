import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MapResponse, POI } from '@fortnite-radar/models';
import { LocaleService } from './locale.service';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private http = inject(HttpClient);
  private localeService = inject(LocaleService);
  private translateService = inject(TranslateService);
  private readonly _pois = signal<POI[] | null>(null);
  private readonly _images = signal<{ blank: string; pois: string } | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly pois = computed(() => this._pois() ?? []);
  readonly images = computed(() => this._images());
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._pois() === null && this._error() === null);

  loadMap() {
    this._error.set(null);
    this._pois.set(null);
    this.http.get<MapResponse>(`/api/getMapWithPois?lang=${this.localeService.locale()}`).subscribe({
      next: (response) => {
        this._images.set(response.data.images);
        this._pois.set(response.data.pois ?? []);
      },
      error: (error) => {
        console.error('Failed to load map:', error);
        this._error.set(this.translateService.translate('maps.error'));
        this._pois.set([]);
      }
    });
  }
}
