# Servidor API Local

Este servidor permite ejecutar las funciones de API localmente para desarrollo.

## Instalación

Primero, instala las dependencias necesarias:

```bash
npm install
```

## Uso

### Iniciar el servidor API

En una terminal, ejecuta:

```bash
npm run api:dev
```

El servidor se iniciará en `http://localhost:3001`

### Iniciar la aplicación Angular

En otra terminal, ejecuta:

```bash
npx nx serve fortnite-radar
```

La aplicación Angular estará disponible en `http://localhost:4200` y las llamadas a `/api/*` se redirigirán automáticamente al servidor local.

## Variables de Entorno

Asegúrate de tener un archivo `.env` en la raíz del proyecto con:

```
FORTNITE_API_KEY=tu_api_key
FORTNITE_API_URL_BASE=https://fortniteapi.io
```

El archivo `.env.local` también se cargará si existe (y tiene prioridad sobre `.env`).

## Endpoints Disponibles

- `GET /api/getNews` - Obtiene las noticias de Fortnite
- `GET /api/getMapWithPois` - Obtiene el mapa con puntos de interés
- `GET /api/getActiveEvents` - Obtiene eventos activos
- `GET /api/getAllEvents` - Obtiene todos los eventos
- `GET /api/getWindowDetailsById?windowId=xxx` - Obtiene detalles de una ventana de evento
