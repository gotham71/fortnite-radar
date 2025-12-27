import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { POI } from '@fortnite-radar/models';
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
  mapUrl: string | null = null;
  loading = true;
  pois: POI[] = [];

  private mapsService = inject(MapsService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.mapsService.getCurrentMap().subscribe({
      next: (url) => {
        if(this.mapUrl) {
          URL.revokeObjectURL(this.mapUrl);
        }
        this.mapUrl = url;
        this.cdr.markForCheck();
        this.loading = false;
        console.log("🚀 ~ maps ~ ngOnInit ~ this.mapUrl:", this.mapUrl)
      },
      error: (error) => {
        this.loading = false;
        console.log(Error, error);
      }
    })


    this.mapsService.getCurrentPOIsUsual().subscribe(pois => {
      this.pois = pois;
      this.cdr.markForCheck();
    });
  }

}
