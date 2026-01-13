import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { POI } from '@fortnite-radar/models';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private http = inject(HttpClient);
  private readonly _pois = signal<POI[]>([]);
  readonly pois = computed(() => this._pois());
  private readonly currentMapUrl = 'https://media.fortniteapi.io/images/map.png?showPOI=true';

  getCurrentMap(): Observable<string> {
    return of(this.currentMapUrl).pipe(delay(1000));
  }

  getCurrentPOIsUsual() {
    this.http.get<POI[]>(`/api/getMapWithPois`)
    .subscribe({
      next: (response) => {
        console.log(response);
        this._pois.set(response);
      },
      error: (error) => {
        console.error('Failed to load POIs:', error);
      }
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
