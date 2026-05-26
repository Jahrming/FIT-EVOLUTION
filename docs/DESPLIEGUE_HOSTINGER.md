# Despliegue Hostinger

Resumen tecnico vigente para Hostinger.

## Arquitectura actual

- una sola app: `apps/web`
- una sola carpeta de despliegue en Hostinger
- una sola base de datos MySQL ya existente
- misma app para frontend y endpoints `/backend/api/v1/...`

## Variables de produccion

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

No uses:

- `API_PROXY_TARGET`
- `NEXT_PUBLIC_API_URL`

## Que subir

Sube solo el contenido de:

- `apps/web`

No subas:

- `node_modules`
- `.next`
- `.env.local`
- `apps/api`

## Estructura correcta en Hostinger

La carpeta raiz final debe verse asi:

```text
package.json
next.config.js
app/
lib/
prisma/
```

## Comandos

### Install

```bash
npm install
```

### Build

```bash
npm install && npx prisma generate && npm run build
```

### Start

```bash
npm run start
```

## Sobre Prisma

Si no cambiaste `apps/web/prisma/schema.prisma`, no necesitas correr `prisma db push` en cada deploy.

Solo corre `prisma db push` cuando cambiaste el esquema de base de datos.

## Validacion minima

Deben responder:

- `https://tudominio.com/backend/api/v1/sedes/kennedy`
- `https://tudominio.com/backend/api/v1/session-token`

Y luego debes probar:

- `https://tudominio.com/aceptacion?sede=kennedy`

## Documento principal

Para la guia paso a paso completa, usa:

- [docs/hostinger/01_GUIA_COMPLETA_NO_TECNICA.md](/D:/Jose/UDI/PRACTICAS/fit-evolution360/docs/hostinger/01_GUIA_COMPLETA_NO_TECNICA.md)
