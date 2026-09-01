import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CosmeticsStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-locker',
  imports: [CommonModule],
  templateUrl: './locker.html',
  styleUrl: './locker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Locker {
  private cosmeticsStore = inject(CosmeticsStoreService);

  readonly results = this.cosmeticsStore.results;
  readonly loading = this.cosmeticsStore.loading;
  readonly error = this.cosmeticsStore.error;
  readonly searched = this.cosmeticsStore.searched;

  search(event: Event, name: string) {
    event.preventDefault();
    this.cosmeticsStore.search(name);
  }
}
