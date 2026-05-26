# Que Subir A Hostinger

Esta guia aplica al despliegue manual por FTP o `File Manager`.

## 1. Regla principal

Debes subir solo el contenido de:

- `apps/web`

No debes subir:

- la raiz completa del proyecto
- `apps/api`
- una carpeta extra llamada `apps`
- una carpeta extra llamada `web`

## 2. Como debe verse la carpeta final en Hostinger

Dentro de la carpeta raiz de la app Node.js en Hostinger, al abrirla debes ver directamente:

- `package.json`
- `next.config.js`
- `app`
- `lib`
- `prisma`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `next-env.d.ts`
- `.eslintrc.json`

Si eso no es lo que ves, la subida quedo mal estructurada.

## 3. Ejemplo correcto

Correcto:

```text
/carpeta-de-tu-app/
  package.json
  next.config.js
  app/
  lib/
  prisma/
```

## 4. Ejemplos incorrectos

Incorrecto:

```text
/carpeta-de-tu-app/
  apps/
    web/
      package.json
```

Incorrecto:

```text
/carpeta-de-tu-app/
  fit-evolution360/
    apps/
      web/
        package.json
```

## 5. Que nunca debes subir

No subas:

- `node_modules`
- `.next`
- `.env`
- `.env.local`
- `tsconfig.tsbuildinfo`
- `.turbo`
- `dist`
- archivos temporales del sistema

## 6. Que si puedes reemplazar

Cuando hagas un nuevo deploy manual, normalmente vas a reemplazar:

- `app`
- `lib`
- `prisma`
- `package.json`
- `next.config.js`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`

## 7. Cuando debes limpiar archivos viejos

Si renombraste o eliminaste archivos en local, recuerda que FTP no siempre borra lo viejo automaticamente.

Entonces:

- si solo actualizaste archivos existentes, con sobrescribir suele bastar
- si eliminaste archivos o cambiaste estructura, borra esos archivos viejos tambien en Hostinger

## 8. Regla simple final

Si en la carpeta final de Hostinger ves `package.json` sin abrir ninguna subcarpeta intermedia, vas bien.
