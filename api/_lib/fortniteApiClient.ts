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
