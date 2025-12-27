import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header, Loading } from '@fortnite-radar/ui';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [Header, Loading, RouterModule]
})
export class App {
  protected title = 'fortnite-radar';
}
