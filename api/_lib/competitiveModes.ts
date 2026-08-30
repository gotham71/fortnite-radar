export interface RawPlaylist {
  id: string;
  name: string;
  subName?: string;
  description?: string;
  gameType: string;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
  added: string;
  images?: {
    showcase?: string;
  };
}

export interface CompetitiveMode {
  id: string;
  name: string;
  description?: string;
  gameType: string;
  teamSizes: string[];
  addedAt: string;
  image?: string;
  isTournament: boolean;
  isLimitedTimeMode: boolean;
}

/**
 * fortnite-api.com's /v1/playlists returns every playlist definition currently
 * shipped in the game (700+, including many identical team-size variants of the
 * same mode). We only care about the tournament/LTM ones, grouped by display
 * name, newest first - this is what stands in for "current events" now that
 * fortniteapi.io (the old source of scheduled competitive events) has shut down.
 */
export function buildCompetitiveModes(playlists: RawPlaylist[]): CompetitiveMode[] {
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

    return {
      id: latest.id,
      name,
      description: latest.description,
      gameType: latest.gameType.replace('EFortGameType::', ''),
      teamSizes,
      addedAt: latest.added,
      image: latest.images?.showcase,
      isTournament: variants.some((v) => v.isTournament),
      isLimitedTimeMode: variants.some((v) => v.isLimitedTimeMode),
    };
  });

  return modes.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
}
