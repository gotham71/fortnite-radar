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
    this.http.get<any>(`/api/getMapWithPois`)
    .subscribe({
      next: (response) => {
        console.log('POIs response:', response);
        // La API puede devolver los datos directamente o dentro de un objeto data
        let poisArray: POI[] = [];
        if (Array.isArray(response)) {
          poisArray = response;
        } else if (response?.data) {
          if (Array.isArray(response.data)) {
            poisArray = response.data;
          } else if (response.data?.pois && Array.isArray(response.data.pois)) {
            poisArray = response.data.pois;
          } else if (typeof response.data === 'object') {
            // Intentar extraer POIs de cualquier propiedad del objeto data
            const dataKeys = Object.keys(response.data);
            for (const key of dataKeys) {
              if (Array.isArray(response.data[key])) {
                poisArray = response.data[key];
                break;
              }
            }
          }
        }
        console.log('POIs extracted:', poisArray);
        this._pois.set(poisArray);
      },
      error: (error) => {
        console.error('Failed to load POIs:', error);
        this._pois.set([]);
      }
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
