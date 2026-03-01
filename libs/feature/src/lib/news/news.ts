import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
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
  private readonly allMotds = this.newsStore.motds;

  readonly hitNew = computed(() => this.allMotds()[0]);
  readonly motds = computed(() => this.allMotds().slice(1));

  ngOnInit() {
    this.newsStore.getNewsList();
  }
}
