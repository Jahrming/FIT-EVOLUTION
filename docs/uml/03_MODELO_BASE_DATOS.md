# Diagrama 3: Modelo de Base de Datos

Modelo reflejado en `apps/api/prisma/schema.prisma`. Los contratos legales viven versionados, cada aceptacion captura trazabilidad tecnica y existe auditoria para los usuarios administrativos.

## Resumen del modelo
- `sedes` define la unidad operativa y expone `slug`, contacto y flag `activo`.
- `terminos_versiones` guarda historicos; `aceptaciones` apunta a la version firmada y almacena hashes, consentimientos y metadata tecnica.
- `sesion_tokens` actua como control anti doble submit (token + expiracion + flag `usado`).
- `correos_log` persiste la intencion y resultado de cada correo real.
- `usuarios_admin`, `roles`, `usuarios_admin_sedes` y `auditoria_logs` resguardan operacion interna y trazabilidad legal.

## Imagen renderizada
![Diagrama Modelo de Datos](./diagrams/modelo_base_datos.svg)

## Notas clave
1. La inmutabilidad legal viene del par `terminos_versiones` + `aceptaciones.documentoHashAceptado`.
2. `aceptaciones` registra IP, user-agent, consentimientos booleanos y contacto de emergencia, alineado con la Ley 1581.
3. `correos_log` permite reintentos o auditorias de entrega (campos `estado`, `proveedorId`, `intentos`).
4. `auditoria_logs` y `usuarios_admin_sedes` soportan futuras consolas operativas multi-sede sin exponer credenciales en el frontend.

### Mermaid (referencia editable)
```mermaid
erDiagram
    SEDE ||--o{ TERMINOS_VERSION : "publica"
    SEDE ||--o{ ACEPTACION : "registra"
    TERMINOS_VERSION ||--o{ ACEPTACION : "respalda"
    ACEPTACION ||--o{ CORREO_LOG : "emite"
    SEDE ||--o{ USUARIO_ADMIN_SEDE : "asigna"
    USUARIO_ADMIN ||--o{ USUARIO_ADMIN_SEDE : "opera"
    ROL ||--o{ USUARIO_ADMIN : "perfila"
    USUARIO_ADMIN ||--o{ AUDITORIA_LOG : "audita"

    SEDE {
        string id PK "uuid"
        string slug "kennedy"
        string nombre
        string ciudad
        string direccion "opcional"
        string correoAdmin
        boolean activo
        datetime createdAt
    }

    TERMINOS_VERSION {
        string id PK
        string sedeId FK
        int numeroVersion
        enum estado "BORRADOR/ACTIVO"
        text contenidoHtml
        string contenidoHash
        datetime publicadoAt "opcional"
    }

    SESION_TOKEN {
        string id PK
        string token "unique"
        string sedeSlug
        boolean usado
        datetime expiresAt
    }

    ACEPTACION {
        string id PK
        string sedeId FK
        string terminosVersionId FK
        string transactionId "unique"
        enum estado "PENDIENTE/COMPLETADO"
        string nombreCompleto
        enum tipoDocumento
        string numeroDocumento
        string correoElectronico
        string telefono
        boolean aceptaTerminos
        boolean aceptaTratamientoDatos
        boolean declaraCondicionFisica
        boolean autorizaUsoImagen
        json metadataExtra "opcional"
        string documentoHashAceptado
        datetime timestampFirma
    }

    CORREO_LOG {
        string id PK
        string aceptacionId FK
        enum tipo "USUARIO/ADMIN"
        enum estado "PENDIENTE/ENVIADO/FALLIDO"
        string destinatario
        string proveedorId "opcional"
        int intentos
        datetime enviadoAt "opcional"
    }

    ROL {
        string id PK
        enum nombre "SUPERADMIN/ADMIN_SEDE/..."
        string descripcion "opcional"
    }

    USUARIO_ADMIN {
        string id PK
        string nombre
        string email "unique"
        string passwordHash
        string rolId FK
        boolean activo
        datetime ultimoLogin "opcional"
    }

    USUARIO_ADMIN_SEDE {
        string usuarioAdminId FK
        string sedeId FK
        datetime asignadoAt
    }

    AUDITORIA_LOG {
        string id PK
        string usuarioAdminId FK
        string accion
        string entidad "opcional"
        string entidadId "opcional"
        json detalle "opcional"
        string ipAddress "opcional"
        datetime createdAt
    }
```
