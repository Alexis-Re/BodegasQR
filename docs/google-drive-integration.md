# Conexion del formulario con Google Drive

## Aclaracion importante

El formulario no escribe directamente en Google Drive desde el navegador. Cada propietario tendra una planilla de Google Sheets guardada dentro de su Google Drive.

La aplicacion escribe en esa planilla mediante Google Apps Script. No hace falta exponer el Drive, la planilla ni sus credenciales al visitante.

## Flujo de una solicitud

```text
Visitante
  -> /api/register del mismo dominio
  -> Funcion serverless
  -> Google Apps Script Web App
  -> Google Sheet privado del propietario
  -> Respuesta confirmada al formulario
```

El formulario solo muestra exito si Apps Script devuelve `ok: true` despues de ejecutar la escritura y `SpreadsheetApp.flush()`.

## Configuracion por propietario

1. El propietario crea una planilla nueva en su Google Drive.
2. La planilla debe tener una hoja llamada `Registros`, aunque Apps Script puede crearla automaticamente.
3. El propietario conserva la propiedad del archivo.
4. El propietario comparte la planilla con la cuenta operativa que ejecuta Apps Script, con permiso de Editor.
5. La planilla no se publica y no se comparte con cualquier persona que tenga el enlace.
6. Se copia el ID de la planilla desde la URL de Google Sheets.

La cuenta operativa necesita acceso de escritura porque Apps Script se ejecuta con la identidad de su propietario. Si una bodega revoca ese permiso, los registros de esa bodega empezaran a fallar y debera aparecer un error, nunca una confirmacion falsa.

## Propiedades privadas de Apps Script

En `Project Settings > Script properties` se configuran los valores privados:

```text
SHARED_SECRET=un-secreto-largo
TENANT_BODEGA_AURORA_SHEET_ID=id-de-la-planilla
```

La regla para nuevos slugs es:

```text
TENANT_<SLUG_EN_MAYUSCULAS>_SHEET_ID=<spreadsheet-id>
```

Por ejemplo, `la-montana` utiliza:

```text
TENANT_LA_MONTANA_SHEET_ID=id-de-la-planilla-de-la-montana
```

Estos valores no se agregan a Vue, a `public/`, a GitHub ni a la URL del QR.

## Variables del proxy

La funcion serverless necesita:

```text
APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
APPS_SCRIPT_SHARED_SECRET=el-mismo-secreto-de-apps-script
```

El frontend solo necesita conocer el endpoint same-origin:

```text
VITE_REGISTRATION_API_URL=/api/register
```

El secreto se configura en el panel del proveedor de hosting, no en un archivo versionado.

## Despliegue de Apps Script

1. Crear un proyecto de Apps Script en la cuenta operativa.
2. Copiar `backend/apps-script/Code.js` y `backend/apps-script/appsscript.json`.
3. Activar el runtime V8.
4. Configurar `SHARED_SECRET` y los IDs de las planillas.
5. Publicar como Web App ejecutando como el propietario del script.
6. Permitir acceso anonimo, porque el visitante no debe iniciar sesion en Google.
7. Usar la URL terminada en `/exec`, nunca la URL `/dev`.

Aunque la URL del Web App sea publica, Apps Script rechaza solicitudes sin una firma HMAC valida. La firma la genera la funcion serverless, no el navegador.

## Registros almacenados

La hoja `Registros` usa estas columnas:

```text
record_id
created_at
tenant_slug
form_id
name
email
phone
fields_json
source
consent
request_id
```

Cada bodega mantiene sus propios registros en su propio archivo. La plataforma no necesita una hoja global con datos mezclados.

## Prueba de una nueva bodega

Antes de publicar una URL o imprimir un QR:

1. Crear la planilla del propietario.
2. Compartirla con la cuenta operativa.
3. Registrar su propiedad `TENANT_<SLUG>_SHEET_ID`.
4. Agregar su configuracion en `src/config/tenants/`.
5. Probar la ruta simple `/bodega/<slug>/registro`.
6. Enviar un registro de prueba.
7. Confirmar que aparece en la planilla correcta.
8. Probar un error de permisos y comprobar que la web no muestra exito.
9. Recién entonces generar el QR.
