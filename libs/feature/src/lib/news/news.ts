import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { Motd } from '@fortnite-radar/models';
import { NewsStoreService } from '@fortnite-radar/store';

@Component({
  selector: 'lib-news',
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  standalone: true
})
export class News implements OnInit {
  private newsStore = inject(NewsStoreService);
  readonly motds = this.newsStore.motds;
  readonly motdsCarroussel = this.newsStore.motdsCarroussel;
  hitNew!: Motd;

  private logEffect = effect(() => {
    this.hitNew = this.motds()[0];
    
    console.log(this.motdsCarroussel());
    //this.motds().shift();
  });

  ngOnInit() {
    this.newsStore.loadNews();
  }
}
