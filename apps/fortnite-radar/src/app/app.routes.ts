import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {path: '', redirectTo: 'news', pathMatch: 'full'},
  {path: 'news', loadComponent: () => import('@fortnite-radar/news').then(m => m.News)},
  {
    path: 'events',
    children: [
      {path: '', loadComponent: () => import('@fortnite-radar/news').then(m => m.Events)},
      {path: ':id', loadComponent: () => import('@fortnite-radar/news').then(m => m.EventDetail)}
    ]
  },
  {path: 'maps', loadComponent: () => import('@fortnite-radar/news').then(m => m.Maps)},
];
