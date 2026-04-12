# FIT_EVOLUTION360 — Esquema de Base de Datos (Prisma)

## Justificación de Diseño

- **PostgreSQL** como motor principal por soporte ACID, JSONB, pg_crypto, y madurez.
- **UUIDs** como clave primaria en todas las tablas para evitar enumeración secuencial de registros.
- **Soft delete** con `deletedAt` en entidades críticas para retención de datos.
- **Multisede desde el origen**: todas las entidades relevantes tienen FK a `Sede`.
- **Inmutabilidad de versiones**: una vez publicada una versión de T&C, su contenido no se modifica.
- **Hash SHA-256** del contenido HTML del documento para garantizar integridad.

---

## Esquema Prisma Completo

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// ENUMERACIONES
// ============================================================

enum EstadoTerminos {
  BORRADOR
  REVISION
  ACTIVO
  ARCHIVADO
}

enum TipoDocumento {
  CC   // Cédula de Ciudadanía
  CE   // Cédula de Extranjería
  PA   // Pasaporte
  TI   // Tarjeta de Identidad
  NIT
}

enum EstadoAceptacion {
  PENDIENTE      // Sesión iniciada, no completada
  COMPLETADO     // Firma y datos enviados
  ERROR          // Falló el procesamiento
}

enum EstadoCorreo {
  PENDIENTE
  ENVIADO
  FALLIDO
  REINTENTANDO
}

enum TipoCorreo {
  USUARIO
  ADMINISTRACION
}

enum NombreRol {
  SUPERADMIN
  ADMIN_SEDE
  RECEPCIONISTA
  AUDITOR
}

// ============================================================
// SEDES
// ============================================================

model Sede {
  id        String   @id @default(uuid()) @db.Uuid
  slug      String   @unique // ej: "kennedy", "bosa"
  nombre    String   // "FIT EVOLUTION360 - Sede Kennedy"
  ciudad    String
  direccion String?
  telefono  String?
  correoAdmin String  // correo que recibe copias de aceptaciones
  activo    Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime? @map("deleted_at")

  // Relaciones
  terminosVersiones TerminosVersion[]
  aceptaciones      Aceptacion[]
  adminSedes        UsuarioAdminSede[]

  @@map("sedes")
}

// ============================================================
// VERSIONES DE TÉRMINOS Y CONDICIONES
// ============================================================

