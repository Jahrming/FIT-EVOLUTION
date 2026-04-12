# Diagrama 1: Flujo del Usuario

El recorrido refleja el flujo real del onboarding digital implementado en `apps/web/app/aceptacion/page.tsx`: el recepcionista entrega un QR, el cliente atraviesa los 5 pasos guiados en Next.js 14 y la API NestJS valida cada entrega antes de almacenar y notificar.

## Resumen operativo
- El frontend (Next.js + Tailwind) es 100% mobile-first y controla el avance desde el componente `AceptacionContent`.
- Zod y React Hook Form se encargan de validar y mostrar errores en tiempo real antes de permitir el avance.
- Cada envio necesita un token emitido por `SessionTokenService` para evitar doble submit y spam.
- La API `POST /api/v1/aceptaciones` inserta con Prisma y dispara correos reales mediante `CorreoService`.

## Imagen renderizada
![Diagrama Flujo del Usuario](./diagrams/flujo_usuario.svg)

## Narrativa paso a paso
1. Cliente llega a la sede y escanea `https://.../aceptacion?sede=kennedy` desde el counter.
2. Next.js muestra la pantalla de bienvenida y luego los pasos Datos > Terminos > Consents > Firma > Confirmacion.
3. Cada paso valida con Zod; los errores regresan a la misma vista hasta corregirlos.
4. Antes de enviar, el frontend solicita `GET /api/v1/session-token` (anti double submit) y empaqueta formulario, consentimientos y firma (`firmaBase64`).
5. El backend verifica sede activa, version de terminos `estado=ACTIVO`, compara correos y recalcula el hash del HTML legal.
6. Prisma crea el registro en `aceptaciones`, deja evidencias (transactionId, hash, metadata tecnica) y genera logs en `correos_log`.
7. `CorreoService` usa Gmail SMTP para enviar el comprobante al cliente y la copia administrativa; el frontend muestra la pantalla verde de exito.

### Mermaid (referencia editable)
```mermaid
graph TD
    classDef persona fill:#fef3c7,stroke:#facc15,stroke-width:2px;
    classDef ui fill:#e0f2fe,stroke:#2563eb,stroke-width:2px;
    classDef backend fill:#fae8ff,stroke:#c026d3,stroke-width:2px;
    classDef correo fill:#dcfce7,stroke:#16a34a,stroke-width:2px;

    A[1. Cliente llega a la sede y escanea QR /aceptacion?sede=kennedy]:::persona
    B[2. Frontend Next.js muestra Welcome + 5 pasos guiados]:::ui
    C{3. Validaciones Zod + React Hook Form}:::ui
    D[4. UI solicita token GET /session-token anti spam]:::ui
    E[5. Cliente revisa terminos HTML, consents y firma digital]:::persona
    F[6. Frontend empaqueta formulario + consentimientos + token]:::ui
    G[7. API POST /aceptaciones NestJS DTO + ValidationPipe]:::backend
    H[8. Prisma guarda en MySQL y emite transactionId]:::backend
    I[9. Servicio de correos crea logs y dispara Gmail SMTP]:::backend
    J[10. Cliente ve pantalla de exito + recibe comprobantes]:::persona
    K[11. Copia oculta llega al administrador correoAdmin de la sede]:::correo

    A --> B
    B --> C
    C -->|Corrige datos| B
    C -->|Todo ok| D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    I --> K
```
