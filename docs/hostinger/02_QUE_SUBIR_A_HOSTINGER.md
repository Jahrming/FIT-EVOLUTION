# Que Subir A Hostinger

Esta guia evita el error mas comun: subir el proyecto equivocado.

## 1. Que SI debes subir

Debes subir solo el contenido de:

- `apps/web`

No debes subir:

- la raiz completa del monorepo
- `apps/api`
- `node_modules`
- `.next`
- `.env.local`

## 2. Que archivos deben existir dentro de lo que subes

Como minimo, dentro del paquete final deben quedar visibles:

- `package.json`
- `next.config.js`
- `app`
- `components`
- `lib`
- `prisma`
- `public`
- `styles`
- `tailwind.config.ts`
- `postcss.config.js`
- `tsconfig.json`
- `.eslintrc.json`

## 3. Metodo recomendado si usas GitHub

Si Hostinger despliega desde GitHub:

- el repositorio puede ser el monorepo completo
- pero la configuracion de despliegue debe apuntar al proyecto `apps/web`

Antes de pulsar deploy, confirma que la app seleccionada es la del frontend actual con backend interno, no `apps/api`.

## 4. Metodo recomendado si usas ZIP

Si Hostinger despliega por ZIP:

1. entra a `apps/web`
2. selecciona todo el contenido dentro de esa carpeta
3. comprime solo ese contenido
4. nombre sugerido del archivo: `fit-evolution360-hostinger.zip`

## 5. Como comprobar que el ZIP esta bien hecho

Abre el ZIP en tu computador.

Si esta correcto, al abrirlo debes ver directamente:

- `package.json`
- `app`
- `lib`
- `prisma`

Si al abrirlo primero ves una carpeta intermedia como:

- `apps`
- `web`
- `fit-evolution360`

entonces el ZIP esta mal hecho y Hostinger puede detectar mal la app.

## 6. Que NO debes incluir nunca

No metas dentro del ZIP:

- `node_modules`
- `.next`
- `dist`
- `.turbo`
- `.env`
- `.env.local`
- archivos temporales del sistema

## 7. Senales de que subiste el paquete incorrecto

Si en Hostinger ves alguno de estos sintomas, casi siempre subiste mal el proyecto:

- no detecta `Next.js`
- no encuentra `package.json`
- no corre `npm run build`
- intenta arrancar otra app distinta
- te pide un `entry file` raro

## 8. Regla simple

Para este proyecto, recuerda esta regla:

- si estas desplegando en Hostinger, casi siempre solo necesitas `apps/web`
