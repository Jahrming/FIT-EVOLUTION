# 🏗️ Arquitectura y Diagramas UML - FIT EVOLUTION360

Este documento contiene la representación visual y técnica del flujo de la plataforma de aceptación digital. Los diagramas están construidos en formato **Mermaid** y pueden ser visualizados nativamente en GitHub, GitLab, o plugins de Markdown.

## 1. Arquitectura del Sistema (Monorepo)

El proyecto utiliza una arquitectura basada en **Turborepo** dividida en dos aplicaciones principales que se comunican a través de una API REST.

```mermaid
graph TD
    classDef frontend fill:#f3f4f6,stroke:#d1d5db,stroke-width:2px;
    classDef backend fill:#e0f2fe,stroke:#bae6fd,stroke-width:2px;
    classDef database fill:#fef08a,stroke:#fde047,stroke-width:2px;
    classDef external fill:#dcfce7,stroke:#86efac,stroke-width:2px;

    Client((📱 Usuario / Cliente)) --> |Escanea QR| Web[🖥️ Frontend Next.js]
    
    subgraph "Monorepo (Turborepo)"
        Web:::frontend
        API[⚙️ Backend NestJS]:::backend
    end
    
    Web -->|HTTP POST JSON| API
    
    API <--> |Prisma ORM| DB[(🐬 MySQL Local)]:::database
    API --> |SMTP TLS| Gmail[📧 Servidor Gmail]:::external
    
    Gmail --> |Email Bienvenida| ClientEmail((Bandeja Cliente))
    Gmail --> |Notificación| AdminEmail((Bandeja Admin))
```

---

## 2. Flujo de Aceptación Digital (Sequence Diagram)

El siguiente diagrama de secuencia detalla el proceso paso a paso desde que el usuario escanea el código QR en la recepción del gimnasio hasta que el recibo de términos llega a su bandeja de correo.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario (Móvil)
    participant F as Frontend (Next.js)
    participant B as API (NestJS)
    participant DB as MySQL (Prisma)
    participant M as Correo (Gmail SMTP)

    U->>F: Escanea QR (https://tudominio.com/aceptacion?sede=kennedy)
    F->>B: GET /api/v1/sedes/kennedy
    B->>DB: Consulta Sede + Términos Activos (v2)
    DB-->>B: Retorna Sede y HTML de Términos
    B-->>F: Respuesta JSON con Datos Legales
    
    F->>B: GET /api/v1/session-token
    B-->>F: UUID de Sesión (Anti-Spam)
    
    U->>F: Ingresa Datos Personales, Acepta Casillas y Firma
    U->>F: Clic en "Finalizar Registro"
    
    F->>B: POST /api/v1/aceptaciones (Payload DTO Sanitizado)
    
    note right of B: Validaciones de Seguridad (DTO)
    B->>DB: Verifica existencia de Sede y Términos V2
    B->>DB: Inserta registro en tabla 'Aceptaciones'
    DB-->>B: Aceptación Guardada con Éxito (ID Transacción)
    
    note right of B: Disparador de Notificación
    B->>DB: Registra intención de correo en 'correos_log'
    B->>M: Envía correo SMTP al Cliente (HTML V2)
    B->>M: Envía correo SMTP al Administrador (Aviso)
    M-->>B: Correo enviado correctamente
    B->>DB: Actualiza 'correos_log' a ENVIADO
    
    B-->>F: 201 Created (Éxito + TransactionID)
    F-->>U: Pantalla de Éxito 🎉 (Registro Completado)
```

---

## 3. Diagrama de Base de Datos (Entity-Relationship)

Estructura relacional simplificada de la base de datos alojada en XAMPP.

```mermaid
erDiagram
    SEDE ||--o{ TERMINOS_VERSIONES : posee
    SEDE ||--o{ ACEPTACIONES : registra
    TERMINOS_VERSIONES ||--o{ ACEPTACIONES : aplica

    SEDE {
        string id PK
        string slug "Ej: kennedy"
        string nombre
        string ciudad
        string correoAdmin "Para notificaciones"
        boolean activo
    }

    TERMINOS_VERSIONES {
        string id PK
        string sedeId FK
        string contenidoHtml "Texto legal completo"
        int numeroVersion "Ej: 2"
        string estado "ACTIVO / INACTIVO"
    }

    ACEPTACIONES {
        string id PK
        string sedeId FK
        string terminosVersionId FK
        string nombreCompleto
        string numeroDocumento
        string correoElectronico
        string firmaUrl "Ruta Base64 o S3"
        boolean aceptaTerminos
    }

    CORREOS_LOG {
        string id PK
        string aceptacionId FK
        string destinatario
        string tipo "USUARIO / ADMIN"
        string estado "PENDIENTE / ENVIADO / ERROR"
    }
```

---

## 4. Estructura de Proyecto Lógica

El repositorio utiliza **Turborepo** para administrar dependencias cruzadas. La comunicación principal se da entre `apps/web` y `apps/api`.

```mermaid
mindmap
  root((FIT EVOL.))
    apps
      web (Next.js 14)
        app/aceptacion
          components
          page.tsx
        lib
          schemas.ts
          api.ts
      api (NestJS 10)
        src/modules
          aceptacion
          correo
          sedes
        prisma
          schema.prisma
          seed.ts
    packages
      eslint-config
      typescript-config
```
