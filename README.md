# Bodega QR

Aplicacion Vue 3 para servir landings y formularios reutilizables para distintas bodegas.

## Desarrollo

```bash
npm install
npm run dev
```

La bodega ficticia disponible tiene una página informativa y una ruta de registro directo:

```text
/bodega/bodega-aurora
/bodega/bodega-aurora/registro
```

La primera ruta contiene información de la bodega. La segunda muestra el formulario al abrirse y es la que debe utilizar el QR. El sitio está orientado a registrar a quienes ya están realizando su visita.

## Estado del registro

El registro pide nombre, apellido, correo y teléfono. La ubicación y el identificador del QR se capturan mediante los parámetros `location` y `qr`; el consentimiento de marketing es opcional e independiente.

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

Después del despliegue, comprobar que la entrada y las rutas directas funcionen:

```text
/bodega/bodega-aurora
/bodega/bodega-aurora/registro
```

La ruta `/` redirige al registro de Aurora. Cada QR debe incluir el slug de su bodega y abrir directamente su ruta `/registro`.

Una URL fija de muestra puede incluir los datos públicos del QR:

```text
/bodega/bodega-aurora/registro?location=entrada&qr=demo-entrada-01&source=qr
```

Generar los QR imprimibles cuando esté definida la URL estable de Vercel; no imprimir códigos basados en una URL temporal de Preview.
