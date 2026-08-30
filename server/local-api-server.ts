import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import { buildCompetitiveModes, RawPlaylist } from '../api/_lib/competitiveModes';
import { fetchPublicFortniteApi } from '../api/_lib/fortniteApiClient';

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
    const data = await fetchPublicFortniteApi('/v2/news?language=en');
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch news', error);
  }
});

// GET /api/getMapWithPois
app.get('/api/getMapWithPois', async (req, res) => {
  try {
    const data = await fetchPublicFortniteApi('/v1/map');
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch map with pois', error);
  }
});

// GET /api/getPlaylists
app.get('/api/getPlaylists', async (req, res) => {
  try {
    const { data } = await fetchPublicFortniteApi<{ data: RawPlaylist[] }>('/v1/playlists');
    res.status(200).json({ status: 200, data: buildCompetitiveModes(data) });
  } catch (error) {
    handleFortniteApiError(res, 'fetch playlists', error);
  }
});

// GET /api/getShop
app.get('/api/getShop', async (req, res) => {
  try {
    const data = await fetchPublicFortniteApi('/v2/shop?language=en');
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch shop', error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API local ejecutándose en http://localhost:${PORT}`);
});
