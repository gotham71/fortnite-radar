import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocaleService } from '@fortnite-radar/store';
import { TranslatePipe } from '../translate/translate.pipe';


@Component({
  selector: 'lib-header',
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})

export class Header {
  private localeService = inject(LocaleService);

  readonly menuOpen = signal(false);
  readonly locale = this.localeService.locale;

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleLocale() {
    this.localeService.toggleLocale();
  }
}
