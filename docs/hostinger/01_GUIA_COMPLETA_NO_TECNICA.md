# Guia Completa No Tecnica Para Hostinger

Fecha de referencia: `25 de mayo de 2026`

Esta guia esta escrita para que una persona no tecnica pueda desplegar el proyecto siguiendo pasos concretos y verificables.

## 1. Que vas a montar exactamente

Con la arquitectura actual del proyecto, en Hostinger vas a montar solo esto:

1. una base de datos MySQL
2. una sola app Node.js con el contenido de `apps/web`

No necesitas:

- una app separada para backend
- un subdominio `api`
- desplegar `apps/api`

## 2. Como debe quedar al final

Al terminar correctamente, debe quedar asi:

- `https://tudominio.com` abre la app
- `https://tudominio.com/backend/api/v1/sedes/kennedy` responde JSON
- la base MySQL existe en Hostinger
- phpMyAdmin muestra las tablas
- el formulario guarda registros
- se envian correos al usuario y a `nortefitevolution360@gmail.com`

## 3. Que necesitas antes de empezar

Debes tener listo lo siguiente:

1. un plan Hostinger compatible con Node.js Web Apps
2. tu dominio ya apuntando a Hostinger
3. acceso al proyecto en tu computador
4. `Node.js 20.x` instalado en tu computador
5. acceso al correo `nortefitevolution360@gmail.com`
6. la clave de aplicacion de Gmail de ese correo

## 4. Plan recomendado en Hostinger

Segun la documentacion oficial de Hostinger revisada el `25 de mayo de 2026`, Node.js Web Apps esta disponible en:

- `Business Web Hosting`
- `Cloud Startup`
- `Cloud Professional`
- `Cloud Enterprise`
- `Cloud Enterprise Plus`

Si tu plan no es uno de esos, primero debes subir de plan.

## 5. Paso 1. Crear la base de datos MySQL

Entra a Hostinger y sigue esta ruta:

1. `Websites`
2. elige tu sitio
3. `Dashboard`
4. busca `MySQL Databases`
5. crea una base nueva

Guarda exactamente estos datos:

- `Database name`
- `Database username`
- `Database password`
- `Database host`
- puerto `3306`

No sigas al siguiente paso si no guardaste esos 5 datos.

## 6. Paso 2. Habilitar Remote MySQL

Esto es para poder crear tablas desde tu computador.

En Hostinger:

1. abre el `Dashboard` del sitio
2. busca `Remote MySQL`
3. pulsa `Create`
4. en `IP`, pon la IP publica de tu computador
5. en `Database`, selecciona tu base
6. pulsa `Create`

Notas:

- si no sabes tu IP publica, buscala en Google con `what is my ip`
- Hostinger tambien permite `Any Host`, pero no es lo ideal para produccion permanente

## 7. Paso 3. Crear el archivo local de variables

En tu computador, dentro del proyecto, crea o edita:

- `apps/web/.env.local`

Contenido:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

Reemplaza:

- `USUARIO_DB`
- `PASSWORD_DB`
- `HOST_DB`
- `NOMBRE_DB`
- `TU_CLAVE_DE_APLICACION`

## 8. Paso 4. Crear las tablas y datos iniciales

Abre terminal en la raiz del proyecto y ejecuta:

```bash
cd apps/web
npx prisma generate
npx prisma db push
npx prisma db seed
cd ../..
```

Que debe pasar:

- `prisma generate` prepara el cliente Prisma
- `prisma db push` crea o actualiza las tablas
- `prisma db seed` crea los datos iniciales, como sede y terminos

Si aqui falla algo, no subas la app todavia.

## 9. Paso 5. Revisar la base con phpMyAdmin

En Hostinger:

1. vuelve a `Websites`
2. entra al sitio
3. `Dashboard`
4. busca `Databases Management`
5. entra a tu base
6. pulsa `Enter phpMyAdmin`

Verifica que existan al menos estas tablas:

- `sedes`
- `terminos_versiones`
- `sesion_tokens`
- `aceptaciones`
- `correos_log`
- `roles`
- `usuarios_admin`
- `usuarios_admin_sedes`
- `auditoria_logs`

Si esas tablas no existen, no pases al despliegue.

## 10. Paso 6. Elegir metodo de subida

Hostinger soporta 2 formas de despliegue para Node.js Web Apps:

1. `GitHub`
2. `ZIP`

Recomendacion:

