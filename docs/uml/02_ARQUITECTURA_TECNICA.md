# Diagrama 2: Arquitectura Tecnica

Este diagrama describe la conversacion real entre el frontend Next.js (app router) y la API NestJS levantada en `apps/api/src/main.ts`. Incluye los controladores `SedesController`, `SessionTokenController`, `AceptacionController` y la cadena Prisma/MySQL + Gmail SMTP.

## Resumen tecnico
- `apps/web/lib/api.ts` centraliza las llamadas HTTP (sedes, session-token, aceptaciones) contra `NEXT_PUBLIC_API_URL`.
- `AppModule` aplica `helmet`, CORS cerrado al dominio del frontend y `ValidationPipe` global con sanitizacion de DTOs.
- El Throttler limita los formularios a 5 solicitudes por minuto; `SessionTokenService` genera UUID de 1 hora y marca consumo.
- `AceptacionService` valida sede/terminos, calcula `documentoHashAceptado`, crea logs en `correos_log` y delega a `CorreoService`.

## Imagen renderizada
![Diagrama Arquitectura Tecnica](./diagrams/arquitectura_tecnica.svg)

## Explicacion
1. El celular abre `/aceptacion?sede=kennedy` y la UI consulta `GET /api/v1/sedes/:slug` para mostrar textos legales vigentes.
2. El frontend obtiene `GET /api/v1/session-token` para cada intento y guarda el token en memoria.
3. El usuario completa el wizard; los datos salen via `POST /api/v1/aceptaciones` firmados con el token.
4. `AceptacionController` pasa por `ValidationPipe`, `SessionTokenService`, `SedesService`, `PrismaService` y crea los `correoLog`.
5. `CorreoService` (Nodemailer) negocia TLS con Gmail y envia los dos recibos; la UI recibe `transactionId` y muestra la pantalla de exito.

### Mermaid (referencia editable)
```mermaid
sequenceDiagram
    autonumber
    actor U as Cliente (QR)
    participant UI as Next.js 14 (App Router)
    participant API as NestJS 10 (AppModule)
    participant DB as Prisma/MySQL
    participant SMTP as Gmail SMTP (Nodemailer)

    U->>UI: Abre /aceptacion?sede=kennedy
    UI->>API: GET /api/v1/sedes/kennedy
    note right of API: SedesController -> SedesService -> Prisma.sede.findFirst()
    API->>DB: Consulta sede activa + terminos version vigentes
    DB-->>API: Datos legales + contenidoHtml
    API-->>UI: JSON con sede y terminosActivos

    UI->>API: GET /api/v1/session-token
    note right of API: SessionTokenService genera UUID 1h y marca anti double submit
    API-->>UI: sessionToken

    U->>UI: Completa pasos (datos, terminos, consents, firma)
    note over U,UI: React Hook Form + Zod validan y muestran errores UI

    UI->>API: POST /api/v1/aceptaciones
    note right of API: ValidationPipe + DTO + Throttler (5 req/min)
    API->>API: Validar token, sede activa, terminos ACTIVO, correos
    API->>DB: Inserta Aceptacion + logs de correo + hash documento
    DB-->>API: transactionId y registro persistido

    API->>SMTP: Nodemailer usa Gmail TLS (cliente + admin)
    SMTP-->>API: messageId / estado
    API-->>UI: 201 Created {transactionId, correoEnviado:true}
    UI-->>U: Pantalla de exito + ID legal

    note left of API: AppModule aplica Helmet, CORS, prefix api/v1 y PrismaModule
```
