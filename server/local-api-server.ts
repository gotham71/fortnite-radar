import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import { join } from 'path';

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

const API_KEY = process.env.FORTNITE_API_KEY;
const BASE_URL = process.env.FORTNITE_API_URL_BASE;

// Helper para manejar errores de variables de entorno
function checkEnvVars() {
  const missing: string[] = [];
  if (!API_KEY) missing.push('FORTNITE_API_KEY');
  if (!BASE_URL) missing.push('FORTNITE_API_URL_BASE');
  return missing;
}

// GET /api/getNews
app.get('/api/getNews', async (req, res) => {
  try {
    const response = await fetch(`https://fortnite-api.com/v2/news?language=en`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/getMapWithPois
app.get('/api/getMapWithPois', async (req, res) => {
  const missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(500).json({
      error: 'Missing API_KEY or BASE_URL',
      missing: missing,
      message: `Missing environment variables: ${missing.join(', ')}. Please configure them in .env file.`
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/v2/game/poi?lang=en`, {
      headers: { Authorization: API_KEY as string },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching map with pois:', error);
    res.status(500).json({ 
      error: 'Failed to fetch map with pois',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/getActiveEvents
app.get('/api/getActiveEvents', async (req, res) => {
  const missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(500).json({
      error: 'Missing API_KEY or BASE_URL',
      missing: missing,
      message: `Missing environment variables: ${missing.join(', ')}. Please configure them in .env file.`
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/events/list/active?language=en`, {
      headers: { Authorization: API_KEY as string },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching active events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch active events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/getAllEvents
app.get('/api/getAllEvents', async (req, res) => {
  const missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(500).json({
      error: 'API key or base URL not found',
      missing: missing,
      message: `Missing environment variables: ${missing.join(', ')}. Please configure them in .env file.`
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/events/list?language=en`, {
      headers: {
        Authorization: API_KEY as string
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch all events',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/getWindowDetailsById
app.get('/api/getWindowDetailsById', async (req, res) => {
  const { windowId } = req.query;

  if (!windowId || typeof windowId !== 'string') {
    return res.status(400).json({ error: 'windowId is required' });
  }

  const missing = checkEnvVars();
  if (missing.length > 0) {
    return res.status(500).json({
      error: 'Missing API_KEY or BASE_URL',
      missing: missing,
      message: `Missing environment variables: ${missing.join(', ')}. Please configure them in .env file.`
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/events/window?windowId=${windowId}`, {
      headers: { Authorization: API_KEY as string },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching window details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch window details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/getShop
app.get('/api/getShop', async (req, res) => {
  try {
    // Note: User modified api/getShop.ts to use /v2/shop instead of /v2/shop/br
    const response = await fetch(`https://fortnite-api.com/v2/shop?language=en`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shop',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API local ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Variables de entorno cargadas:`);
  console.log(`   - FORTNITE_API_KEY: ${API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`   - FORTNITE_API_URL_BASE: ${BASE_URL ? '✅ Configurada' : '❌ No configurada'}`);
});
