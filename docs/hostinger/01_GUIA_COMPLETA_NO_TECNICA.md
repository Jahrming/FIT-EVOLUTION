# Guia Completa No Tecnica Para Hostinger

Esta es la guia vigente para subir el proyecto manualmente a Hostinger usando una sola carpeta y una sola app Node.js.

Esta guia asume esto:

- la base de datos MySQL ya existe
- `DATABASE_URL` ya lo tienes
- el correo Gmail ya esta listo
- vas a subir archivos manualmente por `FTP` o `File Manager`

## 1. Que vas a montar exactamente

Vas a montar solo esto:

1. una sola app Node.js con el contenido de `apps/web`
2. una sola carpeta de codigo en Hostinger
3. una sola base MySQL ya existente

No vas a montar:

- `apps/api`
- un subdominio `api`
- dos apps separadas
- un backend aparte

## 2. Como debe quedar al final

Cuando todo quede bien, debe pasar esto:

- `https://tudominio.com` abre la app
- `https://tudominio.com/backend/api/v1/sedes/kennedy` devuelve JSON
- `https://tudominio.com/backend/api/v1/session-token` devuelve un token
- el formulario guarda en la base de datos que ya tienes publicada
- se envian correos al usuario y al correo administrativo

## 3. Que necesitas antes de empezar

Debes tener:

1. un plan Hostinger con `Node.js Web Apps`
2. tu dominio ya apuntando a Hostinger
3. acceso FTP o acceso al `File Manager`
4. acceso al panel de la app Node.js en Hostinger
5. `Node.js 20.x` en Hostinger
6. acceso a este proyecto en tu computador
7. los datos reales de `DATABASE_URL`
8. `GMAIL_USER` y `GMAIL_APP_PASSWORD`

## 4. Idea central del despliegue

La regla simple es esta:

- en Hostinger existe una carpeta raiz para tu app Node.js
- dentro de esa carpeta debes dejar directamente el contenido de `apps/web`
- no debes meter una carpeta extra llamada `apps`
- no debes meter una carpeta extra llamada `web`

Cuando abras la carpeta final en Hostinger, debes ver directamente:

- `package.json`
- `next.config.js`
- `app`
- `lib`
- `prisma`

## 5. Paso 1. Revisar si realmente necesitas tocar la base de datos

Como tu base ya esta publicada y configurada, normalmente para subir cambios de frontend o logica no debes tocar Prisma.

Haz esto:

- si solo cambiaste UI, formularios, textos, paginas o logica sin cambiar `prisma/schema.prisma`, no corras `db push`
- si cambiaste `prisma/schema.prisma`, entonces si debes actualizar la base antes o durante el despliegue
- si cambiaste `prisma/seed.ts`, solo corre seed si realmente necesitas reinsertar o actualizar datos base

Para el cambio actual de carga de sede en `localhost`, no necesitas cambios de base de datos.

## 6. Paso 2. Preparar la carpeta correcta en tu computador

La carpeta que vas a subir es:

- `apps/web`

No subas la raiz completa del monorepo.

Antes de subir, revisa que en `apps/web` existan como minimo estos archivos y carpetas:

