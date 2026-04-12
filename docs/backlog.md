# FIT_EVOLUTION360 — Backlog Inicial Priorizado (MVP)

## Leyenda
- **Prioridad**: 🔴 Crítica | 🟠 Alta | 🟡 Media | 🟢 Baja
- **Complejidad**: XS (< 2h) | S (2-4h) | M (4-8h) | L (1-2 días) | XL (> 2 días)

---

## ÉPICA 1: Infraestructura y Setup

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-01 | Como desarrollador, necesito el **monorepo configurado** con Turborepo, Next.js, NestJS y Prisma para comenzar el desarrollo. | - `npm run dev` arranca frontend y backend simultáneamente. - Las variables de entorno tienen schema tipado. - ESLint y Prettier configurados. - Pre-commit hooks funcionan. | 🔴 | L |
| US-02 | Como desarrollador, necesito la **base de datos PostgreSQL** configurada localmente y en producción con las migraciones iniciales ejecutadas. | - `prisma migrate dev` corre sin errores. - `prisma db seed` puebla datos iniciales. - Conexión funciona en Railway/Supabase. | 🔴 | M |
| US-03 | Como desarrollador, necesito el **pipeline de CI/CD** configurado para despliegue automático en Vercel (frontend) y Railway (backend). | - Push a `main` despliega automáticamente. - Variables de entorno por ambiente están configuradas. - El build no falla. | 🟠 | M |

---

## ÉPICA 2: Flujo de Aceptación (Core del MVP)

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-04 | Como **recepcionista**, necesito un **código QR físico** para la sede Kennedy que lleve al usuario al formulario correcto. | - El QR redirige a `/aceptacion?sede=kennedy`. - La URL es válida y respondida por el backend. - El QR es generado y descargable desde el panel admin en PNG/SVG. | 🔴 | S |
| US-05 | Como **usuario del gimnasio**, al escanear el QR, quiero ver una **landing de bienvenida** de la sede Kennedy con instrucciones claras antes de comenzar. | - La página carga en < 3s en móvil (4G). - Muestra nombre de la sede, logo y botón "Comenzar". - Si la sede no existe o está inactiva, muestra error amigable. | 🔴 | S |
| US-06 | Como **usuario**, quiero poder **diligenciar mis datos personales** en un formulario claro y validado en mi celular. | - Todos los campos obligatorios tienen validación en tiempo real. - El campo "confirmar email" valida coincidencia. - Los errores son visibles y descriptivos. - El formulario es usable con teclado virtual en iOS y Android. | 🔴 | L |
| US-07 | Como **usuario**, quiero poder **leer los términos y condiciones** completos antes de aceptarlos. | - El visor muestra el T&C en HTML formateado. - El botón "Aceptar" está deshabilitado hasta hacer scroll hasta el final. - Muestra la versión y fecha del documento. | 🔴 | M |
| US-08 | Como **usuario**, quiero **aceptar expresamente** los términos mediante checkboxes separados por consentimiento (datos, imagen, salud). | - Cada consentimiento es un checkbox independiente con etiqueta clara. - Los obligatorios no permiten continuar si no están marcados. - El estado de cada checkbox queda registrado en BD. | 🔴 | S |
| US-09 | Como **usuario**, quiero **firmar digitalmente** en mi celular usando el dedo sobre un canvas. | - El canvas funciona con touch en iOS Safari y Android Chrome. - El botón "Limpiar firma" funciona. - Si el canvas está vacío, no se puede continuar. - La firma se captura en base64 PNG. | 🔴 | M |
| US-10 | Como **usuario**, quiero ver una **pantalla de confirmación** con mis datos antes de enviar definitivamente. | - Muestra resumen de datos ingresados. - Muestra imagen de la firma. - Buttons: "Volver a editar" y "Confirmar y Enviar". | 🟠 | S |
| US-11 | Como **usuario**, quiero recibir **confirmación visual de éxito** con mi ID de transacción al completar el proceso. | - Pantalla de éxito con ID de transacción. - Mensaje indicando que llegará correo. - Sin botón "reintentar" (previene doble envío). | 🔴 | XS |

