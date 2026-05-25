# Capacidad y Responsive

## 1. Capacidad actual de la app

### Limite real hoy

La limitacion mas importante no es CPU ni memoria. Es el rate limit del endpoint final de registro:

- archivo: `apps/api/src/app.module.ts`
- archivo: `apps/api/src/modules/aceptacion/aceptacion.controller.ts`
- configuracion actual: `5` solicitudes por `60` segundos

Eso significa:

- si todos los clientes usan el mismo WiFi del gimnasio y salen por la misma IP publica:
  el sistema permite `5 registros finalizados por minuto` entre todos
- si cada cliente usa datos moviles y sale por IP distinta:
  cada uno tendria su propio limite de `5 por minuto`

### Concurrencia practica

Hoy la app puede tener varios usuarios llenando el formulario al mismo tiempo sin problema serio, porque:

- la carga inicial solo consulta sede y token
- el formulario es mayormente frontend
- el cuello de botella esta en el `POST /api/v1/aceptaciones`

### Cuello de botella tecnico

En `apps/api/src/modules/aceptacion/aceptacion.service.ts` el backend hace todo en la misma solicitud:

1. valida token
2. valida sede
3. valida terminos
4. guarda aceptacion
5. crea logs de correo
6. intenta enviar correos antes de responder

Eso hace que cada registro final sea mas pesado de lo necesario.

### Respuesta corta

Con la configuracion actual:

- para una sede pequena o flujo normal: funciona bien
- para picos de recepcion con muchos cierres de registro al mismo tiempo en la misma red: mas de `5 por minuto` ya empieza a chocar con el limite

### Estimacion honesta

Sin prueba de carga formal, la cifra mas confiable hoy no es "usuarios maximos simultaneos", sino esta:

- `5 registros finalizados por minuto por IP`

Si quieres soportar mejor picos reales, los siguientes cambios recomendados son:

1. mover el envio de correos a una cola o proceso en background
2. revisar el rate limit y ajustarlo por sede, por token o por combinacion IP + fingerprint
3. ejecutar prueba de carga controlada

## 2. Estado responsive actual

### Veredicto

Si, la app esta pensada en formato mobile-first y para moviles modernos deberia funcionar bien en terminos generales.

### Evidencia en el codigo

Se ve una base responsive correcta en estos archivos:

- `apps/web/app/aceptacion/page.tsx`
- `apps/web/app/aceptacion/components/FormStep.tsx`
- `apps/web/app/aceptacion/components/TermsStep.tsx`
- `apps/web/app/aceptacion/components/ConsentsStep.tsx`
- `apps/web/app/aceptacion/components/SignatureStep.tsx`
- `apps/web/app/aceptacion/components/ConfirmStep.tsx`
- `apps/web/app/aceptacion/components/StepIndicator.tsx`
- `apps/web/app/aceptacion/components/SuccessScreen.tsx`

### Cosas que estan bien

- layout central con `max-w-lg`
- uso de `min-h-dvh`
- formularios `w-full`
- grids que pasan de `1` columna a `2` o mas en `sm`
- botones apilados o flexibles en pantallas pequenas
- textos largos con `break-all` en transaction id
- canvas de firma con ancho completo
- labels del step indicator ocultos en movil para ahorrar espacio

### Riesgos o bordes que aun existen

No vi un problema grave de responsive en codigo, pero si hay algunos puntos a vigilar:

1. en `ConfirmStep.tsx` varias filas usan `flex justify-between` y si algun valor es demasiado largo puede verse apretado en pantallas muy estrechas
2. en `TermsStep.tsx` el contenido HTML legal viene desde base de datos; si algun dia metes tablas, imagenes o bloques muy anchos, eso si podria romper en movil
3. en `SignatureStep.tsx` la altura del canvas es fija en `180px`; funciona, pero en celulares muy pequenos puede sentirse algo apretado verticalmente
4. hay varios textos con codificacion dañada (`Ã`, `â`, etc.); eso no rompe responsive, pero si afecta percepcion de calidad

### Conclusión práctica

- para Android Chrome y iPhone Safari modernos: deberia usarse sin problema mayor
- no puedo afirmar "100% perfecto en cualquier movil" sin prueba real en dispositivos

## 3. Recomendacion de validacion final

Antes de despliegue definitivo, conviene probar manualmente en:

1. iPhone Safari
2. Android Chrome
3. un telefono pequeno
4. un telefono grande

Checklist minimo:

- abrir QR
- llenar formulario completo
- hacer scroll en terminos
- marcar consentimientos
- firmar con dedo
- confirmar envio
- revisar pantalla de exito

## 4. Respuesta corta para negocio

- capacidad actual: `5 registros finalizados por minuto por IP`
- responsive actual: `si, en general esta adaptada a movil`
- conclusion: `sirve para uso normal de sede, pero para picos altos conviene mejorar concurrencia y hacer prueba real en dispositivos`
