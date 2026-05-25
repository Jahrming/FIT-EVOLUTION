# Hostinger Guia Paso a Paso Para No Tecnicos

Esta guia esta escrita para que una persona sin conocimientos tecnicos pueda montar:

1. base de datos
2. backend
3. frontend
4. dominio
5. correos funcionando

Si sigues el orden exacto, el proyecto debe quedar funcionando.

---

## 0. Que vas a montar

Vas a montar 3 piezas:

### Pieza 1. Base de datos

Aqui se guardan los registros de los usuarios.

### Pieza 2. Backend

Es la parte que:

- guarda los registros
- valida terminos
- envia correos

### Pieza 3. Frontend

Es la pagina que abre el cliente desde el celular.

---

## 1. Que necesitas antes de empezar

Debes tener:

1. una cuenta de Hostinger
2. un dominio o subdominio en Hostinger
3. acceso a este proyecto en tu computador
4. Node.js instalado en tu computador
5. internet estable
6. acceso al correo `nortefitevolution360@gmail.com`
7. la clave de aplicacion de Google de ese correo

---

## 2. Como vamos a organizarlo

### Recomendacion mas facil

Usa esta estructura:

- frontend: `app.tudominio.com`
- backend: `api.tudominio.com`
- base de datos: MySQL en Hostinger

Ejemplo:

- `app.fitevolution360.com`
- `api.fitevolution360.com`

Si no quieres usar `app`, tambien puedes usar:

- `tudominio.com` para el frontend
- `api.tudominio.com` para el backend

---

## 3. Crear la base de datos en Hostinger

### Paso 1

Entra a Hostinger.

### Paso 2

Ve a:

- `Websites`
- elige tu sitio
- `Manage`

### Paso 3

Busca una seccion que diga:

- `Databases`
- o `MySQL Databases`

### Paso 4

Crea una nueva base de datos.

Cuando la crees, anota en un bloc de notas estos 4 datos:

1. nombre de la base
2. usuario de la base
3. contrasena de la base
4. host de la base

Tambien anota el puerto:

- `3306`

### Paso 5

Ahora busca en Hostinger la opcion:

- `Remote MySQL`

### Paso 6

Agrega tu IP publica para permitir que tu computador se conecte temporalmente a esa base.

Si no sabes tu IP publica:

1. abre Google
2. busca `cual es mi ip`
3. copia ese numero
4. pegalo en `Remote MySQL`

---

## 4. Preparar el backend en tu computador

### Paso 1

Abre el proyecto en tu computador.

### Paso 2

Ve a este archivo:

- `apps/api/.env`

### Paso 3

Reemplaza su contenido por este, cambiando solo los datos que te dio Hostinger:

```env
PORT=3001
DATABASE_URL="mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB"
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION_DE_GOOGLE
```

### Ejemplo

```env
PORT=3001
DATABASE_URL="mysql://u123456789_gym:MiPassword123@mysql.hostinger.com:3306/u123456789_gym"
CORS_ORIGIN=https://app.fitevolution360.com,https://fitevolution360.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=hzggbqnalytzvnof
```

---

## 5. Crear las tablas en la base de datos de Hostinger

Esto se hace una sola vez.

### Paso 1

Abre una terminal en la carpeta del proyecto.

### Paso 2

