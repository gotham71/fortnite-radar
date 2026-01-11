import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const API_KEY = process.env.FORTNITE_API_KEY;
const BASE_URL = process.env.FORTNITE_API_URL;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if(!API_KEY || !BASE_URL) {
        const missing = [];
        if (!API_KEY) missing.push('FORTNITE_API_KEY');
        if (!BASE_URL) missing.push('FORTNITE_API_URL_BASE');
        return res.status(500).json({
            error: 'API key or base URL not found',
            missing: missing,
            message: `Missing environment variables: ${missing.join(', ')}. Please configure them in Vercel dashboard.`
        });
    }

    try {
        const response = await fetch(`${BASE_URL}/v1/events/list?language=en`, {
            headers: {
                Authorization: API_KEY
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching all events:', error);
        return res.status(500).json({ error: 'Failed to fetch active events' });
    }
}