- `package.json`
- `next.config.js`
- `app`
- `lib`
- `prisma`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`

## 7. Paso 3. Confirmar que NO vas a subir basura

No subas:

- `node_modules`
- `.next`
- `.env`
- `.env.local`
- `tsconfig.tsbuildinfo`
- archivos temporales de Windows

La idea es subir codigo fuente, no artefactos de compilacion ni secretos locales.

## 8. Paso 4. Entrar a la app Node.js en Hostinger

En Hostinger:

1. entra a `Websites`
2. abre el sitio correcto
3. entra a la seccion de `Node.js`
4. confirma que la app usa `Node 20.x`
5. identifica la carpeta raiz asignada a esa app

Esa carpeta raiz es la unica carpeta donde vas a trabajar.

## 9. Paso 5. Subir los archivos por FTP o File Manager

Conecta por `FTP` o abre el `File Manager`.

Luego:

1. entra a la carpeta raiz de la app Node.js
2. sube ahi directamente el contenido de `apps/web`
3. reemplaza los archivos existentes cuando corresponda

Importante:

- no subas una carpeta contenedora extra
- no debe quedar algo como `.../apps/web/package.json`
- debe quedar algo como `.../package.json`

Si al terminar ves `package.json` dentro de la carpeta final, la subida quedo bien estructurada.

## 10. Paso 6. Configurar variables de entorno en Hostinger

En la app Node.js de Hostinger agrega exactamente estas variables:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

Notas:

- no pongas `API_PROXY_TARGET`
- no pongas `localhost`
- no pongas `127.0.0.1`
- no subas estas variables en un archivo `.env.local`
- ponlas en el panel de Hostinger

## 11. Paso 7. Poner los comandos correctos

En Hostinger revisa que la app tenga estos comandos:

### Install command

```bash
npm install
```

### Build command

```bash
npm install && npx prisma generate && npm run build
```

### Start command

```bash
npm run start
```

No agregues `apps/web` a esos comandos porque ya estas subiendo directamente el contenido de esa carpeta.

## 12. Paso 8. Si hubo cambios de base de datos, aplicarlos

Este paso es solo cuando cambiaste el esquema Prisma.

Opciones:

1. correr `npx prisma db push` desde tu computador apuntando a la base remota
2. o correrlo desde la terminal de Hostinger si tu plan la ofrece

Si no cambiaste `prisma/schema.prisma`, omite este paso.

## 13. Paso 9. Ejecutar build y reiniciar

Despues de subir archivos por FTP:

1. corre el `install command` si Hostinger no lo ejecuta solo
2. corre el `build command`
3. reinicia la app o pulsa `Deploy` o `Restart`

Regla importante:

- subir por FTP sin rebuild ni restart puede dejar viva la version anterior

## 14. Paso 10. Probar primero la parte tecnica

Abre estas dos URLs:

1. `https://tudominio.com/backend/api/v1/sedes/kennedy`
2. `https://tudominio.com/backend/api/v1/session-token`

Debe pasar esto:

- la primera devuelve JSON
- la segunda devuelve un objeto con `sessionToken`

Si una de esas 2 falla, no sigas a la prueba funcional.

## 15. Paso 11. Probar la app completa

Abre:

- `https://tudominio.com/aceptacion?sede=kennedy`

Verifica:

1. carga la pantalla de bienvenida
2. no aparece `Oops, algo salio mal`
3. puedes avanzar por pasos
4. la firma funciona
5. el registro se envia
6. aparece la pantalla final

## 16. Paso 12. Probar que la base y el correo siguen bien

Despues de una prueba real, confirma:

1. existe un nuevo registro en `aceptaciones`
2. existe movimiento en `correos_log`
3. llego el correo al usuario
4. llego el correo administrativo

## 17. Errores comunes

### Error: Hostinger no detecta bien la app

Casi siempre significa que subiste mal la carpeta.

Debes subir el contenido de `apps/web`, no la carpeta `apps/web` como contenedor.

### Error: `package.json` no aparece donde debe

La app quedo dentro de una carpeta extra. Corrige la estructura.

### Error: subiste por FTP y no cambio nada

Te falto rebuild o restart.

### Error: falla `/backend/api/v1/sedes/kennedy`

Revisa:

1. `DATABASE_URL`
2. que `npm install` corriera bien
3. que `npx prisma generate` corriera bien
4. que la app realmente se reinicio

### Error: Prisma pide tablas que no existen

Solo entonces debes correr `npx prisma db push`.

## 18. Resumen corto

La ruta correcta para tu caso es:

1. subir solo `apps/web`
2. subirlo directo a una sola carpeta raiz de la app Node.js
3. no subir `.next`, `node_modules` ni `.env.local`
4. configurar las 5 variables en Hostinger
5. correr `npm install && npx prisma generate && npm run build`
6. reiniciar
7. probar `/backend/api/v1/sedes/kennedy`
8. probar `/aceptacion?sede=kennedy`
