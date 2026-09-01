import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPublicFortniteApi } from './_lib/fortniteApiClient';
import { resolveLocale } from './_lib/locale';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(`/v1/map?language=${lang}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching map with pois:', error);
    res.status(500).json({ error: 'Failed to fetch map with pois' });
  }
}