---

## ÉPICA 3: Backend — Procesamiento de Aceptación

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-12 | Como **sistema**, necesito un **token de sesión único por formulario** para prevenir doble envío. | - `GET /api/v1/session-token` genera UUID único. - El token se invalida tras el primer uso exitoso. - El backend rechaza con 409 si el token ya fue usado. | 🔴 | S |
| US-13 | Como **sistema**, necesito **validar todos los campos del formulario en el backend** independientemente del frontend. | - Cualquier campo inválido rechazado con 400 y mensaje específico. - XSS sanitizado. - Validación con class-validator/Zod en NestJS. | 🔴 | M |
| US-14 | Como **sistema**, necesito **almacenar la firma digital** en formato PNG en storage seguro. | - La imagen se sube a S3/Supabase Storage. - Se almacena la URL de acceso, no el base64 en BD. - La URL es firmada con expiración. | 🔴 | M |
| US-15 | Como **sistema**, necesito **generar el PDF de evidencia** con todos los metadatos de la aceptación. | - El PDF incluye: nombre, documento, fecha/hora, IP, user-agent, versión de T&C, hash del documento, imagen de firma, ID de transacción. - El PDF tiene logo de FIT_EVOLUTION360. - El PDF se almacena en storage. | 🔴 | XL |
| US-16 | Como **sistema**, necesito registrar el **hash SHA-256 del documento** aceptado en el momento exacto de la aceptación. | - El hash se calcula del `contenidoHtml` de la versión activa. - Se almacena en la tabla `aceptaciones`. - Si el documento cambia luego, el hash histórico no cambia. | 🔴 | S |

---

## ÉPICA 4: Correo Electrónico

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-17 | Como **usuario**, quiero recibir un **correo de confirmación** con el PDF de mi aceptación adjunto. | - El correo llega en < 2 minutos. - El PDF adjunto es legible y completo. - El correo tiene asunto y cuerpo profesional con logo. - El sender es el dominio verificado del gimnasio. | 🔴 | L |
| US-18 | Como **administrador del gimnasio**, quiero recibir una **copia automática** del PDF de cada aceptación. | - El correo admin llega al configurado en la sede. - El asunto identifica el nombre del usuario y la sede. - El PDF adjunto es idéntico al enviado al usuario. | 🔴 | S |
| US-19 | Como **sistema**, necesito un **mecanismo de cola y reintento** para correos que fallan. | - Si Resend falla, el correo queda en cola (Bull). - Se reintenta hasta 3 veces con backoff exponencial. - El estado en `correos_log` se actualiza en cada intento. - El administrador puede ver el estado desde el panel. | 🟠 | L |

---

## ÉPICA 5: Versionado de Términos y Condiciones

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-20 | Como **superadmin**, quiero poder **crear una nueva versión en borrador** de los T&C sin afectar la versión activa. | - El endpoint `POST /admin/terminos` crea versión en estado `BORRADOR`. - La versión activa sigue siendo la misma. - Se puede previsualizar el borrador. | 🔴 | M |
| US-21 | Como **superadmin**, quiero poder **publicar una versión borrador** de los T&C, lo que archiva la activa anterior. | - Al publicar: versión anterior pasa a `ARCHIVADO`. - Nueva versión pasa a `ACTIVO`. - Las aceptaciones anteriores siguen vinculadas a su versión original. | 🔴 | M |
| US-22 | Como **usuario que regresa**, si hay una **nueva versión activa de T&C**, debo realizar el proceso de aceptación nuevamente. | - El sistema detecta si existe aceptación previa del mismo documento. - Si la versión activa es nueva, se muestra como flujo nuevo sin pre-completar. - La nueva aceptación se registra como evento independiente. | 🟠 | M |

---

