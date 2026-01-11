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
  loadingMap = true;
  loadingPois = true;
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
        this.loadingMap = false;
      },
      error: (error) => {
        this.loadingMap = false;
        console.log(Error, error);
      }
    })


    this.mapsService.getCurrentPOIsUsual().subscribe({
      next: (pois) => {
        this.pois = pois;
        this.cdr.markForCheck();
        this.loadingPois = false;
      },
      error: (error) => {
        this.loadingPois = false;
        console.log(Error, error);
      }
    });
  }

}
