# Documentación — FIT_EVOLUTION360

Documentación técnica y de producto para la plataforma digital de FIT_EVOLUTION360.

## Índice

| Documento | Descripción |
|-----------|-------------|
| [propuesta_integral.md](./propuesta_integral.md) | Propuesta completa: requerimientos, arquitectura, flujos, API, fases, pruebas, seguridad, roadmap |
| [db_schema.md](./db_schema.md) | Esquema Prisma completo con todas las entidades y notas de implementación |
| [backlog.md](./backlog.md) | Backlog priorizado: 36 historias de usuario con criterios de aceptación |
| [risks.md](./risks.md) | Registro de riesgos técnicos, legales, operativos y de negocio |

## Estructura del Proyecto

```
fit-evolution360/
├── apps/
│   ├── web/         # Next.js 14 — Frontend (landing, formulario QR, panel admin)
│   └── api/         # NestJS — Backend REST API
├── docs/            # Esta carpeta
└── packages/        # Paquetes compartidos (Fase 1+)
```

## Convenciones

- **Idioma**: Código en inglés, documentación en español
- **Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Ramas**: `main` (producción), `develop` (desarrollo), `feat/nombre-feature`
