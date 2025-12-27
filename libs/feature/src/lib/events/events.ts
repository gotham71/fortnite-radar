import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsStoreService } from '@fortnite-radar/store';
import { PlatformIcons } from '@fortnite-radar/ui';

@Component({
  selector: 'lib-events',
  imports: [CommonModule, PlatformIcons],
  templateUrl: './events.html',
  styleUrl: './events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Events implements OnInit, OnDestroy {
  private eventsStore = inject(EventsStoreService);
  private router = inject(Router);
  //readonly events = this.eventsStore.events;

  readonly events = computed(() => {
    const today = new Date();
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(today.getDate() - 15);

    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    return this.eventsStore.events()
      .filter(event =>
        new Date(event.endTime) >= fifteenDaysAgo &&
        new Date(event.endTime) <= oneWeekLater
      )
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()) // más recientes arriba
      //.slice(0, 5); // solo los 5 más recientes
  });


  private logEffect = effect(() => {
    console.log("📅 Eventos actualizados:", this.events());
  });
  ngOnInit() {
    this.eventsStore.getAllEvents();
  }
  ngOnDestroy() {
    this.logEffect.destroy(); // Clean up effect
  }

  getEventImage(event: any): string {
    return event?.poster || event?.tileImage || event?.loadingScreen || '/bg-no-image.png';
  }

  hasFinishedWindowId(endTime:string):boolean {
    const today = new Date().getTime();
    const endTimeToDate = new Date(endTime).getTime();
    return today > endTimeToDate;
  }

  openEventDetail(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

}
