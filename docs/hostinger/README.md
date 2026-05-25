# Hostinger

Documentacion de despliegue para `FIT EVOLUTION360` en Hostinger.

Estado actual del proyecto:

- una sola app Node.js: `apps/web`
- un solo dominio visible: `tudominio.com`
- una sola base de datos: MySQL de Hostinger
- `apps/api` ya no es parte del despliegue publico recomendado

## Archivos

- `01_GUIA_COMPLETA_NO_TECNICA.md`
- `02_QUE_SUBIR_A_HOSTINGER.md`
- `03_VARIABLES_EXACTAS.md`
- `04_PHPMYADMIN_Y_MYSQL.md`
- `05_CHECKLIST_FINAL.md`

## Orden recomendado

1. `01_GUIA_COMPLETA_NO_TECNICA.md`
2. `03_VARIABLES_EXACTAS.md`
3. `02_QUE_SUBIR_A_HOSTINGER.md`
4. `04_PHPMYADMIN_Y_MYSQL.md`
5. `05_CHECKLIST_FINAL.md`

## Base oficial consultada

Informacion contrastada el `25 de mayo de 2026` con documentacion oficial de Hostinger:

- Node.js Web Apps: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Migracion de app Node.js: https://www.hostinger.com/support/how-to-migrate-a-node-js-application-to-hostinger/
- Conexion MySQL para Node.js: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
- Remote MySQL: https://www.hostinger.com/support/1583546-how-to-set-up-remote-mysql-access-in-hostinger/
- Gestion de bases y phpMyAdmin: https://www.hostinger.com/support/1864454-how-to-manage-mysql-databases-in-hostinger/

Resumen de esas fuentes:

- Hostinger soporta Node.js Web Apps en planes `Business` y `Cloud`
- soporta `Next.js`
- soporta despliegue por `GitHub` o por `ZIP`
- soporta versiones Node `18.x`, `20.x`, `22.x` y `24.x`
- para esta app debes usar `Node 20.x`
