import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPublicFortniteApi, FortniteApiError } from './_lib/fortniteApiClient';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const data = await fetchPublicFortniteApi(
      `/v2/cosmetics/br/search/all?name=${encodeURIComponent(name)}&matchMethod=contains`
    );
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof FortniteApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error('Error fetching cosmetics:', error);
    res.status(500).json({ error: 'Failed to fetch cosmetics' });
  }
}
