# Variables Exactas

## 1. Variables del backend en Hostinger

```env
PORT=3001
DATABASE_URL=mysql://USUARIO_DB:PASSWORD_DB@HOST_DB:3306/NOMBRE_DB
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
GMAIL_USER=nortefitevolution360@gmail.com
GMAIL_APP_PASSWORD=TU_CLAVE_DE_APLICACION
```

## 2. Variables del frontend en Hostinger

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

## 3. Si quieres usar un subdominio para frontend

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

Backend:

```env
CORS_ORIGIN=https://app.tudominio.com,https://tudominio.com
```

## 4. Si el frontend va en el dominio principal

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=/backend
API_PROXY_TARGET=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

Backend:

```env
CORS_ORIGIN=https://tudominio.com,https://www.tudominio.com
```

## 5. Nunca pongas esto mal

### No hagas esto

- no pongas `localhost` en produccion
- no pongas `127.0.0.1` como `DATABASE_URL` en Hostinger
- no pongas la URL del frontend dentro de `DATABASE_URL`

### Debe quedar asi

- `DATABASE_URL` apuntando al MySQL de Hostinger
- `API_PROXY_TARGET` apuntando al backend publico
- `CORS_ORIGIN` apuntando a tus dominios reales
