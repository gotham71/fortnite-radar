export interface RawPlaylist {
  id: string;
  name: string;
  subName?: string;
  description?: string;
  gameType: string;
  maxPlayers?: number;
  maxTeamSize?: number;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
  added: string;
  gameplayTags?: string[];
  images?: {
    showcase?: string;
  };
}

export interface CompetitiveMode {
  id: string;
  name: string;
  description?: string;
  gameType: string;
  teamSizeLabel: string;
  maxPlayers?: number;
  noBuild: boolean;
  addedAt: string;
  image?: string;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
}

const NO_BUILD_TAG = 'Athena.Playlist.NoBuildingMaterials';

const TEAM_SIZE_NAMES: Record<'en' | 'es', Record<number, string>> = {
  en: { 1: 'Solo', 2: 'Duo', 3: 'Trio', 4: 'Squad' },
  es: { 1: 'Individual', 2: 'Dúo', 3: 'Trío', 4: 'Escuadra' },
};

function teamSizeLabelFromCount(count: number, lang: 'en' | 'es'): string {
  return TEAM_SIZE_NAMES[lang][count] ?? `${count}-player teams`;
}

/**
 * fortnite-api.com's /v1/playlists returns every playlist definition currently
 * shipped in the game (700+, including many identical team-size variants of the
 * same mode). We only care about the tournament/LTM ones, grouped by display
 * name, newest first - this is what stands in for "current events" now that
 * fortniteapi.io (the old source of scheduled competitive events) has shut down.
 *
 * `lang` only affects the synthesized team-size fallback label (used when a
 * playlist variant has no subName) - everything else read off `playlists` is
 * already in the requested language, since the caller fetched them with
 * ?language={lang}.
 */
export function buildCompetitiveModes(playlists: RawPlaylist[], lang: 'en' | 'es' = 'en'): CompetitiveMode[] {
  const relevant = playlists.filter(
    (p) => (p.isTournament || p.isLimitedTimeMode) && !p.name.startsWith('[PH]')
  );

  const groups = new Map<string, RawPlaylist[]>();
  for (const playlist of relevant) {
    const variants = groups.get(playlist.name) ?? [];
    variants.push(playlist);
    groups.set(playlist.name, variants);
  }

  const modes = Array.from(groups.entries()).map(([name, variants]) => {
    const latest = variants.reduce((a, b) => (new Date(a.added) > new Date(b.added) ? a : b));
    const teamSizes = Array.from(new Set(variants.map((v) => v.subName).filter((s): s is string => !!s)));
    const teamSizeLabel = teamSizes.length
      ? teamSizes.join(' · ')
      : teamSizeLabelFromCount(latest.maxTeamSize ?? 1, lang);

    return {
      id: latest.id,
      name,
      description: latest.description,
      gameType: latest.gameType.replace('EFortGameType::', ''),
      teamSizeLabel,
      maxPlayers: latest.maxPlayers,
      noBuild: variants.some((v) => v.gameplayTags?.includes(NO_BUILD_TAG)),
      addedAt: latest.added,
      image: latest.images?.showcase,
      isTournament: variants.some((v) => v.isTournament),
      isLimitedTimeMode: variants.some((v) => v.isLimitedTimeMode),
    };
  });

  return modes.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}
