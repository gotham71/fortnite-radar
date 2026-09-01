import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { PlayerModeStats } from '@fortnite-radar/models';
import { EventsStoreService, PlayerStatsStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-events',
  imports: [CommonModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Events implements OnInit {
  private eventsStore = inject(EventsStoreService);
  private statsStore = inject(PlayerStatsStoreService);

  readonly modes = this.eventsStore.modes;
  readonly loading = this.eventsStore.loading;
  readonly error = this.eventsStore.error;

  readonly playerStats = this.statsStore.stats;
  readonly statsLoading = this.statsStore.loading;
  readonly statsError = this.statsStore.error;

  readonly statsRows = computed(() => {
    const stats = this.playerStats();
    if (!stats) return [];
    const modes = stats.stats.all;
    const rows: { label: string; data: PlayerModeStats }[] = [
      { label: 'Overall', data: modes.overall },
      { label: 'Solo', data: modes.solo as PlayerModeStats },
      { label: 'Duo', data: modes.duo as PlayerModeStats },
      { label: 'Squad', data: modes.squad as PlayerModeStats },
    ];
    return rows.filter((row) => !!row.data);
  });

  ngOnInit() {
    this.eventsStore.getCompetitiveModes();
  }

  searchStats(event: Event, name: string) {
    event.preventDefault();
    this.statsStore.search(name);
  }
}
