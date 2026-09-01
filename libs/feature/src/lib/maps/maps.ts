import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { LocaleService, MapsService } from '@fortnite-radar/store';
import { TranslatePipe } from '@fortnite-radar/ui';

@Component({
  selector: 'lib-maps',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './maps.html',
  styleUrl: './maps.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Maps {
  private mapsService = inject(MapsService);
  private localeService = inject(LocaleService);

  readonly images = this.mapsService.images;
  readonly pois = this.mapsService.pois;
  readonly loading = this.mapsService.loading;
  readonly error = this.mapsService.error;

  readonly showLabels = signal(true);
  readonly filterText = signal('');

  readonly mapUrl = computed(() => {
    const images = this.images();
    if (!images) return null;
    return this.showLabels() ? images.pois : images.blank;
  });

  readonly filteredPois = computed(() => {
    const query = this.filterText().trim().toLowerCase();
    if (!query) return this.pois();
    return this.pois().filter((poi) => poi.name.toLowerCase().includes(query));
  });

  constructor() {
    effect(() => {
      this.localeService.locale();
      this.mapsService.loadMap();
    });
  }

  toggleLabels() {
    this.showLabels.update((show) => !show);
  }

  onFilterInput(value: string) {
    this.filterText.set(value);
  }
}
