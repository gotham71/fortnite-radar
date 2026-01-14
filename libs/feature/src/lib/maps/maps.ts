import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { MapsService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-maps',
  imports: [CommonModule],
  templateUrl: './maps.html',
  styleUrl: './maps.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Maps implements OnInit {
  private mapsService = inject(MapsService);
  private cdr = inject(ChangeDetectorRef);

  mapUrl: string | null = null;
  loadingMap = true;
  loadingPois = true;
  readonly pois = this.mapsService.pois;

  constructor() {
    effect(() => {
      const poisValue = this.pois();
      if (poisValue.length > 0) {
        this.loadingPois = false;
        this.cdr.markForCheck();
      } else if (!this.loadingPois && poisValue.length === 0) {
        // Si ya no está cargando y no hay POIs, podría ser un error o simplemente no hay datos
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    this.mapsService.getCurrentMap().subscribe({
      next: (url) => {
        if(this.mapUrl) {
          URL.revokeObjectURL(this.mapUrl);
        }
        this.mapUrl = url;
        this.cdr.markForCheck();
        this.loadingMap = false;
      },
      error: (error) => {
        this.loadingMap = false;
        console.log(Error, error);
        this.cdr.markForCheck();
      }
    })

    this.mapsService.getCurrentPOIsUsual();

    // Timeout para desactivar el loading si la petición tarda demasiado
    setTimeout(() => {
      if (this.loadingPois) {
        this.loadingPois = false;
        this.cdr.markForCheck();
      }
    }, 10000); // 10 segundos
  }

}
