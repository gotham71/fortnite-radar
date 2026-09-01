import fetch from 'node-fetch';

/**
 * Calls the public, unauthenticated fortnite-api.com backend (news, shop, map, playlists).
 */
export async function fetchPublicFortniteApi<T = unknown>(path: string): Promise<T> {
  const response = await fetch(`https://fortnite-api.com${path}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export class MissingApiKeyError extends Error {
  constructor() {
    super('FORTNITE_API_COM_KEY is not configured');
  }
}

export class FortniteApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

/**
 * Calls fortnite-api.com endpoints that require a personal API key (e.g. player stats).
 * Get a free key at https://dash.fortnite-api.com and set FORTNITE_API_COM_KEY.
 */
export async function fetchAuthenticatedFortniteApi<T = unknown>(path: string): Promise<T> {
  const apiKey = process.env.FORTNITE_API_COM_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }

  const response = await fetch(`https://fortnite-api.com${path}`, {
    headers: { Authorization: apiKey },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new FortniteApiError(response.status, body?.error ?? `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
