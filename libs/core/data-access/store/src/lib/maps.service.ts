import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { MapResponse, POI } from '@fortnite-radar/models';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private http = inject(HttpClient);
  private readonly _pois = signal<POI[] | null>(null);
  private readonly _mapUrl = signal<string | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly pois = computed(() => this._pois() ?? []);
  readonly mapUrl = computed(() => this._mapUrl());
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._pois() === null && this._error() === null);

  loadMap() {
    this.http.get<MapResponse>(`/api/getMapWithPois`).subscribe({
      next: (response) => {
        this._mapUrl.set(response.data.images.pois);
        this._pois.set(response.data.pois ?? []);
      },
      error: (error) => {
        console.error('Failed to load map:', error);
        this._error.set('Map service is currently unavailable. Please try again later.');
        this._pois.set([]);
      }
    });
  }
}
