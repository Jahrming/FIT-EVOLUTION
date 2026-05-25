# Checklist Final

Usa esta lista y marca cada punto.

## Base de datos

- [ ] cree la base MySQL en Hostinger
- [ ] guarde host, usuario, password y nombre de base
- [ ] habilite `Remote MySQL`
- [ ] puse bien `DATABASE_URL` en `apps/api/.env`
- [ ] corri `npx prisma generate`
- [ ] corri `npx prisma db push`
- [ ] corri `npx prisma db seed`
- [ ] verifique tablas en phpMyAdmin

## Backend

- [ ] comprimi correctamente el contenido de `apps/api`
- [ ] cree una app Node.js para `api.tudominio.com`
- [ ] puse variables del backend
- [ ] use `npm install && npx prisma generate && npm run build`
- [ ] use `npm run start`
- [ ] abri `https://api.tudominio.com/api/v1/sedes/kennedy`
- [ ] abri `https://api.tudominio.com/api/v1/session-token`

## Frontend

- [ ] configure `apps/web/.env.local`
- [ ] comprimi correctamente el contenido de `apps/web`
- [ ] cree una app Node.js para `app.tudominio.com`
- [ ] puse variables del frontend
- [ ] use `npm install && npm run build`
- [ ] use `npm run start`
- [ ] abri el frontend desde el navegador

## Dominio y SSL

- [ ] cree el subdominio `api`
- [ ] cree el subdominio `app`
- [ ] active SSL en ambos

## Prueba funcional

- [ ] abri el formulario desde un celular
- [ ] complete un registro
- [ ] el registro se guardo
- [ ] llego correo al usuario
- [ ] llego correo a `nortefitevolution360@gmail.com`

## Si todo esta marcado

Tu despliegue en Hostinger esta listo.
