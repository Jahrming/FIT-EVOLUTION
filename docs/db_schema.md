# Esquema de Base de Datos

La fuente de verdad del modelo de datos es:

- `apps/api/prisma/schema.prisma`

Configuracion actual:

- motor: MySQL
- ORM: Prisma
- enfoque: multisede, versionado de terminos, tokens de sesion y trazabilidad de aceptaciones

## Archivos relacionados

- esquema: `apps/api/prisma/schema.prisma`
- seed: `apps/api/prisma/seed.ts`
- servicio de aceptaciones: `apps/api/src/modules/aceptacion/aceptacion.service.ts`

## Flujo de persistencia

1. El frontend obtiene la sede activa.
2. El frontend obtiene un `sessionToken`.
3. El backend valida token, sede y version de terminos.
4. El backend crea la aceptacion.
5. El backend registra `correos_log`.
6. El backend intenta enviar los correos.

La logica de guardado no se modifico. Solo se ordeno la configuracion del proyecto para que el entorno sea consistente con MySQL.
