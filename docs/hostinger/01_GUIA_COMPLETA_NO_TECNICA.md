# Guia Completa No Tecnica Para Hostinger

Fecha de referencia: `25 de mayo de 2026`

Esta guia esta hecha para una persona sin conocimientos tecnicos.

Vas a montar 3 cosas:

1. base de datos MySQL
2. backend
3. frontend

## 1. Estructura recomendada

Usa esta estructura:

- `tudominio.com` para el frontend
- `api.tudominio.com` para el backend
- MySQL de Hostinger para la base de datos

Importante:

- el usuario final solo vera `tudominio.com`
- el backend existira aparte, pero el usuario no tendra que entrar a `api.tudominio.com`
- el frontend ya quedo listo para hablar con el backend por dentro usando `/backend`

## 2. Lo que vas a necesitar

Antes de empezar, necesitas:

1. cuenta de Hostinger
2. dominio apuntando a Hostinger
3. acceso a este proyecto en tu computador
4. Node.js instalado en tu computador
5. acceso al correo `nortefitevolution360@gmail.com`
6. clave de aplicacion de Google de ese correo

## 3. Crear la base de datos

En Hostinger:

1. entra a `Websites`
2. entra al sitio
3. `Manage`
4. abre `MySQL Databases`
5. crea una base nueva
6. guarda:
   - nombre de base
   - usuario
   - contrasena
   - host
   - puerto `3306`

## 4. Habilitar Remote MySQL

En Hostinger:

1. busca `Remote MySQL`
2. agrega la IP publica de tu computador

Esto es necesario para que Prisma cree las tablas desde tu PC.

## 5. Configurar el backend local

Archivo:

- `apps/api/.env`

Contenido:

```env
PORT=3001
DATABASE_URL="mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB"
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

## 6. Crear tablas en Hostinger

Desde tu computador, en la carpeta del proyecto:

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
```

## 7. Verificar la base en phpMyAdmin

En Hostinger:

1. entra a `phpMyAdmin`
2. abre tu base
3. verifica que existan tablas como:
   - `sedes`
   - `terminos_versiones`
   - `aceptaciones`
   - `correos_log`
   - `sesion_tokens`

## 8. Configurar el frontend local

Archivo:

- `apps/web/.env.local`

Contenido:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

## 9. Crear subdominios

En Hostinger:

1. crea `api.tudominio.com`
2. deja `tudominio.com` para el frontend

## 10. Subir backend

Debes subir solo el contenido de `apps/api`.

No subas:

- `node_modules`
- `dist`
- el repo completo

En Hostinger, crea una `Node.js App` para `api.tudominio.com`.

Comandos:

- install:
```bash
npm install
```

- build:
```bash
npm install && npx prisma generate && npm run build
```

- start:
```bash
npm run start
```

Variables del backend en Hostinger:

```env
PORT=3001
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

## 11. Probar backend

Abre:

- `https://api.tudominio.com/api/v1/sedes/kennedy`
- `https://api.tudominio.com/api/v1/session-token`

Si ambos responden, sigue.

## 12. Subir frontend

Debes subir solo el contenido de `apps/web`.

No subas:

- `node_modules`
- `.next`
- el repo completo

En Hostinger, crea otra `Node.js App` para `tudominio.com`.

Comandos:

- install:
```bash
npm install
```

- build:
```bash
npm install && npm run build
```

- start:
```bash
npm run start
```

Variables del frontend en Hostinger:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

## 13. Activar SSL

En Hostinger activa SSL para:

- `tudominio.com`
- `www.tudominio.com` si lo usas
- `api.tudominio.com`

## 14. Prueba final

Desde un celular:

1. abre el frontend
2. completa un registro
3. verifica pantalla de exito
4. verifica correo al usuario
5. verifica correo administrativo a `nortefitevolution360@gmail.com`

## 15. Conclusión

Si sigues este orden:

1. base
2. backend
3. frontend
4. SSL
5. prueba

el sistema debe quedar funcionando correctamente en Hostinger.
