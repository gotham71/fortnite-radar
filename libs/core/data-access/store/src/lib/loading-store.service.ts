import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingStoreService {
  private _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  showLoading() {
    this._isLoading.set(true);
  }

  hideLoading() {
    this._isLoading.set(false);
  }

}
