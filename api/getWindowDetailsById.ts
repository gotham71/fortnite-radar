import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const API_KEY = process.env.FORTNITE_API_KEY;
const BASE_URL = process.env.FORTNITE_API_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { windowId } = req.query;

  if (!windowId || typeof windowId !== 'string') {
    return res.status(400).json({ error: 'windowId is required' });
  }

  if (!API_KEY || !BASE_URL) {
    const missing = [];
    if (!API_KEY) missing.push('FORTNITE_API_KEY');
    if (!BASE_URL) missing.push('FORTNITE_API_URL_BASE');
    return res.status(500).json({
      error: 'Missing API_KEY or BASE_URL',
      missing: missing,
      message: `Missing environment variables: ${missing.join(', ')}. Please configure them in Vercel dashboard.`
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/events/window?windowId=${windowId}`, {
      headers: { Authorization: API_KEY },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching window details:', error);
    res.status(500).json({ error: 'Failed to fetch window details' });
  }
}
