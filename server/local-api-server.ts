import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import { buildCompetitiveModes, RawPlaylist } from '../api/_lib/competitiveModes';
import { fetchAuthenticatedFortniteApi, fetchPublicFortniteApi, FortniteApiError, MissingApiKeyError } from '../api/_lib/fortniteApiClient';
import { resolveLocale } from '../api/_lib/locale';

// Cargar variables de entorno
const envPath = join(process.cwd(), '.env');
const envLocalPath = join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config({ path: envLocalPath });

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint de salud para verificar que el servidor funciona
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor API funcionando correctamente' });
});

function handleFortniteApiError(res: express.Response, context: string, error: unknown) {
  console.error(`Error ${context}:`, error);
  res.status(500).json({
    error: `Failed to ${context}`,
    details: error instanceof Error ? error.message : 'Unknown error',
  });
}

// GET /api/getNews
app.get('/api/getNews', async (req, res) => {
  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(`/v2/news?language=${lang}`);
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch news', error);
  }
});

// GET /api/getMapWithPois
app.get('/api/getMapWithPois', async (req, res) => {
  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(`/v1/map?language=${lang}`);
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch map with pois', error);
  }
});

// GET /api/getPlaylists
app.get('/api/getPlaylists', async (req, res) => {
  try {
    const lang = resolveLocale(req.query.lang);
    const { data } = await fetchPublicFortniteApi<{ data: RawPlaylist[] }>(`/v1/playlists?language=${lang}`);
    res.status(200).json({ status: 200, data: buildCompetitiveModes(data, lang) });
  } catch (error) {
    handleFortniteApiError(res, 'fetch playlists', error);
  }
});

// GET /api/getShop
app.get('/api/getShop', async (req, res) => {
  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(`/v2/shop?language=${lang}`);
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch shop', error);
  }
});

// GET /api/getPlayerStats
app.get('/api/getPlayerStats', async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const data = await fetchAuthenticatedFortniteApi(`/v2/stats/br/v2?name=${encodeURIComponent(name)}`);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return res.status(500).json({ error: 'Stats service is not configured. Set FORTNITE_API_COM_KEY in .env.' });
    }
    if (error instanceof FortniteApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    handleFortniteApiError(res, 'fetch player stats', error);
  }
});

// GET /api/getCosmetics
app.get('/api/getCosmetics', async (req, res) => {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const lang = resolveLocale(req.query.lang);
    const data = await fetchPublicFortniteApi(
      `/v2/cosmetics/br/search/all?name=${encodeURIComponent(name)}&matchMethod=contains&language=${lang}`
    );
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof FortniteApiError) {
      return res.status(error.status).json({ error: error.message });
    }
    handleFortniteApiError(res, 'fetch cosmetics', error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API local ejecutándose en http://localhost:${PORT}`);
});
