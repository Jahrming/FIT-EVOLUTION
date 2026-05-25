# Checklist Final

Marca cada paso solo cuando realmente lo hayas verificado.

## 1. Plan y dominio

- [ ] tengo un plan Hostinger compatible con Node.js Web Apps
- [ ] mi dominio ya apunta a Hostinger
- [ ] usare una sola app para `tudominio.com`

## 2. Base de datos

- [ ] cree la base MySQL en Hostinger
- [ ] guarde `database name`
- [ ] guarde `database username`
- [ ] guarde `database password`
- [ ] guarde `database host`
- [ ] confirme puerto `3306`
- [ ] habilite `Remote MySQL`

## 3. Preparacion local

- [ ] cree o edite `apps/web/.env.local`
- [ ] puse bien `DATABASE_URL`
- [ ] puse bien `GMAIL_USER`
- [ ] puse bien `GMAIL_APP_PASSWORD`
- [ ] corri `npx prisma generate`
- [ ] corri `npx prisma db push`
- [ ] corri `npx prisma db seed`

## 4. Revision en phpMyAdmin

- [ ] entre a phpMyAdmin desde Hostinger
- [ ] vi la tabla `sedes`
- [ ] vi la tabla `terminos_versiones`
- [ ] vi la tabla `aceptaciones`
- [ ] confirme que existe la sede `kennedy`
- [ ] confirme que el correo admin es `nortefitevolution360@gmail.com`

## 5. Paquete correcto

- [ ] confirme que solo voy a desplegar `apps/web`
- [ ] no voy a desplegar `apps/api`
- [ ] no voy a subir `node_modules`
- [ ] no voy a subir `.next`
- [ ] no voy a subir `.env.local`
- [ ] si uso ZIP, el ZIP abre directamente en `package.json`

## 6. Configuracion en Hostinger

- [ ] cree una sola app Node.js para `tudominio.com`
- [ ] seleccione `Node 20.x`
- [ ] configure las 5 variables de entorno
- [ ] revise el install command
- [ ] revise el build command
- [ ] revise el start command

## 7. Deploy

- [ ] lance el deploy
- [ ] no hubo errores de dependencias
- [ ] no hubo errores de build
- [ ] la app quedo en estado activo

## 8. Validacion tecnica

- [ ] abri `https://tudominio.com/backend/api/v1/sedes/kennedy`
- [ ] esa URL devolvio JSON
- [ ] abri `https://tudominio.com/backend/api/v1/session-token`
- [ ] esa URL devolvio un token

## 9. SSL

- [ ] active SSL en `tudominio.com`
- [ ] active SSL en `www.tudominio.com` si lo uso

## 10. Prueba funcional real

- [ ] abri la web desde un celular
- [ ] cargaron los pasos del formulario
- [ ] la firma funciono
- [ ] pude enviar el formulario
- [ ] vi la pantalla de exito
- [ ] llego correo al usuario
- [ ] llego correo a `nortefitevolution360@gmail.com`
- [ ] vi el registro nuevo en phpMyAdmin

## 11. Si todo esta marcado

El despliegue en Hostinger esta listo y operativo.
