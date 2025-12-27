export type PlatformGroup = 'xbox' | 'playstation' | 'switch' | 'pc' | 'mac' | 'mobile' | 'cloud' | 'unknown';

export function groupsPlatforms(platforms: string[]): PlatformGroup[] {
  const normalized: Set<PlatformGroup> = new Set();

  platforms.forEach((p) => {
    if(/^xbox/i.test(p)) {
      normalized.add('xbox');
    } else if (/^ps\d/i.test(p)) {
      normalized.add('playstation');
    } else if (/^switch/i.test(p)) {
      normalized.add('switch');
    } else if (p === 'Windows') {
      normalized.add('pc');
    } else if (p === 'Mac') {
      normalized.add('mac');
    } else if (p === 'Android' || p === 'IOS') {
      normalized.add('mobile');
    } else if (['GFN', 'GFNMobile', 'XCloud', 'XCloudMobile', 'Luna', 'LunaMobile', 'Helios', 'HeliosMobile'].includes(p)) {
      normalized.add('cloud');
    } else {
      normalized.add('unknown');
    }
  });

  return Array.from(normalized);
}
