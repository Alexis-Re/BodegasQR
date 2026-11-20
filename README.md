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

## Despliegue en Vercel

El proyecto usa Vite y se puede importar desde GitHub en Vercel con estos valores:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
```

`vercel.json` configura el fallback de Vue Router para que funcionen las rutas abiertas directamente, incluidas las URL de los QR. `api/register.js` es el adaptador de Vercel y reutiliza la validación y firma de `functions/api/register.js`.

Configurar en Vercel las siguientes variables:

```text
VITE_REGISTRATION_API_URL=/api/register
APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
APPS_SCRIPT_SHARED_SECRET=secreto-compartido-con-apps-script
```

`APPS_SCRIPT_URL` y `APPS_SCRIPT_SHARED_SECRET` son variables solo del servidor: no usar el prefijo `VITE_` ni guardarlas en archivos versionados. En Apps Script deben existir `SHARED_SECRET` y la propiedad `TENANT_<SLUG_EN_MAYUSCULAS>_SHEET_ID`. Para una demostración, usar una planilla de prueba y configurar las variables de Vercel en el entorno Preview.

Después del despliegue, comprobar ambas rutas directamente:

```text
/bodega/bodega-aurora
/bodega/bodega-aurora/registro
```

Una URL fija de muestra puede incluir los datos públicos del QR:

```text
/bodega/bodega-aurora/registro?location=entrada&qr=demo-entrada-01&source=qr
```

Generar los QR imprimibles cuando esté definida la URL estable de Vercel; no imprimir códigos basados en una URL temporal de Preview.
