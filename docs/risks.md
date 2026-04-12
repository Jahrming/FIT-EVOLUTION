# FIT_EVOLUTION360 — Registro de Riesgos

## Leyenda
- **Impacto**: 🔴 Alto | 🟠 Medio | 🟡 Bajo
- **Probabilidad**: Alta | Media | Baja
- **Nivel de Riesgo** = Impacto × Probabilidad

---

## I. RIESGOS TÉCNICOS

| ID | Riesgo | Impacto | Prob. | Nivel | Mitigación |
|----|--------|---------|-------|-------|-----------|
| RT-01 | **Canvas de firma no funciona en iOS Safari** (restricciones de touch events) | 🔴 Alto | Media | **ALTO** | Probar en iOS Safari desde el día 1. Usar `react-signature-canvas` con gesture events correctamente configurados. Tener fallback: campo de firma alternative si el canvas falla. |
| RT-02 | **Latencia de generación de PDF** supera los 5s en servidor de bajo recurso | 🟠 Medio | Media | **MEDIO** | Generar PDF de forma asíncrona (después de guardar en BD). Mostrar pantalla de éxito inmediata y enviar correo cuando el PDF esté listo. Usar worker process separado. |
| RT-03 | **Falla del servicio de correo** (Resend downtime) hace que el usuario no reciba evidencia | 🔴 Alto | Baja | **MEDIO** | Implementar cola con Bull + reintentos (3x con backoff). La aceptación se registra aunque el correo falle. El admin puede reenviar manualmente desde el panel. |
| RT-04 | **Doble envío del formulario** genera aceptaciones duplicadas | 🟠 Medio | Alta | **ALTO** | Token de sesión único (UUID) invalidado tras primer uso. Botón deshabilitado tras submit. Backend retorna 409 en segundo intento. |
| RT-05 | **Base de datos PostgreSQL** sufre downtime en producción | 🔴 Alto | Baja | **MEDIO** | Railway/Supabase tienen HA y backups automáticos. Implementar health check endpoint. Documentar plan de recuperación (< 4h RTO). |
| RT-06 | **Correos de confirmación clasificados como SPAM** por Gmail/Outlook | 🟠 Medio | Media | **MEDIO** | Verificar dominio en Resend (SPF, DKIM, DMARC). Usar sender del dominio propio del gimnasio. Evitar attachments HTML complejos en primer intento. |
| RT-07 | **Storage S3/Supabase** con archivos inaccesibles o URLs expiradas | 🟠 Medio | Baja | **BAJO** | URLs firmadas con TTL largo para PDFs admin. Para PDFs de usuario, adjuntar directamente al correo sin URL externa. Backups regulares del storage. |
| RT-08 | **Pérdida de datos de formulario** si usuario pierde conexión a mitad del proceso | 🟠 Medio | Alta | **ALTO** | Guardar estado del formulario en `localStorage` por pasos. Al recargar, ofrecer continuar desde el paso anterior (el token de sesión sigue válido). |
| RT-09 | **Escalabilidad** del servidor ante múltiples sedes simultáneas en horario pico | 🟡 Bajo | Baja | **BAJO** | Railway y Vercel escalan horizontalmente. Sin embargo, para MVP una instancia es suficiente (< 100 usuarios/hora esperados). Monitorear con Sentry. |

---

## II. RIESGOS LEGALES Y DE CUMPLIMIENTO

| ID | Riesgo | Impacto | Prob. | Nivel | Mitigación |
|----|--------|---------|-------|-------|-----------|
| RL-01 | **Firma en canvas no considerada suficiente como firma electrónica** bajo Ley 527/1999 por un perito o juez | 🔴 Alto | Media | **ALTO** | ⚠️ **[VALIDAR CON ABOGADO]** — El sistema complementa la firma con: IP, user-agent, timestamp, hash del documento, correo de confirmación. Considerar en V2 firma electrónica certificada (e.firma o proveedor colombiano). |
| RL-02 | **Menores de 18 años** acceden al formulario sin representante legal que firme | 🔴 Alto | Media | **ALTO** | Validar fecha de nacimiento: si es menor de 18, mostrar mensaje que el proceso debe realizarse con un adulto responsable. No permitir continuar. **[VALIDAR CON ABOGADO]** si aplica excepción para mayores de 16. |
| RL-03 | **Incumplimiento de la Ley 1581/2012** por no separar correctamente los consentimientos | 🔴 Alto | Baja | **MEDIO** | Implementar checkboxes separados: 1) T&C generales, 2) Tratamiento de datos, 3) Uso de imagen, 4) Comunicaciones comerciales. Cada uno es independiente y opcional si no es obligatorio. |
| RL-04 | **Retención de datos fuera del período legal** o eliminación prematura que impide la defensa en litigios | 🔴 Alto | Baja | **MEDIO** | Política de retención mínima 5 años (soft delete). Implementar proceso documentado de eliminación definitiva solo tras aprobación del abogado del gimnasio. |
| RL-05 | **Brecha de seguridad** expone datos personales de usuarios → sanciones SIC | 🔴 Alto | Baja | **ALTO** | Cifrado en tránsito (TLS) y en reposo (AES-256). Acceso mínimo a datos (RBAC). Monitoreo de accesos anómalos. Plan de respuesta a incidentes documentado. **[VALIDAR CON ABOGADO]** obligación de reporte a SIC en 72h. |
| RL-06 | **Política de Tratamiento de Datos** no registrada ante la SIC | 🟠 Medio | Alta | **ALTO** | Las empresas con datos sensibles deben registrar su política ante la SIC. Verificar si FIT_EVOLUTION360 ya lo hizo. Si no, realizarlo antes del lanzamiento. **[VALIDAR CON ABOGADO]** |
| RL-07 | **Datos de salud** (declaración de condición física) tratados sin el refuerzo legal correcto | 🟠 Medio | Media | **MEDIO** | Limitar la declaración a un checkbox de afirmación genérica ("Declaro que estoy en condición física apta"). No recoger diagnósticos ni condiciones específicas. **[VALIDAR CON ABOGADO]** |

