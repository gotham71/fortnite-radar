import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';

@Component({
  selector: 'lib-flags',
  imports: [CommonModule],
  templateUrl: './flags.html',
  styleUrl: './flags.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flags {
  private readonly cdr = inject(ChangeDetectorRef);

  private countries: Record<string, string> = {};
  private countriesLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  readonly FLAGS_URL = 'https://flagcdn.com/w40';
  flagCodeName = '';
  countryName = '';
  /** true mientras se cargan countries.json o se resuelve el código */
  loading = false;
  /** true cuando la imagen de la bandera ha fallado (404, red, etc.) */
  imageError = false;
  /** false hasta que la imagen dispare load (evita flash vacío) */
  imageLoaded = false;

  @Input() set country(value: string) {
    this.updateFlag(value ?? '');
  }

  get urlFlag(): string {
    return this.flagCodeName && !this.imageError
      ? `${this.FLAGS_URL}/${this.flagCodeName}.png`
      : '';
  }

  get showPlaceholder(): boolean {
    return !this.flagCodeName || this.imageError || this.loading;
  }

  private getLastPart(input: string): string {
    return input.split('_').pop() ?? '';
  }

  private getCountryCodeByName(name: string): string {
    const normalized = (s: string) => s.replace(/\s+/g, '').toLowerCase();
    const entry = Object.entries(this.countries).find(
      ([, value]) => normalized(value) === normalized(name)
    );
    this.countryName = entry ? entry[1] : '';
    return entry ? entry[0] : '';
  }

  private ensureCountriesLoaded(): Promise<void> {
    if (this.countriesLoaded) return Promise.resolve();
    if (!this.loadingPromise) {
      this.loadingPromise = fetch('/countries.json')
        .then((r) => r.json())
        .then((json) => {
          this.countries = json;
          this.countriesLoaded = true;
        })
        .catch((err) => {
          console.error('Error loading countries:', err);
          this.countries = {};
          this.countriesLoaded = true;
        });
    }
    return this.loadingPromise;
  }

  private async updateFlag(raw: string): Promise<void> {
    const countryName = this.getLastPart(raw);
    this.imageError = false;
    this.imageLoaded = false;
    if (!countryName) {
      this.flagCodeName = '';
      this.countryName = '';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    await this.ensureCountriesLoaded();
    this.flagCodeName = this.getCountryCodeByName(countryName);
    this.loading = false;
    this.cdr.markForCheck();
  }

  onFlagImageLoad(): void {
    this.imageError = false;
    this.imageLoaded = true;
    this.cdr.markForCheck();
  }

  onFlagImageError(): void {
    this.imageError = true;
    this.imageLoaded = false;
    this.cdr.markForCheck();
  }
}
