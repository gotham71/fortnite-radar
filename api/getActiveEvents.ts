import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromFortniteApi, MissingEnvError } from './_lib/fortniteApiClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await fetchFromFortniteApi('/v1/events/list/active?language=en');
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return res.status(500).json({
        error: 'Missing API_KEY or BASE_URL',
        missing: error.missing,
        message: `${error.message}. Please configure them in Vercel dashboard.`,
      });
    }
    console.error('Error fetching active events:', error);
    res.status(500).json({ error: 'Failed to fetch active events' });
  }
}