---

## III. RIESGOS OPERATIVOS

| ID | Riesgo | Impacto | Prob. | Nivel | Mitigación |
|----|--------|---------|-------|-------|-----------|
| RO-01 | **Usuarios sin correo electrónico** o correo inaccesible desde su celular | 🟠 Medio | Alta | **ALTO** | El campo correo es obligatorio. Agregar instrucción clara: "Ingresa un correo al que tengas acceso ahora". El PDF también queda en el sistema y el admin puede descargarlo. |
| RO-02 | **QR físico dañado o ilegible** en recepción | 🟡 Bajo | Media | **BAJO** | Tener un QR de respaldo impreso. El recepcionista puede también compartir la URL directamente vía WhatsApp o en pantalla del computador. |
| RO-03 | **Recepcionistas sin entrenamiento** en el nuevo proceso digital | 🟠 Medio | Alta | **MEDIO** | Crear guía rápida (1 página) para recepcionistas. Capacitación de 30 minutos antes del piloto. El sistema es autónomo; el recepcionista solo orienta al usuario. |
| RO-04 | **Cambio frecuente de T&C** sin proceso claro → confusion de versiones históricas | 🟠 Medio | Media | **MEDIO** | Implementar flujo de aprobación: borrador → revisión → activo. Solo superadmin puede publicar. Changelog obligatorio al publicar nueva versión. |
| RO-05 | **Correo corporativo no verificado** en Resend → correos rechazados | 🔴 Alto | Alta | **ALTO** | Verificar el dominio en Resend como primera acción de configuración, antes de cualquier despliegue. Documentar el proceso SPF/DKIM/DMARC. |

---

## IV. RIESGOS DE PRODUCTO Y NEGOCIO

| ID | Riesgo | Impacto | Prob. | Nivel | Mitigación |
|----|--------|---------|-------|-------|-----------|
| RN-01 | **Usuarios abandonan el flujo** por excesiva longitud del formulario | 🟠 Medio | Alta | **ALTO** | Dividir en pasos claros con indicador de progreso. Minimizar campos al mínimo legal. Probar UX con 5 usuarios reales antes del lanzamiento. |
| RN-02 | **Scope creep** en el panel administrativo alarga el MVP indefinidamente | 🟠 Medio | Alta | **ALTO** | Definir MVP del panel: solo consulta + descarga + QR. Todo lo demás es V2. Product Owner debe aprobar explícitamente cualquier adición. |
| RN-03 | **T&C no entregados por la administración** a tiempo → bloquea desarrollo del módulo de términos | 🔴 Alto | Media | **ALTO** | Usar texto placeholder durante desarrollo. Escalar la necesidad del documento como blocker en la Fase 0. |
| RN-04 | **Presupuesto insuficiente** para infraestructura en producción | 🟡 Bajo | Media | **BAJO** | Stack seleccionado usa tiers gratuitos generosos: Vercel (hobby), Railway ($5/mes), Supabase (free), Resend (3.000 emails/mes gratis). Costo inicial estimado: **$10-20 USD/mes**. |

---

## V. RESUMEN EJECUTIVO DE RIESGOS

| Nivel | Cantidad | Riesgos Más Críticos |
|-------|----------|----------------------|
| 🔴 ALTO | 6 | RT-04, RT-08, RL-01, RL-02, RL-06, RO-05, RN-03 |
| 🟠 MEDIO | 9 | RT-02, RT-03, RT-06, RL-03, RL-05, RL-07, RO-01, RO-03, RN-01 |
| 🟡 BAJO | 4 | RT-07, RT-09, RO-02, RN-04 |

### Top 3 Riesgos a Atender Primero

1. **RL-01 / RL-06**: Validar con abogado la suficiencia de la firma canvas y el estado de la política de datos ante la SIC **antes de iniciar el desarrollo del módulo**.
2. **RO-05**: Verificar el dominio de correo en Resend **desde el día 1 de configuración**.
3. **RT-04 / RT-08**: Implementar token de sesión y guardado de progreso **desde el primer sprint del formulario**.
