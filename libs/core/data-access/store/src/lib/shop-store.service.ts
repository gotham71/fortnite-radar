import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ShopResponse } from '@fortnite-radar/models';

@Injectable({
  providedIn: 'root'
})
export class ShopStoreService {
  private http = inject(HttpClient);

  private readonly _shop = signal<ShopResponse | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly shop = computed(() => this._shop());
  readonly error = computed(() => this._error());
  readonly loading = computed(() => this._shop() === null && this._error() === null);

  readonly entries = computed(() => this._shop()?.data?.entries ?? []);

  getShop() {
    this._error.set(null);
    this.http.get<ShopResponse>('/api/getShop').subscribe({
      next: (response) => this._shop.set(response),
      error: (err) => {
        console.error('Error fetching shop:', err);
        this._error.set('Shop is currently unavailable. Please try again later.');
        this._shop.set(null);
      }
    });
  }
}
