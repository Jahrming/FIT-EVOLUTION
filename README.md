# FIT EVOLUTION360

Plataforma de aceptacion digital para sedes de gimnasio.

## Stack

- `apps/web`: Next.js 14
- `apps/api`: NestJS 10
- Base de datos: MySQL + Prisma
- Correo: Gmail SMTP via Nodemailer

## Entornos

Usa variables separadas por app:

- `apps/web/.env.local`
- `apps/api/.env`

Referencias:

- `apps/web/.env.example`
- `apps/api/.env.example`
- `.env.example`

El frontend usa `NEXT_PUBLIC_API_BASE_URL=/backend` y Next.js reenvia al backend real con `API_PROXY_TARGET`. Esto evita problemas cuando el formulario se abre desde celular o desde otro host.

## Arranque local

1. Instala dependencias:

```bash
npm install
```

2. Levanta MySQL con Docker o usa tu servidor MySQL:

```bash
npm run db:up
```

3. Configura:

- `apps/api/.env`
- `apps/web/.env.local`

4. Prepara la base:

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
```

5. Inicia el monorepo:

```bash
npm run dev
```

## Variables importantes

### Frontend

- `NEXT_PUBLIC_API_BASE_URL=/backend`
- `API_PROXY_TARGET=http://127.0.0.1:3001`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Backend

- `PORT=3001`
- `DATABASE_URL=mysql://...`
- `CORS_ORIGIN=http://localhost:3000`
- `GMAIL_USER=...`
- `GMAIL_APP_PASSWORD=...`

`CORS_ORIGIN` acepta varios dominios separados por coma.

## Despliegue

Documentacion relevante:

- [docs/GUIA_OPERATIVA.md](./docs/GUIA_OPERATIVA.md)
- [docs/DESPLIEGUE_HOSTINGER.md](./docs/DESPLIEGUE_HOSTINGER.md)

## Fuente de verdad tecnica

- Base de datos: `apps/api/prisma/schema.prisma`
- Seed: `apps/api/prisma/seed.ts`
- Proxy frontend: `apps/web/next.config.js`
- Cliente HTTP: `apps/web/lib/api.ts`