- usa `GitHub` si tu proyecto ya vive en GitHub y quieres redeploy facil
- usa `ZIP` si no manejas GitHub o quieres subir un paquete manual

Ambos metodos sirven para esta app.

## 11. Paso 7A. Subida recomendada por GitHub

En Hostinger:

1. entra a `Websites`
2. pulsa `Add Website`
3. elige `Node.js Apps`
4. elige `Import Git Repository`
5. autoriza GitHub
6. elige el repositorio correcto
7. elige la rama correcta

Cuando Hostinger te muestre configuracion:

- confirma que el proyecto a desplegar es `apps/web`
- selecciona `Node 20.x`
- revisa variables de entorno antes de desplegar

Luego:

1. agrega las variables de entorno del archivo `03_VARIABLES_EXACTAS.md`
2. revisa comandos de build y start
3. pulsa `Deploy`

## 12. Paso 7B. Subida por ZIP

Si no vas a usar GitHub:

1. sigue `docs/hostinger/02_QUE_SUBIR_A_HOSTINGER.md`
2. crea un ZIP con el contenido de `apps/web`
3. en Hostinger entra a `Websites`
4. pulsa `Add Website`
5. elige `Node.js Apps`
6. elige `Upload your website files`
7. sube el ZIP

Cuando Hostinger termine de analizar el ZIP:

1. selecciona `Node 20.x`
2. revisa o completa variables de entorno
3. revisa comandos
4. pulsa `Deploy`

## 13. Paso 8. Variables de entorno en Hostinger

En la configuracion de la app Node.js agrega:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

Importante:

- no uses `localhost`
- no uses `127.0.0.1`
- no pongas comillas si Hostinger no las necesita
- la clave de Gmail debe ir sin espacios extra

## 14. Paso 9. Comandos correctos en Hostinger

Usa estos comandos:

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

La app ya tiene en [apps/web/package.json](/D:/Jose/UDI/PRACTICAS/fit-evolution360/apps/web/package.json):

- `postinstall: prisma generate`
- `build: next build`
- `start: next start -H 0.0.0.0`
- `engines.node: 20.x`

## 15. Paso 10. Esperar el deploy y revisar el dashboard

Cuando pulses `Deploy`, espera a que Hostinger:

1. suba o clone el proyecto
2. instale dependencias
3. ejecute build
4. inicie la app

No sigas si ves errores rojos en logs.

## 16. Paso 11. Probar primero la parte tecnica

Abre estas dos URLs:

1. `https://tudominio.com/backend/api/v1/sedes/kennedy`
2. `https://tudominio.com/backend/api/v1/session-token`

Debe pasar esto:

- la primera devuelve informacion JSON de la sede
- la segunda devuelve un `sessionToken`

Si falla una de esas 2, la app no esta lista todavia.

## 17. Paso 12. Activar SSL

En Hostinger activa SSL para:

- `tudominio.com`
- `www.tudominio.com` si lo usas

No hagas pruebas finales sin SSL activo.

## 18. Paso 13. Probar la app desde navegador

Abre:

- `https://tudominio.com`

Verifica:

1. la pantalla carga
2. aparece la sede
3. se puede avanzar por pasos
4. la firma funciona
5. la confirmacion final responde bien

## 19. Paso 14. Prueba real completa

Desde un celular:

1. abre `https://tudominio.com`
2. llena el formulario
3. confirma y firma
4. envia el registro

Luego verifica 4 cosas:

1. aparece pantalla de exito
2. llega correo al usuario
3. llega correo a `nortefitevolution360@gmail.com`
4. en phpMyAdmin aparece el nuevo registro en `aceptaciones`

## 20. Si algo falla, revisa en este orden

1. `DATABASE_URL`
2. `GMAIL_USER`
3. `GMAIL_APP_PASSWORD`
4. Node `20.x`
5. que subiste solo `apps/web`
6. que no subiste `node_modules`
7. que ejecutaste `prisma db push` y `prisma db seed`
8. que la URL tecnica `/backend/api/v1/sedes/kennedy` responde

## 21. Conclusión

Si haces exactamente este orden:

1. crear MySQL
2. habilitar Remote MySQL
3. configurar `apps/web/.env.local`
4. correr Prisma localmente
5. revisar phpMyAdmin
6. subir solo `apps/web`
7. poner variables en Hostinger
8. desplegar
9. probar URLs tecnicas
10. activar SSL
11. hacer una prueba real

el despliegue debe quedar exitoso con una sola app y un solo dominio.
