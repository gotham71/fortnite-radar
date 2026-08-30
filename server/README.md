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

Ninguna es obligatoria: todos los endpoints usan la API pública y gratuita de
[fortnite-api.com](https://fortnite-api.com), que no requiere autenticación.
(El antiguo proveedor `fortniteapi.io`, que sí pedía `FORTNITE_API_KEY`, cerró
definitivamente en marzo de 2026.)

## Endpoints Disponibles

- `GET /api/getNews` - Obtiene las noticias de Fortnite
- `GET /api/getMapWithPois` - Obtiene el mapa y los puntos de interés
- `GET /api/getPlaylists` - Obtiene los modos competitivos/torneo y LTM actuales
- `GET /api/getShop` - Obtiene la tienda diaria
