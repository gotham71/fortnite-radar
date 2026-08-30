import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchFromFortniteApi, MissingEnvError } from './_lib/fortniteApiClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { windowId } = req.query;

  if (!windowId || typeof windowId !== 'string') {
    return res.status(400).json({ error: 'windowId is required' });
  }

  try {
    const data = await fetchFromFortniteApi(`/v1/events/window?windowId=${windowId}`);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof MissingEnvError) {
      return res.status(500).json({
        error: 'Missing API_KEY or BASE_URL',
        missing: error.missing,
        message: `${error.message}. Please configure them in Vercel dashboard.`,
      });
    }
    console.error('Error fetching window details:', error);
    res.status(500).json({ error: 'Failed to fetch window details' });
  }
}
