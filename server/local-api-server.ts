import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import { fetchFromFortniteApi, fetchPublicFortniteApi, MissingEnvError } from '../api/_lib/fortniteApiClient';

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
  if (error instanceof MissingEnvError) {
    return res.status(500).json({
      error: 'Missing API_KEY or BASE_URL',
      missing: error.missing,
      message: `${error.message}. Please configure them in .env file.`,
    });
  }
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

// GET /api/getActiveEvents
app.get('/api/getActiveEvents', async (req, res) => {
  try {
    const data = await fetchFromFortniteApi('/v1/events/list/active?language=en');
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch active events', error);
  }
});

// GET /api/getAllEvents
app.get('/api/getAllEvents', async (req, res) => {
  try {
    const data = await fetchFromFortniteApi('/v1/events/list?language=en');
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch all events', error);
  }
});

// GET /api/getWindowDetailsById
app.get('/api/getWindowDetailsById', async (req, res) => {
  const { windowId } = req.query;

  if (!windowId || typeof windowId !== 'string') {
    return res.status(400).json({ error: 'windowId is required' });
  }

  try {
    const data = await fetchFromFortniteApi(`/v1/events/window?windowId=${windowId}`);
    res.status(200).json(data);
  } catch (error) {
    handleFortniteApiError(res, 'fetch window details', error);
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
  console.log(`📝 Variables de entorno cargadas:`);
  console.log(`   - FORTNITE_API_KEY: ${process.env.FORTNITE_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`   - FORTNITE_API_URL_BASE: ${process.env.FORTNITE_API_URL_BASE ? '✅ Configurada' : '❌ No configurada'}`);
});
