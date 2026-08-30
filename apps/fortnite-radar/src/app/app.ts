import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '@fortnite-radar/ui';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [Header, RouterModule]
})
export class App {
  protected title = 'fortnite-radar';
}
