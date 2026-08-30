import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { EventsStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-events',
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Events implements OnInit {
  private eventsStore = inject(EventsStoreService);

  readonly modes = this.eventsStore.modes;
  readonly loading = this.eventsStore.loading;
  readonly error = this.eventsStore.error;

  ngOnInit() {
    this.eventsStore.getCompetitiveModes();
  }
}