Ejecuta esto:

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
```

### Que hace esto

- `prisma generate`: prepara Prisma
- `prisma db push`: crea las tablas en Hostinger
- `prisma db seed`: mete la sede inicial y configuracion base

### Importante

Si aqui aparece un error, no sigas con el despliegue hasta resolverlo.

---

## 6. Preparar el frontend en tu computador

### Paso 1

Ve a este archivo:

- `apps/web/.env.local`

Si no existe, crealo.

### Paso 2

Pega esto:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

### Si el frontend va en el dominio principal

Usa esto:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

---

## 7. Crear los subdominios en Hostinger

### Paso 1

En Hostinger ve a:

- `Domains`
- o `Subdomains`

### Paso 2

Crea estos subdominios:

1. `api`
2. `app`

Si no quieres `app`, usa solo `api` y deja el dominio principal para el frontend.

---

## 8. Comprimir el backend para subirlo

### Importante

No subas todo el proyecto raiz.

Solo vamos a subir la carpeta del backend por separado.

### Paso 1

Abre la carpeta:

- `apps/api`

### Paso 2

Comprime el contenido de esa carpeta en un `.zip`

El zip debe contener cosas como estas:

- `package.json`
- `nest-cli.json`
- `tsconfig.json`
- `prisma/`
- `src/`

No hace falta meter:

- `node_modules`
- `dist`

### Nombre sugerido

- `backend-hostinger.zip`

---

## 9. Subir el backend a Hostinger

### Paso 1

En Hostinger ve a:

- `Websites`
- `Add Website`
- elige `Node.js App`

### Paso 2

Asigna el subdominio:

- `api.tudominio.com`

### Paso 3

Sube el zip del backend.

### Paso 4

Si Hostinger te pide comandos, usa:

#### Install command

```bash
npm install
```

#### Build command

```bash
npm install && npx prisma generate && npm run build
```

#### Start command

```bash
npm run start
```

### Paso 5

En variables de entorno del backend en Hostinger, agrega exactamente:

```env
PORT=3001
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION_DE_GOOGLE
```

### Paso 6

Guarda y arranca la app.

---

## 10. Probar el backend antes de seguir

Abre en el navegador:

```text
https://api.tudominio.com/api/v1/sedes/kennedy
```

### Si funciona

Debes ver algo tipo JSON con datos de la sede.

Tambien prueba:

```text
https://api.tudominio.com/api/v1/session-token
```

### Si no funciona

No sigas todavia.

Primero revisa:

1. variables del backend
2. base de datos
3. build command
4. logs de Hostinger

---

## 11. Comprimir el frontend para subirlo

### Paso 1

Abre la carpeta:

- `apps/web`

### Paso 2

Comprime el contenido de esa carpeta en un `.zip`

El zip debe contener cosas como estas:

- `package.json`
- `next.config.js`
- `app/`
- `lib/`
- `tailwind.config.ts`

No hace falta meter:

- `node_modules`
- `.next`

### Nombre sugerido

- `frontend-hostinger.zip`

---

## 12. Subir el frontend a Hostinger

### Paso 1

En Hostinger crea otra `Node.js App`

### Paso 2

Asigna:

- `app.tudominio.com`

o el dominio principal si lo prefieres.

### Paso 3

Sube el zip del frontend.

### Paso 4

Si Hostinger te pide comandos, usa:

#### Install command

```bash
npm install
```

#### Build command

```bash
npm install && npm run build
```

#### Start command

```bash
npm run start
```

### Paso 5

Agrega estas variables de entorno del frontend:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

Si el frontend va en el dominio principal:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

### Paso 6

Guarda y arranca la app.

---

## 13. Activar SSL

En Hostinger, para el dominio y subdominios:

1. entra al dominio
2. busca `SSL`
3. activa SSL para:
   - `app.tudominio.com`
   - `api.tudominio.com`

No pruebes la app final sin SSL activo.

---

## 14. Prueba completa final

Desde el celular:

1. abre el frontend
2. entra al formulario
3. completa nombre, documento y correo
4. lee terminos
5. marca consentimientos
6. firma
7. envia

### Debe pasar esto

1. se guarda el registro
2. aparece pantalla de exito
3. llega correo al usuario
4. llega correo administrativo a `nortefitevolution360@gmail.com`

---

## 15. Si algo falla, revisa esto primero

### Problema: no carga la sede

Revisa:

- que el backend abra en `https://api.tudominio.com/api/v1/sedes/kennedy`
- que `API_PROXY_TARGET` este bien escrito

### Problema: error de CORS

Revisa:

- `CORS_ORIGIN`
- si usas `www`, debes agregarlo tambien
- si usas `app.tudominio.com`, debes ponerlo exacto

### Problema: no conecta a la base

Revisa:

- `DATABASE_URL`
- `Remote MySQL`
- usuario de base
- password
- host

### Problema: no envia correos

Revisa:

- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- que la clave sea una App Password real de Google

### Problema: Hostinger no compila Prisma

Usa este build command en backend:

```bash
npm install && npx prisma generate && npm run build
```

---

## 16. Orden exacto que debes seguir

Hazlo exactamente asi:

1. crear base de datos en Hostinger
2. habilitar Remote MySQL
3. poner `apps/api/.env`
4. correr `prisma generate`
5. correr `prisma db push`
6. correr `prisma db seed`
7. crear subdominio `api`
8. subir backend
9. probar backend
10. poner `apps/web/.env.local`
11. crear subdominio `app`
12. subir frontend
13. activar SSL
14. probar desde celular
15. probar correo

---

## 17. Recomendacion final para no equivocarte

### Haz esto

- primero deja vivo el backend
- luego deja vivo el frontend
- al final haces la prueba de registro

### No hagas esto

- no subas el proyecto raiz completo
- no mezcles backend y frontend en una sola app
- no pruebes el frontend si el backend aun no responde

---

## 18. Resumen ultra corto

### Que subir

- `apps/api` como una app Node.js
- `apps/web` como otra app Node.js

### Que crear

- una base MySQL en Hostinger

### Que probar

- `https://api.tudominio.com/api/v1/sedes/kennedy`
- luego el frontend
- luego un registro real

---

## 19. Archivo complementario

Si quieres una guia mas tecnica y detallada, revisa tambien:

- `docs/HOSTINGER_DESPLIEGUE_PASO_A_PASO.md`
