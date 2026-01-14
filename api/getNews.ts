import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(`https://fortnite-api.com/v2/news?language=en`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({ error: 'Failed to fetch active events' });
  }
}