## ÉPICA 6: Panel Administrativo

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-23 | Como **admin**, quiero poder **iniciar sesión** en el panel con mis credenciales de forma segura. | - Login con email + password. - JWT access token (15min) + refresh token (7 días). - 5 intentos fallidos bloquean la cuenta temporalmente. | 🔴 | M |
| US-24 | Como **admin**, quiero ver un **dashboard** con métricas básicas de aceptaciones. | - Total aceptaciones hoy / mes / histórico. - Aceptaciones por sede (en MVP solo Kennedy). - Errores de correo en últimas 24h. - Versión actual de T&C activa. | 🟠 | M |
| US-25 | Como **admin**, quiero poder **consultar la lista de aceptaciones** filtrando por sede, fecha, nombre, número de documento y estado. | - Tabla paginada con 20 registros por página. - Filtros por: sede, rango de fechas, estado, búsqueda por nombre/documento. - Tiempo de respuesta < 2s con 1.000 registros. | 🔴 | L |
| US-26 | Como **admin**, quiero poder **ver el detalle completo** de una aceptación específica. | - Muestra todos los campos del formulario. - Muestra metadatos técnicos (IP, user-agent, timestamps). - Muestra imagen de la firma. - Muestra estado del correo. | 🟠 | M |
| US-27 | Como **admin**, quiero poder **descargar el PDF** de cualquier aceptación desde el panel. | - El PDF se descarga con un clic. - La URL firmada expira en 1 hora. - El registro de descarga queda en auditoría. | 🔴 | S |
| US-28 | Como **admin**, quiero poder **generar y descargar el QR** de mi sede. | - El QR se genera con la URL correcta de la sede. - Se puede descargar en PNG de alta resolución. - El QR tiene instrucciones mínimas superpuestas (opcional). | 🟠 | S |
| US-29 | Como **superadmin**, quiero poder **gestionar usuarios administradores** (crear, desactivar, asignar roles y sedes). | - Crear usuario admin con rol y sede asignados. - Desactivar usuario (no eliminar). - Solo superadmin puede crear otros superadmins. | 🟠 | M |

---

## ÉPICA 7: Seguridad

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-30 | Como **sistema**, necesito aplicar **rate limiting** en el endpoint de aceptación para prevenir spam. | - Max 5 requests por IP por minuto en `POST /api/v1/aceptaciones`. - Respuesta 429 con mensaje amigable. | 🔴 | XS |
| US-31 | Como **sistema**, necesito que todos los **headers HTTP de seguridad** estén configurados. | - Helmet.js aplicado: HSTS, X-Frame-Options, CSP, etc. - Verificado con securityheaders.com → calificación A. | 🟠 | XS |
| US-32 | Como **sistema**, necesito **logs estructurados** en producción para auditoría y debugging. | - Todos los requests logueados con timestamp, método, ruta, status, latencia. - Errores incluyen stack trace completo. - Logs en formato JSON. | 🟠 | S |

---

## ÉPICA 8: Web Institucional (Post-MVP / Fase 9)

| # | Historia de Usuario | Criterios de Aceptación | Prioridad | Complejidad |
|---|---------------------|------------------------|-----------|-------------|
| US-33 | Como **visitante**, quiero ver la **página de inicio** de FIT_EVOLUTION360 con información clara del gimnasio. | - Heat, hero visual, CTAs, sedes, servicios en scroll. - Mobile first. - PageSpeed > 85. | 🟡 | L |
| US-34 | Como **visitante**, quiero consultar la **información de la sede Kennedy** (horarios, servicios, ubicación, contacto). | - Página de sede con mapa, horarios y fotos. - CTA para iniciar proceso de aceptación. | 🟡 | M |
| US-35 | Como **visitante**, quiero leer la **Política de Tratamiento de Datos** del gimnasio. | - Página pública con el documento completo. - Versión y fecha de última actualización visibles. | 🟡 | S |
| US-36 | Como **visitante**, quiero poder **contactar al gimnasio** mediante un formulario web. | - Formulario con nombre, correo, sede, mensaje. - Email de confirmación al usuario. - Email de notificación al admin. - Rate limiting habilitado. | 🟢 | M |
