# Que Subir A Hostinger

## 1. Backend

Sube solo el contenido de:

- `apps/api`

### Debe incluir

- `package.json`
- `nest-cli.json`
- `tsconfig.json`
- `src`
- `prisma`

### No debe incluir

- `node_modules`
- `dist`
- `.env`
- la carpeta raiz del monorepo

## 2. Frontend

Sube solo el contenido de:

- `apps/web`

### Debe incluir

- `package.json`
- `next.config.js`
- `app`
- `lib`
- `tailwind.config.ts`
- `postcss.config.js`
- `tsconfig.json`

### No debe incluir

- `node_modules`
- `.next`
- `.env.local`
- la carpeta raiz del monorepo

## 3. Como comprimirlo sin equivocarte

### Backend

1. entra a `apps/api`
2. selecciona todo el contenido dentro de esa carpeta
3. comprime eso en un zip
4. nombre sugerido: `backend-hostinger.zip`

### Frontend

1. entra a `apps/web`
2. selecciona todo el contenido dentro de esa carpeta
3. comprime eso en un zip
4. nombre sugerido: `frontend-hostinger.zip`

## 4. Error comun

No comprimas la carpeta `apps/api` completa dentro de otra carpeta.

El zip debe abrir y mostrar directo:

- `package.json`
- `src`
- `prisma`

Lo mismo para frontend:

- `package.json`
- `app`
- `lib`

Si al abrir el zip primero ves otra carpeta intermedia, vuelve a comprimir.