model TerminosVersion {
  id              String         @id @default(uuid()) @db.Uuid
  sedeId          String?        @db.Uuid @map("sede_id")
  // NULL = aplica globalmente a todas las sedes
  // NOT NULL = aplica solo a esa sede

  numeroVersion   Int
  titulo          String
  estado          EstadoTerminos @default(BORRADOR)
  contenidoHtml   String         @map("contenido_html")   // Contenido completo del documento
  contenidoHash   String         @map("contenido_hash")   // SHA-256 del contenidoHtml
  pdfUrl          String?        @map("pdf_url")          // PDF de la versión del documento
  notas           String?        // Notas de la versión / changelog
  vigenciaDesde   DateTime?      @map("vigencia_desde")
  vigenciaHasta   DateTime?      @map("vigencia_hasta")

  publicadoPorId  String?   @db.Uuid @map("publicado_por_id")
  publicadoAt     DateTime? @map("publicado_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relaciones
  sede            Sede?          @relation(fields: [sedeId], references: [id])
  publicadoPor    UsuarioAdmin?  @relation(fields: [publicadoPorId], references: [id])
  aceptaciones    Aceptacion[]

  @@unique([sedeId, numeroVersion])
  @@index([sedeId, estado])
  @@map("terminos_versiones")
}

// ============================================================
// SESIÓN TOKEN — Prevención de doble envío
// ============================================================

model SesionToken {
  id          String   @id @default(uuid()) @db.Uuid
  token       String   @unique @default(uuid())
  sedeSlug    String   @map("sede_slug")
  usado       Boolean  @default(false)
  expiresAt   DateTime @map("expires_at")
  createdAt   DateTime @default(now()) @map("created_at")
  usadoAt     DateTime? @map("usado_at")

  @@index([token])
  @@map("sesion_tokens")
}

// ============================================================
// ACEPTACIONES (Evento central del sistema)
// ============================================================

model Aceptacion {
  id                  String          @id @default(uuid()) @db.Uuid
  transactionId       String          @unique @default(uuid()) @map("transaction_id")
  estado              EstadoAceptacion @default(PENDIENTE)

  // Sede y versión de términos aceptados
  sedeId              String          @db.Uuid @map("sede_id")
  terminosVersionId   String          @db.Uuid @map("terminos_version_id")

  // Datos del usuario (campos de negocio)
  nombreCompleto      String          @map("nombre_completo")
  tipoDocumento       TipoDocumento   @map("tipo_documento")
  numeroDocumento     String          @map("numero_documento")
  fechaNacimiento     DateTime        @map("fecha_nacimiento") @db.Date

  // Datos de contacto — considerar cifrado a nivel aplicación para email
  telefono            String
  correoElectronico   String          @map("correo_electronico")

  // Consentimientos expresos
  aceptaTerminos          Boolean @default(false) @map("acepta_terminos")
  aceptaTratamientoDatos  Boolean @default(false) @map("acepta_tratamiento_datos")
  declaraCondicionFisica  Boolean @default(false) @map("declara_condicion_fisica")
  autorizaUsoImagen       Boolean @default(false) @map("autoriza_uso_imagen")
  autorizaComunicaciones  Boolean @default(false) @map("autoriza_comunicaciones")

  // Contacto de emergencia (opcional)
  contactoEmergenciaNombre   String? @map("contacto_emergencia_nombre")
  contactoEmergenciaTelefono String? @map("contacto_emergencia_telefono")

  // Metadatos técnicos (trazabilidad)
  ipAddress           String          @map("ip_address")
  userAgent           String          @map("user_agent")
  // JSONB para metadata adicional sin alterar esquema
  metadataExtra       Json?           @map("metadata_extra")

  // Evidencias
  firmaUrl            String?         @map("firma_url")       // URL a imagen PNG de la firma en Storage
  pdfUrl              String?         @map("pdf_url")         // URL al PDF generado en Storage
  documentoHashAceptado String        @map("documento_hash_aceptado") // Hash del documento en el momento de aceptación

  // Timestamps
  timestampInicio     DateTime?       @map("timestamp_inicio")  // Cuando inició el formulario
  timestampFirma      DateTime        @default(now()) @map("timestamp_firma")  // Cuando se envió la firma
  createdAt           DateTime        @default(now()) @map("created_at")
  updatedAt           DateTime        @updatedAt @map("updated_at")
  deletedAt           DateTime?       @map("deleted_at")  // Soft delete para retención

  // Relaciones
  sede                Sede            @relation(fields: [sedeId], references: [id])
  terminosVersion     TerminosVersion @relation(fields: [terminosVersionId], references: [id])
  correosLog          CorreoLog[]

  @@index([sedeId, createdAt])
  @@index([numeroDocumento])
  @@index([correoElectronico])
  @@index([transactionId])
  @@index([estado])
  @@map("aceptaciones")
}

// ============================================================
// LOG DE CORREOS — Estado de entrega
// ============================================================

model CorreoLog {
  id              String      @id @default(uuid()) @db.Uuid
  aceptacionId    String      @db.Uuid @map("aceptacion_id")
  tipo            TipoCorreo
  destinatario    String
  estado          EstadoCorreo @default(PENDIENTE)
  proveedorId     String?     @map("proveedor_id")  // ID del mensaje en Resend/SES
  intentos        Int         @default(0)
  ultimoError     String?     @map("ultimo_error")
  enviadoAt       DateTime?   @map("enviado_at")
  ultimoIntentoAt DateTime?   @map("ultimo_intento_at")
  createdAt       DateTime    @default(now()) @map("created_at")

  // Relaciones
  aceptacion      Aceptacion  @relation(fields: [aceptacionId], references: [id])

  @@index([aceptacionId])
  @@index([estado])
  @@map("correos_log")
}

// ============================================================
// USUARIOS ADMINISTRATIVOS
// ============================================================

model Rol {
  id          String     @id @default(uuid()) @db.Uuid
  nombre      NombreRol  @unique
  descripcion String?
  createdAt   DateTime   @default(now()) @map("created_at")

  usuariosAdmin UsuarioAdmin[]

  @@map("roles")
}

model UsuarioAdmin {
  id             String   @id @default(uuid()) @db.Uuid
  nombre         String
  email          String   @unique
  passwordHash   String   @map("password_hash")
  rolId          String   @db.Uuid @map("rol_id")
  activo         Boolean  @default(true)
  ultimoLogin    DateTime? @map("ultimo_login")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  // Relaciones
  rol            Rol      @relation(fields: [rolId], references: [id])
  sedes          UsuarioAdminSede[]  // Las sedes a las que tiene acceso
  terminosPublicados TerminosVersion[]
  auditoriaLogs  AuditoriaLog[]

  @@map("usuarios_admin")
}

// Tabla pivote: un admin puede gestionar múltiples sedes
model UsuarioAdminSede {
  usuarioAdminId String @db.Uuid @map("usuario_admin_id")
  sedeId         String @db.Uuid @map("sede_id")
  asignadoAt     DateTime @default(now()) @map("asignado_at")

  usuarioAdmin   UsuarioAdmin @relation(fields: [usuarioAdminId], references: [id])
  sede           Sede         @relation(fields: [sedeId], references: [id])

  @@id([usuarioAdminId, sedeId])
  @@map("usuarios_admin_sedes")
}

// ============================================================
// AUDITORÍA — Registro de acciones del panel admin
// ============================================================

model AuditoriaLog {
  id             String   @id @default(uuid()) @db.Uuid
  usuarioAdminId String?  @db.Uuid @map("usuario_admin_id")
  accion         String   // "PUBLICAR_TERMINOS", "DESCARGAR_PDF", "LOGIN", etc.
  entidad        String?  // "TerminosVersion", "Aceptacion", etc.
  entidadId      String?  @map("entidad_id")
  detalle        Json?    // Detalle adicional en JSONB
  ipAddress      String?  @map("ip_address")
  createdAt      DateTime @default(now()) @map("created_at")

  usuarioAdmin   UsuarioAdmin? @relation(fields: [usuarioAdminId], references: [id])

  @@index([usuarioAdminId])
  @@index([accion])
  @@index([createdAt])
  @@map("auditoria_logs")
}
```

---

## Notas de Implementación

### Cifrado de Datos Sensibles

```typescript
// Usar pgcrypto a nivel de PostgreSQL, o cifrado a nivel aplicación con AES-256

// Opción A: Campo cifrado con pgcrypto (require extensión)
// En migración: ALTER TABLE aceptaciones ADD COLUMN correo_cifrado BYTEA;
// UPDATE aceptaciones SET correo_cifrado = pgp_sym_encrypt(correo_electronico, $KEY);

// Opción B (recomendada para MVP): Cifrar en el servicio NestJS antes de guardar
import * as crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes hex

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}
```

### Índices Adicionales Recomendados

```sql
-- Para búsquedas frecuentes del panel admin
CREATE INDEX idx_aceptaciones_sede_fecha ON aceptaciones(sede_id, created_at DESC);
CREATE INDEX idx_aceptaciones_documento ON aceptaciones(numero_documento);
CREATE INDEX idx_aceptaciones_correo ON aceptaciones(correo_electronico);
CREATE INDEX idx_correos_log_estado ON correos_log(estado) WHERE estado IN ('PENDIENTE', 'FALLIDO');
CREATE INDEX idx_sesion_tokens_expiry ON sesion_tokens(expires_at) WHERE usado = FALSE;

