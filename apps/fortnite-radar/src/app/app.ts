import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header, TranslatePipe } from '@fortnite-radar/ui';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true,
  imports: [Header, RouterModule, TranslatePipe]
})
export class App {
  protected title = 'fortnite-radar';
}
