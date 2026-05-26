# Checklist Final

Marca cada punto solo cuando lo hayas verificado de verdad.

## 1. Arquitectura correcta

- [ ] voy a desplegar una sola app Node.js
- [ ] la app a desplegar es `apps/web`
- [ ] no voy a desplegar `apps/api`
- [ ] voy a usar una sola carpeta raiz en Hostinger

## 2. Base de datos

- [ ] la base MySQL ya existe
- [ ] tengo el `DATABASE_URL` real
- [ ] no necesito cambios de esquema para este deploy
- [ ] si habia cambios de esquema, ya corri `prisma db push`

## 3. Paquete correcto

- [ ] confirme que voy a subir solo el contenido de `apps/web`
- [ ] no voy a subir la raiz completa del monorepo
- [ ] no voy a subir `node_modules`
- [ ] no voy a subir `.next`
- [ ] no voy a subir `.env.local`
- [ ] no voy a subir `tsconfig.tsbuildinfo`

## 4. Estructura correcta en Hostinger

- [ ] en la carpeta final se ve `package.json` directamente
- [ ] en la carpeta final se ve `next.config.js`
- [ ] en la carpeta final se ven `app`, `lib` y `prisma`
- [ ] no quedo una carpeta extra `apps`
- [ ] no quedo una carpeta extra `web`

## 5. Variables de entorno

- [ ] configure `NEXT_PUBLIC_API_BASE_URL=/backend`
- [ ] configure `NEXT_PUBLIC_APP_URL`
- [ ] configure `DATABASE_URL`
- [ ] configure `GMAIL_USER`
- [ ] configure `GMAIL_APP_PASSWORD`
- [ ] no configure `API_PROXY_TARGET`

## 6. Node.js app

- [ ] la app usa `Node 20.x`
- [ ] revise el `install command`
- [ ] revise el `build command`
- [ ] revise el `start command`

## 7. Despliegue manual

- [ ] subi los archivos por FTP o File Manager
- [ ] reemplace archivos viejos cuando correspondia
- [ ] borre archivos obsoletos si cambie estructura
- [ ] corri `npm install`
- [ ] corri `npx prisma generate`
- [ ] corri `npm run build`
- [ ] reinicie o redeploye la app

## 8. Validacion tecnica

- [ ] abri `https://tudominio.com/backend/api/v1/sedes/kennedy`
- [ ] esa URL devolvio JSON
- [ ] abri `https://tudominio.com/backend/api/v1/session-token`
- [ ] esa URL devolvio un token

## 9. Validacion funcional

- [ ] abri `https://tudominio.com/aceptacion?sede=kennedy`
- [ ] ya no aparecio `Oops, algo salio mal`
- [ ] cargaron los pasos del formulario
- [ ] la firma funciono
- [ ] pude enviar el formulario
- [ ] vi la pantalla de exito

## 10. Verificacion final

- [ ] llego correo al usuario
- [ ] llego correo al correo administrativo
- [ ] vi el nuevo registro en la base de datos

## 11. Si todo esta marcado

El despliegue manual en Hostinger quedo listo.
