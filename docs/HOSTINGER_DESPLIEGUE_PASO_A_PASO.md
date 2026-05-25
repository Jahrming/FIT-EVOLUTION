# Despliegue en Hostinger Paso a Paso

Fecha de referencia: `25 de mayo de 2026`

## 1. Estado actual del proyecto

Si, este proyecto ya quedo en condiciones razonables para desplegarse en Hostinger.

### Lo que ya deje adaptado

- `apps/web/package.json`
  - `start` usando `next start -H 0.0.0.0`
  - `engines.node = 20.x`
- `apps/api/package.json`
  - `postinstall = prisma generate`
  - `engines.node = 20.x`
- `apps/web/next.config.js`
  - proxy del frontend hacia el backend usando `/backend`
- `apps/api/src/main.ts`
  - CORS con varios dominios separados por coma
  - `trust proxy`

### Conclusion tecnica

No te recomiendo desplegar el monorepo raiz completo como una sola app.

Te recomiendo esto:

1. `frontend` como una app Node.js en Hostinger
2. `backend` como otra app Node.js en Hostinger
3. `base de datos MySQL` creada en Hostinger

## 2. Fuentes oficiales verificadas

Verifique en la documentacion oficial de Hostinger que:

- Hostinger soporta apps Node.js en planes `Business` y `Cloud`:
  https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger soporta `Next.js` y `NestJS` como frameworks detectables:
  https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger permite elegir Node `18.x`, `20.x`, `22.x` y `24.x`:
  https://www.hostinger.com/support/how-to-select-the-node-js-version-for-your-application/
- Hostinger permite crear base de datos MySQL:
  https://www.hostinger.com/support/1583542-how-to-create-a-new-mysql-database-in-hostinger/
- Hostinger permite acceso remoto a MySQL:
  https://www.hostinger.com/support/1583546-how-to-set-up-remote-mysql-access-in-hostinger/

## 3. Recomendacion de plan

### Opcion recomendada para ti

Usa `Business Web Hosting` o cualquier `Cloud Hosting` de Hostinger con soporte de Node.js Web Apps.

### Cuando usar VPS en vez de hosting administrado

Usa `VPS` solo si necesitas:

- acceso root
- PM2
- Nginx manual
- colas complejas
- mas control del servidor

Para este proyecto, si quieres desplegar rapido y con menos riesgo, la mejor ruta es `Node.js Web Apps + MySQL de Hostinger`.

## 4. Arquitectura recomendada en Hostinger

Te recomiendo esta estructura:

- `https://app.tudominio.com` -> frontend Next.js
- `https://api.tudominio.com` -> backend NestJS
- `MySQL` -> base de datos de Hostinger

Tambien puedes usar:

- `https://tudominio.com` -> frontend
- `https://api.tudominio.com` -> backend

## 5. Preparacion local antes de subir

### Paso 1. Verifica estos archivos

- `apps/web/.env.example`
- `apps/api/.env.example`
- `apps/web/package.json`
- `apps/api/package.json`

### Paso 2. No subas el repo raiz como app unica

Lo mas estable es subir cada app por separado:

- una subida para `apps/web`
- otra subida para `apps/api`

## 6. Preparar base de datos MySQL en Hostinger

### Paso 1. Crear la base de datos

En Hostinger:

1. Ve a `Websites`
2. Entra al sitio o plan donde vas a alojar la base
3. Busca `Management` o `Databases`
4. Crea una nueva base MySQL
5. Guarda estos datos:
   - nombre de base
   - usuario
   - password
   - hostname MySQL
   - puerto `3306`

### Paso 2. Habilitar acceso remoto a MySQL

Esto te sirve para empujar el esquema Prisma desde tu computador.

En Hostinger:

1. Ve a `Websites`
2. `Manage`
3. Busca `Remote MySQL`
4. Agrega tu IP publica
5. O usa `Any Host` solo temporalmente mientras despliegas

## 7. Configurar la base de datos remota en tu proyecto

En tu maquina local, en `apps/api/.env`, prepara temporalmente esta conexion:

```env
PORT=3001
DATABASE_URL="mysql://USUARIO:PASSWORD@HOSTNAME:3306/NOMBRE_DB"
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_APP_PASSWORD
```

## 8. Subir el esquema Prisma a la base de Hostinger

Desde tu proyecto local:

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

Esto hace tres cosas:

1. genera el cliente Prisma
2. crea las tablas en la base remota de Hostinger
3. siembra la sede y configuracion inicial

## 9. Preparar el frontend para Hostinger

### Variables del frontend

Crea el archivo `apps/web/.env.local` con valores de produccion antes de empaquetar:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

Si tu frontend va en raiz:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

### Que hace esto

