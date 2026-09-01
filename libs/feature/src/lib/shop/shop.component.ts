import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { ShopEntry } from '@fortnite-radar/models';
import { ShopStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop implements OnInit {
  private shopStore = inject(ShopStoreService);
  readonly entries = this.shopStore.entries;
  readonly vbuckIcon = computed(() => this.shopStore.shop()?.data?.vbuckIcon);
  readonly loading = this.shopStore.loading;
  readonly error = this.shopStore.error;

  // Set to track images that failed to load
  private failedImages = signal<Set<string>>(new Set());

  readonly selectedEntry = signal<ShopEntry | null>(null);

  // Group entries by layout name (or ID if name is missing)
  readonly sections = computed(() => {
    const groups = new Map<string, ShopEntry[]>();
    for (const entry of this.entries()) {
      const key = entry.layout?.name || entry.layoutId || 'Other';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(entry);
    }
    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  });

  ngOnInit() {
    this.shopStore.getShop();
  }

  // Get the best available image URL
  getImage(item: ShopEntry): string | null {
    if (this.failedImages().has(item.offerId)) {
      return null;
    }
    // Check for track album art first if it's a track
    if (item.tracks?.length && item.tracks[0].albumArt) {
      return item.tracks[0].albumArt;
    }
    return item.bundle?.image || item.newDisplayAsset?.renderImages?.[0]?.image || item.newDisplayAssetPath || null;
  }

  // Handle image loading error
  handleImageError(id: string) {
    this.failedImages.update(set => {
      const newSet = new Set(set);
      newSet.add(id);
      return newSet;
    });
  }

  openDetail(entry: ShopEntry) {
    this.selectedEntry.set(entry);
  }

  closeDetail() {
    this.selectedEntry.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeDetail();
  }

  hasDiscount(entry: ShopEntry): boolean {
    return entry.regularPrice !== entry.finalPrice;
  }

  daysUntil(dateStr: string): number {
    const diffMs = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }
}
