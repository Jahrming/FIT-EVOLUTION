# phpMyAdmin y MySQL

## 1. Compatibilidad

Si, este proyecto es compatible con phpMyAdmin porque:

- Prisma usa `provider = "mysql"` en `apps/api/prisma/schema.prisma`
- phpMyAdmin administra bases MySQL y MariaDB

En otras palabras:

- Prisma crea las tablas
- phpMyAdmin te permite verlas, consultarlas y revisar registros

## 2. Lo recomendado

### Usa phpMyAdmin para

- confirmar que la base existe
- confirmar que las tablas existen
- revisar registros
- exportar respaldos

### Usa Prisma para

- crear el esquema
- empujar cambios de tablas
- sembrar datos iniciales

## 3. Tablas que deberias ver

Despues de `prisma db push` y `prisma db seed`, en phpMyAdmin deberias ver:

- `sedes`
- `terminos_versiones`
- `sesion_tokens`
- `aceptaciones`
- `correos_log`
- `roles`
- `usuarios_admin`
- `usuarios_admin_sedes`
- `auditoria_logs`

## 4. Qué NO debes hacer en phpMyAdmin

No recomiendo:

- borrar tablas manualmente
- cambiar nombres de columnas
- alterar relaciones
- cambiar tipos de datos manualmente

Si haces eso, Prisma puede quedar desalineado con la base.

## 5. Qué SI puedes hacer sin problema

- ver los registros
- exportar la base
- revisar correos guardados
- revisar aceptaciones
- revisar que `correo_admin` este correcto en `sedes`

## 6. Sobre MySQL y Hostinger

Prisma documenta oficialmente que el conector `mysql` funciona con MySQL y MariaDB.

Fuente oficial Prisma:

- https://docs.prisma.io/docs/v6/orm/overview/databases/mysql
- https://www.prisma.io/docs/orm/overview/databases/mysql

Eso significa que, si Hostinger te da MySQL o MariaDB administrado, el proyecto sigue siendo valido con el conector actual.
