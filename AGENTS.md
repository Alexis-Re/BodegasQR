# Bodega QR — instrucciones para agentes

## Objetivo del proyecto

Bodega QR es una aplicación web multi-bodega para publicar landings informativas y captar registros de visitantes mediante enlaces o códigos QR. Cada bodega tiene su propia configuración y su propia planilla privada de Google Sheets. La interfaz y los mensajes al visitante están en español.

El recorrido de registro previsto es:

```text
Vue → función serverless /api/register → Google Apps Script → Google Sheet de la bodega
```

El navegador nunca debe acceder directamente a Google Sheets ni recibir secretos o IDs privados.

## Stack y comandos

- Vue 3 con componentes Single File (`.vue`), Vue Router 4, Vite 6, JavaScript ES modules y CSS propio.
- La función `functions/api/register.js` sigue la interfaz de Cloudflare Pages Functions; confirma que el entorno de desarrollo y hosting ejecute esa función antes de dar por operativa la ruta `/api/register`.
- Comandos disponibles en `package.json`:
  - `npm install`: instalar dependencias.
  - `npm run dev`: iniciar Vite.
  - `npm run build`: compilar para producción.
  - `npm run preview`: servir localmente el build.
- Actualmente no hay script de pruebas. Si se añade uno, documentar el comando y usarlo para verificar lógica de validación, errores y persistencia.

## Mapa de código

- `src/router/index.js`: rutas de landing, registro rápido y página 404.
- `src/pages/`: páginas Vue asociadas a las rutas.
- `src/config/tenants/`: configuración por bodega y búsqueda por slug; las páginas esperan `getTenantBySlug(slug)`.
- `src/config/sectionRegistry.js`: registro de secciones por tipo.
- `src/components/layout/`, `src/components/sections/`, `src/components/forms/`: composición visual, bloques de landing y formularios.
- `src/services/registrationApi.js`: envío del payload y tratamiento de respuestas del endpoint.
- `src/styles/base.css` y `src/directives/reveal.js`: estilos compartidos y revelado de contenido al desplazarse.
- `functions/api/register.js`: validación del request, firma HMAC y reenvío a Apps Script.
- `backend/apps-script/Code.js`: verificación de firma, deduplicación y escritura en la planilla de la bodega.
- `docs/google-drive-integration.md` y `backend/apps-script/README.md`: configuración y despliegue de la integración.
- `public/tenants/<slug>/`: recursos públicos de cada bodega. No guardar aquí información privada.

La configuración de una bodega que consumen las páginas incluye `slug`, `name`, `shortName`, `description`, `assets`, `theme`, `contact`, `seo` y `form`. Mantén un esquema claro y consistente al añadir bodegas. La landing se construye con los tipos declarados en `sectionRegistry.js` (`hero`, `about`, `essence`, `experience`, `gallery`, `location`, `registration` y `visit`).

## Estado actual y pendientes verificados

- La configuración de bodegas, los layouts y las ocho secciones ya están implementados. `npm run build` pasó en la revisión actual; mantenerlo verde al realizar cambios.
- `RegistrationForm.vue` inicializa `consent` en `false` y su reset usa los valores iniciales. Añadir pruebas para consentimiento requerido y reinicio tras un envío exitoso.
- La documentación de `docs/google-drive-integration.md` enumera 11 columnas, mientras `backend/apps-script/Code.js` crea actualmente 19. Alinear el esquema documentado con la escritura real.
- `package.json` no define pruebas automatizadas y el servidor Vite no ejecuta por sí solo `functions/api/register.js`.

## Orden de trabajo para completar el proyecto

1. **Conservar una aplicación compilable.** Completar las funciones visuales de cada sección según los datos y estilos del proyecto; no sustituirlas por mocks vacíos. Ejecutar `npm run build` tras cambios de frontend.
2. **Probar el flujo del formulario.** Cubrir consentimiento requerido, consentimiento de marketing independiente, reinicio tras éxito, rechazo de payloads inválidos, errores de red y confirmación de persistencia.
3. **Alinear el contrato del registro.** Mantener compatibles nombres, tipos, límites y reglas entre `RegistrationForm.vue`, `functions/api/register.js` y `backend/apps-script/Code.js`. Al cambiarlo, actualizar ambos README y la documentación de integración.
4. **Hacer reproducible el desarrollo y despliegue.** Documentar cómo ejecutar localmente `/api/register` con el runtime compatible, las variables necesarias, el fallback SPA para rutas directas y los pasos de despliegue. Vite por sí solo no ejecuta la función del directorio `functions/`.
5. **Generar y validar QR fijos.** Usar URLs HTTPS estables y datos públicos (`location`, `qr` y `source`); preferir SVG para impresión y no incluir datos personales, secretos ni IDs de planillas. Generar los QR de producción solo después de validar el dominio y el registro de punta a punta.
6. **Validar cada bodega antes de publicar.** Comprobar sus datos, recursos, ruta simple y landing; enviar un registro a su propia planilla; comprobar que un error de permisos no muestra éxito; imprimir el QR solo después de esa validación.

## Contrato y seguridad de registros

- El payload incluye `tenantSlug`, `formId`, `requestId`, `fields`, `consent`, `honeypot` y `source`. `fields` contiene los datos del visitante y los parámetros QR `qrLocation` y `qrId`.
- La validación del servidor es obligatoria aunque exista validación en Vue. Mantener coherentes los límites y requisitos de ambos lados; no confiar en valores enviados por el navegador.
- El endpoint serverless firma el mensaje con `APPS_SCRIPT_SHARED_SECRET`. Apps Script verifica la firma con `SHARED_SECRET`, comprueba la antigüedad del request y resuelve la planilla por `TENANT_<SLUG_EN_MAYUSCULAS>_SHEET_ID`.
- El `requestId` debe conservar la idempotencia. No eliminar la deduplicación ni devolver éxito hasta que Apps Script confirme la escritura y ejecute `SpreadsheetApp.flush()`.
- Los secretos se configuran solo en el hosting o en propiedades privadas de Apps Script. No agregarlos a Vue, `public/`, archivos versionados, logs o URLs de QR. Usar `.env.example` solo con nombres y valores ficticios.
- Evitar registrar en consola el payload, datos personales, firmas, secretos o IDs de planillas. Tratar la planilla y sus permisos como recursos privados de cada propietario.
- Mantener separado el consentimiento necesario para registrar la visita (`consent`) del consentimiento opcional de marketing (`fields.marketingConsent`); un campo no debe sustituir ni habilitar implícitamente al otro.

## Interfaz y calidad

- Mantener diseño responsive, HTML semántico, etiquetas asociadas a campos, estados accesibles (`aria-*`) y mensajes de error comprensibles en español.
- Conservar soporte para `prefers-reduced-motion` al modificar animaciones o la directiva de revelado.
- Usar texto alternativo útil para imágenes y respetar la identidad visual definida por los tokens del tema de cada bodega.
- Para cambios de rutas, verificar navegación interna y acceso directo a las URLs con fallback SPA configurado.
- Antes de cerrar una tarea, ejecutar `npm run build` y las pruebas disponibles; informar los checks que no pudieron ejecutarse por falta de backend, secretos o planilla de prueba.

## Git y cambios

- Revisar `git status` antes de editar; conservar los cambios preexistentes y no incluir archivos de entorno, credenciales, dependencias, cachés ni `dist/`.
- Mantener `package-lock.json` sincronizado al cambiar dependencias.
- No crear commits, cambiar remotos ni modificar la identidad/configuración de Git salvo que el usuario lo solicite explícitamente.
