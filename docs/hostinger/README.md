# Hostinger

Documentacion vigente para desplegar `FIT EVOLUTION360` en Hostinger con este escenario:

- una sola app Node.js: `apps/web`
- una sola carpeta de despliegue en Hostinger
- subida manual por `FTP` o `File Manager`
- base de datos MySQL ya creada y ya configurada
- mismo dominio para web y rutas tecnicas `/backend`

## Estado real del proyecto

La arquitectura recomendada y soportada por el codigo actual es:

- `apps/web` es la unica app que se despliega
- `apps/web` sirve la UI y tambien las rutas `/backend/api/v1/...`
- `apps/api` no hace parte del despliegue manual actual en Hostinger

## Documentos vigentes

Lee en este orden:

1. `01_GUIA_COMPLETA_NO_TECNICA.md`
2. `02_QUE_SUBIR_A_HOSTINGER.md`
3. `03_VARIABLES_EXACTAS.md`
4. `05_CHECKLIST_FINAL.md`

Complemento tecnico corto:

- `../DESPLIEGUE_HOSTINGER.md`

## Nota importante

Subir archivos por FTP no termina el despliegue por si solo.

Despues de subir los archivos a la carpeta de la app Node.js en Hostinger, tambien debes:

1. revisar variables de entorno
2. correr `install`
3. correr `build`
4. reiniciar o redeployar la app

## Documentos antiguos

Los archivos antiguos fuera de esta carpeta se dejaron solo como punteros:

- `../HOSTINGER_GUIA_PARA_NO_TECNICOS.md`
- `../HOSTINGER_DESPLIEGUE_PASO_A_PASO.md`

Si ves instrucciones que hablen de `apps/api`, `api.tudominio.com` o `2 apps Node.js`, ignoralas para este despliegue.
