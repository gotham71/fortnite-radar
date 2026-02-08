import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const API_KEY = process.env.FORTNITE_API_KEY;
const BASE_URL = process.env.FORTNITE_API_URL_BASE;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Using fortnite-api.com directly as it's the standard for shop data
    // Usually it doesn't require an API key for public endpoints, but it's good practice
    // if using their specific key. However, the plan said to use the environment variable if applicable.
    // The previous endpoints used a different base URL structure.
    // Let's stick to the URL in the plan: https://fortnite-api.com/v2/shop/br
    const response = await fetch(`https://fortnite-api.com/v2/shop?language=en`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ error: 'Failed to fetch shop' });
  }
}
