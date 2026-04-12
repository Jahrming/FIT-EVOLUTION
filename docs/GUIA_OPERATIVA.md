# 🛠️ Guía Operativa y Mantenimiento Manual

Este documento explica cómo modificar la lógica de negocio diaria del aplicativo sin necesidad de conocimientos profundos de arquitectura.

---

## 1. ¿Cómo cambiar el correo de Administración de una Sede?

Cuando un cliente se registra, se envía un correo de aviso a la sede. Este correo está almacenado en la Base de Datos bajo la tabla `Sede`.

**Para actualizarlo desde el código (Seed):**
1. Abre el archivo `apps/api/prisma/seed.ts`.
2. Busca el bloque donde dice `// 2. Sede Kennedy (Bucaramanga)` o la sede deseada.
3. Modifica la propiedad `correoAdmin`:
   ```typescript
   correoAdmin: 'nuevocorreo_admin@gmail.com', // <-- Cambia esto
   ```
4. Aplica el cambio en tu base de datos corriendo en tu terminal:
   ```bash
   cd apps/api
   npx prisma db seed
   ```
*(Nota: En futuras fases, esto se podrá cambiar desde el Panel de Administración Web).*

---

## 2. ¿Cómo actualizar los Términos y Condiciones?

Los términos y condiciones legales **NO ESTÁN EN EL FRONTEND**. El Frontend se los pide al Backend, y el Backend los lee de la Base de Datos. Nunca sobreescribimos los términos viejos, siempre creamos una **Nueva Versión** (v2, v3, etc.) para protección legal del gimnasio.

**Para lanzar nuevos términos:**
1. Abre el archivo `apps/api/prisma/seed.ts`.
2. Busca la sección `// 3. Crear versión de términos para la Sede...`.
3. Sube el identificador numérico de la `numeroVersion`:
   ```typescript
   where: { sedeId: sedeKennedy.id, estado: 'ACTIVO', numeroVersion: 3 } // Pasó de 2 a 3
   ...
   numeroVersion: 3,
   titulo: 'Términos y Condiciones Generales 2027 V3',
   ```
4. Edita el gran bloque de texto HTML dentro de la propiedad `contenidoHtml`.
5. Abre tu terminal y corre:
   ```bash
   cd apps/api
   npx prisma db seed
   ```
El sistema automáticamente marcará la versión vieja como "INACTIVA" (quedará guardada para propósitos legales) y todos los nuevos registros de clientes utilizarán e imprimirán la Versión 3.

---

## 3. ¿Cómo cambiar los Colores de la Plataforma (Identidad Visual)?

Toda la identidad visual del Frontend (Colores Amarillos, Botones, Textos) está centralizada en **Tailwind CSS**.

1. Abre el archivo `apps/web/tailwind.config.ts`.
2. Busca el objeto `colors: { brand: { ... } }`.
3. Actualmente está configurado en Amarillo Neón (`#FFD700`). Si la empresa cambia de color (por ejemplo, a Rojo), ajusta los valores HEX:
   ```typescript
   brand: {
     50: '#fef2f2',
     // ...
     400: '#f87171',
     500: '#ef4444', // Color principal de los botones
     600: '#dc2828',
   }
   ```
Al guardar el archivo, los colores cambiarán instantáneamente en toda la aplicación web.

---

## 4. ¿Cómo clonar y ejecutar el proyecto en un computador nuevo?

Si necesitas pasarle este proyecto a otro programador o subirlo a un servidor, estos son los pasos estrictos a seguir:

### Requisitos Previos:
- Node.js versión 18+ instalado.
- XAMPP o MySQL levantado en el puerto (3306 o 3307 dependiente de la configuración).

### Paso a paso:
1. **Descargar / Clonar:**
   ```bash
   git clone <url-del-repositorio>
   cd fit-evolution360
   ```
2. **Instalar Dependencias:**
   ```bash
   npm install
   ```
3. **Configurar Entorno:**
   Dentro de la carpeta `apps/api/`, crea un archivo llamado `.env` y pega lo siguiente (ajusta los puertos de tu PC y contraseñas de Gmail):
   ```env
   DATABASE_URL="mysql://root:@localhost:3307/fitevolution360_dev"
   GMAIL_USER="tu_correo_admin@gmail.com"
   GMAIL_APP_PASSWORD="tu_contraseña_de_aplicacion_google"
   JWT_SECRET="una_clave_secreta_muy_segura"
   ```
4. **Construir Base de Datos (Primera Vez):**
   ```bash
   cd apps/api
   npx prisma db push --accept-data-loss
   npx prisma db seed
   cd ../..
   ```
5. **Ejecutar el Ecosistema:**
   Dentro de la raíz del proyecto, arranca el Frontend y Backend simultáneamente:
   ```bash
   npm run dev
   ```
Listo. Chrome abrirá `http://localhost:3000` y todo funcionará.
