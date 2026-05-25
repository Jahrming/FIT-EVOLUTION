# Dominio Unico y Backend Oculto

## Pregunta

### Es obligatorio crear un `api.midominio.com`?

Para el usuario final, no.

El usuario puede entrar solamente a:

- `https://tudominio.com`

## Entonces, por que aparece `api.tudominio.com`?

Porque en Hostinger administrado, lo mas simple y estable es:

- una app Node.js para el frontend
- otra app Node.js para el backend

Eso deja:

- frontend en `tudominio.com`
- backend en `api.tudominio.com`

## El usuario vera el subdominio `api`?

No deberia.

El proyecto ya esta preparado para esto:

1. el usuario entra a `tudominio.com`
2. el frontend usa `/backend`
3. Next.js reenvia internamente hacia `https://api.tudominio.com`

En la practica:

- el usuario siente que todo esta en una sola web
- tu no necesitas mostrar el subdominio `api` en el QR ni en la interfaz

## Puedo subir backend y frontend juntos en una sola app?

### En un VPS

Si seria posible, pero requiere mas configuracion manual.

### En Hostinger Node.js Web Apps administrado

No es la opcion mas simple ni la mas estable para este proyecto.

Tu proyecto tiene dos apps separadas:

- Next.js
- NestJS

Intentar meter ambas juntas en una sola app administrada complica:

- build
- arranque
- puertos
- logs
- reinicios
- variables

## Conclusion

### La forma mas simple de despliegue es:

- `tudominio.com` para frontend
- `api.tudominio.com` para backend
- MySQL de Hostinger para base de datos

### Pero para el cliente final:

Solo existira visualmente:

- `https://tudominio.com`