-- GIN index para búsqueda en metadata_extra (JSONB)
CREATE INDEX idx_aceptaciones_metadata ON aceptaciones USING GIN(metadata_extra);
```

### Seed Inicial de Base de Datos

```typescript
// prisma/seed.ts
import { PrismaClient, NombreRol } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  const roles = await Promise.all([
    prisma.rol.upsert({
      where: { nombre: NombreRol.SUPERADMIN },
      update: {},
      create: { nombre: NombreRol.SUPERADMIN, descripcion: 'Acceso total al sistema' },
    }),
    prisma.rol.upsert({
      where: { nombre: NombreRol.ADMIN_SEDE },
      update: {},
      create: { nombre: NombreRol.ADMIN_SEDE, descripcion: 'Administrador de sede específica' },
    }),
    prisma.rol.upsert({
      where: { nombre: NombreRol.RECEPCIONISTA },
      update: {},
      create: { nombre: NombreRol.RECEPCIONISTA, descripcion: 'Lectura parcial de su sede' },
    }),
    prisma.rol.upsert({
      where: { nombre: NombreRol.AUDITOR },
      update: {},
      create: { nombre: NombreRol.AUDITOR, descripcion: 'Lectura y exportación de todas las sedes' },
    }),
  ]);

  // Crear sede Kennedy
  const kennedy = await prisma.sede.upsert({
    where: { slug: 'kennedy' },
    update: {},
    create: {
      slug: 'kennedy',
      nombre: 'FIT EVOLUTION360 - Sede Kennedy',
      ciudad: 'Bogotá',
      direccion: 'Cra X # Y-Z, Kennedy, Bogotá',
      correoAdmin: 'admin@fitevolution360.com',
      activo: true,
    },
  });

  // Crear superadmin inicial
  const passwordHash = await bcrypt.hash('CambiarEnPrimer0Login!', 12);
  await prisma.usuarioAdmin.upsert({
    where: { email: 'superadmin@fitevolution360.com' },
    update: {},
    create: {
      nombre: 'Super Administrador',
      email: 'superadmin@fitevolution360.com',
      passwordHash,
      rolId: roles[0].id,
      activo: true,
    },
  });

  console.log('Seed completado exitosamente.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```
