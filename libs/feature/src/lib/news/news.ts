import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { LocaleService, NewsStoreService } from '@fortnite-radar/store';
import { TranslatePipe } from '@fortnite-radar/ui';

@Component({
  selector: 'lib-news',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  standalone: true
})
export class News {
  private newsStore = inject(NewsStoreService);
  private localeService = inject(LocaleService);
  private readonly allMotds = this.newsStore.motds;

  readonly hitNew = computed(() => this.allMotds()[0]);
  readonly motds = computed(() => this.allMotds().slice(1));
  readonly loading = this.newsStore.loading;
  readonly error = this.newsStore.error;

  constructor() {
    effect(() => {
      this.localeService.locale();
      this.newsStore.getNewsList();
    });
  }
}
