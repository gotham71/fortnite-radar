import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildCompetitiveModes, RawPlaylist } from './_lib/competitiveModes';
import { fetchPublicFortniteApi } from './_lib/fortniteApiClient';
import { resolveLocale } from './_lib/locale';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lang = resolveLocale(req.query.lang);
    const { data } = await fetchPublicFortniteApi<{ data: RawPlaylist[] }>(`/v1/playlists?language=${lang}`);
    res.status(200).json({ status: 200, data: buildCompetitiveModes(data, lang) });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
}