- el navegador nunca llama directo al backend
- el frontend llama a `/backend`
- Next.js reenvia internamente a `https://api.tudominio.com`

## 10. Preparar el backend para Hostinger

### Variables del backend

Crea o ajusta `apps/api/.env` con produccion:

```env
PORT=3001
DATABASE_URL="mysql://USUARIO:PASSWORD@HOSTNAME:3306/NOMBRE_DB"
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_APP_PASSWORD
```

Si el frontend solo vive en un dominio:

```env
CORS_ORIGIN=https://tudominio.com
```

## 11. Como desplegar el frontend en Hostinger

### Metodo recomendado: Node.js Web App

En Hostinger:

1. Ve a `Websites`
2. `Add Website`
3. Elige `Node.js Apps`
4. Crea la app para el dominio o subdominio del frontend

### Forma mas estable de subida

Sube un `.zip` hecho solo con el contenido de `apps/web`.

No metas el repo entero.

### Configuracion sugerida

- framework: `Next.js`
- Node version: `20.x`
- build command: `npm install && npm run build`
- start command: `npm run start`

### Variables de entorno del frontend en Hostinger

Agrega en el panel:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

## 12. Como desplegar el backend en Hostinger

### Metodo recomendado: Node.js Web App

En Hostinger:

1. Ve a `Websites`
2. `Add Website`
3. Elige `Node.js Apps`
4. Crea la app para `api.tudominio.com`

### Forma mas estable de subida

Sube un `.zip` hecho solo con el contenido de `apps/api`.

### Configuracion sugerida

- framework: `NestJS` o `Other` si no lo detecta
- Node version: `20.x`
- build command: `npm install && npm run build`
- start command: `npm run start`

Si el panel no detecta bien Prisma, usa:

```bash
npm install && npx prisma generate && npm run build
```

### Variables de entorno del backend en Hostinger

```env
PORT=3001
DATABASE_URL=mysql://USUARIO:PASSWORD@HOSTNAME:3306/NOMBRE_DB
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_APP_PASSWORD
```

## 13. DNS y dominios

### Opcion recomendada

- `app.tudominio.com` -> frontend
- `api.tudominio.com` -> backend

### Pasos

1. crea el subdominio `api`
2. crea el subdominio `app` si lo usaras
3. asigna cada Node.js app al dominio o subdominio correcto
4. espera propagacion DNS
5. activa SSL desde Hostinger

## 14. Orden correcto de despliegue

Hazlo en este orden exacto:

1. crear base MySQL
2. habilitar Remote MySQL
3. correr `prisma db push`
4. correr `prisma db seed`
5. desplegar backend
6. probar backend
7. desplegar frontend
8. probar frontend
9. probar flujo completo

## 15. Pruebas minimas despues de desplegar

### Backend

Prueba:

- `GET /api/v1/sedes/kennedy`
- `GET /api/v1/session-token`

### Frontend

Prueba:

- abrir `/aceptacion?sede=kennedy`
- completar formulario
- aceptar terminos
- firmar
- enviar

### Correo

Confirma:

- correo al usuario
- correo administrativo a `nortefitevolution360@gmail.com`
- asunto administrativo con documento y nombre

## 16. Errores tipicos y como corregirlos

### Error 1. El frontend no carga la sede

Revisa:

- `API_PROXY_TARGET`
- backend arriba
- `GET /api/v1/sedes/kennedy`

### Error 2. CORS bloqueado

Revisa:

- `CORS_ORIGIN`
- usa dominios exactos
- si usas `www`, incluyelo tambien

### Error 3. Prisma falla en build

Usa este build command:

```bash
npm install && npx prisma generate && npm run build
```

### Error 4. La base no conecta

Revisa:

- hostname de MySQL de Hostinger
- puerto `3306`
- usuario
- password
- Remote MySQL habilitado

### Error 5. Gmail no envia

Revisa:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- que la cuenta tenga App Password real de Google

## 17. Recomendacion final

### Si quieres facilidad

Usa:

- `Business` o `Cloud`
- `2 apps Node.js`
- `1 MySQL`

### Si quieres control total

Usa:

- `VPS`
- PM2
- Nginx o CloudPanel
- MySQL administrado o en VPS

## 18. Conclusión

### Respuesta corta

Si, tu proyecto ya puede desplegarse en Hostinger.

### Pero la forma correcta es

No despliegues el monorepo raiz como una sola app.

Despliega por separado:

1. `apps/web`
2. `apps/api`
3. `MySQL` en Hostinger

### Ruta recomendada para ti

La mejor ruta para tu caso es:

- `frontend` en Node.js Web App
- `backend` en Node.js Web App
- `database` en MySQL de Hostinger

Porque es mas simple, menos riesgoso y suficiente para esta aplicacion.
