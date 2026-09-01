import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resolveLocale } from './_lib/locale';
import { fetchPublicFortniteApi } from './_lib/fortniteApiClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(`/v2/shop?language=${lang}`);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ error: 'Failed to fetch shop' });
  }
}
