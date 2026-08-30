import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {path: '', redirectTo: 'news', pathMatch: 'full'},
  {path: 'news', title: 'News · Fortnite Radar', loadComponent: () => import('@fortnite-radar/news').then(m => m.News)},
  {path: 'events', title: 'Competitive Modes · Fortnite Radar', loadComponent: () => import('@fortnite-radar/news').then(m => m.Events)},
  {path: 'maps', title: 'Map · Fortnite Radar', loadComponent: () => import('@fortnite-radar/news').then(m => m.Maps)},
  {path: 'shop', title: 'Shop · Fortnite Radar', loadComponent: () => import('@fortnite-radar/news').then(m => m.Shop)},
];
