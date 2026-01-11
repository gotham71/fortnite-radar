import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FortniteMap, POI } from '@fortnite-radar/models';
import { catchError, delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private http = inject(HttpClient);
  private readonly apiKey = "b7f7f8f6-200e4139-de07ae3d-78842206";
  private readonly mapsUrl = 'https://fortniteapi.io/v1';
  private readonly currentMapUrl = 'https://media.fortniteapi.io/images/map.png?showPOI=true';
  private readonly currentPOIsUrl = 'https://fortniteapi.io/v2/game/poi'

  getMaps(): Observable<FortniteMap[]> {
    return this.http.get<{ maps: FortniteMap[] }>(this.mapsUrl + 'maps/list', {
      headers: {
        Authorization: this.apiKey
      }
    }).pipe(
      map(res => this.shuffleArray(res.maps)),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to load Maps', error);
        return of([]);
      })
    );
  }

  getCurrentMap(): Observable<string> {
    return of(this.currentMapUrl).pipe(delay(1000));
  }


  getCurrentPOIsUsual(): Observable<POI[]> {
    return this.http.get<any>(this.currentPOIsUrl + '?lang=en', {
      headers: {
        authorization: this.apiKey
      }
    }).pipe(
      map(res => res.list)
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }
}
