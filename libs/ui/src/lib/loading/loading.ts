import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LoadingStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Loading {
  private loadingStore = inject(LoadingStoreService);
  readonly isLoading = this.loadingStore.isLoading;
}
