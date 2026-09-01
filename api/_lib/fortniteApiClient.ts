import fetch, { Response } from 'node-fetch';

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

async function parseOrThrow<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new FortniteApiError(response.status, body?.error ?? `HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Calls the public, unauthenticated fortnite-api.com backend (news, shop, map, playlists, cosmetics).
 */
export async function fetchPublicFortniteApi<T = unknown>(path: string): Promise<T> {
  const response = await fetch(`https://fortnite-api.com${path}`);
  return parseOrThrow<T>(response);
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
  return parseOrThrow<T>(response);
}
