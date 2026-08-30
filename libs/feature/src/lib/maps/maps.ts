import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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

  readonly mapUrl = this.mapsService.mapUrl;
  readonly pois = this.mapsService.pois;
  readonly loading = this.mapsService.loading;
  readonly error = this.mapsService.error;

  ngOnInit(): void {
    this.mapsService.loadMap();
  }
}
