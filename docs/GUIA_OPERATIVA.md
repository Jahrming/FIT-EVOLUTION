# Guia Operativa

Este documento resume como mantener el proyecto sin tocar la logica de guardado de aceptaciones.

## 1. Cambiar el correo administrativo de una sede

Edita `apps/api/prisma/seed.ts` y cambia `correoAdmin`. Luego ejecuta:

```bash
cd apps/api
npx prisma db seed
```

## 2. Actualizar terminos y condiciones

Los terminos viven en la base de datos.

1. Edita `apps/api/prisma/seed.ts`.
2. Crea una nueva `numeroVersion`.
3. Ajusta `titulo`, `contenidoHtml` y `notas`.
4. Ejecuta:

```bash
cd apps/api
npx prisma db seed
```

## 3. Entornos por app

### Frontend: `apps/web/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=http://127.0.0.1:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend: `apps/api/.env`

```env
PORT=3001
DATABASE_URL="mysql://root:root@127.0.0.1:3306/fitevolution360_dev"
CORS_ORIGIN=http://localhost:3000
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_app_password
```

`CORS_ORIGIN` puede contener varios dominios separados por coma.

## 4. Instalacion limpia en un equipo nuevo

```bash
npm install
npm run db:up
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
npm run dev
```

## 5. Despliegue tipo Hostinger o VPS

Si frontend y backend viven en el mismo servidor:

- `NEXT_PUBLIC_API_BASE_URL=/backend`
- `API_PROXY_TARGET=http://127.0.0.1:3001`
- `NEXT_PUBLIC_APP_URL=https://tudominio.com`
- `CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com`

## 6. Notas de seguridad

- No guardes credenciales reales en archivos versionados.
- Si una credencial real se compartio fuera de tu maquina, rotala.
- La fuente de verdad del esquema es `apps/api/prisma/schema.prisma`.
