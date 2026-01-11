import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { LeaderboardEntry, PointBreakDown, Rule, TorunamentWindowScoring, TournamentEntry, TournamentResponse, TournamentWindowResponse } from "@fortnite-radar/models";
import { finalize, Observable } from "rxjs";
import { LoadingStoreService } from "./loading-store.service";

@Injectable({ providedIn: 'root' })
export class EventsStoreService {
  private http = inject(HttpClient);
  private readonly _eventsActive = signal<TournamentResponse | null>(null);
  private readonly _allEvents = signal<TournamentResponse | null>(null);
  private readonly _eventDetails = signal<TournamentEntry | null>(null);
  private readonly _windowDetails = signal<TournamentWindowResponse | null>(null);
  private readonly _eventRules = signal<Rule | null>(null);
  private readonly _eventLeaderboard = signal<LeaderboardEntry | null>(null);
  private readonly isLoading = inject(LoadingStoreService);
  readonly allEvents = computed(() => this._allEvents());
  readonly eventsActive = computed(() => this._eventsActive());
  readonly eventDetails = computed(() => this._eventDetails());
  readonly eventRules = computed(() => this._eventRules());
  readonly eventLeaderboard = computed(() => this._eventLeaderboard());
  readonly windowDetails = computed(() => this._windowDetails());

  private withLoading<T>(obs$: Observable<T>): Observable<T> {
    this.isLoading.showLoading();
    return obs$.pipe(finalize(() => this.isLoading.hideLoading()));
  }

  readonly events = computed<TournamentEntry[]>(() => {
    const items = this.allEvents()?.events ?? [];
    return items;
  });


  getAllEvents() {
    console.log('getAllEvents');
    this.withLoading(this.http.get<TournamentResponse>(`/api/getAllEvents`))
      .subscribe({
        next: (response) => {
          console.log('response: ', response);
          this._allEvents.set(response);
        },
        error: (error) => {
          console.error('Failed to load All Events:', error);
          this._allEvents.set(null);
        }
      })
  }

  getActiveEvents() {
    this.withLoading(this.http.get<TournamentResponse>(`/api/getActiveEvents`))
      .subscribe({
        next: (response) => {
        this._eventsActive.set(response);
      },
      error: (error) => {
        console.error('Failed to load Active Events:', error);
        this._eventsActive.set(null);
      }
    });
  }

  /* getEventDetailsById(eventId: string) {
    this.http.get<TournamentEntry>(this.getEventsActiveUrl + `/events/detail/${eventId}?language=en`, {
      headers: {
        Authorization: this.apiKey
      }
    }).subscribe({
      next: (response) => {
        this._eventDetails.set(response);
      },
      error: (error) => {
        console.error('Failed to load Event Details:', error);
        this._eventDetails.set(null);
      }
    });
  }

   getRules(eventId: string) {
    this.http.get<Rule>(this.getEventsActiveUrl + `/events/rules/${eventId}?language=en`, {
      headers: {
        Authorization: this.apiKey
      }
    }).subscribe({
      next: (response) => {
        this._eventRules.set(response);
      },
      error: (error) => {
        console.error('Failed to load Rules:', error);
        this._eventRules.set(null);
      }
    });
  }

  getLeaderboard(eventId: string, windowId: string) {
    this.http.get<LeaderboardEntry>(this.getEventsActiveUrl + `/events/leaderboard/${eventId}/${windowId}?language=en`, {
      headers: {
        Authorization: this.apiKey
      }
    }).subscribe({
      next: (response) => {
        this._eventLeaderboard.set(response);
      },
      error: (error) => {
        console.error('Failed to load Leaderboard:', error);
        this._eventLeaderboard.set(null);
      }
    });
  } */

  getWindowDetailsById(windowId: string) {
    this.withLoading(
      this.http.get<TournamentWindowResponse>(`/api/getWindowDetailsById?windowId=${windowId}`)
    ).subscribe({
      next: (response) => {
        this._windowDetails.set(response);
      },
      error: (error) => {
        console.error('Failed to load Event Details:', error);
        this._windowDetails.set(null);
      }
    });
  }

  calculateTotalPoints(stats: PointBreakDown, scoringRules: TorunamentWindowScoring[]): number {
    let totalPoints = 0;

    for (const rule of scoringRules) {
      for (const tier of rule.rewardTiers) {
        const statKeyPrefix = `${rule.trackedStat}:${tier.keyValue}`;
        const matchingKeys = Object.keys(stats).filter(key => key.startsWith(rule.trackedStat));

        for (const key of matchingKeys) {
          const index = parseInt(key.split(":")[1]);
          const stat = stats[key];

          const match =
            rule.matchRule === "lte" ? index <= tier.keyValue :
            rule.matchRule === "gte" ? index >= tier.keyValue : false;

          if (match) {
            const earned = tier.multiplicative
              ? stat.timesAchieved * tier.pointsEarned
              : tier.pointsEarned;

            totalPoints += earned;
            break; // Solo aplica el primer tier que coincide
          }
        }
      }
    }

    return totalPoints;
  }


}
