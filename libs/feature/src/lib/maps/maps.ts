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
  private mapsService = inject(MapsService);
  private cdr = inject(ChangeDetectorRef);

  mapUrl: string | null = null;
  loadingMap = true;
  loadingPois = true;
  pois: POI[] = this.mapsService.pois();

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
      }
    })
    this.mapsService.getCurrentPOIsUsual();
  }

}
