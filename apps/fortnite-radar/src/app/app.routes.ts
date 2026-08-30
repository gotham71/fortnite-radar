import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {path: '', redirectTo: 'news', pathMatch: 'full'},
  {path: 'news', loadComponent: () => import('@fortnite-radar/news').then(m => m.News)},
  {path: 'events', loadComponent: () => import('@fortnite-radar/news').then(m => m.Events)},
  {path: 'maps', loadComponent: () => import('@fortnite-radar/news').then(m => m.Maps)},
  {path: 'shop', loadComponent: () => import('@fortnite-radar/news').then(m => m.Shop)},
];
