# Despliegue Hostinger

Guia corta para desplegar el proyecto en un entorno tipo Hostinger o VPS con MySQL.

## Topologia recomendada

- dominio publico: `https://tudominio.com`
- frontend Next.js: mismo dominio
- backend NestJS: proceso interno en `http://127.0.0.1:3001`
- base de datos: MySQL

El frontend usa `/backend` como ruta publica y Next.js reenvia internamente al backend real con `API_PROXY_TARGET`.

## Variables del frontend

Archivo sugerido: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=http://127.0.0.1:3001
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

## Variables del backend

Archivo sugerido: `apps/api/.env`

```env
PORT=3001
DATABASE_URL="mysql://usuario:password@127.0.0.1:3306/fitevolution360_prod"
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_app_password
```

## Preparacion

```bash
npm install
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
npm run build
```

## Puntos clave

- No expongas `localhost:3001` al navegador del cliente.
- Mantien `API_PROXY_TARGET` como URL interna del backend.
- Usa MySQL real en `DATABASE_URL`.
- Asegura que `CORS_ORIGIN` incluya todos los dominios publicos del frontend.
- Si cambias el dominio, actualiza tambien `NEXT_PUBLIC_APP_URL` para los QR.
