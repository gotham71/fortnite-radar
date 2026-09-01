import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Cosmetic } from '@fortnite-radar/models';
import { CosmeticsStoreService, LocaleService } from '@fortnite-radar/store';
import { TranslatePipe } from '@fortnite-radar/ui';

@Component({
  selector: 'lib-locker',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './locker.html',
  styleUrl: './locker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Locker {
  private cosmeticsStore = inject(CosmeticsStoreService);
  private sanitizer = inject(DomSanitizer);
  private localeService = inject(LocaleService);

  readonly results = this.cosmeticsStore.results;
  readonly loading = this.cosmeticsStore.loading;
  readonly error = this.cosmeticsStore.error;
  readonly searched = this.cosmeticsStore.searched;
  readonly locale = this.localeService.locale;

  readonly selectedItem = signal<Cosmetic | null>(null);

  search(event: Event, name: string) {
    event.preventDefault();
    this.cosmeticsStore.search(name);
  }

  openDetail(item: Cosmetic) {
    this.selectedItem.set(item);
  }

  closeDetail() {
    this.selectedItem.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeDetail();
  }

  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }
}
