<div align="center">
  <img src="./apps/web/public/logo.png" alt="FIT EVOLUTION360 Logo" width="120" />
</div>

<h1 align="center">FIT EVOLUTION360 - Plataforma de Aceptación Digital</h1>

<div align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white">
</div>

<br/>

Este repositorio contiene la Plataforma de Registro, Aceptación de Términos Digitales y Notificaciones Automáticas para **FIT EVOLUTION360**. El ecosistema fue construido usando una arquitectura monorepo de alto rendimiento accionada por **Turborepo**.

## 📖 Documentación Principal (Docs)

Hemos creado una serie de manuales detallados ubicados en la carpeta `docs/` para garantizar la sostenibilidad y escalabilidad del proyecto:

1. 🏛️ **[Arquitectura y Diagramas UML](./docs/ARQUITECTURA_Y_DIAGRAMAS.md)**: Flujos del usuario, Diagrama E-R de la Base de Datos MySQL y Comunicación Frontend-Backend.
2. 🛠️ **[Guía Operativa y Mantenimiento Manual](./docs/GUIA_OPERATIVA.md)**: Cómo modificar el correo de los administradores, los colores de la marca, los textos legales, y las credenciales de Gmail.
3. 📋 **[Estado Actual del Proyecto](./docs/ESTADO_ACTUAL.md)**: Registro del 100% de la funcionalidad entregada en la Fase 1 y 2.

---

## 🚀 Tecnologías Core

### Frontend (User Interface)
- **Next.js 14 (App Router)**: Framework React para Server-Side Rendering rápido.
- **Tailwind CSS v3**: Identidad visual *mobile-first* personalizada (Amarillo/Negro).
- **React Hook Form + Zod**: Validación estricta de formularios y seguridad.
- **React Signature Canvas**: Captura del panel de firma digital biométrica (Opcional).

### Backend (Logic & Mailing)
- **NestJS 10**: Arquitectura hexagonal y basada en controladores.
- **Prisma ORM**: Modelado estricto e inyección de datos para MySQL.
- **Nodemailer (Gmail SMTP)**: Servicio de envío de recibos legales instantáneos al cliente y copias ocultas a la administración.

---

## ⚡ Comandos Rápidos

Si ya tienes las dependencias instaladas y tu XAMPP/MySQL configurado, puedes encender toda la plataforma simultáneamente con un solo comando:

```bash
# Iniciar Frontend (Puerto 3000) y Backend (Puerto 3001) paralelamente
npm run dev

# Regenerar cliente de base de datos
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed
```

Para ver la guía de instalación desde cero en un computador nuevo, revisa el paso 4 de la [Guía Operativa](./docs/GUIA_OPERATIVA.md).

---

## 🔒 Privacidad y Legal
Toda la captura de información de clientes, el almacenamiento de metadatos (IP, User Agent) y la trazabilidad de aceptaciones (Hashes SHA-256) cumple rigurosamente con la **Ley 1581 de 2012** (Colombia) sobre Protección de Datos Personales.
