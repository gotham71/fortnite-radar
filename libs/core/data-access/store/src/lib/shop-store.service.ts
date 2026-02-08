import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { ShopResponse } from '@fortnite-radar/models';
import { finalize } from 'rxjs';
import { LoadingStoreService } from './loading-store.service';

@Injectable({
  providedIn: 'root'
})
export class ShopStoreService {
  private http = inject(HttpClient);
  private loadingStore = inject(LoadingStoreService);

  private readonly _shop = signal<ShopResponse | null>(null);
  private readonly _error = signal<string | null>(null);

  readonly shop = computed(() => this._shop());
  readonly error = computed(() => this._error());
  
  readonly entries = computed(() => this._shop()?.data?.entries ?? []);

  getShop() {
    this._error.set(null);
    this.loadingStore.showLoading();
    this.http.get<ShopResponse>('/api/getShop').pipe(
      finalize(() => this.loadingStore.hideLoading())
    ).subscribe({
      next: (response) => this._shop.set(response),
      error: (err) => {
        console.error('Error fetching shop:', err);
        this._error.set('Failed to load shop');
        this._shop.set(null); 
      }
    });
  }
}
