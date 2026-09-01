import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchAuthenticatedFortniteApi, FortniteApiError, MissingApiKeyError } from './_lib/fortniteApiClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const data = await fetchAuthenticatedFortniteApi(`/v2/stats/br/v2?name=${encodeURIComponent(name)}`);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return res.status(500).json({ error: 'Stats service is not configured' });
    }
    if (error instanceof FortniteApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
}
