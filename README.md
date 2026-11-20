# Bodega QR

Aplicacion Vue 3 para servir landings y formularios reutilizables para distintas bodegas.

## Desarrollo

```bash
npm install
npm run dev
```

La bodega ficticia disponible tiene dos recorridos:

```text
/bodega/bodega-aurora
/bodega/bodega-aurora/registro
```

La primera ruta es la landing completa, compactada en cuatro bloques: hero, esencia, experiencia y reserva. La segunda es la version simple para visitantes que necesitan consultar la informacion basica y registrarse rapidamente.

## Estado del registro

El registro de visitantes esta implementado con validacion del lado del cliente y del backend. Incluye datos de contacto, ciudad, pais, red social, intereses y origen de llegada. La ubicacion y el identificador del QR se pueden enviar mediante los parametros `location` y `qr`.

Mientras no exista `VITE_REGISTRATION_API_URL`, la aplicacion informa que el backend no esta configurado y no confirma ningun registro.

## Variables de entorno

```text
VITE_REGISTRATION_API_URL=https://tu-dominio.example/api/register
```

El endpoint debe devolver un JSON con `ok: true` solamente despues de verificar que el backend guardo el registro.

La conexion con las planillas de los propietarios esta documentada en `docs/google-drive-integration.md`.
