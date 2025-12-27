import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamInfo } from '@fortnite-radar/models';
import { EventsStoreService } from '@fortnite-radar/store';
import { Flags } from '@fortnite-radar/ui';

@Component({
  selector: 'lib-event-detail',
  imports: [CommonModule, Flags],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventDetail implements OnInit, OnDestroy {
  private eventsStore = inject(EventsStoreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly windowDetails = computed(() => {
    return this.eventsStore.windowDetails()?.session;
  });

  readonly windowResultsDetails = computed(() => {
    return this.eventsStore.windowDetails()?.session?.results.map(result => {
      return {
        eventId: result.eventId,
        eventWindowId: result.eventWindowId,
        team: result.teamAccountNames.map((player: TeamInfo) => ({
          id: player.id,
          name: player.name,
          flag: result.playerFlagTokens[player.id] ?? null
        })),
        pointsEarned: result.pointsEarned,
        score: result.score,
        rank: result.rank,
        percentile: result.percentile,
        pointBreakdown: result.pointBreakdown
      };
    });
  });

  readonly windowResultsDetailsZero = computed(() => {
    const session = this.eventsStore.windowDetails()?.session;
    if (!session || !session.results?.length) return null;
    const result = session.results[0];

      return {
        eventId: result.eventId,
        eventWindowId: result.eventWindowId,
        team: result.teamAccountNames.map((player: TeamInfo) => ({
          id: player.id,
          name: player.name,
          flag: result.playerFlagTokens[player.id] ?? null
        })),
        pointsEarned: result.pointsEarned,
        score: result.score,
        rank: result.rank,
        percentile: result.percentile
      };

  });

  readonly windowId = computed(() => {
    const windowIdFromParam = this.route.snapshot.paramMap.get('id');
    if (!windowIdFromParam) return null;
    return windowIdFromParam;
  });

  private logEffect = effect(() => {
    console.log("📅 Window id:", this.windowId());
    console.log("📅 Window details:", this.windowDetails());
    console.log("📅 Window Results details:", this.windowResultsDetailsZero());
  });

  ngOnInit() {
    const windowId = this.windowId();
    if (windowId) {
      this.eventsStore.getWindowDetailsById(windowId);
    }
  }

  ngOnDestroy() {
    this.logEffect.destroy();
  }

  getEventImage(event: any): string {
    return event?.poster || event?.tileImage || event?.loadingScreen || '/bg-no-image.png';
  }

  hasFinishedWindowId(endTime: string): boolean {
    const today = new Date().getTime();
    const endTimeToDate = new Date(endTime).getTime();
    return today > endTimeToDate;
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  trackByWindowId(index: number, window: any): string {
    return window.windowId;
  }

  openWindowDetails(window: any): void {
    console.log('Abriendo detalles de la ventana:', window);
  }
}
