import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-flags',
  imports: [CommonModule],
  templateUrl: './flags.html',
  styleUrl: './flags.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Flags implements OnInit {
  private countries: Record<string, string> = {};
  private countriesLoaded = false;
  private loadingPromise?: Promise<void>;
  private FLAGS_URL = 'https://flagcdn.com/w40';
  flagCodeName = '';
  countryName = '';
  private cdr = inject(ChangeDetectorRef);

  @Input() set country(value: string) {
    this.updateFlag(value ?? '');
  }

  ngOnInit() {
    this.loadCountries();

   /*  if (this.countries && this.country) {
      const country = this.getLastPart(this.country);
      console.log("🚀 ~ Flags ~ ngOnInit ~ country:", country)
      this.flagCodeName = this.getCountryCodeByName(country);
    } */
  }

  private async loadCountries() {
    try {
      const response = await fetch('/countries.json');
      this.countries = await response.json();
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  }

  get urlFlag(): string {
    return this.flagCodeName ? `${this.FLAGS_URL}/${this.flagCodeName}.png` : '';
  }

  getLastPart(input: string): string {
    return input.split('_').pop() ?? '';
  }

  getCountryCodeByName(name: string): string {
    const entry = Object.entries(this.countries).find(
      ([, value]) => value.replace(/\s+/g, '').toLowerCase() === name.toLowerCase()
    );
    this.countryName = entry ? entry[1] : '';
    return entry ? entry[0] : '';
  }

  private async ensureCountriesLoaded(): Promise<void> {
    if (this.countriesLoaded) return;
    if (!this.loadingPromise) {
      // Si tu JSON está en src/assets/countries.json:
      this.loadingPromise = fetch('/countries.json')
        .then(r => r.json())
        .then(json => {
          this.countries = json;
          this.countriesLoaded = true;
        })
        .catch(err => {
          console.error('Error loading countries:', err);
          this.countries = {};
          this.countriesLoaded = true;
        });
    }
    await this.loadingPromise;
  }

  private async updateFlag(raw: string) {
    const countryName = this.getLastPart(raw);
    if (!countryName) {
      this.flagCodeName = '';
      this.cdr.markForCheck();
      return;
    }

    await this.ensureCountriesLoaded();

    this.flagCodeName = this.getCountryCodeByName(countryName);
    this.cdr.markForCheck(); // necesario si usas OnPush
  }
}
