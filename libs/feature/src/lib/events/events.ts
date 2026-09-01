import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject } from '@angular/core';
import { PlayerModeStats } from '@fortnite-radar/models';
import { EventsStoreService, LocaleService, PlayerStatsStoreService } from '@fortnite-radar/store';
import { TranslatePipe } from '@fortnite-radar/ui';

interface ModeVisual {
  icon: string;
  containerClass: string;
}

/**
 * fortnite-api.com's playlists barely ever include artwork (see buildCompetitiveModes),
 * so each gameType gets a generic, open-source icon (Iconify/MDI, MIT-licensed - no
 * Fortnite/Epic branding) instead of a broken image or a single repeated placeholder.
 */
const GAME_TYPE_VISUALS: Record<string, ModeVisual> = {
  BRArena: { icon: 'mdi:sword-cross', containerClass: 'bg-gradient-to-br from-amber-500/30 to-black/40' },
  BlastBerry: { icon: 'mdi:lightning-bolt', containerClass: 'bg-gradient-to-br from-fuchsia-500/30 to-black/40' },
  ForbiddenFruit: { icon: 'mdi:run-fast', containerClass: 'bg-gradient-to-br from-rose-500/30 to-black/40' },
  Figment: { icon: 'mdi:account-group', containerClass: 'bg-gradient-to-br from-sky-500/30 to-black/40' },
  VKPlay: { icon: 'mdi:gamepad-variant', containerClass: 'bg-gradient-to-br from-emerald-500/30 to-black/40' },
  Delulu: { icon: 'mdi:emoticon-cool-outline', containerClass: 'bg-gradient-to-br from-violet-500/30 to-black/40' },
};

const DEFAULT_MODE_VISUAL: ModeVisual = { icon: 'mdi:trophy-outline', containerClass: 'bg-gradient-to-br from-yellow-500/20 to-black/40' };

@Component({
  selector: 'lib-events',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Events {
  private eventsStore = inject(EventsStoreService);
  private statsStore = inject(PlayerStatsStoreService);
  private localeService = inject(LocaleService);

  readonly modes = this.eventsStore.modes;
  readonly loading = this.eventsStore.loading;
  readonly error = this.eventsStore.error;
  readonly locale = this.localeService.locale;

  readonly playerStats = this.statsStore.stats;
  readonly statsLoading = this.statsStore.loading;
  readonly statsError = this.statsStore.error;

  readonly statsRows = computed(() => {
    const stats = this.playerStats();
    if (!stats) return [];
    const modes = stats.stats.all;
    const rows: { labelKey: string; data: PlayerModeStats }[] = [
      { labelKey: 'events.rowOverall', data: modes.overall },
      { labelKey: 'events.rowSolo', data: modes.solo as PlayerModeStats },
      { labelKey: 'events.rowDuo', data: modes.duo as PlayerModeStats },
      { labelKey: 'events.rowSquad', data: modes.squad as PlayerModeStats },
    ];
    return rows.filter((row) => !!row.data);
  });

  constructor() {
    effect(() => {
      this.localeService.locale();
      this.eventsStore.getCompetitiveModes();
    });
  }

  searchStats(event: Event, name: string) {
    event.preventDefault();
    this.statsStore.search(name);
  }

  getModeVisual(gameType: string): ModeVisual {
    return GAME_TYPE_VISUALS[gameType] ?? DEFAULT_MODE_VISUAL;
  }
}
