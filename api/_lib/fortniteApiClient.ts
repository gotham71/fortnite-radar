import fetch from 'node-fetch';

// Read lazily (not at module load) so this works whether the caller loads
// .env via dotenv before or after importing this module.
function getApiKey(): string | undefined {
  return process.env.FORTNITE_API_KEY;
}

function getBaseUrl(): string | undefined {
  return process.env.FORTNITE_API_URL_BASE;
}

export class MissingEnvError extends Error {
  constructor(public readonly missing: string[]) {
    super(`Missing environment variables: ${missing.join(', ')}`);
  }
}

export function getMissingEnvVars(): string[] {
  const missing: string[] = [];
  if (!getApiKey()) missing.push('FORTNITE_API_KEY');
  if (!getBaseUrl()) missing.push('FORTNITE_API_URL_BASE');
  return missing;
}

/**
 * Calls the authenticated fortniteapi.io backend (competitive events, POIs).
 * Throws MissingEnvError if FORTNITE_API_KEY/FORTNITE_API_URL_BASE aren't configured.
 */
export async function fetchFromFortniteApi<T = unknown>(path: string): Promise<T> {
  const missing = getMissingEnvVars();
  if (missing.length > 0) {
    throw new MissingEnvError(missing);
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: { Authorization: getApiKey() as string },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/**
 * Calls the public, unauthenticated fortnite-api.com backend (news, shop).
 */
export async function fetchPublicFortniteApi<T = unknown>(path: string): Promise<T> {
  const response = await fetch(`https://fortnite-api.com${path}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
