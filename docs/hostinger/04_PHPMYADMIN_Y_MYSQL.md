# phpMyAdmin y MySQL

Esta guia explica como revisar la base de datos en Hostinger sin dañar el proyecto.

## 1. Compatibilidad

Si, este proyecto es compatible con phpMyAdmin.

Motivo:

- Prisma usa `provider = "mysql"` en [apps/web/prisma/schema.prisma](/D:/Jose/UDI/PRACTICAS/fit-evolution360/apps/web/prisma/schema.prisma)
- Hostinger ofrece MySQL
- phpMyAdmin sirve para ver y administrar esa base desde hPanel

En resumen:

- Prisma crea y actualiza la estructura
- phpMyAdmin te deja revisar si todo realmente se guardo

## 2. Para que usar phpMyAdmin

Usalo para:

- confirmar que la base existe
- confirmar que las tablas existen
- revisar registros guardados
- exportar respaldos
- revisar correos log
- revisar que `correo_admin` este correcto en `sedes`

## 3. Para que NO usar phpMyAdmin

No lo uses para:

- renombrar tablas manualmente
- cambiar tipos de columnas manualmente
- borrar relaciones
- alterar claves foraneas por tu cuenta

Si haces eso, Prisma y la base pueden quedar desalineados.

## 4. Como entrar a phpMyAdmin en Hostinger

En Hostinger:

1. entra a `Websites`
2. entra al sitio
3. `Dashboard`
4. busca `Databases Management`
5. ubica tu base
6. pulsa `Enter phpMyAdmin`

## 5. Tablas que deberias ver

Despues de correr:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

deberias ver estas tablas:

- `sedes`
- `terminos_versiones`
- `sesion_tokens`
- `aceptaciones`
- `correos_log`
- `roles`
- `usuarios_admin`
- `usuarios_admin_sedes`
- `auditoria_logs`

## 6. Revision minima despues del seed

En phpMyAdmin revisa:

1. tabla `sedes`
2. tabla `terminos_versiones`

Confirma:

- existe la sede `kennedy`
- existe una version activa de terminos
- el correo admin apunta a `nortefitevolution360@gmail.com`

## 7. Revision minima despues de una prueba real

Despues de enviar un registro desde la web:

1. abre tabla `aceptaciones`
2. confirma que existe una fila nueva
3. abre tabla `correos_log`
4. confirma que existan logs del usuario y de administracion

## 8. Si no aparece informacion nueva

Revisa en este orden:

1. `DATABASE_URL`
2. que la base correcta este asignada al sitio en Hostinger
3. que el `prisma db push` se ejecuto contra la base remota
4. que la app desplegada use esas mismas variables

## 9. Nota sobre Hostinger y MySQL

Segun la documentacion oficial consultada el `25 de mayo de 2026`:

- Hostinger ofrece MySQL en estos planes compartidos o gestionados
- la conexion remota usa puerto `3306`
- la gestion desde panel se hace por `Databases Management` y `phpMyAdmin`

Fuentes oficiales:

- https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
- https://www.hostinger.com/support/1583546-how-to-set-up-remote-mysql-access-in-hostinger/
- https://www.hostinger.com/support/1864454-how-to-manage-mysql-databases-in-hostinger/
