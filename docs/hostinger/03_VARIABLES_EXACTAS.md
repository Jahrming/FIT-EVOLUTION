# Variables Exactas

Usa este archivo para copiar y pegar variables sin inventar nombres.

## 1. Variables de Hostinger para produccion

En la app Node.js de Hostinger agrega exactamente estas claves:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=https://tudominio.com
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

Reemplaza:

- `USUARIO_DB` por el usuario MySQL real
- `PASSWORD_DB` por la clave MySQL real
- `HOST_DB` por el host MySQL real de Hostinger
- `NOMBRE_DB` por el nombre real de la base
- `TU_CLAVE_DE_APLICACION` por la clave real de Gmail

## 2. Variables locales para preparar la base

En tu computador usa este archivo:

- `apps/web/.env.local`

Ejemplo:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

Si estas trabajando con una base local en tu maquina, ahi si puedes usar un `DATABASE_URL` local.

## 3. Valores que no debes poner mal

No hagas esto:

- no pongas `localhost` en Hostinger
- no pongas `127.0.0.1` en Hostinger
- no pongas `API_PROXY_TARGET`
- no cambies `NEXT_PUBLIC_API_BASE_URL=/backend`
- no dejes espacios raros en `GMAIL_APP_PASSWORD`
- no pongas la URL del frontend dentro de `DATABASE_URL`

## 4. Formato correcto del DATABASE_URL

Debe verse asi:

```env
DATABASE_URL=mysql://usuario:password@host:3306/nombre_base
```

Ejemplo ilustrativo:

```env
DATABASE_URL=mysql://u123456789_fituser:MiClaveSegura@mysql.hostinger.com:3306/u123456789_fitdb
```

## 5. Si tu dominio final usa www

La variable publica principal puede seguir siendo:

```env
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

Si tu dominio canonico real es `https://www.tudominio.com`, entonces usa esa URL exacta.

## 6. Regla simple

En produccion, esta app solo necesita 5 variables:

1. `NEXT_PUBLIC_API_BASE_URL`
2. `NEXT_PUBLIC_APP_URL`
3. `DATABASE_URL`
4. `GMAIL_USER`
5. `GMAIL_APP_PASSWORD`
