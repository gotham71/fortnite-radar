import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { groupsPlatforms, PlatformGroup } from '@fortnite-radar/groupsPlatforms';

@Component({
  selector: 'lib-platform-icons',
  imports: [CommonModule],
  templateUrl: './platform-icons.html',
  styleUrl: './platform-icons.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlatformIcons {
  @Input() platforms: string[] = [];

  get grouped(): PlatformGroup[] {
    return groupsPlatforms(this.platforms);
  }

  readonly platformIcons: Record<PlatformGroup, string> = {
    xbox: 'simple-icons:xbox',
    playstation: 'simple-icons:playstation',
    switch: 'simple-icons:nintendoswitch',
    pc: 'mdi:microsoft-windows',
    mac: 'mdi:apple',
    mobile: 'mdi:cellphone',
    cloud: 'mdi:cloud-circle',
    unknown: 'mdi:help-circle-outline',
  }
}
