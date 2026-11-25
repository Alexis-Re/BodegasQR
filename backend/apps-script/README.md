# Google Apps Script

Este proyecto recibe solicitudes firmadas por la funcion serverless y escribe cada registro en la planilla privada de la bodega indicada.

La hoja `Registros` conserva nombre, apellido, ciudad, correo electrónico, celular, origen y consentimientos. Ciudad, correo y celular son obligatorios; Redes sociales y Dirección postal son opcionales. Ciudad, redes sociales y dirección postal se escriben en `city`, `social_network` y `postal_address`. La ubicación, identificador del QR y todos los campos del formulario también se incluyen en `fields_json`. Las columnas antiguas de país, usuario de red social, intereses y origen declarado se mantienen para compatibilidad y quedan vacías en los registros nuevos.

## Propiedades requeridas

Configurar en `Project Settings > Script properties`:

```text
SHARED_SECRET=un-secreto-largo-compartido-con-el-proxy
TENANT_BODEGA_AURORA_SHEET_ID=id-privado-de-la-planilla
```

Para otra bodega, usar la misma regla:

```text
TENANT_<SLUG_EN_MAYUSCULAS>_SHEET_ID=<spreadsheet-id>
```

Los IDs no deben estar en Vue ni en ningun archivo publico.

## Despliegue

1. Crear un proyecto independiente de Apps Script.
2. Copiar `Code.js` y `appsscript.json`.
3. Configurar las propiedades privadas.
4. Verificar que la cuenta que ejecuta el script tenga acceso de escritura a cada planilla.
5. Publicar como Web app ejecutando como la cuenta propietaria.
6. Permitir el acceso anonimo porque el navegador no inicia sesion en Google.
7. Usar la URL `/exec` en `APPS_SCRIPT_URL` del proxy.

La URL puede ser publica, pero el endpoint no acepta solicitudes sin la firma HMAC correcta.
