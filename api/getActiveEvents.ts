import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const API_KEY = process.env.FORTNITE_API_KEY;
const BASE_URL = process.env.FORTNITE_API_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!API_KEY || !BASE_URL) {
    return res.status(500).json({ error: 'Missing API_KEY or BASE_URL' });
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/events/list/active?language=en`, {
      headers: { Authorization: API_KEY },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({ error: 'Failed to fetch active events' });
  }
}

