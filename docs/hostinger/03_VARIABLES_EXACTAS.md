# Variables Exactas

Estas son las variables vigentes para el despliegue actual:

- una sola app `apps/web`
- una sola carpeta
- misma app para UI y rutas `/backend`
- base de datos ya configurada

## 1. Variables de Hostinger para produccion

En la app Node.js de Hostinger agrega exactamente estas claves:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

## 2. Que significa cada una

- `NEXT_PUBLIC_API_BASE_URL`: deja la base de las llamadas del navegador en `/backend`
- `NEXT_PUBLIC_APP_URL`: URL publica final del dominio
- `DATABASE_URL`: conexion real a MySQL
- `GMAIL_USER`: correo remitente
- `GMAIL_APP_PASSWORD`: clave de aplicacion del correo

## 3. Que NO debes poner

No pongas:

- `API_PROXY_TARGET`
- `NEXT_PUBLIC_API_URL`
- `localhost`
- `127.0.0.1`
- rutas de Windows

En esta arquitectura no necesitas `API_PROXY_TARGET` porque `apps/web` ya sirve internamente `/backend/api/v1/...`.

## 4. Formato correcto de DATABASE_URL

Debe verse asi:

```env
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base
```

Ejemplo ilustrativo:

```env
DATABASE_URL=mysql://u123456789_fituser:MiClaveSegura@mysql.hostinger.com:3306/u123456789_fitdb
```

## 5. Si usas www

Si tu dominio real en produccion es `https://www.tudominio.com`, entonces usa esa URL exacta en:

```env
NEXT_PUBLIC_APP_URL=https://www.tudominio.com
```

## 6. Variables locales para probar con la base remota

Si quieres probar localmente con la misma base remota, usa en tu computador:

- `apps/web/.env.local`

Ejemplo:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

## 7. Regla simple

Para produccion en Hostinger, esta app solo necesita estas 5 variables:

1. `NEXT_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_APP_URL`
3. `DATABASE_URL`
4. `GMAIL_USER`
5. `GMAIL_APP_PASSWORD`
